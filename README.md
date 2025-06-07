# Agenda Zen

Agenda Zen é uma aplicação web de agendamento voltada para profissionais como psicólogos, terapeutas e demais prestadores de serviço. O projeto foi desenvolvido com [Vue 3](https://vuejs.org/) e [Tailwind CSS](https://tailwindcss.com/) utilizando [Vite](https://vitejs.dev/) para o build. Para persistência de dados é utilizado o [Supabase](https://supabase.com/).

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Gestão de clientes, serviços e salas
- Controle de agendamentos com visualização em lista, calendário ou semana
- Dashboard com estatísticas e gráfico dos agendamentos (Chart.js)
- Configuração de perfil público com link personalizado
- Geração de comprovantes de atendimento

O diretório `supabase/schemas` contém os scripts SQL para criação das tabelas e políticas de segurança no Supabase.

## Instalação e execução

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

### Outros comandos úteis

- `npm run build` – gera a versão de produção em `dist/`
- `npm run preview` – serve localmente os arquivos gerados pelo build
- `npm run deploy` – publica a pasta `dist` no GitHub Pages

## Estrutura do projeto

- `src/` – código fonte em Vue (componentes, views e roteamento)
- `public/` – arquivos estáticos
- `supabase/` – scripts SQL de criação do banco de dados
- `mobile/android` – código-fonte do app Android em React Native (sem o projeto nativo)
- `mobile/ios` – código-fonte do app iOS em React Native (sem o projeto nativo)

## Aplicativos móveis

Os diretórios `mobile/android` e `mobile/ios` trazem apenas o código JavaScript das versões móveis em React Native.
Para rodar os apps é necessário criar projetos nativos à parte e incorporar esses arquivos.
Cada um possui apenas as telas de **Login** e **Dashboard**.

Contribuições são bem‑vindas! Sinta‑se à vontade para abrir _issues_ ou enviar _pull requests_.
