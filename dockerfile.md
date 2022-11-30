Para usar o container na CLI use `ENTRYPOINT`

    ENTRYPOINT curl

Rodar algo até o fim dos tempos é com `CMD`

    CMD bundle exec ouroborus

Adicionar coisa de baixa mutabilidade primeiro

- eg: dependências

você pode declarar uma variável e usar em outro ponto posterior em qualquer canto

    ENV maVar=123
    EXPOSE ${maVar}

você pode pedir por um buil-arg (para passar, usar o `--build-arg` no comando `docker build`)

    ARG marmota

exemplos:

- https://lipanski.com/posts/dockerfile-ruby-best-practices
- https://gist.github.com/sibelius/13a8e70c2f4f6483b79d64890d40aa81
- https://gist.github.com/sibelius/8ae1edd6603658da5f9e6dcf63465aa7

Build multi-step: usar

    FROM <img:tag> as intermed

Para pegar algo gerado em `intermed`

    COPY --from=intermed fileIntermed ./destino-minha-image
