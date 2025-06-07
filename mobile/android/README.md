# App Android do Agenda Zen

## Informações gerais

Aplicativo Android escrito em React Native que complementa a versão web do Agenda
Zen. Atualmente conta apenas com as telas de **Login** e **Dashboard**.

## Como rodar localmente

1. Verifique se o ambiente do React Native está configurado (Node.js, JDK e
   Android Studio com um emulador ou dispositivo conectado).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Metro bundler:
   ```bash
   npm start
   ```
4. Em outro terminal, execute o app:
   ```bash
   npx react-native run-android
   ```

## Como gerar um executável para rodar em dispositivos de teste

Para gerar um APK de testes utilize:

```bash
cd android
./gradlew assembleRelease
```

O arquivo será criado em `android/app/build/outputs/apk/release/`.

## Como fazer deploy em produção

1. Crie uma chave de assinatura e configure-a em `android/gradle.properties`.
2. Gere o bundle de produção:
   ```bash
   ./gradlew bundleRelease
   ```
3. Envie o arquivo `.aab` gerado para a Google Play Console.

Consulte a [documentação do React Native](https://reactnative.dev/docs/signed-apk-android)
para detalhes adicionais.
