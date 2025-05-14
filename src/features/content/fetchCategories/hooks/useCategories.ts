import { CategoriesApiResponse } from "@/entities/content-block";
import { fetchCategories } from "@/shared"; // Corrected import path
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery<
    CategoriesApiResponse, // TQueryFnData
    Error, // TError
    CategoriesApiResponse, // TData
    string[] // TQueryKey, explicitly an array of strings
  >({
    queryKey: ["contentCategories"],
    queryFn: fetchCategories,
  });
};
