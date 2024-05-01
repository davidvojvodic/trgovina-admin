import { useEffect, useState } from "react";

// Custom hook to obtain the origin (base URL) of the current web application
export const useOrigin = () => {
  // Initialize a state variable 'origin' to store the base URL
  const [origin, setOrigin] = useState("");

  // Use the useEffect hook to set 'origin' when the component is mounted
  useEffect(() => {
    setOrigin(
      typeof window !== "undefined"
        ? window.location.origin
        : "Undefined environment (probably server-side rendering)"
    );
  }, []);

  // Return the 'origin' state variable
  return origin;
};
