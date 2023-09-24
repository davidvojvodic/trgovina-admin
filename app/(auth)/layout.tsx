// Define the AuthLayout component
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Render a div element with CSS classes to center its content
    <div className="flex items-center justify-center h-full">
      {children} {/* Render the children components within the div */}
    </div>
  );
}
