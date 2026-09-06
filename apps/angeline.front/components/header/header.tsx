import Link from "next/link";
import MenuContainer from "./menuContainer";
import SocialNetwork from "./socialNetwork";
import { getCategoriesActive } from "@/action/category.action";

const Header = async () => {
  const categories = await getCategoriesActive();
  return (
    <>
      <div className="p-6 pb-2 md:pb-6">
        <div className="flex justify-between md:justify-center h-fit">
          <Link href="/">
            <div className="w-fit font-helvetica no-underline font-bold text-2xl md:text-4xl mt-0 md:mt-8 text-black hover:text-primary transition cursor-pointer">
              Angéline Desdevises
            </div>
          </Link>
        </div>
        <div className="flex justify-between md:justify-center h-fit mt-2 text-sm font-semibold">
          <p>Photographe</p>
        </div>
      </div>
      <MenuContainer categories={categories} />
      <SocialNetwork isHeader />
    </>
  );
};

export default Header;
