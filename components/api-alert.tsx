"use client";
/**
 * @file ApiAlert.tsx
 * @description This file defines an alert component for displaying API information.
 */

import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge, BadgeProps } from "./ui/badge";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

// Define props for the ApiAlert component
interface ApiAlertProps {
  title: string; // Title for the API alert
  description: string; // Description for the API alert
  variant: "public" | "admin"; // Variant of the API alert ("public" or "admin")
}

// Define text mapping for variants
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

// Define variant mapping for badges
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

/**
 * ApiAlert is a component for displaying API information as an alert.
 * It includes the API title, variant badge, and an option to copy the API route.
 */
export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const { toast } = useToast();

  // Function to handle copying the API route to the clipboard
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    // Display a toast message when the API route is copied
    toast({
      title: "Copied",
      description: "API Route is copied to the clipboard.",
    });
  };

  // Render the ApiAlert component with API information and copy button
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm font-semibold">
          {description}
        </code>
        {/* Button to copy the API route */}
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
