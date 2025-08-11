import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EventFilters } from "@/components/event-filters";
import { EventModal } from "@/components/event-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Users, Clock, Grid3X3, List as ListIcon } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

export function ListPage() {
  const [filters, setFilters] = useState<CalendarFilters>({
    search: "",
    eventTypes: [],
    priceRange: { min: 0, max: 1000 },
    ageGroups: []
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events']
  });

  const getEventColor = (eventType: string, title: string) => {
    const text = `${eventType} ${title}`.toLowerCase();
    
    if (text.includes("women") || text.includes("ladies")) return "bg-pink-500";
    if (text.includes("men") || text.includes("pastor") || text.includes("father")) return "bg-blue-600";
    if (text.includes("family")) return "bg-green-600";
    if (text.includes("young") || text.includes("youth") || text.includes("teen")) return "bg-orange-500";
    if (text.includes("creative") || text.includes("art")) return "bg-purple-600";
    if (text.includes("adventure") || text.includes("outdoor")) return "bg-teal-600";
    if (text.includes("senior") || text.includes("adult")) return "bg-indigo-600";
    return "bg-primary";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    if (startDate === endDate) return "1 Day";
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    return `${days} Days`;
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.eventType.toLowerCase().includes(filters.search.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesEventType = filters.eventTypes.length === 0 || 
      filters.eventTypes.includes(event.eventType);

    const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
    const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));
    const matchesPrice = minPrice >= filters.priceRange.min && maxPrice <= filters.priceRange.max;

    const matchesAgeGroup = filters.ageGroups.length === 0 || 
      filters.ageGroups.includes(event.ageGroup);

    return matchesSearch && matchesEventType && matchesPrice && matchesAgeGroup;
  });

  // Sort events by start date
  const sortedEvents = filteredEvents.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Get event type counts for filters
  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-muted rounded"></div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-xs text-muted-foreground">Events List 2025-2026</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <Link href="/">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <Grid3X3 className="w-4 h-4" />
                    <span>Month</span>
                  </Button>
                </Link>
                <Link href="/week">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Week</span>
                  </Button>
                </Link>
                <Link href="/year">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Year</span>
                  </Button>
                </Link>
                <Button size="sm" variant="default" className="flex items-center space-x-1">
                  <ListIcon className="w-4 h-4" />
                  <span>List</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Camp Events List</h1>
          <p className="text-muted-foreground">
            Showing {sortedEvents.length} of {events.length} events
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EventFilters
              filters={filters}
              onFiltersChange={setFilters}
              eventTypeCounts={eventTypeCounts}
            />
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            {sortedEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more events.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedEvents.map(event => {
                  const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
                  const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));

                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6" onClick={() => openModal(event)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-4 h-4 rounded-full ${getEventColor(event.eventType, event.title)}`}></div>
                              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {event.eventType}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDate(event.startDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{getDuration(event.startDate, event.endDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location || 'TBA'}</span>
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
                          </div>

                          <div className="ml-6 text-right">
                            <div className="text-lg font-bold text-primary mb-2">
                              ${minPrice}{minPrice !== maxPrice ? ` - $${maxPrice}` : ''}
                            </div>
                            <div className="text-xs text-muted-foreground mb-3">
                              {event.pricingOptions.length} pricing option{event.pricingOptions.length !== 1 ? 's' : ''}
                            </div>
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && selectedEvent && (
        <EventModal 
          event={selectedEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}