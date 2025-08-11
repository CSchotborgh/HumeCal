import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
    retry: false,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ eventId }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Event Favorited",
        description: "Event added to your favorites!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to favorite events.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add event to favorites",
        variant: "destructive",
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/favorites/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from Favorites",
        description: "Event removed from your favorites.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to manage favorites.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove event from favorites",
        variant: "destructive",
      });
    },
  });

  const checkFavorite = (eventId: string) => {
    return useQuery({
      queryKey: ["/api/favorites/check", eventId],
      enabled: isAuthenticated && !!eventId,
      retry: false,
    });
  };

  const isFavorite = (eventId: string) => {
    if (!isAuthenticated) return false;
    return Array.isArray(favorites) && favorites.some((fav: any) => fav.eventId === eventId);
  };

  return {
    favorites,
    isLoading,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isFavorite,
    checkFavorite,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
}