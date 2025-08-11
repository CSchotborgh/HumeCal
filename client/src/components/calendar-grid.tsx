import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@shared/schema";

interface CalendarGridProps {
  events: Event[];
  currentDate: Date;
  onEventClick: (event: Event) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

export function CalendarGrid({ events, currentDate, onEventClick, onNavigateMonth }: CalendarGridProps) {
  const { isAuthenticated } = useAuth();

  const { calendarDays, monthName } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and how many days to show from previous month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks) for the calendar grid
    const days = [];
    const currentCalendarDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return currentCalendarDate >= eventStart && currentCalendarDate <= eventEnd;
      });
      
      days.push({
        date: new Date(currentCalendarDate),
        isCurrentMonth: currentCalendarDate.getMonth() === month,
        isToday: currentCalendarDate.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }
    
    return {
      calendarDays: days,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  }, [currentDate, events]);

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
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{monthName}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] border-r border-b border-border p-2 ${
              !day.isCurrentMonth ? 'bg-muted/30' : 'bg-background'
            } ${day.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <div className={`text-sm font-medium mb-2 ${
              !day.isCurrentMonth ? 'text-muted-foreground' : 'text-foreground'
            } ${day.isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
              {day.date.getDate()}
            </div>
            
            <div className="space-y-1">
              {day.events.slice(0, 3).map((event, eventIndex) => (
                <div
                  key={event.id}
                  className="group relative cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <div className={`p-1 rounded text-xs font-medium text-white text-left ${getEventColor(event.eventType, event.title)}`}>
                    <div className="truncate">{event.title}</div>
                    {event.location?.includes("SoCal") && (
                      <div className="text-xs opacity-75 mt-0.5">SoCal</div>
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FavoriteButton 
                        eventId={event.id} 
                        variant="ghost" 
                        size="icon"
                        className="w-5 h-5 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
                      />
                    </div>
                  )}
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}