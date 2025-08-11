import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventModal } from "@/components/event-modal";
import { FavoriteButton } from "@/components/favorite-button";
import { Calendar as CalendarIcon, MapPin, Users, Clock, Heart, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to view your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // Get full event details for favorited events
  const favoriteEvents = Array.isArray(favorites) 
    ? favorites
        .map((fav: any) => events.find((event: Event) => event.id === fav.eventId))
        .filter(Boolean) as Event[]
    : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const getEventColor = (eventType: string, title: string) => {
    const text = `${eventType} ${title}`.toLowerCase();
    
    if (text.includes("women") || text.includes("ladies")) return "bg-pink-500";
    if (text.includes("men") || text.includes("pastor") || text.includes("father")) return "bg-blue-600";
    if (text.includes("family")) return "bg-green-600";
    if (text.includes("young") || text.includes("youth") || text.includes("teen")) return "bg-orange-500";
    if (text.includes("marriage") || text.includes("couples")) return "bg-purple-500";
    if (text.includes("creative") || text.includes("arts")) return "bg-yellow-500";
    if (text.includes("retreat")) return "bg-teal-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">HL</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Hume Lake Christian Camps</h1>
                <p className="text-xs text-muted-foreground">My Favorite Events</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Back to Calendar
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="text-sm">Contact</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-semibold text-foreground">My Favorite Events</h1>
          </div>
          <p className="text-muted-foreground">
            {favoriteEvents.length === 0 
              ? "You haven't favorited any events yet. Browse the calendar to add some!" 
              : `You have ${favoriteEvents.length} favorite event${favoriteEvents.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {favoriteEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No favorite events yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring our amazing retreat and camp offerings and click the heart icon to save your favorites!
              </p>
              <Link href="/">
                <Button>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Browse Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {favoriteEvents.map(event => {
              const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
              const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));

              return (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-4 h-4 rounded-full ${getEventColor(event.eventType, event.title)}`}></div>
                          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {event.eventType}
                          </Badge>
                          <FavoriteButton eventId={event.id} />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{getDuration(event.startDate, event.endDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location || 'Hume Lake, CA'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{event.ageGroup}</span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <a 
                            href="https://register.hume.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button size="sm">
                              Register Now
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="ml-6 text-right">
                        <div className="text-lg font-bold text-primary mb-2">
                          ${minPrice}{minPrice !== maxPrice ? ` - $${maxPrice}` : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.pricingOptions.length} pricing option{event.pricingOptions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}