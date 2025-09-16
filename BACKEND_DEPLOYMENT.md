# 🚀 백엔드 배포 가이드

## 배포 옵션

### 1. Railway (권장) ⭐

**장점**: 
- 무료 티어 제공
- 자동 배포
- PostgreSQL 지원
- 쉬운 환경변수 설정

**배포 방법**:
1. [Railway](https://railway.app) 가입
2. GitHub 저장소 연결
3. 백엔드 폴더 선택
4. 환경변수 설정:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   KAKAO_CLIENT_ID=your-kakao-client-id
   KAKAO_CLIENT_SECRET=your-kakao-client-secret
   KAKAO_REDIRECT_URI=https://your-frontend-domain.vercel.app/auth/kakao/callback
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### 2. Render

**장점**:
- 무료 티어 제공
- 자동 배포
- PostgreSQL 지원

**배포 방법**:
1. [Render](https://render.com) 가입
2. GitHub 저장소 연결
3. Web Service 생성
4. 백엔드 폴더 선택
5. 환경변수 설정

### 3. Heroku

**장점**:
- 안정적인 플랫폼
- 다양한 애드온

**단점**:
- 무료 티어 종료

### 4. Vercel (현재 설정)

**현재 모노레포 설정**:
- 프론트엔드와 백엔드를 함께 배포
- `/api/*` → 백엔드
- `/*` → 프론트엔드

## 환경변수 설정

### 백엔드 환경변수
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

### 프론트엔드 환경변수 (Vercel)
```
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
```

## 데이터베이스 옵션

### 1. SQLite (현재)
- **장점**: 간단함
- **단점**: 서버리스 환경에서 데이터 손실 가능

### 2. PostgreSQL (권장)
- **Railway**: 자동으로 PostgreSQL 제공
- **Render**: PostgreSQL 애드온 사용

## 배포 후 확인사항

1. **헬스체크**: `https://your-backend-domain.com/api/health`
2. **API 테스트**: 카카오 로그인 테스트
3. **CORS 설정**: 프론트엔드 도메인 허용
4. **환경변수**: 모든 환경변수 정상 설정 확인

## 권장 배포 순서

1. **백엔드 배포** (Railway 권장)
2. **프론트엔드 배포** (Vercel)
3. **환경변수 설정**
4. **카카오 개발자 콘솔 설정 업데이트**
5. **테스트**

## 문제 해결

### CORS 오류
```javascript
// backend/src/index.ts
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend-domain.vercel.app'
    ],
    credentials: true
}));
```

### 환경변수 오류
- 모든 환경변수가 설정되었는지 확인
- 대소문자 구분 확인
- 따옴표 없이 입력

### 데이터베이스 연결 오류
- PostgreSQL 사용 권장
- 연결 문자열 확인
