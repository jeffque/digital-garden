Um jeito de fazer recursão é fazer uma função que recebe a si mesma.

Para tal, é preciso declarar o tipo da função, para poder passar a ela mesma
como referência:

```ts
export type RecFunc = (n: number, f: RecFunc) => number;

export function fix_point(f: RecFunc): (x: number) => number {
        return x => f(x, f)
}
```

E para implementar uma função como essa (por exemplo, função de Fibonacci):

```ts
import { RecFunc, fix_point } from './genericMemoization.js'

const fibPrimitive = (n: number, selfFib: RecFunc): number => n <= 0? 0: n == 1? 1: selfFib(n-1, selfFib) + selfFib(n-2, selfFib);

const fib = fix_point(fibPrimitive);
console.log(fib(12)); // 144
```

É possível extender para quaisquer argumentos de entrada e saída, apenas foquei aqui em entrada
e saída com número simples.

Função de Péter-Ackermann:

```ts
export type RecFunc2 = (m:number, n: number, f: RecFunc) => number;

export function fix_point2(f: RecFunc2): (x: number, y: number) => number {
        return (x, y) => f(x, y, f)
}
```

```ts
import { RecFunc2, fix_point2 } from './genericMemoization.js'

const ackPrimitive = (m:number, n: number, selfAck: RecFunc2): number => {
  if (m == 0) return n + 1;
  if (n == 0) return selfAck(m-1, 1, selfAck);
  return selfAck(m-1, selfAck(m, n-1, selfAck), selfAck);
}

const ack = fix_point2(ackPrimitive);
```
