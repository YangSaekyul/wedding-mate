# 카카오 개발자 콘솔 설정 확인 가이드

## 🔍 현재 상황 분석

### Vercel에서 실제 사용되는 URI:
```
https://our-wedding-mate.vercel.app/auth/kakao/callback
```

### Vercel 로그 분석:
- `/api/auth/kakao` → 200 OK (정상)
- `/auth/kakao/callback` → 416 RANGE_MISSING_UNIT 오류

## ❗ 카카오 개발자 콘솔에서 확인해야 할 사항

### 1. 플랫폼 설정 확인
[카카오 개발자 콘솔](https://developers.kakao.com/) → 해당 앱 → 플랫폼

**Web 플랫폼 설정:**
- 사이트 도메인: `https://our-wedding-mate.vercel.app`
- Redirect URI: `https://our-wedding-mate.vercel.app/auth/kakao/callback`

### 2. 현재 등록된 Redirect URI 확인
다음 URI들이 **모두** 등록되어 있어야 합니다:

**개발용:**
- `http://localhost:3000/auth/kakao/callback`

**프로덕션용:**
- `https://our-wedding-mate.vercel.app/auth/kakao/callback`

### 3. 확인 방법
1. 카카오 개발자 콘솔 로그인
2. 해당 앱 선택
3. 플랫폼 → Web
4. "Redirect URI" 섹션 확인

## 🚨 예상되는 문제점

### 1. Redirect URI 미등록
- `https://our-wedding-mate.vercel.app/auth/kakao/callback`가 등록되지 않음
- 로컬 URI만 등록되어 있을 가능성

### 2. 도메인 불일치
- 등록된 도메인과 실제 도메인이 다를 수 있음
- `our-wedding-mate.vercel.app` vs `our-wedding-mate-xxx.vercel.app`

### 3. 프로토콜 문제
- `http://` vs `https://` 불일치

## ✅ 해결 방법

### 1. 카카오 콘솔에 URI 추가
```
https://our-wedding-mate.vercel.app/auth/kakao/callback
```

### 2. 다중 URI 등록
개발과 프로덕션 모두 지원하도록:
```
http://localhost:3000/auth/kakao/callback
https://our-wedding-mate.vercel.app/auth/kakao/callback
```

### 3. 설정 후 테스트
- 카카오 로그인 버튼 클릭
- 리다이렉트 확인
- 콜백 처리 확인

## 📝 참고사항

- KOE006 에러는 99% 카카오 콘솔의 Redirect URI 설정 문제
- Vercel에서는 올바른 URI를 사용하고 있음을 확인함
- 환경변수는 정상적으로 로드되고 있음

