export interface CommuteSettings {
  center: [number, number]; // [longitude, latitude]
  duration: number; // minutes
  transportModes: TransportMode[];
  timeOfDay: string; // "09:00"
  dayOfWeek: number; // 0-6 (Sunday = 0)
}

export type TransportMode = 'walking' | 'cycling' | 'driving' | 'transit';

export interface IsochroneResult {
  mode: TransportMode;
  duration: number;
  geometry: GeoJSON.Polygon;
  area: number; // square meters
  color: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export const TRANSPORT_COLORS = {
  walking: '#10B981', // green
  cycling: '#3B82F6', // blue
  driving: '#EF4444', // red
  transit: '#8B5CF6', // purple
} as const;

export const TRANSPORT_LABELS = {
  walking: '도보',
  cycling: '자전거',
  driving: '자동차',
  transit: '대중교통',
} as const;