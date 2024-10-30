import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedRoute({
    children,
    roles,
}: {
    children: React.ReactNode;
    roles: string[];
}) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(localStorage.getItem("jwt_token") === null){
            router.push("/auth/login");
        }else {
            if (user && !roles.includes(user.role)) {
                router.push("/auth/login");
            }
        }
        
    }, [user, roles, router]);

    return <>{children}</>;
}