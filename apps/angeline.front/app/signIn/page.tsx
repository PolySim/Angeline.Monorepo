import ConnectionForm from "./connectionForm";

export default function SignInPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          Connexion à l’administration
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Connectez-vous pour gérer vos reportages, vos images et vos
          biographies.
        </p>
      </div>
      <ConnectionForm />
    </>
  );
}
