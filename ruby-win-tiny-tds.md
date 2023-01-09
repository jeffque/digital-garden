Para conseguir ler do MSSQL usando Ruby no windows, achei a gem [tiny_tds](https://rubygems.org/gems/tiny_tds)

# Instalando

Precisa ter o [free tds](https://github.com/FreeTDS/freetds/) instalado.

Não encontrei binários prontos, então clonei o repositório.

Precisei baixar o [GnuWin32 autotools](https://gnuwin32.sourceforge.net/packages/autoconf.htm),
coloquei no `C:/gnuwin32/autotools` (adicionei esse diretório ao `PATH` apenas via `.bash_profile`)

> Originalmente ficava em `C:/Program Files (x86)/gnuwin32/autotools`, portanto algumas referências
> ao local original vão existir nesse Zettel

Foi necessário baixar o **GnuWin32 autotools** para ter acesso ao `autoreconf` para
tentar compilar o free tds.

Está no momento falhando com a seguinte mensagem:

```
$ ./autogen.sh
running /c/Program Files (x86)/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
Can't locate Autom4te/ChannelDefs.pm in @INC (you may need to install the Autom4te::ChannelDefs module) (@INC contains: c:/progra~1/autoconf/share/autoconf /usr/lib/perl5/site_perl /usr/share/perl5/site_perl /usr/lib/perl5/vendor_perl /usr/share/perl5/vendor_perl /usr/lib/perl5/core_perl /usr/share/perl5/core_perl) at /c/Program Files (x86)/gnuwin32/autotools/bin/autoreconf line 42.
BEGIN failed--compilation aborted at /c/Program Files (x86)/gnuwin32/autotools/bin/autoreconf line 42.
```

Descobri que eu tenho acesso a esse arquivo (`/c/Program Files (x86)/gnuwin32/autotools/share/autoconf/`), porém
o Perl por algum motivo não está encontrando. Preciso alterar o `@Inc` para ele enxergar

Usa a [variável `PERL5LIBRARY`](https://perlmaven.com/how-to-change-inc-to-find-perl-modules-in-non-standard-locations) para
determinar o `@INC`.

```bash
export PERL5LIB=/c/Program\ Files\ \(x86\)/gnuwin32/autotools/share/autoconf/
```

Agora o próximo impedimento é o `aclocal`.

Instalei a partir de outro pacote do GnuWin32, [automake](https://gnuwin32.sourceforge.net/packages/automake.htm),
de modo semelhante a o que fiz com o autotools.

Adicionei mais caminhos para o `@INC`:

- `/c/Program Files (x86)/gnuwin32/automake/share/aclocal-1.9/`
- `/c/Program Files (x86)/gnuwin32/automake/share/automake-1.9/`

O `aclocal` tem em sua composição referência a variável `perllibdir`, com o valor default
`c:/progra~1/AutoMake/share/automake-1.9`. Então também sobrescrevi essa variável no `.bash_profile`:

- `export perllibdir="/c/gnuwin32/automake/share/aclocal-1.9/"`

Só que a linha 48 de `aclocal` referencia um caminho hardcoded. Troquei ele para
o meu local de instalação:

```diff
-$acdir = 'c:/progra~1/AutoMake/share/aclocal';
+$acdir = 'c:/gnuwin32/automake/share/aclocal';
```

Com isso deu problema ao carregar o `m4`:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
autom4te: need GNU m4 1.4 or later: /usr/bin/m4
aclocal: autom4te failed with exit status: 1
```

Coloquei a seguinte envvar para sobrescrever o binário que ele carrega:

```bash
export M4=m4
```

> Não deu certo o `which m4` porque no meu caso tinha um espaço no nome e o perl se perdeu

E agora ele reclama do seguinte:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
autom4te: cannot open < c:/progra~1/autoconf/share/autoconf/autom4te.cfg: No such file or directory
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
autom4te: cannot open < c:/progra~1/autoconf/share/autoconf/autom4te.cfg: No such file or directory
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
```

Hmmm, pelo visto é `AC_MACRODIR` ou `autom4te_perllibdir`, colocando ambos para o mesmo valor:

```bash
export autom4te_perllibdir="/c/gnuwin32/autotools/share/autoconf/"
export AC_MACRODIR="$autom4te_perllibdir"
```

Ainda deu problemas:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
autom4te: m4sugar/m4sugar.m4: no such file or directory
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
autom4te: m4sugar/m4sugar.m4: no such file or directory
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
```

Ao investigar o `autom4te`, descobri que a configuração `autom4te.cfg` tava apontando para local inexistente:

```
args: --prepend-include 'c:/progra~1/autoconf/share/autoconf'
```

Isso em diversos lugares. Apliquei a substituição `s_c:/progra~1/_c:/gnuwin32/_c`, mas continuou com o mesmo problema.

Percebi então que minha instalação está com `autotools`, então segui para substituir `s_c:/gnuwin32/autoconf/_c:/gnuwin32/autotools/_c`.

Agora o erro alterou para:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
C:\Program Files (x86)\Gow\bin\m4.exe:c:/gnuwin32/autotools/share/autoconf/autoconf/autoconf.m4f:2068: premature end of frozen file
autom4te: m4 failed with exit status: 1
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
C:\Program Files (x86)\Gow\bin\m4.exe:c:/gnuwin32/autotools/share/autoconf/autoconf/autoconf.m4f:2068: premature end of frozen file
autom4te: m4 failed with exit status: 1
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
```


Removi todos os `.m4f`. Deu para seguir em frente.

Deu problema depois no seguinte:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
C:\Program Files (x86)\Gow\bin\m4.exe: esyscmd subprocess failed: No such file or directory
C:\Program Files (x86)\Gow\bin\m4.exe:configure.ac:14: cannot run command `printf $(date +"%Y%m%d")': No such file or directory
autom4te: m4 failed with exit status: 1
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
aclocal:configure.ac:124: warning: macro `AM_ICONV' not found in library
C:\Program Files (x86)\Gow\bin\m4.exe: esyscmd subprocess failed: No such file or directory
C:\Program Files (x86)\Gow\bin\m4.exe:configure.ac:14: cannot run command `printf $(date +"%Y%m%d")': No such file or directory
autom4te: m4 failed with exit status: 1
aclocal: autom4te failed with exit status: 1
autoreconf: aclocal failed with exit status: 1
```

Não conseguindo sanar o problema do `esyscmd`, fui ver se era algum problema local
nos arquivos do repositório. Daí encontrei o `esyscmd` no `configure.ac`, linha 14 mesmo,
e troquei por uma constante:

```diff
-AC_INIT(FreeTDS, http://1.4.dev.esyscmd(printf $(date +"%Y%m%d")))
+AC_INIT(FreeTDS, 20230108)
```

Depois disso, deu o seguinte problema:

```
sh: c:/progra~1/autoconf/bin/autoconf: No such file or directory
```

Então descobri mais duas variáveis de ambiente que poderiam ser sobrescritas:

- `AUTOCONF` (referente a esse executável)
- `AUTOHEADER` (referente ao `autoheader`)

Em seguida apareceu o mesmo problema para `autom4te`.

Corrigi para os 3:

```bash
export AUTOCONF=/c/gnuwin32/autotools/bin/autoconf
export AUTOHEADER=/c/gnuwin32/autotools/bin/autoheader
export AUTOM4TE=/c/gnuwin32/autotools/bin/autom4te
```

O erro evoluiu para:

```
running /c/gnuwin32/autotools/bin/autoreconf in /c/repos/freetds:
aclocal:configure.ac:125: warning: macro `AM_ICONV' not found in library
configure.ac:20: error: possibly undefined macro: AM_INIT_AUTOMAKE
      If this token and others are legitimate, please use m4_pattern_allow.
      See the Autoconf documentation.
configure.ac:88: error: possibly undefined macro: AM_CONDITIONAL
configure.ac:96: error: possibly undefined macro: AC_DEFINE
configure.ac:107: error: possibly undefined macro: AM_PROG_CC_C_O
configure.ac:117: error: possibly undefined macro: AC_LTDL_DLLIB
configure.ac:118: error: possibly undefined macro: LT_AC_PROG_RC
configure.ac:125: error: possibly undefined macro: AM_ICONV
configure.ac:201: error: possibly undefined macro: AC_SEARCH_LIBS
autoreconf: /c/gnuwin32/autotools/bin/autoconf failed with exit status: 1
aclocal:configure.ac:125: warning: macro `AM_ICONV' not found in library
Running
./configure
...
configure: error: cannot find install-sh or install.sh in "." "./.." "./../.."
```
