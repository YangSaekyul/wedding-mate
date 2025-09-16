import { NextRequest, NextResponse } from 'next/server';
import { KakaoAuthService } from '@/lib/services/kakaoAuth';
import { UserModel, CreateUserData } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { initDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        // 데이터베이스 초기화
        await initDatabase();

        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                {
                    error: 'MISSING_CODE',
                    message: '인증 코드가 필요합니다.'
                },
                { status: 400 }
            );
        }

        // 1. 카카오에서 액세스 토큰 획득
        const tokenResponse = await KakaoAuthService.getAccessToken(code);

        // 2. 액세스 토큰으로 사용자 정보 획득
        const kakaoUser = await KakaoAuthService.getUserProfile(tokenResponse.access_token);

        // 3. 기존 사용자 확인 또는 새 사용자 생성
        let user = await UserModel.findByKakaoId(kakaoUser.id.toString());

        if (!user) {
            // 새 사용자 생성
            const newUserData: CreateUserData = {
                kakao_id: kakaoUser.id.toString(),
                nickname: kakaoUser.properties.nickname,
                profile_image: kakaoUser.properties.profile_image,
                email: kakaoUser.kakao_account.email
            };

            user = await UserModel.create(newUserData);
        } else {
            // 기존 사용자 정보 업데이트 (프로필 이미지나 닉네임이 변경되었을 수 있음)
            user = await UserModel.update(user.id, {
                nickname: kakaoUser.properties.nickname,
                profile_image: kakaoUser.properties.profile_image,
                email: kakaoUser.kakao_account.email
            });
        }

        // 4. JWT 토큰 생성
        const token = generateToken(user);

        // 5. 응답
        return NextResponse.json({
            token,
            user: {
                id: user.id,
                nickname: user.nickname,
                profile_image: user.profile_image,
                email: user.email
            }
        });

    } catch (error) {
        console.error('카카오 콜백 처리 실패:', error);
        return NextResponse.json(
            {
                error: 'CALLBACK_ERROR',
                message: '로그인 처리 중 오류가 발생했습니다.'
            },
            { status: 500 }
        );
    }
}
