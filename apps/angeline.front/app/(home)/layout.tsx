import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getBiography } from "@/action/information.action";
import StructuredData from "@/components/seo/StructuredData";
import { Lang } from "@repo/types/entities";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const biography = await getBiography();
  const description = biography?.find((item) => item.lang === Lang.FR)?.content;
  return (
    <>
      <StructuredData type="person" description={description} />
      <StructuredData type="website" />
      <Header />
      {children}
      <Footer />
    </>
  );
}
