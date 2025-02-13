// components/SkeletonLoader.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex w-full justify-between">
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
        </div>
        <div className="flex w-[25%] space-x-1">
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
          <Skeleton className="bg-gray-200 h-8 w-1/3"></Skeleton>
        </div>
        <div className="flex w-full flex-col space-y-2">
          <div className="w-full flex h-10 flex-row gap-1 mb-2">
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
          </div>
          <div className="w-full flex h-8 flex-row gap-1 ">
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <div className="w-1/3 flex flex-row px-1 h-full gap-2">
              <Skeleton className="w-8 h-7  rounded-full bg-gray-200  "></Skeleton>
              <Skeleton className="bg-gray-200 h-8 w-full"></Skeleton>
            </div>

            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
          </div>
          <div className="w-full flex h-8 flex-row gap-1 ">
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <div className="w-1/3 flex flex-row px-1 h-full gap-2">
              <Skeleton className="w-8 h-7  rounded-full bg-gray-200  "></Skeleton>
              <Skeleton className="bg-gray-200 h-8 w-full"></Skeleton>
            </div>

            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
          </div>
          <div className="w-full flex h-8 flex-row gap-1 ">
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <div className="w-1/3 flex flex-row px-1 h-full gap-2">
              <Skeleton className="w-8 h-7  rounded-full bg-gray-200  "></Skeleton>
              <Skeleton className="bg-gray-200 h-8 w-full"></Skeleton>
            </div>

            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
            <Skeleton className="bg-gray-200 h-full w-1/3"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
