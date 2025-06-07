# App iOS do Agenda Zen

## Informações gerais

Versão para iOS desenvolvida em React Native que acompanha a aplicação web do Agenda Zen. Neste estágio inicial possui apenas as telas de **Login** e **Dashboard**.
Este diretório contém somente o código JavaScript do app (arquivos `App.js` e `src/`).
O projeto nativo do Xcode não está incluso.

## Como rodar localmente

1. Instale o Xcode pela App Store e as ferramentas de linha de comando:
   ```bash
   xcode-select --install
   ```
   Em seguida instale o CocoaPods (requer `ruby`):
   ```bash
   sudo gem install cocoapods
   ```
   *(se preferir, use `brew install cocoapods`)*
   Verifique a instalação com:
   ```bash
   pod --version
   ```
2. Crie um novo projeto React Native com `npx react-native init AgendaZen`.
3. Copie deste diretório os arquivos `App.js` e a pasta `src/` para a raiz do novo projeto.
4. Dentro da pasta `ios` do projeto recém-criado execute:
   ```bash
   npx pod-install
   ```
5. Na raiz do projeto, inicie o bundler:
   ```bash
   npm start
   ```
6. Em outro terminal execute:
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
