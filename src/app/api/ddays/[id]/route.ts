import { NextRequest, NextResponse } from 'next/server';
import { DDayModel } from '@/lib/models/DDay';
import { verifyToken, extractTokenFromHeader } from '@/lib/utils/jwt';

export const dynamic = 'force-dynamic';

// 특정 D-DAY 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const ddayId = parseInt(params.id);

        if (isNaN(ddayId)) {
            return NextResponse.json(
                {
                    error: 'INVALID_ID',
                    message: '유효하지 않은 D-DAY ID입니다.'
                },
                { status: 400 }
            );
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, payload.userId);
        if (!isOwner) {
            return NextResponse.json(
                {
                    error: 'ACCESS_DENIED',
                    message: '해당 D-DAY에 접근할 권한이 없습니다.'
                },
                { status: 403 }
            );
        }

        const dday = await DDayModel.findById(ddayId);

        if (!dday) {
            return NextResponse.json(
                {
                    error: 'DDAY_NOT_FOUND',
                    message: 'D-DAY를 찾을 수 없습니다.'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({ dday });
    } catch (error) {
        console.error('D-DAY 조회 실패:', error);
        return NextResponse.json(
            {
                error: 'DDAY_FETCH_ERROR',
                message: 'D-DAY를 가져올 수 없습니다.'
            },
            { status: 500 }
        );
    }
}

// D-DAY 정보 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const ddayId = parseInt(params.id);
        const { title, targetDate, description } = await request.json();

        if (isNaN(ddayId)) {
            return NextResponse.json(
                {
                    error: 'INVALID_ID',
                    message: '유효하지 않은 D-DAY ID입니다.'
                },
                { status: 400 }
            );
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, payload.userId);
        if (!isOwner) {
            return NextResponse.json(
                {
                    error: 'ACCESS_DENIED',
                    message: '해당 D-DAY를 수정할 권한이 없습니다.'
                },
                { status: 403 }
            );
        }

        // 날짜 형식 검증 (제공된 경우)
        if (targetDate) {
            const targetDateObj = new Date(targetDate);
            if (isNaN(targetDateObj.getTime())) {
                return NextResponse.json(
                    {
                        error: 'INVALID_DATE',
                        message: '유효하지 않은 날짜 형식입니다.'
                    },
                    { status: 400 }
                );
            }
        }

        const updateData: any = {};

        if (title !== undefined) updateData.title = title.trim();
        if (targetDate !== undefined) updateData.targetDate = new Date(targetDate);
        if (description !== undefined) updateData.description = description?.trim();

        const dday = await DDayModel.update(ddayId, updateData);

        return NextResponse.json({
            message: 'D-DAY가 성공적으로 수정되었습니다.',
            dday
        });
    } catch (error) {
        console.error('D-DAY 수정 실패:', error);
        return NextResponse.json(
            {
                error: 'DDAY_UPDATE_ERROR',
                message: 'D-DAY 수정에 실패했습니다.'
            },
            { status: 500 }
        );
    }
}

// D-DAY 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const ddayId = parseInt(params.id);

        if (isNaN(ddayId)) {
            return NextResponse.json(
                {
                    error: 'INVALID_ID',
                    message: '유효하지 않은 D-DAY ID입니다.'
                },
                { status: 400 }
            );
        }

        // 소유권 확인
        const isOwner = await DDayModel.isOwner(ddayId, payload.userId);
        if (!isOwner) {
            return NextResponse.json(
                {
                    error: 'ACCESS_DENIED',
                    message: '해당 D-DAY를 삭제할 권한이 없습니다.'
                },
                { status: 403 }
            );
        }

        const deleted = await DDayModel.delete(ddayId);

        if (!deleted) {
            return NextResponse.json(
                {
                    error: 'DDAY_NOT_FOUND',
                    message: '삭제할 D-DAY를 찾을 수 없습니다.'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'D-DAY가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('D-DAY 삭제 실패:', error);
        return NextResponse.json(
            {
                error: 'DDAY_DELETE_ERROR',
                message: 'D-DAY 삭제에 실패했습니다.'
            },
            { status: 500 }
        );
    }
}