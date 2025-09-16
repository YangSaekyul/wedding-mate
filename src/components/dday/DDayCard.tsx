'use client';

import React from 'react';
import { DDay } from '@/types';
import { calculateDDay, formatDate, truncate } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Trash2, Edit3 } from 'lucide-react';

interface DDayCardProps {
    dday: DDay;
    onEdit: (dday: DDay) => void;
    onDelete: (dday: DDay) => void;
}

export const DDayCard = ({ dday, onEdit, onDelete }: DDayCardProps) => {
    const { displayText, status } = calculateDDay(dday.target_date);

    const getStatusColors = () => {
        switch (status) {
            case 'today':
                return {
                    bg: 'bg-gradient-to-r from-red-500 to-pink-500',
                    text: 'text-white',
                    badge: 'bg-white text-red-600'
                };
            case 'future':
                return {
                    bg: 'bg-gradient-to-r from-primary-500 to-orange-500',
                    text: 'text-white',
                    badge: 'bg-white text-primary-600'
                };
            case 'past':
                return {
                    bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    text: 'text-white',
                    badge: 'bg-white text-gray-600'
                };
        }
    };

    const colors = getStatusColors();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* D-DAY 헤더 */}
            <div className={`${colors.bg} px-6 py-4`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>
                            {truncate(dday.title, 20)}
                        </h3>
                        <p className={`text-sm ${colors.text} opacity-90`}>
                            {formatDate(dday.target_date)}
                        </p>
                    </div>

                    <div className={`${colors.badge} px-3 py-1 rounded-full`}>
                        <span className="text-sm font-bold">
                            {displayText}
                        </span>
                    </div>
                </div>
            </div>

            {/* 설명 및 액션 버튼 */}
            <div className="p-6">
                {dday.description && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {truncate(dday.description, 100)}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        등록일: {formatDate(dday.created_at, 'MM월 dd일')}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(dday)}
                            className="text-gray-600 hover:text-primary-600 p-2"
                        >
                            <Edit3 size={16} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(dday)}
                            className="text-gray-600 hover:text-red-600 p-2"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
