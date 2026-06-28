import React from 'react';

const palette = {
  General: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Academic: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Exam: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Cultural: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  All: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export default function CategoryBadge({ label }) {
  return (
    <span className={`badge ${palette[label] || palette.Other}`}>
      {label}
    </span>
  );
}
