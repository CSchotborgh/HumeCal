import { Phone, Mail, MapPin, Clock, Users, ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ContactPage() {
  const locations = [
    {
      name: "Hume Lake",
      description: "Main Camp Location",
      phone: "(559) 305-7770",
      registration: "(559) 305-7788",
      fax: "(559) 305-7687",
      address: {
        line1: "64144 Hume Lake Rd.",
        line2: "Hume, CA 93628"
      },
      businessOffice: {
        line1: "5545 E. Hedges",
        line2: "Fresno, CA 93727"
      }
    },
    {
      name: "Hume SoCal",
      description: "Southern California Location",
      phone: "(559) 305-7770",
      address: {
        line1: "32355 Green Valley Lake Rd",
        line2: "Green Valley Lake, CA 92341"
      },
      mailing: {
        line1: "P.O. Box 8560",
        line2: "Green Valley Lake, CA 92341"
      }
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "(559) 305-7770",
      secondary: "General Information & Welcome Center",
      action: "tel:5593057770"
    },
    {
      icon: Phone,
      title: "Registration",
      primary: "(559) 305-7788",
      secondary: "Direct Registration Line",
      action: "tel:5593057788"
    },
    {
      icon: Mail,
      title: "Email Registration",
      primary: "registration@hume.org",
      secondary: "For registration questions & check payments",
      action: "mailto:registration@hume.org"
    },
    {
      icon: Users,
      title: "General Registration",
      primary: "1-800-965-4863",
      secondary: "Toll-free registration support",
      action: "tel:18009654863"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Contact Hume Lake Christian Camps</h1>
            <p className="text-lg text-muted-foreground">
              Ready to register or have questions? We're here to help you plan your camp experience.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Contact Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{method.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-semibold text-primary text-left justify-start"
                        onClick={() => window.open(method.action, '_self')}
                      >
                        {method.primary}
                      </Button>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {method.secondary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Camp Locations */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Camp Locations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{location.name}</span>
                  </CardTitle>
                  <p className="text-muted-foreground">{location.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone Numbers */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Phone Numbers</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Main:</span>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-medium text-primary"
                          onClick={() => window.open(`tel:${location.phone.replace(/\D/g, '')}`, '_self')}
                        >
                          {location.phone}
                        </Button>
                      </div>
                      {location.registration && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Registration:</span>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-primary"
                            onClick={() => window.open(`tel:${location.registration.replace(/\D/g, '')}`, '_self')}
                          >
                            {location.registration}
                          </Button>
                        </div>
                      )}
                      {location.fax && (
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 text-center text-xs text-muted-foreground">FAX</span>
                          <span className="text-muted-foreground">Fax:</span>
                          <span className="font-medium">{location.fax}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Physical Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Hume Lake Christian Camps</p>
                      <p>{location.address.line1}</p>
                      <p>{location.address.line2}</p>
                    </div>
                  </div>

                  {location.mailing && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Mailing Address (USPS only)</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{location.mailing.line1}</p>
                        <p>{location.mailing.line2}</p>
                      </div>
                    </div>
                  )}

                  {location.businessOffice && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Business Office</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Hume Lake Business Office</p>
                        <p>{location.businessOffice.line1}</p>
                        <p>{location.businessOffice.line2}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Registration Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Registration Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Phone Registration</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Call our registration team for immediate assistance with camp enrollment:
                </p>
                <div className="space-y-1">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-primary"
                    onClick={() => window.open('tel:5593057788', '_self')}
                  >
                    (559) 305-7788
                  </Button>
                  <p className="text-xs text-muted-foreground">Direct Registration Line</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Email Registration</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Send registration questions or check payment notifications:
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => window.open('mailto:registration@hume.org', '_self')}
                >
                  registration@hume.org
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-2">Payment Information</h4>
              <p className="text-sm text-muted-foreground">
                Mail registration checks to: <strong>64144 Hume Lake Road, Hume, CA 93628</strong> (Attention: Registration)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Online Registration</h4>
                <p className="text-muted-foreground mb-2">
                  Access your registration dashboard online
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://hume.org/registration-dashboard/', '_blank')}
                >
                  Registration Dashboard
                </Button>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Lost & Found</h4>
                <p className="text-muted-foreground mb-2">
                  Looking for items left at camp?
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://hume.org/lost-and-found/', '_blank')}
                >
                  Lost & Found
                </Button>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Main Website</h4>
                <p className="text-muted-foreground mb-2">
                  Visit our main website for more information
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://hume.org/', '_blank')}
                >
                  hume.org
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}