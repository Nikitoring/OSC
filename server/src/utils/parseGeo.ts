import parse from 'wkb-raster';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Преобразует WKB строку в координаты latitude/longitude
 */
export function parseWKBToCoordinates(wkbString: string): Coordinates | null {
  try {
    if (!wkbString) return null;

    const buffer = Buffer.from(wkbString, 'hex');
    const geometry = parse(buffer);

    // Для Point геометрии
    if (geometry.type === 'Point') {
      return {
        longitude: geometry.x,
        latitude: geometry.y,
      };
    }

    console.warn('Не Point геометрия:', geometry.type);
    return null;
  } catch (error) {
    console.error('Ошибка парсинга WKB:', error);
    return null;
  }
}
