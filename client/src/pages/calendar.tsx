import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventFilters } from "@/components/event-filters";
import { EventModal } from "@/components/event-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { Search, ChevronLeft, ChevronRight, Sun, Moon, List, Calendar as CalendarIcon, Grid3X3 } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

export default function Calendar() {
  const { theme, toggleTheme } = useTheme();
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
      <div className="min-h-screen bg-warm-gray dark:bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest mx-auto mb-4"></div>
          <p className="text-camp-charcoal dark:text-camp-charcoal">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header */}
      <header className="bg-background dark:bg-background border-b border-border sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">HL</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Hume Lake Christian Camps</h1>
                <p className="text-xs text-muted-foreground">Events Calendar 2025-2026</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-sm">Summer Camps</Button>
              <Button variant="ghost" size="sm" className="text-sm">Retreats</Button>
              <Button variant="ghost" size="sm" className="text-sm">Contact</Button>
              <div className="h-4 w-px bg-border mx-3"></div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-8 h-8"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" className="ml-2">Register</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <EventFilters 
              filters={filters}
              onFiltersChange={setFilters}
              eventTypeCounts={eventTypeCounts}
            />
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-3">
            {/* Calendar Navigation */}
            <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold text-foreground">{currentMonthName}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="default" className="flex items-center space-x-1">
                      <Grid3X3 className="w-4 h-4" />
                      <span>Month</span>
                    </Button>
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
                    <Link href="/list">
                      <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                        <List className="w-4 h-4" />
                        <span>List</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CalendarGrid 
                  currentDate={currentDate}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                />
              </div>
            </div>

            {/* Event Legend */}
            <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Event Types</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span className="text-sm text-foreground">All Events</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-forest rounded-sm"></div>
                    <span className="text-sm text-muted-foreground">Family Events</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-lake rounded-sm"></div>
                    <span className="text-sm text-muted-foreground">Women's Retreats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-earth rounded-sm"></div>
                    <span className="text-sm text-muted-foreground">Men's/Pastors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-sunset rounded-sm"></div>
                    <span className="text-sm text-muted-foreground">Youth Programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                    <span className="text-sm text-muted-foreground">Creative Arts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events List */}
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Upcoming Events</h3>
              </div>
              <div className="divide-y divide-border">
                {filteredEvents.slice(0, 5).map(event => {
                  const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
                  const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));
                  
                  return (
                    <div 
                      key={event.id}
                      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.startDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                              {event.endDate !== event.startDate && (
                                ` — ${new Date(event.endDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}`
                              )}
                              <span className="mx-1">•</span>
                              {event.ageGroup}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            ${minPrice}{minPrice !== maxPrice ? `+` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredEvents.length > 5 && (
                  <div className="p-4 text-center">
                    <Button variant="ghost" size="sm" className="text-sm">
                      View all events
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-xs">HL</span>
                </div>
                <span className="text-sm font-medium text-foreground">Hume Lake Christian Camps</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Creating life-changing experiences through Christian camp ministry in the beautiful Sierra Nevada mountains.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Programs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Summer Camps</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Family Retreats</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Youth Programs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Adult Conferences</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Visit Campus</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-muted-foreground">
                © 2025 Hume Lake Christian Camps. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Safety</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
