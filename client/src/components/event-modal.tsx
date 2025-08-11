import React from "react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
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

  const getEventImage = (eventType: string, title: string) => {
    const text = `${eventType} ${title}`.toLowerCase();
    
    // Mountain lake scenery for general retreats
    if (text.includes("retreat") || text.includes("camp")) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Women's retreats - serene lake with flowers
    if (text.includes("women") || text.includes("ladies")) {
      return "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Men's retreats - mountain wilderness
    if (text.includes("men") || text.includes("pastor") || text.includes("father")) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Family events - lakeside gathering
    if (text.includes("family")) {
      return "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Youth/Young Adults - adventure activities
    if (text.includes("young") || text.includes("youth") || text.includes("teen")) {
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Marriage/Couples - romantic lakeside
    if (text.includes("marriage") || text.includes("couples")) {
      return "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Creative Arts - artistic mountain setting
    if (text.includes("creative") || text.includes("arts")) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Summer camps - sunny lake activities
    if (text.includes("summer")) {
      return "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
    }
    
    // Default Hume Lake scenic view
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80";
  };

  const getEventImageAlt = (eventType: string, title: string) => {
    const text = `${eventType} ${title}`.toLowerCase();
    
    if (text.includes("women") || text.includes("ladies")) return "Serene mountain lake setting for women's retreat";
    if (text.includes("men") || text.includes("pastor") || text.includes("father")) return "Mountain wilderness for men's retreat";
    if (text.includes("family")) return "Beautiful lakeside setting for family gathering";
    if (text.includes("young") || text.includes("youth") || text.includes("teen")) return "Adventure activities at mountain lake for youth";
    if (text.includes("marriage") || text.includes("couples")) return "Romantic lakeside setting for couples retreat";
    if (text.includes("creative") || text.includes("arts")) return "Inspiring mountain scenery for creative arts retreat";
    if (text.includes("summer")) return "Sunny lake activities for summer camp";
    
    return "Beautiful Hume Lake Christian Camp mountain setting";
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
            <div>
              <h2 className="text-xl font-semibold text-foreground">{event.title}</h2>
              {event.location?.includes("SoCal") && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Hume SoCal
                  </span>
                  {event.description?.includes("FILLING FAST") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      FILLING FAST
                    </span>
                  )}
                  {event.description?.includes("50% OFF") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      50% OFF
                    </span>
                  )}
                  {event.description?.includes("WAITLIST") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      JOIN WAITLIST
                    </span>
                  )}
                  {event.description?.includes("FREE counselors") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      FREE COUNSELORS
                    </span>
                  )}
                </div>
              )}
            </div>
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
            src={getEventImage(event.eventType, event.title)}
            alt={getEventImageAlt(event.eventType, event.title)}
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
                  <div className="text-muted-foreground leading-relaxed">
                    {/* Extract speaker information from description for SoCal events */}
                    {event.location?.includes("SoCal") && event.description?.includes("Speaker:") ? (
                      <div>
                        <p className="mb-3">
                          {event.description.split("Speaker:")[0].trim()}
                        </p>
                        <div className="font-medium text-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          🎤 Speaker: {event.description.split("Speaker:")[1].split(".")[0].trim()}
                        </div>
                      </div>
                    ) : (
                      <p>{event.description}</p>
                    )}
                  </div>
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
                <div className="flex gap-3">
                  <a 
                    href="https://register.hume.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-md hover:bg-primary/90 transition-colors">
                      Register Now
                    </Button>
                  </a>
                  <FavoriteButton 
                    eventId={event.id} 
                    variant="outline" 
                    size="lg" 
                    className="px-4"
                  />
                </div>
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
