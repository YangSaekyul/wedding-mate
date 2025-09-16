# 💒 Our Wedding Mate

예비 신혼부부를 위한 초간단 웨딩 플래닝 도구 MVP

## 📋 주요 기능

- **🔐 카카오 소셜 로그인**: 간편한 원클릭 로그인
- **📅 D-DAY 관리**: 결혼식, 신혼여행 등 중요한 날짜 관리
- **⏰ 자동 카운트다운**: 실시간 D-DAY 계산
- **🔒 개인정보 보호**: 철저한 사용자별 데이터 분리

## 🛠 기술 스택

### Backend
- **Node.js + Express + TypeScript**
- **SQLite**: 간단하고 효율적인 데이터베이스
- **JWT**: 안전한 인증 시스템
- **카카오 OAuth 2.0**: 소셜 로그인

### Frontend
- **React + TypeScript**
- **Tailwind CSS**: 모던하고 반응형 UI
- **React Query**: 효율적인 데이터 관리
- **React Hook Form**: 폼 상태 관리

## 🚀 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- npm 또는 yarn
- 카카오 개발자 계정 ([developers.kakao.com](https://developers.kakao.com))

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd wedding-mate

# 루트 의존성 설치
npm install

# 백엔드 의존성 설치
cd backend
npm install

# 프론트엔드 의존성 설치
cd ../frontend
npm install
```

### 2. 카카오 개발자 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com)에 로그인
2. 새 애플리케이션 생성
3. **플랫폼 설정**:
   - Web 플랫폼 추가
   - 사이트 도메인: `http://localhost:3000`
4. **카카오 로그인 설정**:
   - 카카오 로그인 활성화
   - Redirect URI: `http://localhost:3000/auth/kakao/callback`
   - 동의항목: 닉네임, 프로필 이미지, 카카오계정(이메일)

### 3. 환경 변수 설정

백엔드 환경 변수 파일 생성:

```bash
cd backend
cp env.example .env
```

`.env` 파일 내용을 다음과 같이 수정:

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# JWT 시크릿 키 (안전한 랜덤 문자열로 변경)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 카카오 OAuth 설정 (카카오 개발자 콘솔에서 확인)
KAKAO_CLIENT_ID=your-kakao-app-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# 프론트엔드 URL
FRONTEND_URL=http://localhost:3000

# 데이터베이스 경로
DB_PATH=./wedding-mate.db
```

### 4. 애플리케이션 실행

루트 디렉토리에서:

```bash
# 개발 서버 실행 (백엔드 + 프론트엔드 동시 실행)
npm run dev
```

또는 각각 따로 실행:

```bash
# 백엔드 실행
npm run backend

# 새 터미널에서 프론트엔드 실행
npm run frontend
```

### 5. 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **헬스체크**: http://localhost:3001/health

## 📁 프로젝트 구조

```
wedding-mate/
├── backend/                 # 백엔드 API 서버
│   ├── src/
│   │   ├── models/         # 데이터베이스 모델
│   │   ├── routes/         # API 라우트
│   │   ├── services/       # 비즈니스 로직
│   │   ├── middleware/     # 미들웨어
│   │   ├── utils/          # 유틸리티
│   │   └── index.ts        # 서버 진입점
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── contexts/       # React Context
│   │   ├── lib/            # 라이브러리 및 유틸리티
│   │   └── types/          # TypeScript 타입 정의
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── package.json             # 루트 패키지 설정
└── README.md
```

## 🔧 주요 스크립트

```bash
# 개발 모드 실행 (백엔드 + 프론트엔드)
npm run dev

# 백엔드만 실행
npm run backend

# 프론트엔드만 실행
npm run frontend

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔐 보안 기능

- **JWT 기반 인증**: 안전한 토큰 기반 인증 시스템
- **사용자별 데이터 분리**: 다른 사용자의 데이터 접근 완전 차단
- **Rate Limiting**: API 요청 제한으로 서비스 남용 방지
- **입력 검증**: 모든 사용자 입력에 대한 검증 및 새니타이징

## 📱 사용법

### 1. 로그인
- 카카오 로그인 버튼 클릭
- 카카오 계정으로 간편 인증

### 2. D-DAY 등록
- 대시보드에서 "새 D-DAY 추가" 버튼 클릭
- 제목, 날짜, 설명 입력
- 등록 버튼 클릭

### 3. D-DAY 관리
- **조회**: 등록된 모든 D-DAY를 카드 형태로 표시
- **수정**: 연필 아이콘 클릭하여 정보 수정
- **삭제**: 휴지통 아이콘 클릭하여 삭제

## 🚦 API 엔드포인트

### 인증
- `GET /api/auth/kakao` - 카카오 로그인 URL 조회
- `POST /api/auth/kakao/callback` - 카카오 로그인 콜백 처리
- `GET /api/auth/me` - 현재 사용자 정보 조회
- `POST /api/auth/logout` - 로그아웃

### D-DAY 관리
- `GET /api/ddays` - 사용자 D-DAY 목록 조회
- `POST /api/ddays` - 새 D-DAY 생성
- `GET /api/ddays/:id` - 특정 D-DAY 조회
- `PUT /api/ddays/:id` - D-DAY 정보 수정
- `DELETE /api/ddays/:id` - D-DAY 삭제

## 🤝 기여하기

1. 이 저장소를 포크합니다.
2. 새로운 기능 브랜치를 생성합니다. (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다. (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시합니다. (`git push origin feature/새기능`)
5. Pull Request를 생성합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🐛 문제 해결

### 자주 발생하는 문제

**1. 카카오 로그인이 안 되는 경우**
- 카카오 개발자 콘솔에서 Client ID와 Secret이 올바른지 확인
- Redirect URI가 정확히 설정되어 있는지 확인
- 도메인 설정이 올바른지 확인

**2. 데이터베이스 오류**
- `backend/` 폴더의 권한 확인
- SQLite 파일 생성 권한 확인

**3. 포트 충돌**
- 3000번, 3001번 포트가 사용 중인지 확인
- 환경 변수에서 다른 포트로 변경 가능

## 📞 지원

문제가 있으시면 이슈를 등록해 주세요. 빠른 시일 내에 도움을 드리겠습니다!

---

💒 **Our Wedding Mate**로 특별한 날들을 더욱 의미있게 준비하세요!
