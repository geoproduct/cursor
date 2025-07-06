'use client';

import { useState, useCallback, useEffect } from 'react';
import MapComponent from '@/components/Map';
import ControlPanel from '@/components/ControlPanel';
import { CommuteSettings, IsochroneResult } from '@/types';
import { fetchMultipleIsochrones, isochronesToGeoJSON } from '@/services/isochrone';

// Default center: Seoul, South Korea
const DEFAULT_CENTER: [number, number] = [126.9780, 37.5665];

const DEFAULT_SETTINGS: CommuteSettings = {
  center: [0, 0],
  duration: 30,
  transportModes: ['walking'],
  timeOfDay: '09:00',
  dayOfWeek: 1, // Monday
};

export default function Home() {
  const [settings, setSettings] = useState<CommuteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isochroneResults, setIsochroneResults] = useState<IsochroneResult[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);

  // Handle location selection from map
  const handleLocationSelect = useCallback((coordinates: [number, number]) => {
    setSettings(prev => ({
      ...prev,
      center: coordinates,
    }));
  }, []);

  // Handle settings change from control panel
  const handleSettingsChange = useCallback((newSettings: CommuteSettings) => {
    setSettings(newSettings);
  }, []);

  // Fetch isochrone data when settings change
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if no location is selected or no transport modes
      if (
        settings.center[0] === 0 && settings.center[1] === 0 ||
        settings.transportModes.length === 0
      ) {
        setIsochroneResults([]);
        setGeoJsonData(null);
        return;
      }

      setIsLoading(true);
      
      try {
        const results = await fetchMultipleIsochrones({
          coordinates: settings.center,
          duration: settings.duration,
          transportModes: settings.transportModes,
        });
        
        setIsochroneResults(results);
        
        if (results.length > 0) {
          const geoJson = isochronesToGeoJSON(results);
          setGeoJsonData(geoJson);
        } else {
          setGeoJsonData(null);
        }
      } catch (error) {
        console.error('Error fetching isochrone data:', error);
        setIsochroneResults([]);
        setGeoJsonData(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API calls
    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [settings.center, settings.duration, settings.transportModes]);

  // Transform results for control panel display
  const panelResults = isochroneResults.map(result => ({
    mode: result.mode,
    area: result.area,
    duration: result.duration,
  }));

  return (
    <div className="h-screen flex">
      {/* Map Container */}
      <div className="flex-1 relative">
                 <MapComponent
           center={settings.center[0] !== 0 && settings.center[1] !== 0 ? settings.center : DEFAULT_CENTER}
           onLocationSelect={handleLocationSelect}
           isochroneData={geoJsonData || undefined}
         />
      </div>

      {/* Control Panel */}
      <div className="w-96 bg-white shadow-xl">
        <ControlPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          isLoading={isLoading}
          results={panelResults}
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-96 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            통근 범위 시각화 도구
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            원하는 지점에서 설정한 시간 내에 도달 가능한 지역을 확인하세요
          </p>
        </div>
      </div>
    </div>
  );
}
