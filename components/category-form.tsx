"use client";
/**
 * @file CategoryForm.tsx
 * @description This file defines a form component for creating or editing a category.
 */

import * as z from "zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import AlertModal from "./modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "./image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Billboard, Category } from "@prisma/client";
import Heading from "./heading";
import { Trash } from "lucide-react";
import { useState } from "react";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1), // Category name is a required string with a minimum length of 1 character
  billboardId: z.string().min(1), // Billboard ID is a required string with a minimum length of 1 character
});

// Define the type for category form values
type CategoryFormValues = z.infer<typeof formSchema>;

// Define props for the CategoryForm component
interface CategoryFormProps {
  initialData: Category | null; // Initial category data (null for creating new category)
  billboards: Billboard[]; // List of available billboards for selection
}

/**
 * CategoryForm is a component that allows users to create or edit a category.
 * It displays a form with fields for entering the category's name and selecting a billboard.
 */
const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  // Access the toast function, router, and origin
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  // State variables for handling modal and loading states
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine whether the form is used for editing or creating a category
  const title = initialData ? "Uredi kategorijo" : "Ustvari kategorijo";
  const description = initialData
    ? "Spremenite podatke o kategorijah."
    : "Dodaj novo kategorijo";
  const toastMessage = initialData
    ? "Kategorijo posodobljena."
    : "Kategorija ustvarjena.";
  const action = initialData ? "Shrani spremembe" : "Ustvari";

  // Initialize React Hook Form with the form schema and default values
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", billboardId: "" },
  });

  // Function to handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      // Refresh the router and navigate to the categories page
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      // Display a success toast message
      toast({
        title: "Uspešno",
        description: toastMessage,
        variant: "default",
      });
    } catch (error) {
      // Handle errors and display an error toast message
      toast({
        title: "Error",
        description: "Nekaj je šlo narobe",
        variant: "destructive",
      });
      console.error("[SETTINGS_FORM_ON_SUBMIT]", error);
    } finally {
      // Set loading back to false after the request is complete
      setLoading(false);
    }
  };

  // Function to handle category deletion
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      // Refresh the router and navigate to the categories page
      router.refresh();
      router.push(`/${params.storeId}/categories`);

      // Display a success toast message
      toast({
        title: "Uspešno",
        description: "Kategorija je izbrisana",
        variant: "default",
      });
    } catch (error) {
      // Display an error toast message if deletion fails
      toast({
        title: "Error",
        description:
          "Prepričajte se, da ste najprej odstranili vse izdelke, ki uporabljajo to kategorijo.",
        variant: "destructive",
      });
    } finally {
      // Set loading back to false and close the modal
      setLoading(false);
      setOpen(false);
    }
  };

  // Render the CategoryForm component with the form fields
  return (
    <>
      {/* Alert modal for category deletion */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      {/* Header with title and optional delete button */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Separator */}
      <Separator />
      {/* Form with fields for name and billboard selection */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Category name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ime kategorije"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Billboard selection field */}
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oglasni pano</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Izberi oglasni pano"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Map through billboards and create select options */}
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                          disabled={loading}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Submit button */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
