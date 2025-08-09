import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesActive,
  getCategoryById,
  toggleCategoryVisibility,
  updateCategoriesOrder,
  updateCategory,
} from "@/action/category.action";
import { useAppParams } from "@/hook/useAppParams";
import { Category } from "@repo/types/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoriesActive = () => {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: getCategoriesActive,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoryById = () => {
  const { pageId } = useAppParams();

  return useQuery({
    queryKey: ["category", pageId],
    queryFn: () => getCategoryById(pageId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!pageId,
  });
};

export const useToggleCategoryVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => toggleCategoryVisibility(categoryId),
    onMutate: (categoryId) => {
      queryClient.cancelQueries({ queryKey: ["categories", "all"] });
      const previousCategories = queryClient.getQueryData([
        "categories",
        "all",
      ]);
      queryClient.setQueryData(["categories", "all"], (old: Category[]) =>
        old.map((category) =>
          category.id === categoryId
            ? { ...category, disabled: !category.disabled }
            : category
        )
      );
      return { previousCategories };
    },
    onError: (_error, _categoryId, context) => {
      queryClient.setQueryData(
        ["categories", "all"],
        context?.previousCategories
      );
      toast.error(
        "Une erreur est survenue lors de la modification de la visibilité du reportage"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (category: { name: string; article: string }) =>
      createCategory(category),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["categories", "all"] });
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success("Catégorie créée avec succès");
        router.push(`/admin/category/${res.data.id}`);
      } else {
        toast.error(
          "Une erreur est survenue lors de la création de la catégorie"
        );
      }
    },
    onError: () => {
      toast.error(
        "Une erreur est survenue lors de la création de la catégorie"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onMutate: (categoryId) => {
      queryClient.cancelQueries({ queryKey: ["categories", "all"] });
      const previousCategories = queryClient.getQueryData([
        "categories",
        "all",
      ]);
      queryClient.setQueryData(["categories", "all"], (old: Category[]) =>
        old.filter((category) => category.id !== categoryId)
      );
      return { previousCategories };
    },
    onError: (_error, _categoryId, context) => {
      queryClient.setQueryData(
        ["categories", "all"],
        context?.previousCategories
      );
      toast.error(
        "Une erreur est survenue lors de la suppression du reportage"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategoriesOrder = (props?: {
  onErrorCallback?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderedIds }: { orderedIds: string[] }) =>
      updateCategoriesOrder({ orderedIds }),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["categories", "all"] });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Sauvegarde réussie");
      } else {
        if (props?.onErrorCallback) {
          props.onErrorCallback();
        }
        toast.error("Une erreur est survenue lors de la sauvegarde");
      }
    },
    onError: () => {
      if (props?.onErrorCallback) {
        props.onErrorCallback();
      }
      toast.error("Une erreur est survenue lors de la sauvegarde");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { pageId: categoryId } = useAppParams();

  return useMutation({
    mutationFn: ({ content }: { content: Partial<Category> }) =>
      updateCategory({ categoryId, content }),
    onMutate: (categoryId) => {
      queryClient.cancelQueries({ queryKey: ["category", categoryId] });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Catégorie modifiée avec succès");
      } else {
        toast.error(
          "Une erreur est survenue lors de la modification de la catégorie"
        );
      }
    },
    onError: () => {
      toast.error(
        "Une erreur est survenue lors de la modification de la catégorie"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
