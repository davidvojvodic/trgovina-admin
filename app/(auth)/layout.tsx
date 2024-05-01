import React, { ReactNode } from 'react';

// Define the CenteredLayout component
const CenteredLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      {/* Render a div element with CSS classes to center its content */}
      <div className="flex items-center justify-center h-full">{children}</div>
    </React.Fragment>
  );
};

export default CenteredLayout;
