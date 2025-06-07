# App Android do Agenda Zen

## Informações gerais

Aplicativo Android escrito em React Native que complementa a versão web do Agenda
Zen. Atualmente conta apenas com as telas de **Login** e **Dashboard**. Este
diretório contém **somente** o código JavaScript do app (`App.js` e a pasta
`src/`). O projeto nativo do Android (arquivos Gradle) não está incluso para
manter o repositório enxuto.

## Como rodar localmente

1. Verifique se o ambiente do React Native está configurado (Node.js, JDK e
   Android Studio com um emulador ou dispositivo conectado).
2. Crie um novo projeto React Native com `npx react-native init AgendaZen`.
3. Copie deste diretório os arquivos `App.js` e a pasta `src/` para a raiz do novo
   projeto criado.
4. Dentro da pasta do novo projeto, instale as dependências:
   ```bash
   npm install
   ```
5. Inicie o Metro bundler:
   ```bash
   npm start
   ```
6. Em outro terminal, execute o app:
   ```bash
   npx react-native run-android
   ```

## Como gerar um executável para rodar em dispositivos de teste

Para gerar um APK de testes, dentro da pasta `android` do novo projeto, execute:

```bash
cd android
./gradlew assembleRelease
```

O arquivo será criado em `android/app/build/outputs/apk/release/`.

## Como fazer deploy em produção

1. Crie uma chave de assinatura e configure-a em `android/gradle.properties` do projeto.
2. Gere o bundle de produção dentro da pasta `android` do projeto:
   ```bash
   ./gradlew bundleRelease
   ```
3. Envie o arquivo `.aab` gerado para a Google Play Console.

Consulte a [documentação do React Native](https://reactnative.dev/docs/signed-apk-android)
para detalhes adicionais.
