import {
  ContentBlock,
  ContentBlockFilters,
  ContentBlocksApiResponse,
  UpdateProgressResponse,
} from "@/entities/content-block";
import { updateContentBlockProgress } from "@/shared/api/contentApi";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface OptimisticUpdateContext {
  previousContentBlocks?: InfiniteData<ContentBlocksApiResponse>;
  previousContentBlockDetail?: ContentBlock;
  listQueryKeyForMutation: (string | ContentBlockFilters | undefined)[];
  detailQueryKey: (string | undefined)[];
  filtersProvided: boolean;
}

export const useUpdateContentProgress = (filters?: ContentBlockFilters) => {
  const queryClient = useQueryClient();
  const listQueryKey = filters ? ["contentBlocks", filters] : ["contentBlocks"];

  return useMutation<
    UpdateProgressResponse,
    Error,
    { blockId: string; action: "increment" | "decrement" },
    OptimisticUpdateContext
  >({
    mutationFn: ({ blockId, action }) =>
      updateContentBlockProgress(blockId, action),

    onMutate: async ({ blockId, action }) => {
      const detailQueryKeyGenerated = ["contentBlockDetails", blockId] as (
        | string
        | undefined
      )[];
      const filtersProvidedForThisMutation = !!filters;

      await queryClient.cancelQueries({ queryKey: listQueryKey });
      await queryClient.cancelQueries({ queryKey: detailQueryKeyGenerated });

      const previousContentBlocksSnapshot = filtersProvidedForThisMutation
        ? queryClient.getQueryData<InfiniteData<ContentBlocksApiResponse>>(
            listQueryKey
          )
        : undefined;
      const previousContentBlockDetailSnapshot =
        queryClient.getQueryData<ContentBlock>(detailQueryKeyGenerated);

      if (filtersProvidedForThisMutation && previousContentBlocksSnapshot) {
        const newPagesArray = previousContentBlocksSnapshot.pages.map(
          (page) => ({
            ...page,
            data: page.data.map((block) => {
              if (block.id === blockId) {
                const newSolvedCount =
                  action === "increment"
                    ? (block.currentUserSolvedCount || 0) + 1
                    : Math.max(0, (block.currentUserSolvedCount || 0) - 1);
                return { ...block, currentUserSolvedCount: newSolvedCount };
              }
              return block;
            }),
          })
        );
        queryClient.setQueryData<InfiniteData<ContentBlocksApiResponse>>(
          listQueryKey,
          { ...previousContentBlocksSnapshot, pages: newPagesArray }
        );
      }

      if (previousContentBlockDetailSnapshot) {
        const newSolvedCount =
          action === "increment"
            ? (previousContentBlockDetailSnapshot.currentUserSolvedCount || 0) +
              1
            : Math.max(
                0,
                (previousContentBlockDetailSnapshot.currentUserSolvedCount ||
                  0) - 1
              );
        queryClient.setQueryData<ContentBlock>(detailQueryKeyGenerated, {
          ...previousContentBlockDetailSnapshot,
          currentUserSolvedCount: newSolvedCount,
        });
      }
      return {
        previousContentBlocks: previousContentBlocksSnapshot,
        previousContentBlockDetail: previousContentBlockDetailSnapshot,
        listQueryKeyForMutation: listQueryKey,
        detailQueryKey: detailQueryKeyGenerated,
        filtersProvided: filtersProvidedForThisMutation,
      };
    },

    onError: (_err, _variables, context) => {
      if (context?.filtersProvided && context.previousContentBlocks) {
        queryClient.setQueryData(
          context.listQueryKeyForMutation,
          context.previousContentBlocks
        );
      }
      if (context?.previousContentBlockDetail) {
        queryClient.setQueryData(
          context.detailQueryKey,
          context.previousContentBlockDetail
        );
      }
      console.error("Ошибка при обновлении прогресса:", _err);
    },

    onSuccess: (data, variables, context) => {
      if (context?.filtersProvided) {
        queryClient.setQueryData<InfiniteData<ContentBlocksApiResponse>>(
          context.listQueryKeyForMutation,
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((block) =>
                  block.id === variables.blockId
                    ? { ...block, currentUserSolvedCount: data.solvedCount }
                    : block
                ),
              })),
            };
          }
        );
      }

      queryClient.setQueryData<ContentBlock>(
        context!.detailQueryKey,
        (oldDetailData) => {
          if (!oldDetailData) {
            if (variables.blockId === data.blockId) {
              return undefined;
            }
            return undefined;
          }
          return {
            ...oldDetailData,
            currentUserSolvedCount: data.solvedCount,
          };
        }
      );
      console.log(
        "Прогресс успешно обновлен (onSuccess), данные с сервера:",
        data
      );
    },

    onSettled: (_data, _error, variables, context) => {
      if (context?.filtersProvided) {
        queryClient.invalidateQueries({
          queryKey: context.listQueryKeyForMutation,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["contentBlocks"] });
      }
      queryClient.invalidateQueries({
        queryKey: ["contentBlockDetails", variables.blockId],
      });
      console.log("Мутация прогресса завершена (onSettled).");
    },
  });
};
