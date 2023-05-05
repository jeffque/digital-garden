No JUnit 5, a anotação `@Test` permite que seu teste rode.

A priori, o nome do teste é o nome do método que foi anotado, mas isso pode ser sobrescrito
usando a anotação `@DisplayName("descrição")`:

```java
@Test
void marmota() {
}
// exibe no console o teste "marmota"

@DisplayName("""
            Uma string mais bonita e complexa.
            """)
@Test
void outraMarmota() {
}
// exibe no console o teste "Uma string mais bonita e complexa."
```

Leia mais sobre:

- `org.junit.jupiter.api.DisplayName`
- `org.junit.jupiter.api.Test`

Se você tem métodos muito semelhantes, idênticos exceto por parâmetros, você pode anotar com `@ParameterizedTest`.
Para passar os parâmetros, você deve fornecer um modo dele resgatar os valores. Particularmente eu gostei mais
do `@MethodSource("nomeMetodo")`.

```java
@ParameterizedTest
@MethodSource("fonteDosArgs")
void umTeste(String primeiro, Optional<String> segundo, boolean terceiro) {
}

private static Stream<Arguments> fonteDosArgs() {
  return Stream.of(
        Arguments.of("um valor", Optional.empty(), true),
        Arguments.of(null, Optional.of("123"), true)
    );
}
```

Leia mais sobre:

- `org.junit.jupiter.params.provider.Arguments`
- `org.junit.jupiter.params.ParameterizedTest`
- `org.junit.jupiter.params.provider.MethodSource`

No caso de `ParameterizedTest`, se ele receber apenas um valor por vcez, o `@MethodSource` a ele associado
pode retornar o tipo adequado do parâmetro no lugar de usar `Arguments`:

```java
@ParameterizedTest
@MethodSource("fonteDosArgs")
void umTeste(String forma) {
}

private static Stream<String> fonteDosArgs() {
  return Stream.of(
        "bola",
        "quadrado",
        "retangulo"
    );
}
```

O `@MethodSource` precisa se ligar a um método estático, necessariamente. É interessante que ele retorn `Stream`,
mas podem ser outras coisas.

Testes parametrizáveis tem o nome genérico do teste dado por `DisplayName` e também uma descrição distinta para cada rodada
do teste. Se quiser das um nome específico a como o teste é apresentado no console, só preencher o atributo `ParameterizedTest#name`:

```java
@ParameterizedTest(name = """
          primeiro valor [{0}]
          segundo valor [{1}]
          terceiro valor [{2}]
            """)
@MethodSource("fonteDosArgs")
void umTeste(String primeiro, Optional<String> segundo, boolean terceiro) {
}

private static Stream<Arguments> fonteDosArgs() {
  return Stream.of(
        Arguments.of("um valor", Optional.empty(), true),
        Arguments.of(null, Optional.of("123"), true)
    );
}
```

Para situações de testes com tipos mais simples de variáveis, você pode anotar diretamente o argumento e seus
valores, sem precisar incorrer em indireção tão grande. Por exemplo, se você precisa fornecer inteiros:

```java
@ValueSource(ints = {0, 1, 2, 3, 5, 8, 13})
@ParameterizedTest
void testeComNumeros(int valor) {
}
```

Outros argumentos possíveis para a anotação `@ValueSource` são:

- `booleans`
- `longs`
- `string`

Por motivos, não pode passar nulo na lista, nem para string.

Leia mais sobre:

- `org.junit.jupiter.params.provider.ValueSource`
