Para conseguir ler do MSSQL usando Ruby no windows, achei a gem [tiny_tds](https://rubygems.org/gems/tiny_tds)

# Instalando

Precisa ter o [free tds](https://github.com/FreeTDS/freetds/) instalado.

Não encontrei binários prontos, então clonei o repositório.

Precisei baixar o [GnuWin32 autotools](https://gnuwin32.sourceforge.net/packages/autoconf.htm),
coloquei no `Program Files (x86)/gnuwin32/autotools` e adicionei esse diretório ao `PATH`

(tanto via variáveis de ambiente do windows como `.bashrc`)

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

Agora o próximo impedimento é o `aclocal`
