export function extractCoords(row, headers) {
  const latHeader = headers[headers.length - 4];
  const lonHeader = headers[headers.length - 3];

  const lat = parseFloat(row.lat || row[latHeader]);
  const lon = parseFloat(row.lon || row[lonHeader]);

  if (isNaN(lat) || isNaN(lon)) return null;
  return { lat, lon };
}
