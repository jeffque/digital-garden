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
