"use client";
import * as z from "zod";
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal, ModalContent, ModalTitle, ModalDescription, ModalCloseButton, ModalActionGroup, ModalAction, Button } from "../ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/stores", data);
      toast({
        title: "Success",
        description: "Store created",
        variant: "default",
      });
      redirect(`/${response.data.id}`);
    } catch (error) {
      console.error("[STORE_MODAL_ON_SUBMIT]", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
      <ModalContent>
        <ModalTitle>Create Store</ModalTitle>
        <ModalDescription>
          Add a new store to manage products and categories
        </ModalDescription>
        <ModalCloseButton />
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
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
          <ModalActionGroup>
            <ModalAction onClick={storeModal.onClose}>Cancel</ModalAction>
            <Button disabled={loading} type="submit">
              Continue
            </Button>
          </ModalActionGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};
