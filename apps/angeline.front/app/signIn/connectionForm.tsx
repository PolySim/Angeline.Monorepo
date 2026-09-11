"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Login: z.string().trim().min(1, "Saisissez votre identifiant."),
  Password: z.string().min(1, "Saisissez votre mot de passe."),
});

export default function ConnectionForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [connected, setConnected] = useState(false);
  const submitting = useRef(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { Login: "", Password: "" },
  });
  const pending = form.formState.isSubmitting;
  const disabled = pending || connected || !isLoaded;
  const error = form.formState.errors.root?.message;

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isLoaded || !signIn || !setActive || submitting.current || connected)
      return;
    submitting.current = true;
    form.clearErrors("root");
    try {
      const result = await signIn.create({
        identifier: data.Login,
        password: data.Password,
      });
      if (result.status !== "complete" || !result.createdSessionId) {
        form.setError("root", {
          message:
            "Ce compte nécessite une vérification supplémentaire que ce formulaire ne prend pas en charge. Contactez la personne qui gère les accès.",
        });
        return;
      }
      await setActive({ session: result.createdSessionId });
      setConnected(true);
      router.replace("/admin");
    } catch (err) {
      const message = isClerkAPIResponseError(err)
        ? err.status === 429 ||
          err.errors.some((item) => item.code === "user_locked")
          ? "La connexion est temporairement bloquée. Patientez avant de réessayer."
          : "Connexion impossible. Vérifiez votre identifiant et votre mot de passe, puis réessayez."
        : "Le service de connexion est indisponible. Vérifiez votre connexion et réessayez.";
      form.setError("root", { message });
    } finally {
      submitting.current = false;
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => form.clearErrors("root")}
        className="space-y-5"
        aria-busy={pending || !isLoaded}
      >
        <FormField
          control={form.control}
          name="Login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifiant</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={disabled}
                    className="pr-12"
                    onKeyDown={(event) =>
                      setCapsLock(event.getModifierState("CapsLock"))
                    }
                    onKeyUp={(event) =>
                      setCapsLock(event.getModifierState("CapsLock"))
                    }
                    onBlur={() => {
                      field.onBlur();
                      setCapsLock(false);
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 text-muted-foreground"
                  disabled={disabled}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {capsLock && (
          <p role="status" className="text-sm text-amber-800">
            La touche Verr. Maj. est activée.
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
          >
            <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={disabled}>
          {pending || !isLoaded ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="size-4" aria-hidden="true" />
          )}
          {!isLoaded
            ? "Chargement du formulaire…"
            : pending
              ? "Connexion en cours…"
              : connected
                ? "Connexion réussie"
                : "Se connecter"}
        </Button>
        <p
          role="status"
          className="text-center text-xs leading-5 text-muted-foreground"
        >
          {connected
            ? "Ouverture de l’administration…"
            : "Accès réservé à l’administration du portfolio."}
        </p>
      </form>
    </Form>
  );
}
