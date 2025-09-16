// @ts-nocheck
import axios from 'axios';

export interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
}

export interface KakaoUserProfile {
    id: number;
    connected_at: string;
    properties: {
        nickname: string;
        profile_image?: string;
        thumbnail_image?: string;
    };
    kakao_account: {
        profile_needs_agreement?: boolean;
        profile: {
            nickname: string;
            thumbnail_image_url?: string;
            profile_image_url?: string;
        };
        has_email?: boolean;
        email_needs_agreement?: boolean;
        is_email_valid?: boolean;
        is_email_verified?: boolean;
        email?: string;
    };
}

// 환경변수 디버깅 (실시간으로 확인)
console.log('🔍 모든 환경변수 확인:');
console.log('process.env keys:', Object.keys(process.env).filter(key => key.includes('KAKAO')));
console.log('KAKAO_CLIENT_ID:', process.env.KAKAO_CLIENT_ID);
console.log('KAKAO_CLIENT_SECRET:', process.env.KAKAO_CLIENT_SECRET);
console.log('KAKAO_REDIRECT_URI:', process.env.KAKAO_REDIRECT_URI);

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

export class KakaoAuthService {
    // 환경변수 검증
    private static validateEnvVars(): void {
        if (!KAKAO_CLIENT_ID) {
            throw new Error('KAKAO_CLIENT_ID 환경변수가 설정되지 않았습니다.');
        }
        if (!KAKAO_CLIENT_SECRET) {
            throw new Error('KAKAO_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
        }
        if (!KAKAO_REDIRECT_URI) {
            throw new Error('KAKAO_REDIRECT_URI 환경변수가 설정되지 않았습니다.');
        }
    }

    // 카카오 로그인 URL 생성
    static getAuthUrl(): string {
        this.validateEnvVars();

        const params = new URLSearchParams({
            client_id: KAKAO_CLIENT_ID!,
            redirect_uri: KAKAO_REDIRECT_URI!,
            response_type: 'code',
            scope: 'profile_nickname,profile_image,account_email'
        });

        return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    }

    // 인증 코드로 액세스 토큰 획득
    static async getAccessToken(code: string): Promise<KakaoTokenResponse> {
        try {
            const response = await axios.post(
                'https://kauth.kakao.com/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: KAKAO_CLIENT_ID,
                    client_secret: KAKAO_CLIENT_SECRET,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('카카오 토큰 획득 실패:', error);
            throw new Error('카카오 인증에 실패했습니다.');
        }
    }

    // 액세스 토큰으로 사용자 정보 획득
    static async getUserProfile(accessToken: string): Promise<KakaoUserProfile> {
        try {
            const response = await axios.get(
                'https://kapi.kakao.com/v2/user/me',
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('카카오 사용자 정보 획득 실패:', error);
            throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
    }

    // 카카오 토큰 폐기 (로그아웃)
    static async revokeToken(accessToken: string): Promise<void> {
        try {
            await axios.post(
                'https://kapi.kakao.com/v1/user/logout',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
        } catch (error) {
            console.error('카카오 로그아웃 실패:', error);
            // 로그아웃 실패는 치명적이지 않으므로 에러를 던지지 않음
        }
    }
}
