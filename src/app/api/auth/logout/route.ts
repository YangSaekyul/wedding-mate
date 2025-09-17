import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
    // JWT는 서버에서 무효화할 수 없으므로 클라이언트에서 토큰을 삭제하도록 안내
    return NextResponse.json({
        message: '로그아웃되었습니다. 클라이언트에서 토큰을 삭제하세요.'
    });
}
