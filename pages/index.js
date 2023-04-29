import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hello, {session?.user?.name}</h2>
        <div className="bg-gray-300 flex gap-1 rounded-lg text-black items-center" >
          <img
            src={session?.user?.image}
            alt="profileImage"
            className="w-8 h-8 rounded-l-lg"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
