import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getRange = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) range.push(i);
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <FaChevronLeft className="text-xs" />
      </button>

      {page > 3 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">1</button>
          {page > 4 && <span className="text-gray-400 px-1">…</span>}
        </>
      )}

      {getRange().map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white border border-primary-600' : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          {p}
        </button>
      ))}

      {page < pages - 2 && (
        <>
          {page < pages - 3 && <span className="text-gray-400 px-1">…</span>}
          <button onClick={() => onPageChange(pages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{pages}</button>
        </>
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}
