"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardForm component for creating or editing billboards
//    - Uses zod for form validation and react-hook-form for form handling
//    - Handles form submission, deletion, and image upload

// Import necessary modules and components

import * as z from "zod";
import { Billboard, Store } from "@prisma/client";
import Heading from "./heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "./modals/alert-modal";
import { ApiAlert } from "./api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "./image-upload";
import { Switch } from "./ui/switch";

// Define the form schema for billboard data validation
const formSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  imageUrl: z.string().min(1),
  tabletImageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional(),
  isActive: z.boolean(),
  displayOrder: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>;

// Define the BillboardFormProps interface
interface BillboardFormProps {
  initialData: Billboard | null;
}

// Define the BillboardForm component for creating or editing billboards
const BillboardForm = ({ initialData }: BillboardFormProps) => {
  // Initialize form handling and toast notifications
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  // State variables for modal and loading state
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine form title, description, action button text, and toast message
  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData
    ? "Edit existing billboard"
    : "Create a new billboard";
  const toastMessage = initialData ? "Billboard edited." : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  // Initialize react-hook-form with the form schema and initial values
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      name: initialData?.name ?? "",
      isActive: initialData?.isActive ?? true, // Default to true for new billboards
      displayOrder: initialData?.displayOrder ?? undefined, // No default value, it's optional
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined, // Convert to Date object or null
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined, // Convert to Date object or null
      tabletImageUrl: initialData?.tabletImageUrl ?? "",
      mobileImageUrl: initialData?.mobileImageUrl ?? "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Success",
        description: toastMessage,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.log("[SETTINGS_FORM_ON_SUBMIT]", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle billboard deletion
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/billboards`);

      toast({
        title: "Success",
        description: "Billboard deleted.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Make sure you remove all categories that use this billboard first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Alert modal for confirming deletion */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        {/* Form title and delete button (if editing) */}
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
      {/* Form separator */}
      <Separator />
      {/* Billboard form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Form field for uploading an image */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Activen</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Grid for label input */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
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

export default BillboardForm;
