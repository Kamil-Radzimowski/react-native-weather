const obj= {
  snow: 'weather-snowy',
  rain: 'weather-pouring',
  fog: 'weather-fog',
  wind: 'weather-windy-variant',
  cloudy: 'weather-cloudy',
  'partly-cloudy-day': 'weather-partly-cloudy',
  'partly-cloudy-night': 'weather-night-partly-cloudy',
  'clear-day': 'weather-sunny',
  'clear-night': 'weather-night',
};

export function map(name){
  return obj[name];
}
