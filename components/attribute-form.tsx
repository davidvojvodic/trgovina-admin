"use client";
import { Attribute } from "@prisma/client";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AlertModal from "./modals/alert-modal";
import axios from "axios";
import Heading from "./heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

type AttributeFormValues = z.infer<typeof formSchema>;

interface AttributeFormProps {
  initialData: Attribute | null;
}

const AttributeForm = ({ initialData }: AttributeFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit the attribute" : "Create attribute";
  const description = initialData
    ? "Edit attribute changes"
    : "Add a new attribute";
  const toastMessage = initialData
    ? "Attribute updated."
    : "Attribute created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { key: "", value: "" },
  });

  // Handle form submission
  const onSubmit = async (data: AttributeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/attributes/${params.attributeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/attributes`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/attributes`);
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
      console.log("[ATTRIBUTES_FORM_ON_SUBMIT]", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle billboard deletion
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/attributes/${params.attributeId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/attributes`);

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
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            onClick={() => setOpen(true)}
            variant="destructive"
            size="icon"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full flex flex-col"
        >
          <div className="flex flex-wrap flex-1 gap-4">
            <FormField
              control={form.control}
              name={"key"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="Key" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"value"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="Value" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AttributeForm;
