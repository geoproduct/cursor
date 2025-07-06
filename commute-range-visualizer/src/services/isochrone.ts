import { TransportMode, IsochroneResult, TRANSPORT_COLORS } from '@/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_API_BASE = 'https://api.mapbox.com/isochrone/v1/mapbox';

// Map our transport modes to Mapbox profiles
const MAPBOX_PROFILES: Record<TransportMode, string> = {
  walking: 'walking',
  cycling: 'cycling',
  driving: 'driving',
  transit: 'walking', // Fallback to walking for now - transit requires different approach
};

export interface IsochroneRequest {
  coordinates: [number, number]; // [longitude, latitude]
  duration: number; // minutes
  transportModes: TransportMode[];
}

export interface IsochroneAPIResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      fill: string;
      fillColor: string;
      color: string;
      contour: number;
    };
    geometry: GeoJSON.Polygon;
  }>;
}

/**
 * Calculate area of a polygon using the shoelace formula
 */
function calculatePolygonArea(coordinates: number[][][]): number {
  if (!coordinates[0] || coordinates[0].length < 3) return 0;
  
  const ring = coordinates[0];
  let area = 0;
  
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += (x1 * y2 - x2 * y1);
  }
  
  // Convert to square meters (approximate)
  // This is a rough approximation for visualization purposes
  return Math.abs(area / 2) * 12100000000; // Rough conversion factor
}

/**
 * Fetch isochrone data from Mapbox API
 */
export async function fetchIsochrone(
  coordinates: [number, number],
  duration: number,
  transportMode: TransportMode
): Promise<IsochroneResult | null> {
  if (!MAPBOX_TOKEN) {
    console.error('Mapbox token not configured');
    return null;
  }

  const profile = MAPBOX_PROFILES[transportMode];
  const [longitude, latitude] = coordinates;
  
  try {
    const url = `${MAPBOX_API_BASE}/${profile}/${longitude},${latitude}?contours_minutes=${duration}&polygons=true&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }
    
    const data: IsochroneAPIResponse = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return null;
    }
    
    const feature = data.features[0];
    const area = calculatePolygonArea(feature.geometry.coordinates);
    
    return {
      mode: transportMode,
      duration,
      geometry: feature.geometry,
      area,
      color: TRANSPORT_COLORS[transportMode],
    };
  } catch (error) {
    console.error(`Error fetching isochrone for ${transportMode}:`, error);
    return null;
  }
}

/**
 * Fetch multiple isochrones for different transport modes
 */
export async function fetchMultipleIsochrones(
  request: IsochroneRequest
): Promise<IsochroneResult[]> {
  const promises = request.transportModes.map((mode) =>
    fetchIsochrone(request.coordinates, request.duration, mode)
  );
  
  const results = await Promise.all(promises);
  return results.filter((result): result is IsochroneResult => result !== null);
}

/**
 * Convert isochrone results to GeoJSON FeatureCollection for map display
 */
export function isochronesToGeoJSON(
  isochrones: IsochroneResult[]
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: isochrones.map((isochrone) => ({
      type: 'Feature',
      properties: {
        mode: isochrone.mode,
        duration: isochrone.duration,
        area: isochrone.area,
        color: isochrone.color,
      },
      geometry: isochrone.geometry,
    })),
  };
}