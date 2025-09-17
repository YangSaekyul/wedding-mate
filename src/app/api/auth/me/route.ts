import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/models/User';
import { verifyToken, extractTokenFromHeader } from '@/lib/utils/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 토큰 추출 및 검증
        const authHeader = request.headers.get('authorization');
        const token = extractTokenFromHeader(authHeader || undefined);

        if (!token) {
            return NextResponse.json(
                {
                    error: 'MISSING_TOKEN',
                    message: '인증 토큰이 필요합니다.'
                },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        const user = await UserModel.findById(payload.userId);

        if (!user) {
            return NextResponse.json(
                {
                    error: 'USER_NOT_FOUND',
                    message: '사용자를 찾을 수 없습니다.'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                nickname: user.nickname,
                profileImage: user.profileImage,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return NextResponse.json(
            {
                error: 'USER_INFO_ERROR',
                message: '사용자 정보를 가져올 수 없습니다.'
            },
            { status: 500 }
        );
    }
}
