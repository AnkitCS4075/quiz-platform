'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Quiz component with no SSR
const Quiz = dynamic(() => import('../components/Quiz'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-base-300 rounded w-48 mb-6"></div>
        <div className="h-64 bg-base-200 rounded-lg"></div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100">
      <Quiz />
    </main>
  );
}
