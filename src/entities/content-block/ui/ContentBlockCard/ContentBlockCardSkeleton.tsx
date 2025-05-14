import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import React from "react";

export const ContentBlockCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <Skeleton className="h-8 w-full" />{" "}
        {/* Placeholder for code block info */}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-gray-500">
        <div className="flex justify-between items-center w-full mb-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-16" /> {/* ID Placeholder */}
        </div>
        <div className="flex items-center justify-between w-full mt-1 pt-2 border-t">
          <Skeleton className="h-5 w-20" /> {/* Solved count placeholder */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-7 w-7 rounded-md" />{" "}
            {/* Decrement button placeholder */}
            <Skeleton className="h-7 w-7 rounded-md" />{" "}
            {/* Increment button placeholder */}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
