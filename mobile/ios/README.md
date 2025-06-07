# App iOS do Agenda Zen

## Informações gerais

Versão para iOS desenvolvida em React Native que acompanha a aplicação web do Agenda Zen. Neste estágio inicial possui apenas as telas de **Login** e **Dashboard**.

## Como rodar localmente

1. Tenha o ambiente do React Native configurado no macOS (Xcode e CocoaPods).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Instale as bibliotecas nativas:
   ```bash
   npx pod-install ios
   ```
4. Inicie o bundler:
   ```bash
   npm start
   ```
5. Em outro terminal execute:
   ```bash
   npx react-native run-ios
   ```
   O app será aberto no simulador ou dispositivo conectado.

## Como gerar um executável para rodar em dispositivos de teste

Para distribuir em aparelhos de teste gere um arquivo `.ipa` através de um archivamento no Xcode:

1. Abra `ios/AgendaZen.xcworkspace`.
2. Selecione `Product` > `Archive`.
3. Escolha **Distribute App** e exporte no formato Ad Hoc.

## Como fazer deploy em produção

1. Gere os certificados e perfis de provisionamento na Apple Developer.
2. No Xcode, após arquivar o projeto, selecione **Upload to App Store**.
3. Finalize o envio pelo App Store Connect.

Mais detalhes estão na [documentação do React Native](https://reactnative.dev/docs/publishing-to-app-store).
