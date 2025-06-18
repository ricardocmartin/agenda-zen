export async function fetchStates() {
  const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  return await res.json();
}

export async function fetchCities(stateId) {
  if (!stateId) return [];
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`);
  return await res.json();
}
