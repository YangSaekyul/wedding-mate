// @ts-nocheck
import React from 'react';
import { DDay } from '../../types';
import { DDayCard } from './DDayCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface DDayListProps {
    ddays: DDay[];
    isLoading: boolean;
    onEdit: (dday: DDay) => void;
    onDelete: (dday: DDay) => void;
    onAdd: () => void;
}

export const DDayList = ({
    ddays,
    isLoading,
    onEdit,
    onDelete,
    onAdd
}: DDayListProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="D-DAY 목록을 불러오는 중..." />
            </div>
        );
    }

    if (ddays.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    아직 등록된 D-DAY가 없습니다
                </h3>

                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    중요한 날짜들을 등록하고 카운트다운을 시작해보세요.
                    결혼식, 신혼여행 등 특별한 날들을 놓치지 마세요!
                </p>

                <Button onClick={onAdd} className="inline-flex items-center gap-2">
                    <Plus size={20} />
                    첫 번째 D-DAY 등록하기
                </Button>
            </div>
        );
    }

    // D-DAY 상태별 정렬 (오늘 > 가까운 미래 > 먼 미래 > 과거)
    const sortedDDays = [...ddays].sort((a, b) => {
        const aDate = new Date(a.target_date);
        const bDate = new Date(b.target_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const aDiff = aDate.getTime() - today.getTime();
        const bDiff = bDate.getTime() - today.getTime();

        // 오늘인 경우 최우선
        if (aDiff === 0) return -1;
        if (bDiff === 0) return 1;

        // 미래 날짜는 가까운 순으로
        if (aDiff > 0 && bDiff > 0) return aDiff - bDiff;

        // 과거 날짜는 최근 순으로
        if (aDiff < 0 && bDiff < 0) return bDiff - aDiff;

        // 미래가 과거보다 우선
        return aDiff > 0 ? -1 : 1;
    });

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    내 D-DAY 목록 ({ddays.length}개)
                </h2>

                <Button onClick={onAdd} size="sm" className="inline-flex items-center gap-2">
                    <Plus size={16} />
                    새 D-DAY 추가
                </Button>
            </div>

            {/* D-DAY 카드 그리드 */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sortedDDays.map((dday) => (
                    <DDayCard
                        key={dday.id}
                        dday={dday}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};
