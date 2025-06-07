# Agenda Zen

Agenda Zen é uma aplicação web de agendamento voltada para profissionais como psicólogos, terapeutas e demais prestadores de serviço. O projeto foi desenvolvido com [Vue 3](https://vuejs.org/) e [Tailwind CSS](https://tailwindcss.com/) utilizando [Vite](https://vitejs.dev/) para o build. Para persistência de dados é utilizado o [Supabase](https://supabase.com/).

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Gestão de clientes, serviços e salas
- Controle de agendamentos com visualização em lista, calendário ou semana
- Dashboard com estatísticas e gráfico dos agendamentos (Chart.js)
- Configuração de perfil público com link personalizado
- Geração de comprovantes de atendimento
- Indicação visual do horário atual na visão semanal

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
- `mobile/` – código-fonte compartilhado do app móvel em React Native (sem os projetos nativos)

## Aplicativos móveis

O diretório `mobile/` traz apenas o código JavaScript compartilhado para as versões móveis em React Native.
Para rodar o app é necessário criar um projeto nativo à parte e copiar esses arquivos.
O aplicativo disponibiliza somente as telas de **Login** e **Dashboard**.

Contribuições são bem‑vindas! Sinta‑se à vontade para abrir _issues_ ou enviar _pull requests_.
