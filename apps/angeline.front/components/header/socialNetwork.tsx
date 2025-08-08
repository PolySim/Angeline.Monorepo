import { cn } from "@/lib/utils";
import Link from "next/link";

const SocialNetwork = ({ isHeader }: { isHeader?: boolean }) => {
  return (
    <div
      className={cn(`flex justify-center items-center gap-8 mt-10`, {
        "hidden md:flex mb-10": isHeader,
      })}
    >
      <Link
        href="https://www.instagram.com/angeline_desdevises/?hl=fr"
        target="_blank"
        className="hover:text-primary hover:scale-110 transition duration-200"
      >
        <svg
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
        >
          <path
            d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M17.5 6.51L17.51 6.49889"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <Link
        href="https://www.facebook.com/angeline.desdevises"
        target="_blank"
        className="hover:text-primary hover:scale-110 transition duration-200"
      >
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path d="m32 16c0-8.839-7.167-16-16-16-8.839 0-16 7.161-16 16 0 7.984 5.849 14.604 13.5 15.803v-11.177h-4.063v-4.625h4.063v-3.527c0-4.009 2.385-6.223 6.041-6.223 1.751 0 3.584.312 3.584.312v3.937h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-.713 4.625h-3.724v11.177c7.645-1.199 13.5-7.819 13.5-15.803z" />
        </svg>
      </Link>
      <Link
        href="https://www.linkedin.com/in/ang%C3%A9line-desdevises-942436199/?originalSubdomain=fr"
        target="_blank"
        className="hover:text-primary hover:scale-110 transition duration-200"
      >
        <svg
          viewBox="0 0 448 512"
          className="w-7 h-7"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m100.28 448h-92.88v-299.1h92.88zm-46.49-339.9c-29.7 0-53.79-24.6-53.79-54.3a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zm394.11 339.9h-92.68v-145.6c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7v148.1h-92.78v-299.1h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3v164.3z" />
        </svg>
      </Link>
      <p className="text-gray-600 text-sm font-medium">Follow me</p>
    </div>
  );
};

export default SocialNetwork;
