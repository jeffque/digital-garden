`asdf` é uma ferramenta muito útil para controlar ferramental de código, como instalar `go`
e `ruby` 3.

- Home: https://asdf-vm.com/

Vou configurar o `ruby` na versão 3 e o `go` em um usuáfio alternativo do meu WSL2,
então alguns detalhes (como, ao instalar `ruby` precisar de algumas libs a mais instaladas
previamente), estarão omissos.

# Seguindo o tutorial

```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.2
```

Isso vai baixar o repo do `asdf` e colocar no lugar default dele. Agora preciso deixar
ele acessível via comando `asdf`. Para tal, seguindo o tutorial:

```bash
echo '. $HOME/.asdf/asdf.sh' >> ~/.bashrc
echo '. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc
```

Isso adiciona o `asdf` e as opções de auto-complete do bash para carga imediata ao logar-se.

Nesse momento é preciso fazer um novo login (ou forçar novamente o carregamento do `.bashrc`,
particularmente prefiro o novo login).

E, pronto, já está disponível. Agora ele precisa instalar o plugin.

# Instalando o plugin de ruby

Instalando o plugin de ruby:

```bash
asdf plugin add ruby
```

Para listar todas as versões para escolher a desejada:

```bash
asdf list-all ruby
```

Instalar a desejada:

```bash
asdf install ruby 3.0.5
```

Então agora temos acesso ao comando `ruby`, certo?

```bash
$ which ruby
~/.asdf/shims/ruby
$ ruby
No version is set for command ruby
Consider adding one of the following versions in your config file at
ruby 3.0.5
```

Bem, depois de instalar a versão você precisa configurar ela, seja localmente ou global:

```bash
$ asdf global ruby 3.0.5
tail: cannot open '~/.tool-versions' for reading: No such file or directory
$ touch ~/.tool-versions
$ asdf global ruby 3.0.5
$ ruby --version
ruby 3.0.5p211 (2022-11-24 revision ba5cf0f7c5) [x86_64-linux]
```

# Instalando o plugin de go

Adicionar o plugin:

```bash
asdf plugin add golang
```

Instalar uma versão (agora vou pegar `latest`):

```bash
asdf install golang latest
```

Configurar a versão globalmente:

```bash
asdf global golang latest
```

Verificar:

```bash
$ which go
~/.asdf/shims/go
$ go version
go version go1.19.4 linux/amd64
```

# Script geral

1. instalar plugin
2. instalar versão
3. configurar versão
