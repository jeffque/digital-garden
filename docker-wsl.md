Docker não funciona bem no WSL 1

Para mudar para WSL 2, executar

    wsl --set-default-version 2

Se precisar voltar pra WSL 1, executar

    wsl --set-default-version 1

Mais informação https://learn.microsoft.com/en-us/windows/wsl/install#check-which-version-of-wsl-you-are-running

Quando colocado no WSL2, o dockerd simplesmente subiu
