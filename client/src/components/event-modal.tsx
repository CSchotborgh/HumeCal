import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { X, ChevronDown, Printer, Share2, Copy, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const printEvent = () => {
    // Create a print-friendly version of the event details
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${event.title} - Hume Lake Christian Camps</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 40px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .event-title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0 10px 0;
            }
            .event-type {
              background: #f0f0f0;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 14px;
              display: inline-block;
              margin-bottom: 20px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #ddd;
            }
            .detail-label {
              font-weight: 600;
              color: #666;
            }
            .detail-value {
              font-weight: 500;
            }
            .description {
              margin: 20px 0;
              line-height: 1.7;
            }
            .pricing-section {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
            }
            .pricing-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .pricing-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .pricing-item:last-child {
              border-bottom: none;
            }
            .contact-info {
              margin-top: 30px;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            @media print {
              body { padding: 20px; }
              .header { page-break-inside: avoid; }
              .pricing-section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Hume Lake Christian Camps</div>
            <div>Event Details</div>
          </div>
          
          <div class="event-title">${event.title}</div>
          <div class="event-type">${event.eventType}</div>
          
          <div class="details-grid">
            <div>
              <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${formatDate(event.startDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">End Date:</span>
                <span class="detail-value">${formatDate(event.endDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${event.location}</span>
              </div>
            </div>
            <div>
              <div class="detail-row">
                <span class="detail-label">Age Group:</span>
                <span class="detail-value">${event.ageGroup}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price Range:</span>
                <span class="detail-value">$${minPrice}${minPrice !== maxPrice ? ` - $${maxPrice}` : ''}</span>
              </div>
            </div>
          </div>
          
          ${event.description ? `
            <div>
              <h3>Description</h3>
              <div class="description">${event.description}</div>
            </div>
          ` : ''}
          
          <div class="pricing-section">
            <div class="pricing-title">Pricing Options</div>
            ${event.pricingOptions.map(option => `
              <div class="pricing-item">
                <span>${option.name}</span>
                <span>$${option.price}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="contact-info">
            <h3>Registration Information</h3>
            <p><strong>Phone:</strong> (559) 305-7788</p>
            <p><strong>Email:</strong> registration@hume.org</p>
            <p><strong>Website:</strong> https://register.hume.org</p>
            <p><strong>Address:</strong> 64144 Hume Lake Road, Hume, CA 93628</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const shareEvent = () => {
    const eventUrl = `${window.location.origin}?event=${event.id}`;
    const shareText = `Check out this event at Hume Lake Christian Camps: ${event.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${event.title} - Hume Lake Christian Camps`,
        text: shareText,
        url: eventUrl,
      }).catch(() => {
        // Fallback to dialog if native sharing fails
        setShareDialogOpen(true);
      });
    } else {
      setShareDialogOpen(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Link copied successfully!",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied to clipboard",
        description: "Link copied successfully!",
      });
    }
  };

  const shareViaEmail = () => {
    const eventUrl = `${window.location.origin}?event=${event.id}`;
    const subject = encodeURIComponent(`${event.title} - Hume Lake Christian Camps`);
    const body = encodeURIComponent(`Hi! I wanted to share this amazing event with you:

${event.title}
Date: ${formatDate(event.startDate)}${event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ''}
Location: ${event.location}
Age Group: ${event.ageGroup}

${event.description ? event.description + '\n\n' : ''}For more details and to register, visit: ${eventUrl}

Hope to see you there!`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const eventUrl = `${window.location.origin}?event=${event.id}`;
    const message = encodeURIComponent(`Check out this event at Hume Lake: ${event.title} on ${formatDate(event.startDate)}. ${eventUrl}`);
    window.open(`sms:?body=${message}`);
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
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={shareEvent}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={printEvent}
                className="text-muted-foreground hover:text-foreground"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
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

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Link</label>
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}?event=${event.id}`}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${window.location.origin}?event=${event.id}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">Share via:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={shareViaEmail}
                    className="justify-start"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={shareViaSMS}
                    className="justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '?event=' + event.id)}`)}
                    className="justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this event: ${event.title}`)}&url=${encodeURIComponent(window.location.origin + '?event=' + event.id)}`)}
                    className="justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
