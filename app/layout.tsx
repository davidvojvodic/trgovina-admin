// Import global CSS styles
import "./globals.css";

// Import necessary modules and components
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

// Initialize the Inter font with a subset of "latin" characters
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the page
export const metadata: Metadata = {
  title: "Admin Trgovina", // Set the title of the page
  description: "Admin Trgovina", // Set the description of the page
};

// Define the default layout component for the application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrap the content with ClerkProvider for user authentication
    <ClerkProvider>
      <html lang="en">
        {" "}
        {/* Specify the language of the HTML document */}
        <body className={inter.className}>
          {" "}
          {/* Apply the Inter font to the body */}
          <ModalProvider /> {/* Render the modal provider component */}
          {children} {/* Render the children components (page content) */}
          <Toaster /> {/* Render the toaster component */}
        </body>
      </html>
    </ClerkProvider>
  );
}
