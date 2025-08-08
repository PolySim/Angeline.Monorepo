import Link from "next/link";
import SocialNetwork from "../header/socialNetwork";

const Footer = () => {
  return (
    <>
      <SocialNetwork />
      <footer className="flex flex-col justify-center items-center w-full pb-20 mt-5 text-xs font-light text-gray-700">
        <p>Reproduction interdite - Copyright Angeline Desdevises</p>
        <p className="mt-2">
          Développé par{" "}
          <Link
            href="https://www.simondesdevises.com"
            target="_blank"
            className="underline"
          >
            Simon Desdevises
          </Link>
        </p>
      </footer>
    </>
  );
};

export default Footer;
