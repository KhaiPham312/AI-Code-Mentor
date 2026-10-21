import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

export type SubmissionStatusType =
  | 'accepted'
  | 'wrong_answer'
  | 'time_limit'
  | 'compile_error'
  | 'runtime_error'
  | string;

export interface StatusBadgeProps {
  status: SubmissionStatusType;
  size?: 'sm' | 'md';
  detail?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  detail,
  className = '',
}) => {
  const normalized = (status || '').toLowerCase().trim();

  let resolvedStatus: 'accepted' | 'wrong_answer' | 'time_limit' | 'compile_error' | 'runtime_error';

  if (normalized === 'accepted' || normalized === 'passed') {
    resolvedStatus = 'accepted';
  } else if (
    normalized === 'wrong_answer' ||
    normalized === 'wrong answer' ||
    normalized === 'failed' ||
    normalized.includes('wrong')
  ) {
    resolvedStatus = 'wrong_answer';
  } else if (
    normalized === 'time_limit' ||
    normalized.includes('time limit') ||
    normalized === 'tle'
  ) {
    resolvedStatus = 'time_limit';
  } else if (
    normalized === 'compile_error' ||
    normalized.includes('compilation') ||
    normalized === 'ce'
  ) {
    resolvedStatus = 'compile_error';
  } else if (
    normalized === 'runtime_error' ||
    normalized.includes('runtime') ||
    normalized === 'error' ||
    normalized === 're'
  ) {
    resolvedStatus = 'runtime_error';
  } else {
    resolvedStatus = 'wrong_answer';
  }

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  const labelSuffix = detail ? ` ${detail}` : '';

  switch (resolvedStatus) {
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className={`${iconSize} text-emerald-600 dark:text-emerald-400`} />
          <span>Accepted{labelSuffix}</span>
        </span>
      );
    case 'wrong_answer':
      return (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 ${sizeClasses} ${className}`}
        >
          <XCircle className={`${iconSize} text-rose-600 dark:text-rose-400`} />
          <span>Wrong Answer{labelSuffix}</span>
        </span>
      );
    case 'time_limit':
      return (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}
        >
          <Clock className={`${iconSize} text-amber-600 dark:text-amber-400`} />
          <span>Time Limit Exceeded{labelSuffix}</span>
        </span>
      );
    case 'compile_error':
      return (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 ${sizeClasses} ${className}`}
        >
          <AlertTriangle className={`${iconSize} text-orange-600 dark:text-orange-400`} />
          <span>Compilation Error{labelSuffix}</span>
        </span>
      );
    case 'runtime_error':
      return (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 ${sizeClasses} ${className}`}
        >
          <AlertCircle className={`${iconSize} text-red-600 dark:text-red-400`} />
          <span>Runtime Error{labelSuffix}</span>
        </span>
      );
  }
};
