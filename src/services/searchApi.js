import { searchResults } from "../mock/searchData";

export async function searchSatelliteImages(query, filters = {}) {
  await new Promise(resolve => setTimeout(resolve, 700));
  let results = [...searchResults];
  if (filters.sensor && filters.sensor !== 'ALL') {
    results = results.filter(r => r.sensor.toLowerCase().includes(filters.sensor.toLowerCase()));
  }
  return results;
}
