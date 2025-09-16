'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DDay, CreateDDayForm } from '@/types';
import { Button } from '../ui/Button';
import { formatInputDate, getTodayInputFormat } from '@/lib/utils';
import { X } from 'lucide-react';

interface DDayFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDDayForm) => Promise<void>;
    editingDDay?: DDay | null;
    isLoading?: boolean;
}

export const DDayFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingDDay,
    isLoading = false
}: DDayFormModalProps) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateDDayForm>();

    // 모달이 열릴 때 폼 초기화
    useEffect(() => {
        if (isOpen) {
            if (editingDDay) {
                // 수정 모드
                setValue('title', editingDDay.title);
                setValue('target_date', formatInputDate(editingDDay.target_date));
                setValue('description', editingDDay.description || '');
            } else {
                // 추가 모드
                reset({
                    title: '',
                    target_date: getTodayInputFormat(),
                    description: ''
                });
            }
        }
    }, [isOpen, editingDDay, setValue, reset]);

    const handleFormSubmit = async (data: CreateDDayForm) => {
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            // 에러 처리는 부모 컴포넌트에서 처리됨
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* 배경 오버레이 */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

            {/* 모달 컨테이너 */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingDDay ? 'D-DAY 수정' : '새 D-DAY 등록'}
                        </h2>

                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 폼 */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
                        {/* 제목 */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                D-DAY 제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="예: 결혼식, 신혼여행, 프로포즈..."
                                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 ${errors.title
                                        ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 bg-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                                    }`}
                                {...register('title', {
                                    required: '제목을 입력해 주세요.',
                                    maxLength: {
                                        value: 50,
                                        message: '제목은 50자 이내로 입력해 주세요.'
                                    }
                                })}
                                disabled={isLoading}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        {/* 날짜 */}
                        <div>
                            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 mb-1">
                                목표 날짜 <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="target_date"
                                type="date"
                                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 ${errors.target_date
                                        ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 bg-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                                    }`}
                                {...register('target_date', {
                                    required: '날짜를 선택해 주세요.'
                                })}
                                disabled={isLoading}
                            />
                            {errors.target_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.target_date.message}</p>
                            )}
                        </div>

                        {/* 설명 */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                설명 (선택)
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                placeholder="이 날에 대한 간단한 설명을 입력해 주세요..."
                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                                {...register('description', {
                                    maxLength: {
                                        value: 200,
                                        message: '설명은 200자 이내로 입력해 주세요.'
                                    }
                                })}
                                disabled={isLoading}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                취소
                            </Button>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {editingDDay ? '수정' : '등록'}하기
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
