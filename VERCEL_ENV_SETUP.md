# Vercel 환경변수 설정 가이드

## 현재 배포 상태
- 도메인: `https://our-wedding-mate.vercel.app`
- 상태: 404 오류 (환경변수 누락으로 추정)

## 필요한 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해야 합니다:

### 1. JWT Secret Key
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Kakao OAuth 설정
```
KAKAO_CLIENT_ID=your_kakao_client_id_here
KAKAO_CLIENT_SECRET=your_kakao_client_secret_here
KAKAO_REDIRECT_URI=https://our-wedding-mate.vercel.app/auth/kakao/callback
```

### 3. 데이터베이스 설정
```
DB_PATH=./wedding-mate.db
```

### 4. 환경 설정
```
NODE_ENV=production
```

## 설정 방법

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. `our-wedding-mate` 프로젝트 선택
3. Settings > Environment Variables로 이동
4. 위의 환경변수들을 추가
5. 재배포 실행

## 카카오 개발자 콘솔 설정

카카오 개발자 콘솔에서도 리다이렉트 URI를 업데이트해야 합니다:

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 로그인
2. 해당 애플리케이션 선택
3. 플랫폼 설정 > Web 플랫폼 추가
4. 사이트 도메인: `https://our-wedding-mate.vercel.app`
5. Redirect URI: `https://our-wedding-mate.vercel.app/auth/kakao/callback`

## 현재 문제점

- Vercel 배포가 404 오류를 반환
- API 엔드포인트가 500 오류를 반환 (환경변수 누락)
- 카카오 OAuth 리다이렉트 URI가 localhost로 설정되어 있음

## 보안 주의사항

⚠️ **중요**: 실제 키 값들은 절대 Git에 커밋하지 마세요!
- 카카오 개발자 콘솔에서 새로운 키를 발급받으세요
- 로컬 개발용 `.env.local` 파일을 별도로 생성하세요
- Vercel 환경변수는 대시보드에서만 설정하세요

## 해결 후 예상 결과

환경변수 설정 후:
- 메인 페이지 정상 로드
- 카카오 로그인 버튼 클릭 시 정상 리다이렉트
- 로그인 후 대시보드 접근 가능
