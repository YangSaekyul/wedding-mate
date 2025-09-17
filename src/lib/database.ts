import { PrismaClient } from '@prisma/client';

// Prisma 클라이언트 설정 (싱글톤 패턴)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 데이터베이스 연결 테스트
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    return false;
  }
};

// 데이터베이스 연결 종료
export const closeDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('데이터베이스 연결 종료');
  } catch (error) {
    console.error('데이터베이스 종료 오류:', error);
  }
};

// 기존 코드와의 호환성을 위한 별칭
export const db = prisma;
