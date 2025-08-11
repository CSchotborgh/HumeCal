import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function FavoriteButton({ 
  eventId, 
  variant = "ghost", 
  size = "icon",
  className 
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent
    
    if (!isAuthenticated) {
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

    if (isFavorite(eventId)) {
      removeFavorite(eventId);
    } else {
      addFavorite(eventId);
    }
  };

  const isLoading = isAddingFavorite || isRemovingFavorite;
  const favorited = isAuthenticated && isFavorite(eventId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        favorited && "text-red-500 hover:text-red-600",
        !favorited && "text-muted-foreground hover:text-foreground",
        className
      )}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-all", 
          favorited && "fill-current",
          isLoading && "opacity-50"
        )} 
      />
      {size !== "icon" && (
        <span className="ml-2">
          {favorited ? "Favorited" : "Favorite"}
        </span>
      )}
    </Button>
  );
}