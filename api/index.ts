// @ts-nocheck
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { VercelRequest, VercelResponse } from '@vercel/node';

// 백엔드 라우터들 import
import authRoutes from '../backend/src/routes/auth';
import ddayRoutes from '../backend/src/routes/ddays';

const app = express();

// CORS 설정
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://wedding-mate.vercel.app', // Vercel 도메인으로 변경 필요
        process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.'
});
app.use(limiter);

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 헬스체크 엔드포인트
app.get('/api/health', (req, res) => {
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

// Vercel Functions 핸들러
export default (req: VercelRequest, res: VercelResponse) => {
    return app(req as any, res as any);
};
