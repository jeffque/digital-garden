Docker não funciona bem no WSL 1

Para mudar para WSL 2 em novas instalações, executar

    > wsl --set-default-version 2

Se precisar voltar pra WSL 1, executar

    > wsl --set-default-version 1

Mais informação https://learn.microsoft.com/en-us/windows/wsl/install#check-which-version-of-wsl-you-are-running

Precisei rodar através do PowerShell aberto com permissões de administrador para rodar o `dockerd`

O `dockerd` até iniciou, mas não consegui rodar nenhuma imagem. Ficava dando esse erro:

```
docker: Error response from daemon: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: waiting for init preliminary setup: EOF: unknown.
ERRO[0001] error waiting for container: context canceled
```

Eu estava ainda com WSL 1 nesse teste 👆

-----

Verificar versão do WSL:

    > wsl --list --verbose
      NAME            STATE           VERSION
    * Ubuntu-20.04    Stopped         1
    
Alterar versão do WSL na máquina específica:

    > wsl --set-version Ubuntu-20.04 2
    
Talvez não esteja pronto para receber WSL 2:

    > wsl --set-version Ubuntu-20.04 2
    Conversão em andamento. Isso pode levar alguns minutos...
    Para obter informações sobre as principais diferenças em relação ao WSL 2, visite https://aka.ms/wsl2
    WSL 2 requer uma atualização para seu componente kernel. Para obter mais informações, visite https://aka.ms/wsl2kernel

Siga as instruções para instalar as atualizações, visite https://aka.ms/wsl2kernel

Depois disso, sucesso. Executei o `dockerd` no PowerShell com permissões de administração.
