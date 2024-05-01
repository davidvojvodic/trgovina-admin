"use client";

import * as z from "zod";
import { Store } from "@prisma/client";
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
  storeImage: z.string().nullable().optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store;
}

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with React Hook Form and Zod resolver.
  const formMethods = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { handleSubmit, register, setValue, watch, formState } = formMethods;
  const { errors } = formState;

  // Function to handle form submission.
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);

      // Send a PATCH request to update store settings.
      await axios.patch(`/api/stores/${params.storeId}`, data);

      // Refresh the page.
      router.refresh();

      // Show a success toast message.
      toast({
        title: "Success",
        description: "Store updated.",
        variant: "default",
      });
    } catch (error) {
      // Show an error toast message.
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
      console.log("[SETTINGS_FORM_ON_SUBMIT]", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle store deletion.
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Send a DELETE request to delete the store.
      await axios.delete(`/api/stores/${params.storeId}`);

      // Refresh and navigate to the homepage.
      router.refresh();
      router.push("/");

      // Show a success toast message.
      toast({
        title: "Success",
        description: "The store has been deleted.",
        variant: "default",
      });
    } catch (error) {
      // Show an error toast message if deletion fails.
      toast({
        title: "Error",
        description: "Make sure you remove all products and categories first.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Alert modal for confirming store deletion */}
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        {/* Heading for the settings form */}
        <Heading title="Settings" description="Manage store settings" />
        {/* Delete button for store */}
        <Button
          disabled={isLoading}
          variant="destructive"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      {/* Separator */}
      <Separator />
      {/* Settings form */}
      <Form {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 w-full "
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-8">
            {/* Store name field */}
            <FormField
              control={formMethods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...register("name")}
                    />
                  </FormControl>
                  <FormMessage error={errors.name?.message} />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="storeImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isLoading}
                      onChange={(url) => setValue("storeImage", url)}
                      onRemove={() => setValue("storeImage", "")}
                    />
                  </FormControl>
                  <FormMessage error={errors.storeImage?.message} />
                </FormItem>
              )}
            />
          </div>
          {/* Save changes button */}
          <Button disabled={isLoading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      {/* Separator */}
      <Separator />
      {/* Display the API URL */}
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
