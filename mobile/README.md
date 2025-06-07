# Agenda Zen Mobile

Este diretório contém o código JavaScript utilizado pelo aplicativo móvel em React Native. Aqui ficam `App.js` e o diretório `src/`, que concentram as telas e lógicas comuns às plataformas Android e iOS.

## Como utilizar

1. Certifique-se de que o ambiente do React Native esteja configurado.
2. Crie um projeto nativo com `npx react-native init AgendaZen`.
3. Copie `App.js`, a pasta `src/`, `package.json` e `metro.config.js` para a raiz do novo projeto.
4. Na pasta do projeto, instale as dependências:
   ```bash
   npm install
   ```
5. Para rodar no Android:
   ```bash
   npx react-native run-android
   ```
6. Para rodar no iOS:
   ```bash
   npx react-native run-ios
   ```

## Builds de produção

A geração do APK ou do arquivo IPA segue a documentação oficial do React Native para cada plataforma.
