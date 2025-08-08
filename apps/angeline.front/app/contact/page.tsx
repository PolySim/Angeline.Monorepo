import ContactImg from "@/public/contact.jpg";
import Image from "next/image";
import ContactForm from "./contactForm";

export const metadata = {
  title: "Contact",
};

export default function AboutPage() {
  return (
    <main className="w-screen flex items-center flex-col">
      <div className="w-9/12 max-w-7xl">
        <Image
          src={ContactImg}
          width={1280}
          height={640}
          alt="Landscape"
          className="w-full h-auto"
        />
      </div>
      <div className="w-9/12 flex flex-col items-center">
        <h2 className="mt-8 font-bold text-3xl">Contact</h2>
        <p className="w-11/12 md:w-8/12 text-sm font-light text-start md:text-center text-gray-700 mt-4">
          Basée à Rennes, je suis disponible sur toute la France. I&apos;m
          available for local projects as well as potential employment
          opportunities. Use the form to inquire about rates and availability,
          or just to say hi.
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
