# Usuário docker

Usuário precisa estar no grupo `docker`

```bash
usermod -a -G docker <usuario>
```

- `-G lista` lista de grupos do usuário
- `-a` junto do `-G`, os grupos são ação de append, não de substituição
