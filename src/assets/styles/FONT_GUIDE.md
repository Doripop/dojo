# 폰트 사용 가이드

## Helvetica63-ExtendedMedium 폰트 사용법

### SCSS에서 사용하기

```scss
// Helvetica63 폰트 적용 예시
.my-text {
  @include fontFamily("HELVETICA_XL", "helvetica63");
}

.title {
  @include fontFamily("HELVETICA_L", "helvetica63");
}

.subtitle {
  @include fontFamily("HELVETICA_M", "helvetica63");
}

.body-text {
  @include fontFamily("HELVETICA_S", "helvetica63");
}

.small-text {
  @include fontFamily("HELVETICA_XS", "helvetica63");
}
```

### 사용 가능한 Helvetica63 사이즈

- `HELVETICA_XL`: 28px (font-weight: 500, line-height: 130%)
- `HELVETICA_L`: 24px (font-weight: 500, line-height: 130%)
- `HELVETICA_M`: 20px (font-weight: 500, line-height: 130%)
- `HELVETICA_S`: 16px (font-weight: 500, line-height: 130%)
- `HELVETICA_XS`: 14px (font-weight: 500, line-height: 130%)

## 폰트 파일 설치 방법

1. `public/fonts/` 폴더에 다음 파일들을 추가하세요:
   - `Helvetica63-ExtendedMedium.woff2`
   - `Helvetica63-ExtendedMedium.woff`
   - `Helvetica63-ExtendedMedium.ttf`

2. 폰트 파일이 없어도 fallback 폰트들이 적용됩니다:
   - Helvetica Neue
   - Helvetica
   - Arial
   - 기본 sans-serif

## 모든 폰트 타입

- `pretendard` (기본값)
- `silkscreen`
- `pixel`
- `angeris`
- `helvetica63` (새로 추가됨)
