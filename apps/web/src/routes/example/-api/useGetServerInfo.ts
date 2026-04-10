import { queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/api/client";

export const getServerInfoQueryOptions = () =>
  queryOptions({
    queryKey: ["server", "info"],
    queryFn: async () => {
      const { data, error } = await api.server.info.get();
      if (error) throw error;
      return data;
    },
  });
