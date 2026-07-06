import React from 'react';
import { Skeleton } from './ui/skeleton';

export default function SkeletonGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-[32px] bg-white/5" />
          <div className="space-y-2 px-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/4 bg-white/5" />
            </div>
            <Skeleton className="h-4 w-1/2 bg-white/5" />
            <Skeleton className="h-8 w-1/3 bg-white/5 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
