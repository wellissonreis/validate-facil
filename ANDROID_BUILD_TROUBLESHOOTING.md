# Android local build: provider sem valor no Gradle

Este documento registra a causa do erro que impedia gerar o APK Android local de debug neste projeto Expo/React Native.

## Erro observado

Ao executar:

```bash
cd android
.\gradlew.bat assembleDebug
```

o Gradle falhava em:

```txt
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'.
> Cannot query the value of this provider because it has no value available.
```

O stacktrace indicava `ProviderBackedFileCollection`, `LocalFileDependencyBackedArtifactSet` e `ResolutionBackedFileCollection`, o que inicialmente parecia um problema de dependência/autolinking.

## Causa real

A causa não era `react-native-reanimated`, `react-native-worklets`, `@expo/ui`, `expo-glass-effect`, `expo-symbols`, `codex`, Gradle 8/9, nem incompatibilidade direta entre Expo SDK 56 e JDK 17.

O problema real era uma instalação incompleta do Android SDK Platform 36.

A pasta abaixo existia:

```txt
C:\Users\welli\AppData\Local\Android\Sdk\platforms\android-36
```

mas faltavam arquivos essenciais, principalmente:

```txt
android.jar
core-for-system-modules.jar
```

Durante a configuração da task `:app:compileDebugJavaWithJavac`, o Android Gradle Plugin tenta resolver o `androidJdkImage` usando a plataforma configurada por `compileSdk 36`. Como o `android.jar` da platform 36 não existia, um provider interno do Gradle ficava sem valor e a mensagem genérica era exibida.

Por isso o erro aparecia como falha de provider/dependency, mas a raiz era o SDK Android local corrompido ou incompleto.

## Como foi diagnosticado

Foi criado um diagnóstico temporário de Gradle para inspecionar as entradas da task `:app:compileDebugJavaWithJavac`.

O ponto decisivo foi encontrar:

```txt
C:\Users\welli\AppData\Local\Android\Sdk\platforms\android-36\android.jar exists=false
```

Depois foi verificado que a pasta `android-36.1` estava íntegra e continha:

```txt
android.jar
core-for-system-modules.jar
```

Também foi confirmado que não havia `sdkmanager.bat` instalado na máquina, então não era possível reinstalar a platform via linha de comando naquele momento.

## O que foi feito para solucionar

1. A platform `android-36` foi reparada localmente copiando de `android-36.1` os arquivos obrigatórios que estavam ausentes:

```txt
android.jar
core-for-system-modules.jar
android-stubs-src.jar
build.prop
```

2. O Gradle wrapper foi mantido em uma versão compatível com a stack atual:

```txt
Gradle 8.13
```

3. A dependência `@expo/ui` foi removida do projeto porque não era usada diretamente no código.

4. O autolinking do Expo passou a excluir módulos não usados que entravam de forma transitiva:

```json
"expo": {
  "autolinking": {
    "exclude": [
      "@expo/ui",
      "@expo/dom-webview"
    ]
  }
}
```

5. Arquivos temporários de diagnóstico e logs Gradle foram removidos.

## Validação

Depois da correção, estes comandos passaram:

```bash
npx expo-doctor
```

```bash
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

O APK foi gerado em:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

## Como evitar que ocorra novamente

### 1. Reinstalar corretamente o Android SDK Platform 36

A correção manual funcionou, mas o ideal é reparar a instalação pelo Android Studio:

1. Abra o Android Studio.
2. Vá em `Settings > Languages & Frameworks > Android SDK`.
3. Na aba `SDK Platforms`, remova e instale novamente `Android SDK Platform 36`.
4. Na aba `SDK Tools`, instale `Android SDK Command-line Tools`.

Com o `sdkmanager` instalado, a correção por terminal também passa a ser possível:

```bash
sdkmanager "platforms;android-36" "build-tools;36.0.0"
```

### 2. Verificar se a platform está completa

Antes de investigar dependências, confirme se estes arquivos existem:

```txt
C:\Users\welli\AppData\Local\Android\Sdk\platforms\android-36\android.jar
C:\Users\welli\AppData\Local\Android\Sdk\platforms\android-36\core-for-system-modules.jar
```

Se `android.jar` estiver ausente, o build pode falhar com mensagens genéricas de Gradle provider.

### 3. Evitar Gradle 9 neste projeto

Expo SDK 56 usa Android Gradle Plugin 8.x. Para este projeto, mantenha o wrapper em Gradle 8.x compatível:

```txt
android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https://services.gradle.org/distributions/gradle-8.13-bin.zip
```

### 4. Não tratar todo erro de provider como dependência quebrada

Este erro:

```txt
Cannot query the value of this provider because it has no value available
```

pode ser causado por dependências, mas também pode ser causado por SDK Android incompleto. Sempre verificar primeiro:

```bash
.\gradlew.bat :app:compileDebugJavaWithJavac --stacktrace
```

e confirmar a existência de:

```txt
platforms/android-36/android.jar
```

### 5. Evitar dependências nativas não usadas

Dependências não usadas podem aumentar o número de módulos autolinkados e dificultar o diagnóstico. Se um pacote não é usado no app, remova-o ou exclua-o do autolinking quando for apenas transitivo e desnecessário.

Neste projeto, `@expo/ui` não era usado diretamente, então foi removido.

