const https = require('https');
const fs = require('fs');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      })
      .on('error', reject);
  });
}

function escape(str) {
  return str.replace(/'/g, "''");
}

async function main() {
  const states = await fetchJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  const stateSql = states
    .map(s => `insert into states (id, name, abbreviation) values (${s.id}, '${escape(s.nome)}', '${s.sigla}');`)
    .join('\n');
  fs.writeFileSync('brazil_states.sql', stateSql);

  const cities = await fetchJSON('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
  const citySql = cities
    .map(c => {
      const stateId = c.microrregiao?.mesorregiao?.UF?.id;
      if (!stateId) {
        console.warn(`State id not found for city ${c.nome} (${c.id}), skipping.`);
        return null;
      }
      return `insert into cities (id, state_id, name) values (${c.id}, ${stateId}, '${escape(c.nome)}');`;
    })
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync('brazil_cities.sql', citySql);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
