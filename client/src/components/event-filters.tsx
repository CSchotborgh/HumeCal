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
    { name: "Family Event", color: "bg-green-600", count: eventTypeCounts["Family Event"] || 0 },
    { name: "Women's Retreat", color: "bg-pink-500", count: eventTypeCounts["Women's Retreat"] || 0 },
    { name: "Men's Retreat", color: "bg-blue-600", count: eventTypeCounts["Men's Retreat"] || 0 },
    { name: "Pastor Retreat", color: "bg-blue-600", count: eventTypeCounts["Pastor Retreat"] || 0 },
    { name: "Young Adults", color: "bg-orange-500", count: eventTypeCounts["Young Adults"] || 0 },
    { name: "Youth Leaders", color: "bg-orange-500", count: eventTypeCounts["Youth Leaders"] || 0 },
    { name: "Creative Arts", color: "bg-purple-600", count: eventTypeCounts["Creative Arts"] || 0 },
    { name: "Marriage Retreat", color: "bg-primary", count: eventTypeCounts["Marriage Retreat"] || 0 },
    { name: "Adventure Camp", color: "bg-teal-600", count: eventTypeCounts["Adventure Camp"] || 0 },
    { name: "Adult Conference", color: "bg-indigo-600", count: eventTypeCounts["Adult Conference"] || 0 }
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
    <div className="bg-card border border-border rounded-lg shadow-sm sticky top-24">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">Filters</h2>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Search</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Filter events..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pr-8 h-8 text-sm"
            />
            <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Event Types</label>
          <div className="space-y-2">
            {eventTypes.map(type => (
              <div key={type.name} className="flex items-center space-x-2">
                <Checkbox
                  id={type.name}
                  checked={filters.eventTypes.includes(type.name)}
                  onCheckedChange={() => handleEventTypeToggle(type.name)}
                  className="h-4 w-4"
                />
                <label htmlFor={type.name} className="flex-1 flex items-center justify-between text-sm text-foreground cursor-pointer">
                  <span>{type.name}</span>
                  {type.count > 0 && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-md font-medium">
                      {type.count}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Price Range</label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min || ""}
              onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
              className="flex-1 text-sm h-8"
            />
            <span className="text-muted-foreground text-sm">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max || ""}
              onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 1000)}
              className="flex-1 text-sm h-8"
            />
          </div>
        </div>

        {/* Age Groups */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Age Groups</label>
          <div className="flex flex-wrap gap-1">
            {ageGroups.map(ageGroup => (
              <Button
                key={ageGroup}
                variant={filters.ageGroups.includes(ageGroup) ? "default" : "outline"}
                size="sm"
                onClick={() => handleAgeGroupToggle(ageGroup)}
                className="h-7 px-2 text-xs"
              >
                {ageGroup}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={clearAllFilters}
          className="w-full h-8 text-sm"
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
}
