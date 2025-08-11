import React, { useState } from "react";
import { Share2, Copy, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareButton({ 
  title, 
  description, 
  url = window.location.href, 
  variant = "ghost", 
  size = "sm",
  className = ""
}: ShareButtonProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const shareGeneral = () => {
    const shareText = description || `Check out: ${title}`;
    
    if (navigator.share) {
      navigator.share({
        title,
        text: shareText,
        url,
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
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description || `Check out: ${title}`}\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`${title}: ${url}`);
    window.open(`sms:?body=${message}`);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={shareGeneral}
        className={`text-muted-foreground hover:text-foreground ${className}`}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <div className="flex space-x-2">
                <Input
                  readOnly
                  value={url}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(url)}
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
                  onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
                  className="justify-start"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)}
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
    </>
  );
}