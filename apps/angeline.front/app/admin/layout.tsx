import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import AdminShell from "./adminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "Administration",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AdminShell>{children}</AdminShell>
    </ClerkProvider>
  );
}
