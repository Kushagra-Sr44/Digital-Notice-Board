import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:ml-0 ml-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
          {title && (
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
