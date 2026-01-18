import HomeImg from "@/public/home.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen max-w-6xl mx-auto mt-5 md:mt-10">
      <h1 className="sr-only">
        Angeline Desdevises - Photographe de guerre et documentaire
      </h1>
      <Image
        src={HomeImg}
        alt="Angeline Desdevises - Photographie de guerre et reportage au Moyen-Orient"
        width={1920}
        height={1080}
        priority
      />
    </div>
  );
}
