'use client';

import { useCallback, useState, useRef } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapViewState } from '@/types';

interface MapComponentProps {
  center: [number, number];
  onLocationSelect: (coordinates: [number, number]) => void;
  isochroneData?: GeoJSON.FeatureCollection;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapComponent({
  center,
  onLocationSelect,
  isochroneData,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: center[0],
    latitude: center[1],
    zoom: 12,
  });

  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    center[0] !== 0 && center[1] !== 0 ? center : null
  );

  const handleMapClick = useCallback(
    (event: any) => {
      const { lng, lat } = event.lngLat;
      const coordinates: [number, number] = [lng, lat];
      
      setMarkerLocation(coordinates);
      onLocationSelect(coordinates);
    },
    [onLocationSelect]
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-semibold">
            Mapbox Token이 설정되지 않았습니다
          </p>
          <p className="text-sm text-gray-600 mt-2">
            .env.local 파일에 NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN을 설정해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Isochrone layers */}
        {isochroneData && (
          <Source id="isochrone" type="geojson" data={isochroneData}>
            <Layer
              id="isochrone-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.3,
              }}
            />
            <Layer
              id="isochrone-stroke"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Location marker */}
        {markerLocation && (
          <Marker
            longitude={markerLocation[0]}
            latitude={markerLocation[1]}
            color="#EF4444"
            draggable
            onDragEnd={(event: any) => {
              const { lng, lat } = event.lngLat;
              const coordinates: [number, number] = [lng, lat];
              setMarkerLocation(coordinates);
              onLocationSelect(coordinates);
            }}
          />
        )}
      </Map>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm text-gray-700">
          지도를 클릭하거나 마커를 드래그하여 위치를 선택하세요
        </p>
      </div>
    </div>
  );
}