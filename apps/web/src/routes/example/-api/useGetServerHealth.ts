import { queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/api/client";

export const getServerHealthQueryOptions = () =>
  queryOptions({
    queryKey: ["server", "health"],
    queryFn: async () => {
      const { data, error } = await api.server.health.get();
      if (error) throw error;
      return data;
    },
  });
