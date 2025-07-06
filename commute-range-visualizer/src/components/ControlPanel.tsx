'use client';

import { useState } from 'react';
import { CommuteSettings, TransportMode, TRANSPORT_COLORS, TRANSPORT_LABELS } from '@/types';

interface ControlPanelProps {
  settings: CommuteSettings;
  onSettingsChange: (settings: CommuteSettings) => void;
  isLoading?: boolean;
  results?: Array<{
    mode: TransportMode;
    area: number;
    duration: number;
  }>;
}

export default function ControlPanel({
  settings,
  onSettingsChange,
  isLoading = false,
  results = [],
}: ControlPanelProps) {
  const [localDuration, setLocalDuration] = useState(settings.duration);

  const handleDurationChange = (duration: number) => {
    setLocalDuration(duration);
    onSettingsChange({
      ...settings,
      duration,
    });
  };

  const handleTransportModeToggle = (mode: TransportMode) => {
    const newModes = settings.transportModes.includes(mode)
      ? settings.transportModes.filter((m) => m !== mode)
      : [...settings.transportModes, mode];

    onSettingsChange({
      ...settings,
      transportModes: newModes,
    });
  };

  const formatArea = (area: number) => {
    if (area > 1000000) {
      return `${(area / 1000000).toFixed(1)} km²`;
    }
    return `${(area / 1000).toFixed(0)} m²`;
  };

  return (
    <div className="bg-white p-6 shadow-lg h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">통근 범위 설정</h2>

      {/* Duration Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          이동 시간: {localDuration}분
        </label>
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={localDuration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5분</span>
          <span>120분</span>
        </div>
      </div>

      {/* Transport Mode Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          교통수단 선택
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(TRANSPORT_LABELS) as TransportMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleTransportModeToggle(mode)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                settings.transportModes.includes(mode)
                  ? 'border-current text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
              style={{
                backgroundColor: settings.transportModes.includes(mode)
                  ? TRANSPORT_COLORS[mode]
                  : 'transparent',
              }}
            >
              <div className="text-sm font-medium">
                {TRANSPORT_LABELS[mode]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            계산 결과
          </h3>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.mode}
                className="bg-gray-50 rounded-lg p-4 border-l-4"
                style={{ borderLeftColor: TRANSPORT_COLORS[result.mode] }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    {TRANSPORT_LABELS[result.mode]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {result.duration}분
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  범위: {formatArea(result.area)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">계산 중...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">사용 방법</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 지도에서 시작점을 클릭하세요</li>
          <li>• 이동 시간을 조정하세요</li>
          <li>• 원하는 교통수단을 선택하세요</li>
          <li>• 통근 가능 범위를 확인하세요</li>
        </ul>
      </div>
    </div>
  );
}