# 🚀 Wedding Mate 배포 가이드

## Vercel 배포 방법

### 1. Vercel 계정 생성 및 프로젝트 연결

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 프로젝트 import

### 2. 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해야 합니다:

#### 백엔드 환경변수
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=https://your-domain.vercel.app/auth/kakao/callback
FRONTEND_URL=https://your-domain.vercel.app
DB_PATH=/tmp/wedding-mate.db
```

#### 프론트엔드 환경변수
```
REACT_APP_API_URL=https://your-backend-domain.vercel.app/api
```

### 3. 카카오 개발자 콘솔 설정

1. [Kakao Developers](https://developers.kakao.com) 접속
2. 애플리케이션 설정 → 플랫폼 → Web
3. 사이트 도메인에 Vercel 도메인 추가:
   ```
   https://your-domain.vercel.app
   ```
4. Redirect URI 설정:
   ```
   https://your-domain.vercel.app/auth/kakao/callback
   ```

### 4. 배포 단계

#### 방법 1: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 환경변수 설정
vercel env add NODE_ENV
vercel env add JWT_SECRET
vercel env add KAKAO_CLIENT_ID
vercel env add KAKAO_CLIENT_SECRET
vercel env add KAKAO_REDIRECT_URI
vercel env add FRONTEND_URL
```

#### 방법 2: GitHub 연동
1. GitHub에 코드 푸시
2. Vercel에서 GitHub 저장소 연결
3. 자동 배포 설정

### 5. 데이터베이스 설정

Vercel은 서버리스 환경이므로 SQLite 파일이 임시로만 저장됩니다.
실제 운영 환경에서는 다음 중 하나를 사용하는 것을 권장합니다:

- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **MongoDB Atlas**
- **Railway** (PostgreSQL)

### 6. 도메인 설정

1. Vercel 대시보드 → Domains
2. 커스텀 도메인 추가
3. DNS 설정 업데이트

### 7. 모니터링 및 로그

- Vercel 대시보드에서 실시간 로그 확인
- Analytics 탭에서 성능 모니터링
- Functions 탭에서 API 호출 통계 확인

## 🔧 로컬 개발 환경

### 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### 데이터베이스 확인
```bash
cd backend
node check-data.js
```

## 📝 주의사항

1. **환경변수 보안**: 절대 `.env` 파일을 Git에 커밋하지 마세요
2. **JWT 시크릿**: 강력한 랜덤 문자열을 사용하세요
3. **카카오 설정**: 배포 후 반드시 Redirect URI를 업데이트하세요
4. **데이터베이스**: 서버리스 환경에서는 데이터가 영구 저장되지 않습니다

## 🆘 문제 해결

### 자주 발생하는 문제들

1. **환경변수 로딩 실패**
   - Vercel 대시보드에서 환경변수 확인
   - 변수명 대소문자 확인

2. **카카오 로그인 실패**
   - Redirect URI 설정 확인
   - 도메인 설정 확인

3. **API 호출 실패**
   - CORS 설정 확인
   - API URL 확인

4. **빌드 실패**
   - TypeScript 오류 확인
   - 의존성 버전 확인
