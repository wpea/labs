import { useRouter } from "next/router";
import { useAuth2 } from "./../lib/hooks/useAuth2";

export default function Header() {
  const { logout } = useAuth2();
  const router = useRouter();
  return (
    <div className="grid grid-cols-2">
      <div
        onClick={() => {
          router.push("/home");
        }}
        className="font-bold cursor-pointer"
      >
        <img
          className="w-36"
          src="https://res.cloudinary.com/dtdavvoo3/image/upload/v1664449278/labs/wplabs_w17n4z.svg"
          alt="wplabs"
        />
      </div>
      <div className="text-xs self-center justify-self-end">
        Innovating the family office.
      </div>
      <div
        onClick={logout}
        className="col-span-2 justify-self-end text-xs uppercase font-bold text-red-500 hover:text-red-800 cursor-pointer"
      >
        (Logout)
      </div>
    </div>
  );
}
