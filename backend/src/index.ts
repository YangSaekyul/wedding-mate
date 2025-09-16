// @ts-nocheck
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { initDatabase, closeDatabase } from './models/database';

// 라우터 import
import authRoutes from './routes/auth';
import ddayRoutes from './routes/ddays';

console.log('🔍 .env 파일 경로:', process.cwd() + '/.env');
console.log('🔍 환경변수 로드 확인:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Rate limiting - API 요청 제한
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100개 요청
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: '너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 미들웨어 설정
app.use(limiter);
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Wedding Mate API'
    });
});

// API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/ddays', ddayRoutes);

// 404 에러 핸들러
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'NOT_FOUND',
        message: '요청한 리소스를 찾을 수 없습니다.'
    });
});

// 전역 에러 핸들러
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('서버 오류:', error);

    res.status(error.status || 500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development'
            ? error.message
            : '서버 내부 오류가 발생했습니다.'
    });
});

// 서버 시작
const startServer = async () => {
    try {
        // 데이터베이스 초기화
        await initDatabase();
        console.log('✅ 데이터베이스가 초기화되었습니다.');

        // 서버 시작
        app.listen(PORT, () => {
            console.log(`🚀 Wedding Mate API 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`📖 API 문서: http://localhost:${PORT}/health`);
            console.log(`🌐 프론트엔드 URL: ${FRONTEND_URL}`);
        });
    } catch (error) {
        console.error('❌ 서버 시작 실패:', error);
        process.exit(1);
    }
};

// 서버 종료 시 정리 작업
process.on('SIGINT', async () => {
    console.log('\n서버를 종료합니다...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n서버를 종료합니다...');
    await closeDatabase();
    process.exit(0);
});

// 처리되지 않은 Promise rejection 처리
process.on('unhandledRejection', (reason, promise) => {
    console.error('처리되지 않은 Promise Rejection:', reason);
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
    console.error('처리되지 않은 예외:', error);
    process.exit(1);
});

// 서버 시작
startServer();
