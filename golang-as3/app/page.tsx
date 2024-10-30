import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-700">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">
          Report Management System
        </h1>
        <p className="text-4xl text-slate-300">Role based access control</p>
        <p className="text-xl text-slate-300">Golang assignment 3 - Next.js</p>
        <div>
          <LoginButton >
            <Button variant={"secondary"} size={"lg"}>Sign in</Button>
          </LoginButton> 
        </div>
      </div>
    </main>
  );
}
