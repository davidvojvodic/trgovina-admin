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

// Define the schema for form validation using Zod.
const formSchema = z.object({
  name: z.string().min(1),
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

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize the form with React Hook Form and Zod resolver.
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Function to handle form submission.
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      // Send a PATCH request to update store settings.
      await axios.patch(`/api/stores/${params.storeId}`, data);

      // Refresh the page.
      router.refresh();

      // Show a success toast message.
      toast({
        title: "Uspešno",
        description: "Trgovina posodobljena",
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

  // Function to handle store deletion.
  const onDelete = async () => {
    try {
      setLoading(true);
      // Send a DELETE request to delete the store.
      await axios.delete(`/api/stores/${params.storeId}`);

      // Refresh and navigate to the homepage.
      router.refresh();
      router.push("/");

      // Show a success toast message.
      toast({
        title: "Uspešno",
        description: "Trgovina je izbrisana",
        variant: "default",
      });
    } catch (error) {
      // Show an error toast message if deletion fails.
      toast({
        title: "Error",
        description:
          "Prepričajte se, da ste najprej odstranili vse izdelke in kategorije.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Alert modal for confirming store deletion */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        {/* Heading for the settings form */}
        <Heading
          title="Nastavitve"
          description="Upravljajte nastavitve trgovine"
        />
        {/* Delete button for store */}
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      {/* Separator */}
      <Separator />
      {/* Settings form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Store name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime trgovine</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ime trgovine"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Save changes button */}
          <Button disabled={loading} className="ml-auto" type="submit">
            Shrani spremembe
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
