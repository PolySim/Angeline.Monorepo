import type { Metadata } from "next";
import Image from "next/image";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import ContactImg from "@/public/contact.jpg";
import ContactForm from "./contactForm";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contactez Angeline Desdevises, photographe basée dans les Hautes-Pyrénées et mobile dans le sud-ouest pour des commandes presse ou corporate.",
  path: "/contact",
  images: [
    {
      url: absoluteUrl("/contact.jpg"),
      alt: "Contact Angeline Desdevises",
    },
  ],
});

export default function AboutPage() {
  return (
    <main className="w-screen flex items-center flex-col">
      <div className="w-9/12 max-w-7xl">
        <Image
          src={ContactImg}
          width={1280}
          height={640}
          alt="Paysage photographié par Angeline Desdevises"
          sizes="(max-width: 1536px) 75vw, 1152px"
          className="w-full h-auto max-h-[400px] object-contain"
        />
      </div>
      <div className="w-9/12 flex flex-col items-center">
        <h1 className="mt-8 font-bold text-3xl">Contact</h1>
        <p className="w-11/12 md:w-8/12 text-sm font-light text-start md:text-center text-gray-700 mt-4">
          Actuellement basée dans les Hautes-Pyrénées, je suis mobile dans tout
          le sud-ouest pour des commandes presses ou corporates.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-10/12 mt-5 mb-0 my-auto text-gray-700">
        <div className="w-10/12 md:w-4/12 mr-0 md:mr-2">
          <h5 className="mt-6 text-sm">Email</h5>
          <p className="mt-2 break-words font-light">
            angeline.desdevises@gmail.com
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
