import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/manageUsers";

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};
