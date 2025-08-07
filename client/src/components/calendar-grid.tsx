import React from "react";
import type { Event } from "@shared/schema";

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function CalendarGrid({ currentDate, events, onEventClick }: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days in month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Get days from previous month to fill the grid
  const daysFromPrevMonth = new Date(year, month, 0).getDate();
  
  // Create array of all days to display
  const calendarDays = [];
  
  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysFromPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysFromPrevMonth - i)
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day)
    });
  }
  
  // Next month days to fill remaining slots
  const remainingSlots = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingSlots; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    });
  }

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes("Women")) return "bg-lake";
    if (eventType.includes("Men") || eventType.includes("Pastor")) return "bg-earth";
    if (eventType.includes("Family")) return "bg-forest";
    if (eventType.includes("Young")) return "bg-sunset";
    if (eventType.includes("Creative")) return "bg-purple-600";
    return "bg-pine";
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7 border border-border rounded-md overflow-hidden">
      {/* Calendar Headers */}
      {days.map(day => (
        <div key={day} className="bg-muted p-2 text-center border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{day}</span>
        </div>
      ))}

      {/* Calendar Days */}
      {calendarDays.map((calendarDay, index) => {
        const dayEvents = getEventsForDate(calendarDay.date);
        const isLastRow = index >= 35;
        const isLastColumn = (index + 1) % 7 === 0;
        
        return (
          <div 
            key={index}
            className={`bg-background p-2 min-h-[100px] relative hover:bg-muted/50 transition-colors
              ${!isLastRow ? 'border-b border-border' : ''}
              ${!isLastColumn ? 'border-r border-border' : ''}
            `}
          >
            <span className={`text-sm ${
              calendarDay.isCurrentMonth 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground'
            }`}>
              {calendarDay.day}
            </span>
            
            {/* Events for this day */}
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 2).map(event => {
                const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
                const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));
                
                return (
                  <div
                    key={event.id}
                    className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs opacity-80">
                      ${minPrice}{minPrice !== maxPrice ? `+` : ''}
                    </div>
                  </div>
                );
              })}
              
              {/* Show "more" indicator if there are additional events */}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
