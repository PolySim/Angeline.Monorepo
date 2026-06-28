"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-4">
      <div className="flex justify-end w-11/12 max-w-6xl mx-auto pb-2">
        <Button asChild className="w-fit">
          <SignOutButton>Déconnexion</SignOutButton>
        </Button>
      </div>
      {children}
    </div>
  );
}
