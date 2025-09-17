import axios from 'axios';

// 환경에 따른 base URL 결정 함수
const getBaseUrl = () => {
    // 환경변수에서 직접 설정된 리다이렉트 URI가 있다면 그것을 사용
    if (process.env.KAKAO_REDIRECT_URI) {
        try {
            const url = new URL(process.env.KAKAO_REDIRECT_URI);
            return url.origin;
        } catch (e) {
            console.warn('KAKAO_REDIRECT_URI 파싱 실패:', e);
        }
    }

    // 개발 환경
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000';
    }
    
    // Vercel 배포 환경
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 프로덕션 환경의 기본값
    return 'https://our-wedding-mate.vercel.app';
};

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

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const BASE_URL = getBaseUrl();
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${BASE_URL}/auth/kakao/callback`;

// 환경변수 로딩 디버그 로그
console.log('=== 환경변수 로딩 디버그 ===');
console.log('현재 환경:', process.env.NODE_ENV);
console.log('BASE_URL:', BASE_URL);
console.log('KAKAO_REDIRECT_URI:', KAKAO_REDIRECT_URI);
console.log('KAKAO_CLIENT_ID 설정됨:', !!KAKAO_CLIENT_ID);
console.log('KAKAO_CLIENT_SECRET 설정됨:', !!KAKAO_CLIENT_SECRET);
console.log('VERCEL 정보:', {
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV
});
console.log('===============================');

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

        // 디버깅을 위한 로그 추가
        console.log('=== 카카오 OAuth 요청 정보 ===');
        console.log('인증 시간:', new Date().toISOString());
        console.log('사용 중인 리다이렉트 URI:', KAKAO_REDIRECT_URI);
        
        const params = new URLSearchParams({
            client_id: KAKAO_CLIENT_ID!,
            redirect_uri: KAKAO_REDIRECT_URI,
            response_type: 'code',
            scope: 'profile_nickname,profile_image,account_email'
        });

        const authUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
        console.log('생성된 인증 URL:', authUrl);
        console.log('================================');

        return authUrl;
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
