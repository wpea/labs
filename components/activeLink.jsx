import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveLink({ children, href }) {
  const router = useRouter();
  return (
    <Link href={href}>
      <div
        className={`flex justify-between border-b p-4 hover:bg-gray-100 cursor-pointer ${
          router.pathname === href ? "bg-gray-100" : null
        }`}
      >
        {children}
      </div>
    </Link>
  );
}
