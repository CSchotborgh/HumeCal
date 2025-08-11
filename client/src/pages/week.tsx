import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday } from "date-fns";
import { EventFilters } from "@/components/event-filters";
import { EventModal } from "@/components/event-modal";
import { useMobileOrientation } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, List, ChevronLeft, ChevronRight, Grid3X3, Printer } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

export default function WeekPage() {
  const { isMobile, isPortrait, isLandscape } = useMobileOrientation();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState<CalendarFilters>({
    search: "",
    eventTypes: [],
    priceRange: { min: 0, max: 2000 },
    ageGroups: [],
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesEventType = filters.eventTypes.length === 0 || 
        filters.eventTypes.some(type => event.eventType.toLowerCase().includes(type.toLowerCase()));
      
      const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
      const matchesPrice = minPrice >= filters.priceRange.min && minPrice <= filters.priceRange.max;
      
      const matchesAgeGroup = filters.ageGroups.length === 0 ||
        filters.ageGroups.some(group => event.ageGroup.toLowerCase().includes(group.toLowerCase()));
      
      return matchesSearch && matchesEventType && matchesPrice && matchesAgeGroup;
    });
  }, [events, filters]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.startDate), day));
  };

  const getEventTypeColor = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes("women")) return "bg-pink-500";
    if (type.includes("men")) return "bg-blue-500";
    if (type.includes("family")) return "bg-green-500";
    if (type.includes("youth")) return "bg-purple-500";
    if (type.includes("child")) return "bg-yellow-500";
    if (type.includes("teen")) return "bg-indigo-500";
    if (type.includes("retreat")) return "bg-orange-500";
    return "bg-gray-500";
  };

  const printWeek = () => {
    window.print();
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(prev => direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background print-week-view">
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
                <p className="text-xs text-muted-foreground">
                  Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className={`
              ${isPortrait 
                ? 'flex flex-col space-y-2' 
                : isLandscape 
                  ? 'flex flex-col space-y-1' 
                  : 'flex items-center space-x-4'
              }
            `}>
              <div className={`
                ${isPortrait 
                  ? 'mobile-portrait-nav mobile-nav-portrait' 
                  : isLandscape 
                    ? 'mobile-landscape-nav mobile-nav-landscape' 
                    : 'flex space-x-1'
                }
              `}>
                <Link href="/">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <Grid3X3 className="w-4 h-4" />
                    <span className={isPortrait ? "hidden" : ""}>Month</span>
                  </Button>
                </Link>
                <Link href="/list">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <List className="w-4 h-4" />
                    <span className={isPortrait ? "hidden" : ""}>List</span>
                  </Button>
                </Link>
                <Link href="/year">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className={isPortrait ? "hidden" : ""}>Year</span>
                  </Button>
                </Link>
                <Button size="sm" variant="default">
                  <span className={isPortrait ? "hidden" : ""}>Week</span>
                  {isPortrait && <Calendar className="w-4 h-4" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={printWeek}
                  className="flex items-center space-x-1 print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  <span className={isPortrait ? "hidden" : ""}>Print</span>
                </Button>
              </div>
              {!isMobile && (
                <>
                  <div className="h-4 w-px bg-border mx-3"></div>
                  <Link href="/contact">
                    <Button variant="ghost" size="sm" className="text-sm">Contact</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${isMobile ? 'flex flex-col gap-6' : 'flex gap-8'}`}>
          {/* Main Content */}
          <div className={`${isMobile ? 'order-1' : 'flex-1'} ${!isMobile ? 'flex-1' : ''}`}>
            {/* Week Navigation */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Week Navigation</h2>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-4 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <div className="text-sm font-semibold text-foreground">
                    {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(weekStart, "yyyy")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Weekly View</h1>
              <p className="text-muted-foreground">
                Week of {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
              </p>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentDay = isToday(day);

                return (
                  <div key={day.toISOString()} className="min-h-[200px] week-day-column">
                    <div className={`
                      bg-card border border-border rounded-lg overflow-hidden h-full
                      ${isCurrentDay ? "ring-2 ring-primary" : ""}
                    `}>
                      {/* Day Header */}
                      <div className={`
                        px-3 py-2 border-b border-border
                        ${isCurrentDay ? "bg-primary text-primary-foreground" : "bg-muted"}
                      `}>
                        <div className="text-sm font-medium">
                          {format(day, "EEEE")}
                        </div>
                        <div className={`text-lg font-semibold ${isCurrentDay ? "" : "text-foreground"}`}>
                          {format(day, "d")}
                        </div>
                        {dayEvents.length > 0 && (
                          <div className={`text-xs ${isCurrentDay ? "" : "text-muted-foreground"}`}>
                            {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {/* Events */}
                      <div className="p-2 space-y-2">
                        {dayEvents.length === 0 ? (
                          <div className="text-xs text-muted-foreground text-center py-4">
                            No events
                          </div>
                        ) : (
                          dayEvents.map((event, index) => (
                            <Card
                              key={index}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <CardContent className="p-2">
                                <div className="flex items-start space-x-2">
                                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getEventTypeColor(event.eventType)}`} />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-medium text-card-foreground truncate">
                                      {event.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {event.eventType}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                                    </p>
                                    <p className="text-xs font-medium text-card-foreground">
                                      From ${Math.min(...event.pricingOptions.map(p => p.price))}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week Summary */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Week Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {filteredEvents.filter(event => {
                      const eventDate = new Date(event.startDate);
                      return eventDate >= weekStart && eventDate <= weekEnd;
                    }).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Events This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(filteredEvents.filter(event => {
                      const eventDate = new Date(event.startDate);
                      return eventDate >= weekStart && eventDate <= weekEnd;
                    }).map(e => e.eventType)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Event Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {weekDays.filter(day => getEventsForDay(day).length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Sidebar - Mobile: Below content, Desktop: Sidebar */}
          <div className={`${isMobile ? 'order-2' : 'w-80 flex-shrink-0'}`}>
            <EventFilters filters={filters} onFiltersChange={setFilters} eventTypeCounts={eventTypeCounts} />
          </div>
        </div>
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