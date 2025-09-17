import { prisma } from '../database';
import { User } from '@prisma/client';

export type { User } from '@prisma/client';

export interface CreateUserData {
    kakaoId: string;
    nickname: string;
    profileImage?: string;
    email?: string;
}

export interface UpdateUserData {
    nickname?: string;
    profileImage?: string;
    email?: string;
}

export class UserModel {
    // 카카오 ID로 사용자 조회
    static async findByKakaoId(kakaoId: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { kakaoId }
            });
        } catch (error) {
            console.error('사용자 조회 오류 (카카오 ID):', error);
            throw error;
        }
    }

    // ID로 사용자 조회
    static async findById(id: number): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { id }
            });
        } catch (error) {
            console.error('사용자 조회 오류 (ID):', error);
            throw error;
        }
    }

    // 새 사용자 생성
    static async create(userData: CreateUserData): Promise<User> {
        try {
            return await prisma.user.create({
                data: userData
            });
        } catch (error) {
            console.error('사용자 생성 오류:', error);
            throw error;
        }
    }

    // 사용자 정보 업데이트
    static async update(id: number, userData: UpdateUserData): Promise<User> {
        try {
            return await prisma.user.update({
                where: { id },
                data: userData
            });
        } catch (error) {
            console.error('사용자 업데이트 오류:', error);
            throw error;
        }
    }

    // 사용자와 연관된 D-Day 목록 포함 조회
    static async findByIdWithDDays(id: number) {
        try {
            return await prisma.user.findUnique({
                where: { id },
                include: {
                    ddays: {
                        orderBy: { targetDate: 'asc' }
                    }
                }
            });
        } catch (error) {
            console.error('사용자 조회 오류 (D-Day 포함):', error);
            throw error;
        }
    }
}
