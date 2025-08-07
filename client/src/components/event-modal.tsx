import React from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto"
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
        <div className="p-8">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=300" 
            alt="Hume Lake retreat center" 
            className="w-full h-56 object-cover rounded-lg mb-8"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">Event Details</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground font-medium">Date</span>
                    <span className="font-medium text-foreground">
                      {formatDate(event.startDate)}
                      {event.endDate !== event.startDate && ` — ${formatDate(event.endDate)}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground font-medium">Location</span>
                    <span className="font-medium text-foreground">{event.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground font-medium">Age Group</span>
                    <span className="font-medium text-foreground">{event.ageGroup}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {event.gender && event.gender !== "Coed" && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Gender</span>
                      <span className="font-medium text-foreground">{event.gender}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground font-medium">Type</span>
                    <span className="font-medium text-foreground">{event.eventType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground font-medium">Duration</span>
                    <span className="font-medium text-foreground">
                      {event.endDate === event.startDate ? "1 Day" : 
                       `${Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days`}
                    </span>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-md">
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-foreground">Price Range</span>
                  <span className="font-bold text-primary text-lg">
                    ${minPrice}{minPrice !== maxPrice ? ` — $${maxPrice}` : ''}
                  </span>
                </div>
              </div>

              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="pricing" className="border-border">
                  <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                    Pricing Options ({event.pricingOptions.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {event.pricingOptions.map((option, index) => (
                        <div key={index} className="flex justify-between py-3 px-4 bg-muted rounded-md">
                          <span className="text-foreground font-medium">{option.name}</span>
                          <span className="font-semibold text-foreground">${option.price}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-3">
                <Button className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  Register Now
                </Button>
                <Button variant="outline" className="w-full font-medium py-3 px-4 rounded-md hover:bg-muted transition-colors">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
