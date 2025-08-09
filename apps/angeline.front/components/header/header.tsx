import Link from "next/link";
import MenuContainer from "./menuContainer";
import SocialNetwork from "./socialNetwork";

const Header = () => {
  return (
    <>
      <div className="flex justify-between md:justify-center p-6 h-fit">
        <Link href="/">
          <h1 className="w-fit font-helvetica no-underline font-bold text-2xl md:text-4xl mt-0 md:mt-8 text-black hover:text-primary transition cursor-pointer">
            Angeline Desdevises
          </h1>
        </Link>
      </div>
      <MenuContainer />
      <SocialNetwork isHeader />
    </>
  );
};

export default Header;
