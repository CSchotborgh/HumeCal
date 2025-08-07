import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface CalendarFilters {
  search: string;
  eventTypes: string[];
  priceRange: { min: number; max: number };
  ageGroups: string[];
}

interface EventFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  eventTypeCounts: Record<string, number>;
}

export function EventFilters({ filters, onFiltersChange, eventTypeCounts }: EventFiltersProps) {
  const eventTypes = [
    { name: "Family Event", color: "bg-forest", count: eventTypeCounts["Family Event"] || 0 },
    { name: "Women's Retreat", color: "bg-lake", count: eventTypeCounts["Women's Retreat"] || 0 },
    { name: "Men's Retreat", color: "bg-earth", count: eventTypeCounts["Men's Retreat"] || 0 },
    { name: "Pastor Retreat", color: "bg-earth", count: eventTypeCounts["Pastor Retreat"] || 0 },
    { name: "Young Adults", color: "bg-sunset", count: eventTypeCounts["Young Adults"] || 0 },
    { name: "Youth Leaders", color: "bg-sunset", count: eventTypeCounts["Youth Leaders"] || 0 },
    { name: "Creative Arts", color: "bg-purple-600", count: eventTypeCounts["Creative Arts"] || 0 },
    { name: "Marriage Retreat", color: "bg-pine", count: eventTypeCounts["Marriage Retreat"] || 0 }
  ];

  const ageGroups = [
    "Kids (8-11)",
    "Youth (12-17)", 
    "Adults (18+)",
    "All Ages"
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleEventTypeToggle = (eventType: string) => {
    const newEventTypes = filters.eventTypes.includes(eventType)
      ? filters.eventTypes.filter(t => t !== eventType)
      : [...filters.eventTypes, eventType];
    onFiltersChange({ ...filters, eventTypes: newEventTypes });
  };

  const handleAgeGroupToggle = (ageGroup: string) => {
    const newAgeGroups = filters.ageGroups.includes(ageGroup)
      ? filters.ageGroups.filter(a => a !== ageGroup)
      : [...filters.ageGroups, ageGroup];
    onFiltersChange({ ...filters, ageGroups: newAgeGroups });
  };

  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [field]: value }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      eventTypes: [],
      priceRange: { min: 0, max: 1000 },
      ageGroups: []
    });
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-camp-charcoal dark:text-camp-charcoal mb-4">Filter Events</h2>
        
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">Search Events</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by event name..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-muted-foreground" />
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-3">Event Types</label>
          <div className="space-y-2">
            {eventTypes.map(type => (
              <div key={type.name} className="flex items-center space-x-2">
                <Checkbox
                  id={type.name}
                  checked={filters.eventTypes.includes(type.name)}
                  onCheckedChange={() => handleEventTypeToggle(type.name)}
                />
                <label htmlFor={type.name} className="flex-1 flex items-center justify-between text-sm text-gray-700 dark:text-foreground cursor-pointer">
                  <span>{type.name}</span>
                  {type.count > 0 && (
                    <span className={`${type.color} text-white text-xs px-2 py-1 rounded-full`}>
                      {type.count}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-3">Price Range</label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="$0"
              value={filters.priceRange.min || ""}
              onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
              className="flex-1 text-sm"
            />
            <span className="text-gray-500 dark:text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="$600"
              value={filters.priceRange.max || ""}
              onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 1000)}
              className="flex-1 text-sm"
            />
          </div>
        </div>

        {/* Age Groups */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-3">Age Groups</label>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map(ageGroup => (
              <Button
                key={ageGroup}
                variant={filters.ageGroups.includes(ageGroup) ? "default" : "outline"}
                size="sm"
                onClick={() => handleAgeGroupToggle(ageGroup)}
                className={filters.ageGroups.includes(ageGroup) 
                  ? "bg-forest text-white hover:bg-pine" 
                  : "text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                }
              >
                {ageGroup}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
