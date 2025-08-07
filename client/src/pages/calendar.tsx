import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventFilters } from "@/components/event-filters";
import { EventModal } from "@/components/event-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@shared/schema";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    search: "",
    eventTypes: [],
    priceRange: { min: 0, max: 1000 },
    ageGroups: []
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Event type filter
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.eventType)) {
        return false;
      }

      // Price range filter
      const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
      const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));
      if (minPrice > filters.priceRange.max || maxPrice < filters.priceRange.min) {
        return false;
      }

      // Age group filter
      if (filters.ageGroups.length > 0) {
        const eventAgeMatches = filters.ageGroups.some(ageGroup => {
          if (ageGroup === "Kids (8-11)" && event.ageGroup.includes("8")) return true;
          if (ageGroup === "Youth (12-17)" && (event.ageGroup.includes("16") || event.ageGroup.includes("12"))) return true;
          if (ageGroup === "Adults (18+)" && event.ageGroup.includes("18")) return true;
          if (ageGroup === "All Ages" && event.ageGroup.includes("8")) return true;
          return false;
        });
        if (!eventAgeMatches) return false;
      }

      return true;
    });
  }, [events, filters]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const currentMonthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest mx-auto mb-4"></div>
          <p className="text-camp-charcoal">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="Hume Lake Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-forest">Hume Lake Christian Camps</h1>
                <p className="text-sm text-gray-600">Events Calendar 2025-2026</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-forest transition-colors">Summer Camps</a>
              <a href="#" className="text-gray-700 hover:text-forest transition-colors">Retreats</a>
              <a href="#" className="text-gray-700 hover:text-forest transition-colors">Contact</a>
              <Button className="bg-forest text-white hover:bg-pine">Register</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <EventFilters 
              filters={filters}
              onFiltersChange={setFilters}
              eventTypeCounts={eventTypeCounts}
            />
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-3">
            {/* Calendar Navigation */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth('prev')}
                      className="hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-2xl font-bold text-camp-charcoal">{currentMonthName}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth('next')}
                      className="hover:bg-gray-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-forest text-white hover:bg-pine">Month</Button>
                    <Button variant="outline">List</Button>
                  </div>
                </div>

                <CalendarGrid 
                  currentDate={currentDate}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                />
              </CardContent>
            </Card>

            {/* Event Legend */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-camp-charcoal mb-4">Event Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-forest rounded"></div>
                    <span className="text-sm text-gray-700">Family Events</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-lake rounded"></div>
                    <span className="text-sm text-gray-700">Women's Retreats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-earth rounded"></div>
                    <span className="text-sm text-gray-700">Men's/Pastors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-sunset rounded"></div>
                    <span className="text-sm text-gray-700">Youth Programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span className="text-sm text-gray-700">Creative Arts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-pine rounded"></div>
                    <span className="text-sm text-gray-700">Marriage Retreats</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-camp-charcoal mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {filteredEvents.slice(0, 5).map(event => {
                    const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
                    const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));
                    
                    return (
                      <div 
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              event.eventType.includes("Women") ? "bg-lake" :
                              event.eventType.includes("Men") || event.eventType.includes("Pastor") ? "bg-earth" :
                              event.eventType.includes("Family") ? "bg-forest" :
                              event.eventType.includes("Young") ? "bg-sunset" :
                              event.eventType.includes("Creative") ? "bg-purple-600" :
                              "bg-pine"
                            }`}></div>
                            <div>
                              <h4 className="font-medium text-camp-charcoal">{event.title}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(event.startDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                                {event.endDate !== event.startDate && (
                                  ` - ${new Date(event.endDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}`
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-camp-charcoal">
                              ${minPrice}{minPrice !== maxPrice ? ` - $${maxPrice}` : ''}
                            </p>
                            <p className="text-sm text-gray-600">{event.ageGroup} {event.gender !== "Coed" ? `• ${event.gender}` : ""}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredEvents.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="ghost" className="text-forest hover:text-pine">
                        View All Events →
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
