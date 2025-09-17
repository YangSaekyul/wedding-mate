import { prisma } from '../database';
import { DDay } from '@prisma/client';

export type { DDay } from '@prisma/client';

export interface CreateDDayData {
    userId: number;
    title: string;
    targetDate: Date | string;
    description?: string;
}

export interface UpdateDDayData {
    title?: string;
    targetDate?: Date | string;
    description?: string;
}

// D-Day with calculated days remaining
export interface DDayWithDaysRemaining extends DDay {
    daysRemaining: number;
}

export class DDayModel {
    // 사용자의 모든 D-Day 조회 (남은 일수 계산 포함)
    static async findByUserId(userId: number): Promise<DDayWithDaysRemaining[]> {
        try {
            const ddays = await prisma.dDay.findMany({
                where: { userId },
                orderBy: { targetDate: 'asc' }
            });

            // 각 D-Day에 대해 남은 일수 계산
            return ddays.map(dday => ({
                ...dday,
                daysRemaining: this.calculateDaysRemaining(dday.targetDate)
            }));
        } catch (error) {
            console.error('D-Day 조회 오류 (사용자 ID):', error);
            throw error;
        }
    }

    // ID로 D-Day 조회 (남은 일수 계산 포함)
    static async findById(id: number): Promise<DDayWithDaysRemaining | null> {
        try {
            const dday = await prisma.dDay.findUnique({
                where: { id }
            });

            if (!dday) return null;

            return {
                ...dday,
                daysRemaining: this.calculateDaysRemaining(dday.targetDate)
            };
        } catch (error) {
            console.error('D-Day 조회 오류 (ID):', error);
            throw error;
        }
    }

    // 새 D-Day 생성
    static async create(ddayData: CreateDDayData): Promise<DDayWithDaysRemaining> {
        try {
            const { targetDate, ...rest } = ddayData;
            const dday = await prisma.dDay.create({
                data: {
                    ...rest,
                    targetDate: new Date(targetDate)
                }
            });

            return {
                ...dday,
                daysRemaining: this.calculateDaysRemaining(dday.targetDate)
            };
        } catch (error) {
            console.error('D-Day 생성 오류:', error);
            throw error;
        }
    }

    // D-Day 정보 업데이트
    static async update(id: number, ddayData: UpdateDDayData): Promise<DDayWithDaysRemaining> {
        try {
            const updateData: any = { ...ddayData };
            if (updateData.targetDate) {
                updateData.targetDate = new Date(updateData.targetDate);
            }

            const dday = await prisma.dDay.update({
                where: { id },
                data: updateData
            });

            return {
                ...dday,
                daysRemaining: this.calculateDaysRemaining(dday.targetDate)
            };
        } catch (error) {
            console.error('D-Day 업데이트 오류:', error);
            throw error;
        }
    }

    // D-Day 삭제
    static async delete(id: number): Promise<boolean> {
        try {
            await prisma.dDay.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            console.error('D-Day 삭제 오류:', error);
            // 레코드가 없는 경우 false 반환
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return false;
            }
            throw error;
        }
    }

    // 사용자가 해당 D-Day의 소유자인지 확인
    static async isOwner(ddayId: number, userId: number): Promise<boolean> {
        try {
            const dday = await prisma.dDay.findFirst({
                where: {
                    id: ddayId,
                    userId: userId
                }
            });
            return !!dday;
        } catch (error) {
            console.error('D-Day 소유자 확인 오류:', error);
            throw error;
        }
    }

    // 사용자와 함께 D-Day 조회
    static async findByIdWithUser(id: number) {
        try {
            return await prisma.dDay.findUnique({
                where: { id },
                include: {
                    user: true
                }
            });
        } catch (error) {
            console.error('D-Day 조회 오류 (사용자 포함):', error);
            throw error;
        }
    }

    // 남은 일수 계산 헬퍼 함수
    private static calculateDaysRemaining(targetDate: Date): number {
        const today = new Date();
        const target = new Date(targetDate);
        
        // 시간 부분을 제거하고 날짜만 비교
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
}
