import { NextRequest, NextResponse } from 'next/server';
import { KakaoAuthService } from '@/lib/services/kakaoAuth';

export async function GET() {
    try {
        const authUrl = KakaoAuthService.getAuthUrl();
        return NextResponse.json({ authUrl });
    } catch (error) {
        console.error('카카오 인증 URL 생성 실패:', error);
        return NextResponse.json(
            {
                error: 'AUTH_URL_ERROR',
                message: '인증 URL 생성에 실패했습니다.'
            },
            { status: 500 }
        );
    }
}
