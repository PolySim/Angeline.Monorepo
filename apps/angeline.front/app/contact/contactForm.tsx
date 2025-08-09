"use client";

import { sendMail } from "@/action/mail.action";
import { FormArea } from "@/components/form/formArea";
import { FormInput } from "@/components/form/formInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  email: z.email({ message: "L'email est invalide" }),
  message: z
    .string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" }),
});

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const response = await sendMail(data);
      if (!response.success) {
        toast.error("Une erreur est survenue lors de l'envoi du message");
        return;
      }
      form.reset();
      toast.success("Message envoyé avec succès", {
        description: "Nous vous répondrons dans les plus brefs délais",
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-10/12 md:w-7/12 h-max mt-6 md:mt-0"
      >
        <FormInput
          className="w-full h-12 border border-gray-700 text-gray-700 p-5 text-sm outline-hidden rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="name"
          placeholder="Nom"
          disabled={isPending}
        />
        <FormInput
          className="w-full h-12 border border-gray-700 border-t-0 text-gray-700 p-5 text-sm outline-hidden rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="email"
          placeholder="Email"
          disabled={isPending}
        />
        <FormArea
          className="w-full h-36 border border-gray-700 border-t-0 text-gray-700 p-5 text-sm outline-hidden break-words resize-y rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="message"
          placeholder="Message"
          disabled={isPending}
        />
        <Button
          type="submit"
          className="w-full rounded-none  h-auto md:h-12 bg-primary md:bg-transparent md:hover:bg-primary transition text-white md:text-gray-700 text-md md:text-sm md:hover:text-white font-bold md:border md:border-primary mt-6 p-4 outline-hidden cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            "Envoyer"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
