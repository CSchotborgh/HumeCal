import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addYears, subYears } from "date-fns";
import { EventFilters } from "@/components/event-filters";
import { EventModal } from "@/components/event-modal";
import { Button } from "@/components/ui/button";
import { Calendar, List, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function YearPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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

  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getEventsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  };

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

  const MonthGrid = ({ month }: { month: Date }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthEvents = getEventsForMonth(month);

    // Pad the beginning of the month to align with Sunday
    const startPadding = monthStart.getDay();
    const paddedDays = Array(startPadding).fill(null).concat(days);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-muted px-3 py-2 border-b border-border">
          <h3 className="font-medium text-card-foreground text-sm">
            {format(month, "MMMM yyyy")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {monthEvents.length} events
          </p>
        </div>
        
        <div className="p-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-xs text-muted-foreground text-center p-1 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-8" />;
              }
              
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, month);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    h-8 text-xs flex flex-col items-center justify-center relative cursor-pointer
                    rounded hover:bg-accent transition-colors
                    ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                    ${isToday ? "bg-primary text-primary-foreground font-semibold" : ""}
                  `}
                  onClick={() => {
                    if (dayEvents.length === 1) {
                      setSelectedEvent(dayEvents[0]);
                    }
                  }}
                >
                  <span>{format(day, "d")}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${getEventTypeColor(event.eventType)}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
                <p className="text-xs text-muted-foreground">Year View {currentYear}</p>
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
                <Link href="/list">
                  <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </Button>
                </Link>
                <Button size="sm" variant="default">Year</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            {/* Year Navigation */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Year Navigation</h2>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentYear(currentYear - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold text-foreground min-w-[80px] text-center">
                  {currentYear}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentYear(currentYear + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <EventFilters filters={filters} onFiltersChange={setFilters} eventTypeCounts={eventTypeCounts} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {currentYear} Year Overview
              </h1>
              <p className="text-muted-foreground">
                Showing {filteredEvents.length} of {events.length} events across all months
              </p>
            </div>

            {/* Year Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {months.map((month) => (
                <MonthGrid key={month.toISOString()} month={month} />
              ))}
            </div>
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