Quando a função não tem argumento:

```ts
const f = () => 1
```

Temos aqui que o compilador do TS entende tudo sobre a função, inferindo entrada (sem args) e saída (number).

Entretanto, ao informar uma entrada sem tipo:

```ts
const f2 = (x) => x + 1
<repl>.ts:6:13 - error TS7006: Parameter 'x' implicitly has an 'any' type.

6 const f2 = (x) => x + 1
```

Para corrigir, só informar o tipo do argumento:

```ts
const f2 = (x:number) => x + 1
```

Quando a função é recursiva, declarar os tipos dos argumentos não é o suficiente:

```ts
const f4 = (x: number) => f4(x - 1) + 1
<repl>.ts:7:7 - error TS7023: 'f3' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.        

7 const f4 = (x: number) => f4(x - 1) + 1
```

```ts
const f4 = (x: number):number => x <= 0? 0: f4(x - 1) + 1
```

Dá também para tipar diretamente a variável no lugar de tipar o lambda:

```ts
const f5: (x:number) => number = (x) => x <= 0? 0: f5(x-1)+1
```
