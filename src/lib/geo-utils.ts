export function latLongToCartesian(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

export const MUMBAI_COORDS = { lat: 18.9438, lng: 72.8353 };

export const ROUTE_DATA = [
  { id: 'lhr', name: 'London', code: 'LHR', lat: 51.4700, lng: -0.4543, transitTime: 'Air Express: 24-48 Hours', mode: 'Air Freight' },
  { id: 'dxb', name: 'Dubai', code: 'DXB', lat: 25.2532, lng: 55.3657, transitTime: 'Air Express: 12-24 Hours', mode: 'Air Freight' },
  { id: 'jfk', name: 'New York', code: 'JFK', lat: 40.6413, lng: -73.7781, transitTime: 'Air Express: 48-72 Hours', mode: 'Air Freight' },
  { id: 'sin', name: 'Singapore', code: 'SIN', lat: 1.3644, lng: 103.9915, transitTime: 'Air Express: 24-36 Hours', mode: 'Air Freight' },
  { id: 'fra', name: 'Frankfurt', code: 'FRA', lat: 50.0379, lng: 8.5622, transitTime: 'Air Express: 24-48 Hours', mode: 'Air Freight' },
];
