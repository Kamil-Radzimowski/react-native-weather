const obj = {
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

const gradientMapObj = {
  snow: ['#4287f5', '#ffffff'],
  rain: ['#161b57', '#2d48a8'],
  fog: ['#58607a', '#8a97c2'],
  wind: ['#161b57', '#2d48a8'],
  cloudy: ['#093f6e', '#2f4e69'],
  'partly-cloudy-day': ['#0d5ea1', '#5285b7'],
  'partly-cloudy-night': ['#062d4f', '#233c4f'],
  'clear-day': ['#1064eb', '#0b97ba'],
  'clear-night': ['#072259', '#07485d'],
};

export function gradientSum(arr) {
  return arr.reduce((acc, value) => {
    /*
    gradientMap(value.icon).forEach(value => {
      acc.push(value);
    });
     */
    acc.push(gradientMap(value.icon)[0]);
    return acc;
  }, []);
}

export function map(name) {
  return obj[name];
}

export function gradientMap(name) {
  return gradientMapObj[name];
}
