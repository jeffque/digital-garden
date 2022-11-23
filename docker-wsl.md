Docker não funciona bem no WSL 1

Para mudar para WSL 2, executar

    wsl --set-default-version 2

Se precisar voltar pra WSL 1, executar

    wsl --set-default-version 1

Mais informação https://learn.microsoft.com/en-us/windows/wsl/install#check-which-version-of-wsl-you-are-running

Precisei rodar através do PowerShell aberto com permissões de administrador para rodar o `dockerd`

Não sei dizer se estava sendo executado o Ubuntu sobre WSL1 ou WSL2, apenas que foi executado anteriormente o
comando para setar a versão default para 2
