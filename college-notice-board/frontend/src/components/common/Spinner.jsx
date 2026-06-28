import React from 'react';

export default function Spinner({ size = 'md', center = false }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const el = (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`} />
  );
  if (center) return <div className="flex justify-center items-center py-12">{el}</div>;
  return el;
}
