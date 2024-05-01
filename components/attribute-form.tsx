"use client";
import { Attribute } from "@prisma/client";
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
  initialData?: Attribute;
  onSuccess?(): void;
  onDelete?(): void;
}

const AttributeForm = ({
  initialData,
  onSuccess,
  onDelete,
}: AttributeFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit the attribute" : "Create attribute";
  const description = initialData
    ? "Edit attribute changes"

