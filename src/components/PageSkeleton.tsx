import React from 'react';
import Skeleton from './Skeleton';

const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col items-center text-center mb-16">
        <Skeleton className="w-48 h-8 rounded-full mb-8" />
        <Skeleton className="w-3/4 h-16 md:h-24 mb-6" />
        <Skeleton className="w-1/2 h-16 md:h-24 mb-8" />
        <Skeleton className="w-full max-w-2xl h-6 mb-4" />
        <Skeleton className="w-2/3 max-w-xl h-6 mb-12" />
        <div className="flex gap-6">
          <Skeleton className="w-40 h-14 rounded-full" />
          <Skeleton className="w-40 h-14 rounded-full" />
        </div>
      </div>

      {/* Grid Section Skeleton (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-8 rounded-3xl h-80 flex flex-col">
            <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
            <Skeleton className="w-3/4 h-8 mb-4" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-2/3 h-4 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
