// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { UserModel } from '../models/User';

// 인증된 사용자 정보를 Request에 추가
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                kakao_id: string;
                nickname: string;
            };
        }
    }
}

// 인증 필수 미들웨어
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                error: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.'
            });
        }

        const payload = await verifyToken(token);
        const user = await UserModel.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                error: 'USER_NOT_FOUND',
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        // 요청 객체에 사용자 정보 추가
        req.user = {
            id: user.id,
            kakao_id: user.kakao_id,
            nickname: user.nickname
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'TOKEN_EXPIRED',
                    message: '로그인이 만료되었습니다. 다시 로그인해 주세요.'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 'INVALID_TOKEN',
                    message: '유효하지 않은 토큰입니다.'
                });
            }
        }

        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: '서버 내부 오류가 발생했습니다.'
        });
    }
};

// 선택적 인증 미들웨어 (토큰이 있으면 사용자 정보 추가, 없어도 계속 진행)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (token) {
            const payload = await verifyToken(token);
            const user = await UserModel.findById(payload.userId);

            if (user) {
                req.user = {
                    id: user.id,
                    kakao_id: user.kakao_id,
                    nickname: user.nickname
                };
            }
        }

        next();
    } catch (error) {
        // 선택적 인증에서는 오류가 발생해도 계속 진행
        next();
    }
};
