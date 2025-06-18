# Agenda Zen

Agenda Zen é uma aplicação web de agendamento para psicólogos, terapeutas e outros prestadores de serviço. O sistema foi desenvolvido com [Vue 3](https://vuejs.org/), [Tailwind CSS](https://tailwindcss.com/) e [Vite](https://vitejs.dev/). Para armazenamento dos dados é utilizado o [Supabase](https://supabase.com/).

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Nome cadastrado é salvo como display name no Supabase
- Gestão de clientes, serviços e salas
- Controle de agendamentos em lista, calendário ou semana
- Dashboard com estatísticas e gráficos (Chart.js)
- Configuração de perfil público com link personalizado
- Geração de comprovantes de atendimento
- Indicação visual do horário atual na visão semanal

O diretório `supabase/schemas` reúne os scripts SQL para criação das tabelas e definição das políticas de segurança no Supabase.

## Instalação e execução

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

### Outros comandos úteis

- `npm run build` – gera os arquivos de produção em `dist/`
- `npm run preview` – serve localmente os arquivos de produção
- `npm run deploy` – publica a pasta `dist` no GitHub Pages

## Estrutura do projeto

- `src/` – código-fonte em Vue (componentes, views e roteamento)
- `public/` – arquivos estáticos
- `supabase/` – scripts SQL do banco de dados
- `supabase/scripts/` – utilidades para gerar dados de estados e cidades do Brasil
- `supabase/email_templates/` – modelos de email usados pelo Supabase

### Gerar lista de estados e cidades

Execute `node supabase/scripts/generate_locations_sql.js` para baixar os dados do IBGE
e criar os arquivos `brazil_states.sql` e `brazil_cities.sql` com instruções `INSERT`.
- `mobile/` – código compartilhado do app móvel em React Native (sem os projetos nativos)

## Aplicativos móveis

O diretório `mobile/` traz o código JavaScript utilizado nas versões móveis em React Native. Para rodar o app, crie um projeto nativo à parte e copie esses arquivos. No momento, o aplicativo disponibiliza apenas as telas de **Login** e **Dashboard**.

Contribuições são bem-vindas! Sinta‑se à vontade para abrir _issues_ ou enviar _pull requests_.
