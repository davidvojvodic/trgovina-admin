"use client";

import * as z from "zod";
import { Size } from "@prisma/client";
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

// Define the schema for form validation using Zod.
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

const SizeForm = ({ initialData }: SizeFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine whether the form is for editing or creating a size.
  const title = initialData ? "Uredi velikost" : "Ustvari velikost";
  const description = initialData
    ? "Uredi spremembe velikost"
    : "Dodaj novo velikost";
  const toastMessage = initialData
    ? "Velikost posodobljena."
    : "Velikost ustvarjena.";
  const action = initialData ? "Shrani spremembe" : "Ustvari";

  // Initialize the form with React Hook Form and Zod resolver.
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  // Function to handle form submission.
  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // Send a PATCH request to update the size.
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        // Send a POST request to create a new size.
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      // Refresh the page and navigate to the sizes page.
      router.refresh();
      router.push(`/${params.storeId}/sizes`);

      // Show a success toast message.
      toast({
        title: "Uspešno",
        description: toastMessage,
        variant: "default",
      });
    } catch (error) {
      // Show an error toast message.
      toast({
        title: "Error",
        description: "Nekaj je šlo narobe",
        variant: "destructive",
      });
      console.log("[SETTINGS_FORM_ON_SUBMIT]", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle size deletion.
  const onDelete = async () => {
    try {
      setLoading(true);
      // Send a DELETE request to delete the size.
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

      // Refresh and navigate to the sizes page.
      router.refresh();
      router.push(`/${params.storeId}/sizes`);

      // Show a success toast message.
      toast({
        title: "Uspešno",
        description: "Velikost izbrisana",
        variant: "default",
      });
    } catch (error) {
      // Show an error toast message if deletion fails.
      toast({
        title: "Error",
        description:
          "Prepričajte se, da ste najprej odstranili vse izdelke, ki uporabljajo to velikost.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Alert modal for confirming size deletion */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        {/* Heading for the size form */}
        <Heading title={title} description={description} />
        {/* Delete button for size (only displayed when editing) */}
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
      {/* Form for creating/editing sizes */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Form field for size name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ime velikosti"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form field for size value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vrednost</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vrednost velikosti"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Save changes or Create button */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
