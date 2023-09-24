"use client";
/**
 * @file StoreModal.tsx
 * @description This file defines a modal for creating a new store.
 */

// Import necessary modules and components
import * as z from "zod";
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "./modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { redirect } from "next/navigation";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1), // Store name is a required string with a minimum length of 1 character
});

/**
 * StoreModal is a component that allows users to create a new store.
 * It displays a modal with a form for entering the store's name.
 */
export const StoreModal = () => {
  // Access the storeModal state and toast function
  const storeModal = useStoreModal();
  const { toast } = useToast();

  // State variable for tracking loading status
  const [loading, setLoading] = useState(false);

  // Initialize React Hook Form with the form schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Function to handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Set loading to true to indicate loading state
      setLoading(true);

      // Send a POST request to create a new store
      const response = await axios.post("/api/stores", data);

      // Display a success toast message
      toast({
        title: "Success",
        description: "Store created",
        variant: "default",
      });

      // Redirect the user to the newly created store's page
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      // Handle errors and display an error toast message
      console.error("[STORE_MODAL_ON_SUBMIT]", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      // Set loading back to false after the request is complete
      setLoading(false);
    }
  };

  // Render the StoreModal component with a form for creating a new store
  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
