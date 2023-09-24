// Import necessary functions and types from external libraries
import { type ClassValue, clsx } from "clsx"; // Import ClassValue type and clsx function from clsx library
import { twMerge } from "tailwind-merge"; // Import twMerge function from tailwind-merge library

// Define a function called `cn` (short for classNames) that takes any number of class values as input
export function cn(...inputs: ClassValue[]) {
  // Step 1: Merge and format the input class values using clsx and twMerge
  return twMerge(clsx(inputs)); // Merge and format the class values using clsx and twMerge and return the result
}

// Create a new instance of Intl.NumberFormat for currency formatting
export const formatter = new Intl.NumberFormat("en-US", {
  // Step 2: Define formatting options for currency display
  style: "currency", // Use currency style formatting
  currency: "EUR", // Display amounts in Euros (European currency)
});
