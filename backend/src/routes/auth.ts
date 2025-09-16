// @ts-nocheck
import { Router, Request, Response } from 'express';
import { KakaoAuthService } from '../services/kakaoAuth';
import { UserModel, CreateUserData } from '../models/User';
import { generateToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

const router = Router();

// 카카오 로그인 URL 제공
router.get('/kakao', (req: Request, res: Response) => {
    try {
        const authUrl = KakaoAuthService.getAuthUrl();
        res.json({ authUrl });
    } catch (error) {
        console.error('카카오 인증 URL 생성 실패:', error);
        res.status(500).json({
            error: 'AUTH_URL_ERROR',
            message: '인증 URL 생성에 실패했습니다.'
        });
    }
});

// 카카오 OAuth 콜백 처리
router.post('/kakao/callback', async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: 'MISSING_CODE',
                message: '인증 코드가 필요합니다.'
            });
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
        res.json({
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
        res.status(500).json({
            error: 'CALLBACK_ERROR',
            message: '로그인 처리 중 오류가 발생했습니다.'
        });
    }
});

// 현재 로그인한 사용자 정보 조회
router.get('/me', requireAuth, async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.user!.id);

        if (!user) {
            return res.status(404).json({
                error: 'USER_NOT_FOUND',
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        res.json({
            user: {
                id: user.id,
                nickname: user.nickname,
                profile_image: user.profile_image,
                email: user.email,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        res.status(500).json({
            error: 'USER_INFO_ERROR',
            message: '사용자 정보를 가져올 수 없습니다.'
        });
    }
});

// 로그아웃 (클라이언트 측에서 토큰 삭제)
router.post('/logout', (req: Request, res: Response) => {
    // JWT는 서버에서 무효화할 수 없으므로 클라이언트에서 토큰을 삭제하도록 안내
    res.json({
        message: '로그아웃되었습니다. 클라이언트에서 토큰을 삭제하세요.'
    });
});

export default router;
