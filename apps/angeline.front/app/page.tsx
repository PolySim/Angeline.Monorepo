import HomeImg from "@/public/home.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen max-w-6xl mx-auto mt-5 md:mt-10">
      <Image src={HomeImg} alt="Home page image" width={1920} height={1080} />
    </div>
  );
}
