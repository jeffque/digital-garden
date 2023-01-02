Para testar diretamente algo com typescript, para não precisar primeiro compilar com `tsc` e depois executar o `.js` resultante,
podemos chamar diretamente o `ts-node`:

```
$ npx ts-node <<EOL
> const myFunc = (() => {
>   let acc = 0;
>   return (x: number) => {
>     acc += x;
>     return acc;
>   };
> })();
> 
> console.log(myFunc(1));
> console.log(myFunc(1));
> EOL
1
2
```

Observe se tem algum `tsconfig.json` por perto, porque ele altera o comportamento do `ts-node`.

```
$ npx ts-node
[...]/npm-cache/_npx/1bf7c3c15bf47d04/node_modules/ts-node/src/index.ts:859    return new TSError(diagnosticText, diagnosticCodes, diagnostics);
           ^
TSError: ⨯ Unable to compile TypeScript:
<repl>.ts:1:1 - error TS1208: '<repl>.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.
```

Porque no `tsconfig.json` tinha a seguinte flag ligada:

```json
{
  ...
  "isolatedModules": true,
  ...
}
```
