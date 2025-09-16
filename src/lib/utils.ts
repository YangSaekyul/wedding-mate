import { format, differenceInDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import clsx, { ClassValue } from 'clsx';

// className 조합 유틸리티
export const cn = (...inputs: ClassValue[]) => {
    return clsx(inputs);
};

// D-DAY 계산
export const calculateDDay = (targetDate: string): {
    daysRemaining: number;
    displayText: string;
    status: 'future' | 'today' | 'past';
} => {
    const target = parseISO(targetDate);
    const today = new Date();
    const daysRemaining = differenceInDays(target, today);

    let displayText = '';
    let status: 'future' | 'today' | 'past' = 'future';

    if (daysRemaining > 0) {
        displayText = `D-${daysRemaining}`;
        status = 'future';
    } else if (daysRemaining === 0) {
        displayText = 'D-DAY';
        status = 'today';
    } else {
        displayText = `D+${Math.abs(daysRemaining)}`;
        status = 'past';
    }

    return { daysRemaining, displayText, status };
};

// 날짜 포맷팅
export const formatDate = (date: string | Date, formatStr: string = 'yyyy년 MM월 dd일'): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr, { locale: ko });
};

// 상대적 날짜 표시 (예: 3일 후, 어제)
export const formatRelativeDate = (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    const diffDays = differenceInDays(parsedDate, today);

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays === -1) return '어제';
    if (diffDays > 1 && diffDays <= 7) return `${diffDays}일 후`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}일 전`;

    return formatDate(parsedDate, 'MM월 dd일');
};

// 입력 폼 날짜 형식 (YYYY-MM-DD)
export const formatInputDate = (date: Date | string): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'yyyy-MM-dd');
};

// 오늘 날짜를 input[type="date"] 형식으로 반환
export const getTodayInputFormat = (): string => {
    return formatInputDate(new Date());
};

// 날짜 유효성 검사
export const isValidDate = (dateString: string): boolean => {
    try {
        const date = parseISO(dateString);
        return !isNaN(date.getTime());
    } catch {
        return false;
    }
};

// 문자열 자르기
export const truncate = (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};

// 랜덤 ID 생성
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// 로컬 스토리지 안전하게 사용하기
export const localStorage = {
    getItem: (key: string): string | null => {
        try {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            if (typeof window === 'undefined') return;
            window.localStorage.setItem(key, value);
        } catch {
            // 저장 실패 시 무시
        }
    },
    removeItem: (key: string): void => {
        try {
            if (typeof window === 'undefined') return;
            window.localStorage.removeItem(key);
        } catch {
            // 삭제 실패 시 무시
        }
    },
};
