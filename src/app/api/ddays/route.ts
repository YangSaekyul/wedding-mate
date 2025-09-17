import { NextRequest, NextResponse } from 'next/server';
import { DDayModel } from '@/lib/models/DDay';
import { verifyToken, extractTokenFromHeader } from '@/lib/utils/jwt';
import { initDatabase } from '@/lib/database';

export const dynamic = 'force-dynamic';

// 사용자의 모든 D-DAY 목록 조회
export async function GET(request: NextRequest) {
    try {
        // 데이터베이스 초기화
        await initDatabase();

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
        const ddays = await DDayModel.findByUserId(payload.userId);

        return NextResponse.json({ ddays });
    } catch (error) {
        console.error('D-DAY 목록 조회 실패:', error);
        return NextResponse.json(
            {
                error: 'DDAYS_FETCH_ERROR',
                message: 'D-DAY 목록을 가져올 수 없습니다.'
            },
            { status: 500 }
        );
    }
}

// 새 D-DAY 생성
export async function POST(request: NextRequest) {
    try {
        // 데이터베이스 초기화
        await initDatabase();

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
        const { title, target_date, description } = await request.json();

        // 필수 필드 검증
        if (!title || !target_date) {
            return NextResponse.json(
                {
                    error: 'MISSING_REQUIRED_FIELDS',
                    message: '제목과 목표 날짜는 필수입니다.'
                },
                { status: 400 }
            );
        }

        // 날짜 형식 검증
        const targetDate = new Date(target_date);
        if (isNaN(targetDate.getTime())) {
            return NextResponse.json(
                {
                    error: 'INVALID_DATE',
                    message: '유효하지 않은 날짜 형식입니다.'
                },
                { status: 400 }
            );
        }

        const ddayData = {
            user_id: payload.userId,
            title: title.trim(),
            target_date,
            description: description?.trim()
        };

        const dday = await DDayModel.create(ddayData);

        return NextResponse.json(
            {
                message: 'D-DAY가 성공적으로 생성되었습니다.',
                dday
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('D-DAY 생성 실패:', error);
        return NextResponse.json(
            {
                error: 'DDAY_CREATE_ERROR',
                message: 'D-DAY 생성에 실패했습니다.'
            },
            { status: 500 }
        );
    }
}
