Se você está pensando em fazer mock de métodos estáticos: PARE E PENSE NAS ESCOLHAS DA SUA VIDA.

Dito isso, as vezes você precisa da gambiarra...

Os experimentos foram feitos com JUnit5.

Eu precisei das seguintes dependências:

- `org.junit.jupiter:junit-jupiter-api:5.9.0`
- `org.mockito:mockito-core:5.2.0`
- `org.mockito:mockito-inline:5.2.0`

Vamos trabalhar em cima da classe `Marmota`:

```java
class Marmota {
    static String hello(String world) {
        return "hello " + world;
    }

    static void nada() {
        System.out.println("nada aqui");
        consta();
        throw new RuntimeException();
    }

    static void consta() {
        System.out.println("certidão negativa");
    }
}
```

Você precisa invocar o método `Mockito.mockStatic` e passar para ele uma classe. Por exemplo,
para mockar os métodos estáticos da classe `Marmota`:

```java
MockedStatic<Marmota> mock = mockStatic(Marmota.class);
```

Para liberar o que foi interceptado e alterado para o mock estático, você precisa
garantidamente liberar os recursos do `mock` criado. Você deve fazer isso usando
`try-with-resources`:

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  // seu teste aqui
}
```

A priori, mockar os métodos estáticos vai fazer TODOS os métodos fazerem nada.

Diferente do mockito tradicional que tem o `verify` estático, para inspecionar
os métodos chamados do mock estático você precisa chamar o `verify` do objeto
retornado pelo `mockStatic`. E por algum motivo precisa passar um lambda `Verification`
(não recebe parêmtros). Por exemplo:

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  Marmota.hello("world");
  mock.verify(() -> Marmota.hello("world"), times(1));
}
```

Para fazer algo, você pode chamar o `mock.when`:

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  String x = Marmota.hello("world");
  assertNull(x);

  mock.when(() -> Marmota.hello(anyString())).thenReturn("mama mia");

  String y = Marmota.hello("world");
  assertEquals("mama mia", y);
}
```

Você pode pedir para ele chamar o método real também com `mock.thenCallRealMethod()`

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  mock.when(() -> Marmota.nada()).thenCallRealMethod();
  assertThrows(RuntimeException.class, () -> Marmota.nada());
}
```

Aqui o método real `nada` foi chamado, mas não o `consta`,
já que só foi pedido para chamar o método real apenas de `nada`.
Se for olhar a saída padrão dessa chamada, teremos apenas o
seguinte:

```txt
nada aqui
```

O mock pode ser feito para acessar transitivamente um método, basta
pedir para que ele funcione (seja indicando o retorno com o `.then`, seja
com chamar o método real com `thenCallRealMethod`:

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  mock.when(() -> Marmota.nada()).thenCallRealMethod();
  mock.when(() -> Marmota.consta()).thenCallRealMethod();
  assertThrows(RuntimeException.class, () -> Marmota.nada());
}
```

O produzido foi:

```
nada aqui
certidão negativa
```

Você pode até confirmar que realmente ele está passando pelo
método transitivamente usando o `mock.verify`:

```java
try (MockedStatic<Marmota> mock = mockStatic(Marmota.class);) {
  mock.when(() -> Marmota.nada()).thenCallRealMethod();
  mock.when(() -> Marmota.consta()).thenCallRealMethod();
  assertThrows(RuntimeException.class, () -> Marmota.nada());
  mock.verify(() -> Marmota.consta(), times(1));
}
```
