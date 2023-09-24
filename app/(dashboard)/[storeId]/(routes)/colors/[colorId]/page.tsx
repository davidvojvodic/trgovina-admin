// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the ColorPage component
//    - Takes params as a prop, representing the colorId
//    - Fetches color data based on colorId and displays a form to edit it

// Import necessary modules and components
import ColorForm from "@/components/color-form";
import prismadb from "@/lib/prismadb";

// Define the ColorPage component
const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  // Fetch color data based on the provided colorId
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render a form with initial data for editing the color */}
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
