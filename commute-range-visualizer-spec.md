# 통근 범위 시각화 서비스 - 프로젝트 명세서

## 📋 프로젝트 개요

**프로젝트명**: Commute Range Visualizer (통근 범위 시각화 도구)  
**목표**: 사용자가 선택한 지점에서 설정한 시간 내에 도달 가능한 지역을 교통수단별로 시각화

## 🎯 핵심 기능

### 1. 지도 인터페이스
- 인터랙티브 지도 표시
- 마커를 통한 지점 선택
- 줌 인/아웃 기능
- 현재 위치 감지

### 2. 통근 조건 설정
- 이동 시간 입력 (5분~120분)
- 교통수단 선택 (도보/지하철/버스/자전거)
- 출발/도착 시간대 설정
- 요일 선택

### 3. 범위 계산 및 시각화
- 등시간대 (Isochrone) 계산
- 교통수단별 색상 구분
- 반투명 오버레이 표시
- 범위 면적 계산 및 표시

### 4. 추가 정보
- 주요 지하철역 표시
- 버스 노선 정보
- 실시간 교통 상황 반영
- 통근 비용 추정

## 🛠️ 기술 스택

### Frontend
- **React 18** with TypeScript
- **Next.js 14** (SSR, 최적화)
- **Tailwind CSS** (스타일링)
- **React Query** (데이터 페칭)

### 지도 및 위치 서비스
- **Mapbox GL JS** (지도 렌더링)
- **Mapbox Isochrone API** (등시간대 계산)
- **Kakao Map API** (한국 지역 최적화)

### 교통 정보 API
- **Kakao Mobility API** (대중교통)
- **GTFS 데이터** (지하철/버스 정보)
- **T-map API** (실시간 교통정보)

### 백엔드 (옵션)
- **Node.js + Express** (API 서버)
- **Redis** (캐싱)
- **PostgreSQL + PostGIS** (지리 데이터)

## 📐 시스템 아키텍처

```
Frontend (React/Next.js)
    ↓
지도 컴포넌트 (Mapbox/Kakao Map)
    ↓
API 레이어 (교통정보, 등시간대)
    ↓
외부 서비스 (Kakao, T-map, Mapbox)
```

## 🚀 개발 단계

### Phase 1: 기본 지도 인터페이스
1. Next.js 프로젝트 설정
2. Mapbox 지도 통합
3. 마커 추가/이동 기능
4. 기본 UI 컴포넌트

### Phase 2: 등시간대 계산
1. Mapbox Isochrone API 연동
2. 도보 범위 계산 및 표시
3. 시간 입력 UI 구현

### Phase 3: 대중교통 연동
1. Kakao Mobility API 연동
2. 지하철/버스 범위 계산
3. 교통수단별 색상 구분

### Phase 4: 고도화
1. 실시간 교통정보 반영
2. 다중 교통수단 조합
3. 성능 최적화
4. 모바일 최적화

## 🎨 UI/UX 설계

### 메인 화면 구성
- **좌측**: 지도 (전체 화면의 70%)
- **우측**: 컨트롤 패널 (30%)
  - 시간 설정 슬라이더
  - 교통수단 선택 버튼
  - 결과 정보 패널

### 인터랙션 플로우
1. 지도에서 지점 클릭 → 마커 설정
2. 이동 시간 설정 (슬라이더)
3. 교통수단 선택 (토글 버튼)
4. 실시간 범위 계산 및 표시

## 📊 데이터 구조

### 설정 데이터
```typescript
interface CommuteSettings {
  center: [number, number]; // 위도, 경도
  duration: number; // 분
  transportModes: TransportMode[];
  timeOfDay: string; // "09:00"
  dayOfWeek: number; // 0-6
}

type TransportMode = 'walking' | 'subway' | 'bus' | 'cycling';
```

### 결과 데이터
```typescript
interface IsochroneResult {
  mode: TransportMode;
  duration: number;
  geometry: GeoJSON.Polygon;
  area: number; // 제곱미터
  color: string;
}
```

## 🔧 개발 우선순위

1. **높음**: 지도 인터페이스, 도보 범위 계산
2. **중간**: 대중교통 연동, UI 개선
3. **낮음**: 실시간 정보, 고급 기능

## 📈 성능 고려사항

- API 호출 최적화 (디바운싱)
- 결과 캐싱 (Redis/LocalStorage)
- 지도 타일 최적화
- 모바일 성능 최적화

## 🌐 배포 전략

- **개발**: Vercel/Netlify
- **프로덕션**: AWS CloudFront + S3
- **API**: AWS Lambda (서버리스)

---

이 명세서를 바탕으로 단계별 개발을 진행하겠습니다!