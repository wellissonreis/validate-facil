# Como gerar o APK release Android

Este projeto usa Expo SDK 56 com build nativo Android local. Para a versao release funcionar sem crash de `Cannot find native module 'ExpoUI'`, mantenha `@expo/ui` autolinkado. Ele entra como dependencia transitiva do `expo-router` e precisa estar presente no APK.

## Regra importante

Nao coloque `@expo/ui` em `expo.autolinking.exclude`.

O `package.json` deve manter apenas exclusoes realmente seguras, por exemplo:

```json
"expo": {
  "autolinking": {
    "exclude": [
      "@expo/dom-webview"
    ]
  }
}
```

## Antes de gerar a release

Rode estas validacoes na raiz do projeto:

```powershell
npx expo-doctor
```

```powershell
npx expo install --check
```

Confirme que `@expo/ui` aparece no autolinking Android:

```powershell
node node_modules\expo-modules-autolinking\bin\expo-modules-autolinking search --platform android --json
```

Na saida, deve existir um bloco parecido com:

```txt
"@expo/ui": ... "expo.modules.ui.ExpoUIModule"
```

Se `@expo/ui` nao aparecer, o APK pode voltar a quebrar ao abrir com `Cannot find native module 'ExpoUI'`.

## Build release

Entre na pasta Android:

```powershell
cd android
```

Limpe o build:

```powershell
.\gradlew.bat clean
```

Gere o APK release:

```powershell
.\gradlew.bat assembleRelease
```

O APK final fica em:

```txt
android\app\build\outputs\apk\release\app-release.apk
```

## Se o clean/build falhar por cache nativo

Se aparecer erro de CMake/Ninja, arquivo `.so` ausente, `mergeReleaseNativeLibs`, ou estado incremental inconsistente, pare os daemons Gradle:

```powershell
.\gradlew.bat --stop
```

Volte para a raiz do projeto e remova apenas caches/intermediarios gerados:

```powershell
cd ..
Remove-Item -Recurse -Force android\app\.cxx
Remove-Item -Recurse -Force android\app\build\intermediates\merged_native_libs,android\app\build\intermediates\stripped_native_libs
```

Depois rode novamente:

```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleRelease
```

## Instalacao no celular

Depois de gerar o APK, instale o arquivo:

```txt
android\app\build\outputs\apk\release\app-release.apk
```

Ao abrir o app, o erro `Cannot find native module 'ExpoUI'` nao deve aparecer, porque o modulo nativo `expo.modules.ui.ExpoUIModule` estara incluido no APK.

## Checklist rapido

- `@expo/ui` nao esta em `expo.autolinking.exclude`.
- `npx expo-doctor` passa.
- `npx expo install --check` passa.
- Autolinking Android lista `@expo/ui` e `expo.modules.ui.ExpoUIModule`.
- `.\gradlew.bat clean` passa.
- `.\gradlew.bat assembleRelease` passa.
- APK gerado em `android\app\build\outputs\apk\release\app-release.apk`.
