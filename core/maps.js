export function computeGoogleMapsUrl(lat, lon) {
  return `https://www.google.com/maps/place/${lat},${lon}/@${lat},${lon},19z`;
}
