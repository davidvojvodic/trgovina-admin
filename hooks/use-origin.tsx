import { useEffect, useState } from "react";

// Custom hook to obtain the origin (base URL) of the current web application
export const useOrigin = () => {
  // Step 1: Initialize a state variable 'mounted' to track if the component is mounted.
  const [mounted, setMounted] = useState(false);

  // Step 2: Obtain the origin (base URL) of the current web application.
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  // Step 3: Use the useEffect hook to set 'mounted' to true when the component is mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 4: If the component is not yet mounted, return an empty string.
  if (!mounted) {
    return "";
  }

  // Step 5: Once the component is mounted, return the obtained 'origin'.
  return origin;
};
