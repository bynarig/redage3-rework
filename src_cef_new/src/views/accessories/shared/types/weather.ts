export interface WeatherItem {
    weatherId: number
    hour: number
    minute: number
    temp: number
}

export const WEATHER_NAMES: Record<string, string> = {
    cloud: 'Облачно',
    fog: 'Туман',
    rain: 'Дождь',
    snow: 'Снег',
    sunny: 'Солнечно',
    thunder: 'Гроза',
    night: 'Ночь',
    nightcloud: 'Облачно',
    nightfog: 'Туман',
    nightrain: 'Дождь',
    nightthunder: 'Гроза',
    nightsnow: 'Снег',
}

export const NIGHT_WEATHERS = ['night', 'nightcloud', 'nightfog', 'nightrain', 'nightthunder', 'nightsnow']

const WEATHER_ID_MAP: Record<number, [string, string]> = {
    0: ['sunny', 'night'],
    1: ['sunny', 'night'],
    2: ['cloud', 'nightcloud'],
    3: ['cloud', 'nightcloud'],
    4: ['fog', 'nightfog'],
    5: ['cloud', 'nightcloud'],
    6: ['rain', 'nightrain'],
    7: ['thunder', 'nightthunder'],
    8: ['rain', 'nightrain'],
    9: ['cloud', 'nightcloud'],
    10: ['snow', 'nightsnow'],
    11: ['snow', 'nightsnow'],
    12: ['snow', 'nightsnow'],
    13: ['snow', 'nightsnow'],
}

export function getWeatherName(weatherId: number, hour: number): string {
    const isDay = hour > 7 && hour < 21
    const entry = WEATHER_ID_MAP[weatherId] ?? ['sunny', 'night']
    return isDay ? entry[0] : entry[1]
}
