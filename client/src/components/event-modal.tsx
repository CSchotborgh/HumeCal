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

  const generateEventSVG = (eventType: string, title: string, description?: string) => {
    const text = `${eventType} ${title} ${description || ''}`.toLowerCase();
    
    // Color schemes based on event type
    let primaryColor = "#4F83CC";
    let secondaryColor = "#87CEEB";
    let accentColor = "#228B22";
    let elements = [];
    
    if (text.includes("women") || text.includes("ladies")) {
      primaryColor = "#E6A8D2";
      secondaryColor = "#F8BBD9";
      accentColor = "#FF69B4";
      elements = ['flowers', 'serene-lake'];
    } else if (text.includes("men") || text.includes("pastor") || text.includes("father")) {
      primaryColor = "#4682B4";
      secondaryColor = "#5F9EA0";
      accentColor = "#2F4F4F";
      elements = ['mountains', 'trees'];
    } else if (text.includes("family")) {
      primaryColor = "#90EE90";
      secondaryColor = "#98FB98";
      accentColor = "#32CD32";
      elements = ['family-scene', 'lake'];
    } else if (text.includes("young") || text.includes("youth") || text.includes("teen")) {
      primaryColor = "#FF8C00";
      secondaryColor = "#FFA500";
      accentColor = "#FF4500";
      elements = ['adventure', 'activities'];
    } else if (text.includes("marriage") || text.includes("couples")) {
      primaryColor = "#DDA0DD";
      secondaryColor = "#EE82EE";
      accentColor = "#BA55D3";
      elements = ['romantic', 'sunset'];
    } else if (text.includes("creative") || text.includes("arts")) {
      primaryColor = "#FFD700";
      secondaryColor = "#FFA500";
      accentColor = "#FF8C00";
      elements = ['artistic', 'inspiration'];
    } else if (text.includes("summer")) {
      primaryColor = "#87CEEB";
      secondaryColor = "#00BFFF";
      accentColor = "#FFD700";
      elements = ['sun', 'water-activities'];
    }
    
    // Create SVG based on elements
    const svgContent = `
      <svg width="1200" height="400" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${secondaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#8B7355;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5D4E37;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Sky background -->
        <rect width="1200" height="250" fill="url(#skyGradient)" />
        
        <!-- Mountains -->
        <polygon points="0,200 200,80 400,120 600,60 800,100 1000,40 1200,90 1200,250 0,250" 
                 fill="url(#mountainGradient)" />
        
        <!-- Lake -->
        <ellipse cx="600" cy="320" rx="500" ry="80" fill="${primaryColor}" opacity="0.7" />
        
        ${elements.includes('flowers') ? `
        <!-- Flowers for women's events -->
        <circle cx="100" cy="180" r="8" fill="#FF69B4" />
        <circle cx="120" cy="175" r="6" fill="#FFB6C1" />
        <circle cx="1100" cy="190" r="7" fill="#FF1493" />
        ` : ''}
        
        ${elements.includes('trees') ? `
        <!-- Trees for nature/men's events -->
        <polygon points="150,250 170,200 190,250" fill="#228B22" />
        <polygon points="950,250 970,190 990,250" fill="#32CD32" />
        <polygon points="1050,250 1070,210 1090,250" fill="#228B22" />
        ` : ''}
        
        ${elements.includes('sun') ? `
        <!-- Sun for summer events -->
        <circle cx="1050" cy="80" r="40" fill="#FFD700" />
        <path d="M1050,20 L1050,40 M1090,50 L1080,60 M1110,80 L1090,80 M1090,110 L1080,100 M1050,140 L1050,120 M1010,110 L1020,100 M990,80 L1010,80 M1010,50 L1020,60" stroke="#FFA500" stroke-width="3" />
        ` : ''}
        
        ${elements.includes('romantic') ? `
        <!-- Heart for romantic events -->
        <path d="M580,150 C580,140 590,130 600,130 C610,130 620,140 620,150 C620,160 600,180 600,180 C600,180 580,160 580,150 Z" fill="${accentColor}" />
        ` : ''}
        
        ${elements.includes('artistic') ? `
        <!-- Artistic brush strokes -->
        <path d="M50,100 Q200,150 350,120 T650,140" stroke="${accentColor}" stroke-width="8" fill="none" opacity="0.6" />
        <path d="M800,160 Q950,110 1100,130" stroke="${primaryColor}" stroke-width="6" fill="none" opacity="0.8" />
        ` : ''}
        
        <!-- Event title overlay -->
        <rect x="50" y="320" width="${Math.min(title.length * 12 + 40, 400)}" height="50" fill="rgba(0,0,0,0.7)" rx="5" />
        <text x="70" y="345" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">${title}</text>
        <text x="70" y="360" font-family="Arial, sans-serif" font-size="12" fill="#E0E0E0">${eventType}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  };

  const getEventImageAlt = (eventType: string, title: string, description?: string) => {
    const text = `${eventType} ${title} ${description || ''}`.toLowerCase();
    
    if (text.includes("women") || text.includes("ladies")) return `Custom illustration for ${title} - serene mountain lake setting with floral elements for women's retreat`;
    if (text.includes("men") || text.includes("pastor") || text.includes("father")) return `Custom illustration for ${title} - mountain wilderness with trees for men's retreat`;
    if (text.includes("family")) return `Custom illustration for ${title} - beautiful lakeside setting for family gathering`;
    if (text.includes("young") || text.includes("youth") || text.includes("teen")) return `Custom illustration for ${title} - adventure-themed mountain lake for youth`;
    if (text.includes("marriage") || text.includes("couples")) return `Custom illustration for ${title} - romantic lakeside setting for couples retreat`;
    if (text.includes("creative") || text.includes("arts")) return `Custom illustration for ${title} - artistic mountain scenery with creative elements`;
    if (text.includes("summer")) return `Custom illustration for ${title} - sunny lake activities for summer camp`;
    
    return `Custom illustration for ${title} - Beautiful Hume Lake Christian Camp mountain setting`;
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
            src={generateEventSVG(event.eventType, event.title, event.description)}
            alt={getEventImageAlt(event.eventType, event.title, event.description)}
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
