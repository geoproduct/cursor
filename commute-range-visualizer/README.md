# 통근 범위 시각화 도구 (Commute Range Visualizer)

사용자가 지도에서 지점을 선택하고 이동 시간을 입력하면, 도보/자전거/자동차/대중교통별로 통근 가능 범위를 시각화하여 보여주는 웹 기반 서비스입니다.

## 🎯 주요 기능

- **인터랙티브 지도**: Mapbox를 사용한 고품질 지도 인터페이스
- **위치 선택**: 클릭 또는 드래그로 시작점 설정
- **이동 시간 설정**: 5분~120분 범위의 슬라이더
- **교통수단 선택**: 도보, 자전거, 자동차, 대중교통 선택 가능
- **실시간 범위 계산**: Mapbox Isochrone API를 통한 정확한 계산
- **시각화**: 교통수단별 색상 구분으로 범위 표시
- **통계 정보**: 각 교통수단별 도달 가능 면적 표시

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **지도**: Mapbox GL JS, react-map-gl
- **스타일링**: Tailwind CSS
- **API**: Mapbox Isochrone API

## 🚀 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경변수 설정**
   `.env.local` 파일에 Mapbox 토큰을 설정하세요:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
   
   > Mapbox 토큰은 [Mapbox 계정](https://account.mapbox.com/access-tokens/)에서 무료로 발급받을 수 있습니다.

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   http://localhost:3000 으로 접속하세요.

## 📱 사용법

1. **위치 선택**: 지도를 클릭하여 시작점을 선택하거나 마커를 드래그하세요
2. **시간 설정**: 우측 패널에서 이동 시간을 조정하세요 (5-120분)
3. **교통수단 선택**: 원하는 교통수단을 클릭하여 활성화/비활성화하세요
4. **결과 확인**: 지도에서 색상별로 구분된 통근 가능 범위를 확인하세요

## 🎨 교통수단별 색상

- 🟢 **도보**: 녹색
- 🔵 **자전거**: 파란색  
- 🔴 **자동차**: 빨간색
- 🟣 **대중교통**: 보라색

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── globals.css      # 전역 스타일
│   └── page.tsx         # 메인 페이지
├── components/
│   ├── Map.tsx          # 지도 컴포넌트
│   └── ControlPanel.tsx # 제어판 컴포넌트
├── services/
│   └── isochrone.ts     # Isochrone API 서비스
└── types/
    └── index.ts         # TypeScript 타입 정의
```

## 🔧 주요 컴포넌트

### MapComponent
- Mapbox GL JS 기반 지도 렌더링
- 마커 추가/이동 기능
- Isochrone 결과 시각화

### ControlPanel
- 이동 시간 설정 슬라이더
- 교통수단 선택 버튼
- 계산 결과 표시

### Isochrone Service
- Mapbox Isochrone API 호출
- 다중 교통수단 지원
- GeoJSON 변환

## 📊 API 제한사항

- **Mapbox Free Tier**: 월 50,000 요청 무료
- **Rate Limiting**: 600 요청/분
- **대중교통**: 현재 도보로 대체 (향후 개선 예정)

## 🎯 향후 개선 계획

- [ ] 실제 대중교통 API 연동 (카카오 모빌리티, T-map)
- [ ] 시간대별 교통 상황 반영
- [ ] 다중 시간 비교 기능
- [ ] 즐겨찾기 위치 저장
- [ ] 모바일 최적화
- [ ] PWA 지원

## 🐛 문제 해결

### Mapbox 토큰 오류
```
Mapbox Token이 설정되지 않았습니다
```
→ `.env.local` 파일에 올바른 Mapbox 토큰을 설정하세요.

### API 요청 실패
```
Mapbox API error: 401
```
→ Mapbox 토큰이 유효한지 확인하고, 계정의 사용량을 확인하세요.

## 📄 라이선스

MIT License

---

**만든이**: AI Assistant  
**문의**: 개발 관련 질문이 있으시면 언제든 말씀해주세요!
