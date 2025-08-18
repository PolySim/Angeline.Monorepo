import { config } from "@/config/config";

export const metadata = {
  title: "A propos",
  alternates: {
    canonical: `${config.APP_URL}/apropos`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
