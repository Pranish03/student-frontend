import { useQuery } from "@tanstack/react-query";
import { fetchCourse } from "../api/manageCourses";

export const useCourse = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  });
};
