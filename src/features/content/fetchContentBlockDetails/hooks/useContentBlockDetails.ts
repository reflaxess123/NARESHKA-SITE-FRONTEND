import { ContentBlock } from "@/entities/content-block";
import { fetchContentBlockById } from "@/shared"; // Corrected import path
import { useQuery } from "@tanstack/react-query";

export const useContentBlockDetails = (blockId: string | null | undefined) => {
  return useQuery<
    ContentBlock, // TQueryFnData
    Error, // TError
    ContentBlock, // TData
    (string | null | undefined)[] // TQueryKey, e.g. ['contentBlockDetails', blockId]
    // Making it an array with blockId as element
  >({
    queryKey: ["contentBlockDetails", blockId],
    queryFn: () => {
      if (!blockId) {
        return Promise.reject(new Error("Block ID is not provided."));
      }
      return fetchContentBlockById(blockId);
    },
    enabled: !!blockId, // Only run the query if blockId is truthy
  });
};
