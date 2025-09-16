// @ts-nocheck
import { Router, Request, Response } from 'express';
import { DDayModel, CreateDDayData, UpdateDDayData } from '../models/DDay';
import { requireAuth } from '../middleware/auth';

const router = Router();

// 모든 D-DAY 라우트는 인증 필요
router.use(requireAuth);

// 사용자의 모든 D-DAY 목록 조회
router.get('/', async (req: Request, res: Response) => {
    try {
        const ddays = await DDayModel.findByUserId(req.user!.id);
        res.json({ ddays });
    } catch (error) {
        console.error('D-DAY 목록 조회 실패:', error);
        res.status(500).json({
            error: 'DDAYS_FETCH_ERROR',
            message: 'D-DAY 목록을 가져올 수 없습니다.'
        });
    }
});

// 특정 D-DAY 조회
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const ddayId = parseInt(req.params.id);

        if (isNaN(ddayId)) {
            return res.status(400).json({
                error: 'INVALID_ID',
                message: '유효하지 않은 D-DAY ID입니다.'
            });
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, req.user!.id);
        if (!isOwner) {
            return res.status(403).json({
                error: 'ACCESS_DENIED',
                message: '해당 D-DAY에 접근할 권한이 없습니다.'
            });
        }

        const dday = await DDayModel.findById(ddayId);

        if (!dday) {
            return res.status(404).json({
                error: 'DDAY_NOT_FOUND',
                message: 'D-DAY를 찾을 수 없습니다.'
            });
        }

        res.json({ dday });
    } catch (error) {
        console.error('D-DAY 조회 실패:', error);
        res.status(500).json({
            error: 'DDAY_FETCH_ERROR',
            message: 'D-DAY를 가져올 수 없습니다.'
        });
    }
});

// 새 D-DAY 생성
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, target_date, description } = req.body;

        // 필수 필드 검증
        if (!title || !target_date) {
            return res.status(400).json({
                error: 'MISSING_REQUIRED_FIELDS',
                message: '제목과 목표 날짜는 필수입니다.'
            });
        }

        // 날짜 형식 검증
        const targetDate = new Date(target_date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                error: 'INVALID_DATE',
                message: '유효하지 않은 날짜 형식입니다.'
            });
        }

        const ddayData: CreateDDayData = {
            user_id: req.user!.id,
            title: title.trim(),
            target_date,
            description: description?.trim()
        };

        const dday = await DDayModel.create(ddayData);

        res.status(201).json({
            message: 'D-DAY가 성공적으로 생성되었습니다.',
            dday
        });
    } catch (error) {
        console.error('D-DAY 생성 실패:', error);
        res.status(500).json({
            error: 'DDAY_CREATE_ERROR',
            message: 'D-DAY 생성에 실패했습니다.'
        });
    }
});

// D-DAY 정보 수정
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const ddayId = parseInt(req.params.id);
        const { title, target_date, description } = req.body;

        if (isNaN(ddayId)) {
            return res.status(400).json({
                error: 'INVALID_ID',
                message: '유효하지 않은 D-DAY ID입니다.'
            });
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, req.user!.id);
        if (!isOwner) {
            return res.status(403).json({
                error: 'ACCESS_DENIED',
                message: '해당 D-DAY를 수정할 권한이 없습니다.'
            });
        }

        // 날짜 형식 검증 (제공된 경우)
        if (target_date) {
            const targetDate = new Date(target_date);
            if (isNaN(targetDate.getTime())) {
                return res.status(400).json({
                    error: 'INVALID_DATE',
                    message: '유효하지 않은 날짜 형식입니다.'
                });
            }
        }

        const updateData: UpdateDDayData = {};

        if (title !== undefined) updateData.title = title.trim();
        if (target_date !== undefined) updateData.target_date = target_date;
        if (description !== undefined) updateData.description = description?.trim();

        const dday = await DDayModel.update(ddayId, updateData);

        res.json({
            message: 'D-DAY가 성공적으로 수정되었습니다.',
            dday
        });
    } catch (error) {
        console.error('D-DAY 수정 실패:', error);
        res.status(500).json({
            error: 'DDAY_UPDATE_ERROR',
            message: 'D-DAY 수정에 실패했습니다.'
        });
    }
});

// D-DAY 삭제
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const ddayId = parseInt(req.params.id);

        if (isNaN(ddayId)) {
            return res.status(400).json({
                error: 'INVALID_ID',
                message: '유효하지 않은 D-DAY ID입니다.'
            });
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, req.user!.id);
        if (!isOwner) {
            return res.status(403).json({
                error: 'ACCESS_DENIED',
                message: '해당 D-DAY를 삭제할 권한이 없습니다.'
            });
        }

        const deleted = await DDayModel.delete(ddayId);

        if (!deleted) {
            return res.status(404).json({
                error: 'DDAY_NOT_FOUND',
                message: '삭제할 D-DAY를 찾을 수 없습니다.'
            });
        }

        res.json({
            message: 'D-DAY가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('D-DAY 삭제 실패:', error);
        res.status(500).json({
            error: 'DDAY_DELETE_ERROR',
            message: 'D-DAY 삭제에 실패했습니다.'
        });
    }
});

export default router;
