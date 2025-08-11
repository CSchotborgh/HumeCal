import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

interface EventFiltersProps {
  filters: {
    search: string;
    eventTypes: string[];
    priceRange: { min: number; max: number };
    ageGroups: string[];
  };
  onFiltersChange: (filters: any) => void;
  eventTypeCounts: Record<string, number>;
}

export function EventFilters({ filters, onFiltersChange, eventTypeCounts }: EventFiltersProps) {
  const eventTypes = [
    "Summer Camp",
    "Family Retreat", 
    "Young Adults",
    "Marriage Retreat",
    "Mens Retreat",
    "Womens Retreat",
    "Creative Arts",
    "Youth Retreat"
  ];

  const ageGroups = [
    "Kids (8-11)",
    "Youth (12-17)", 
    "Adults (18+)",
    "All Ages"
  ];

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleEventType = (eventType: string) => {
    const newEventTypes = filters.eventTypes.includes(eventType)
      ? filters.eventTypes.filter(t => t !== eventType)
      : [...filters.eventTypes, eventType];
    updateFilters('eventTypes', newEventTypes);
  };

  const toggleAgeGroup = (ageGroup: string) => {
    const newAgeGroups = filters.ageGroups.includes(ageGroup)
      ? filters.ageGroups.filter(g => g !== ageGroup)
      : [...filters.ageGroups, ageGroup];
    updateFilters('ageGroups', newAgeGroups);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      eventTypes: [],
      priceRange: { min: 0, max: 1000 },
      ageGroups: []
    });
  };

  const hasActiveFilters = filters.search || filters.eventTypes.length > 0 || 
    filters.ageGroups.length > 0 || filters.priceRange.min > 0 || filters.priceRange.max < 1000;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-auto p-1"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Search Events</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => updateFilters('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Event Types */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Event Types</label>
          <div className="space-y-2">
            {eventTypes.map(eventType => (
              <div key={eventType} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${eventType}`}
                    checked={filters.eventTypes.includes(eventType)}
                    onCheckedChange={() => toggleEventType(eventType)}
                  />
                  <label
                    htmlFor={`event-${eventType}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {eventType}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {eventTypeCounts[eventType] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Price Range: ${filters.priceRange.min} - ${filters.priceRange.max}
          </label>
          <div className="space-y-3">
            <Slider
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={([min, max]) => updateFilters('priceRange', { min, max })}
              max={1000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>
        </div>

        {/* Age Groups */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Age Groups</label>
          <div className="space-y-2">
            {ageGroups.map(ageGroup => (
              <div key={ageGroup} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${ageGroup}`}
                  checked={filters.ageGroups.includes(ageGroup)}
                  onCheckedChange={() => toggleAgeGroup(ageGroup)}
                />
                <label
                  htmlFor={`age-${ageGroup}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {ageGroup}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}