'use client';

import dynamic from 'next/dynamic';
import ClientOnly from '../components/ClientOnly';

// Dynamically import the Quiz component with no SSR
const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100">
      <ClientOnly>
        <Quiz />
      </ClientOnly>
    </main>
  );
}
