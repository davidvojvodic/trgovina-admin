"use client";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";
import { useToast } from "./ui/use-toast";
import AlertModal from "./modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { z } from "zod";
import { Heading } from "./heading";
import { Textarea } from "./ui/textarea";
import { Billboard, Category } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  metaDescription: z.string().optional(),
  parentId: z.string().optional(),
  billboardId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: Category | null;
  billboards: Billboard[];
  allCategories: Category[];
  onSuccess?: () => void;
  onDelete?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
  allCategories,
  onSuccess,
  onDelete,
}) => {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData
    ? "Change category information."
    : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          metaDescription: initialData.metaDescription,
          parentId: initialData.parentId,
          billboardId: initialData.billboardId,
        }
      : {
          name: "",
          slug: "",
          description: "",
          metaDescription: "",
          parentId: "",
          billboardId: "",
        },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);

    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      toast.success(toastMessage);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("[SETTINGS_FORM_ON_SUBMIT]", error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteCategory = async () => {
    setLoading(true);

    try {
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      router.refresh();
      toast.success("The category has been deleted.");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast.error(
        "Make sure you remove all products using this category first."
      );
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      {deleteOpen && (
        <AlertModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={onDeleteCategory}
          loading={loading}
        />
      )}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="SEO-friendly URL slug"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
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
                          placeholder="Select billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                          disabled={loading}
                        >
                          {billboard.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Category description"
                      rows={10}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Meta description"
                      rows={10}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {allCategories && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allCategories
                          .filter((cat) => cat.id !== initialData?.id)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
