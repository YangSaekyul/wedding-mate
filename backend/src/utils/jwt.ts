// @ts-nocheck
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JwtPayload {
    userId: number;
    kakaoId: string;
    iat?: number;
    exp?: number;
}

// JWT 토큰 생성
export const generateToken = (user: User): string => {
    const payload: JwtPayload = {
        userId: user.id,
        kakaoId: user.kakao_id
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d' // 7일 후 만료
    });
};

// JWT 토큰 검증
export const verifyToken = (token: string): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as JwtPayload);
            }
        });
    });
};

// Authorization 헤더에서 토큰 추출
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
};
