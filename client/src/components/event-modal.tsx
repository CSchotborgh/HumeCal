import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const minPrice = Math.min(...event.pricingOptions.map(p => p.price));
  const maxPrice = Math.max(...event.pricingOptions.map(p => p.price));

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{event.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="p-6">

          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
            alt="Hume Lake retreat center" 
            className="w-full h-48 object-cover rounded-lg mb-6"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {formatDate(event.startDate)}
                    {event.endDate !== event.startDate && ` — ${formatDate(event.endDate)}`}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{event.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Age Group</span>
                  <span className="font-medium text-foreground">{event.ageGroup}</span>
                </div>
                {event.gender && event.gender !== "Coed" && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium text-foreground">{event.gender}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">{event.eventType}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Pricing Options</h3>
              <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                {event.pricingOptions.map((option, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span className="text-muted-foreground">{option.name}</span>
                    <span className="font-medium text-foreground">${option.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">Price Range</span>
                  <span className="font-semibold text-primary">
                    ${minPrice}{minPrice !== maxPrice ? ` — $${maxPrice}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <Button className="flex-1 bg-forest text-white hover:bg-pine">
              Register Now
            </Button>
            <Button variant="outline" className="px-6">
              Save Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
