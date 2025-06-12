"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SavedPilot, Pilot } from "@/types/client";
import { AxiosInstance } from "@/lib/axios-instance";
import { useTotalCount } from "@/store/total-count";

export const useGetPilotsInfinite = (limit = 10) => {
  const { setTotal } = useTotalCount();

  return useInfiniteQuery<SavedPilot[]>({
    queryKey: ["pilots"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await AxiosInstance.get("/api/pilots", {
        params: {
          page: pageParam,
          limit: limit,
        },
      });
      setTotal(res.data.total);
      return res.data.pilots;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });
};

export const useNewPilot = () => {
  const queryClient = useQueryClient();
  const { total, increaseTotal } = useTotalCount();

  return useMutation({
    mutationFn: async (pilot: Pilot) => {
      const res = await AxiosInstance.post("/api/pilots", {
        ...pilot,
      });
      return res.data;
    },
    onSuccess: (data) => {
      increaseTotal();
      queryClient.setQueryData<InfiniteData<SavedPilot[]>>(
        ["pilots"],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? [];
          if (pages.flat().length < total) pages[0].pop();
          pages[0].unshift({
            ...data,
          });
          return { ...prevData!, pages };
        },
      );
    },
  });
};
export const useDeletePilot = () => {
  const queryClient = useQueryClient();
  const { total, decreaseTotal } = useTotalCount();
  const showCount = queryClient
    .getQueryData<InfiniteData<SavedPilot[]>>(["pilots"])
    ?.pages.flat().length;
  const patchIndex = showCount === total ? 0 : showCount;

  return useMutation({
    mutationFn: async (pilotId: string) => {
      const res = await AxiosInstance.delete(`/api/pilots/${pilotId}`, {
        params: {
          patch_index: patchIndex,
        },
      });
      return res.data;
    },

    onSuccess: (data) => {
      decreaseTotal();
      queryClient.setQueryData<InfiniteData<SavedPilot[]>>(
        ["pilots"],
        (prevData) => {
          if (prevData) {
            // Flatten all pages, remove deleted item, and add patch data if exists
            const allPilots = prevData.pages
              .flat()
              .filter((pilot) => pilot.id !== data.pilotId);

            if (data.patchPilot) {
              allPilots.push(data.patchPilot);
            }

            // Regroup into pages of the original size
            const pageSize = prevData.pages[0].length;
            const regroupedPages = [];
            for (let i = 0; i < allPilots.length; i += pageSize) {
              regroupedPages.push(allPilots.slice(i, i + pageSize));
            }

            return {
              ...prevData,
              pages: regroupedPages,
            };
          }
          return prevData;
        },
      );
    },
  });
};

export const useEditPilot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      pilotId: string;
      updatedPilot: Partial<Pilot>;
    }) => {
      const res = await AxiosInstance.put(`/api/pilots/${data.pilotId}`, {
        ...data.updatedPilot,
      });

      return res.data;
    },
    onSuccess: (data, variables) => {
      // Update pilot in query
      queryClient.setQueryData<InfiniteData<SavedPilot[]>>(
        ["pilots"],
        (prevData) => {
          if (prevData) {
            const updatedPages = prevData.pages.map((page) =>
              page.map((pilot) => {
                if (pilot.id === data.pilotId) {
                  return {
                    ...pilot,
                    ...variables.updatedPilot,
                  };
                }
                return pilot;
              }),
            );
            return {
              ...prevData,
              pages: updatedPages,
            };
          }
          return prevData;
        },
      );
    },
  });
};
