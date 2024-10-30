"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper"
import { SignUpSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const SignUpForm = () => {
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const { login } = useAuth();
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
        try{
            const username = values.username  
            const password = values.password  
            const role = values.role === true ? "admin" : "user"
            const response = await api.post("/signup", {username, password, role});
            if(response.status === 201){
                login(response.data);
                router.push("/reports");
            } else if(response.data.error === "user already exists"){
                form.setError("username", {message: "User already exists"}, {shouldFocus: true});
            }else {
                console.error("Signup failed: ", response.data);
            }
        } catch (error){
            console.error("Signup failed: ", error);
        }
    }

    return (
        <CardWrapper
            headerLabel={"Create an account"}
            backButtonLabel={"Already have an account?"}
            backButtonHref={"/auth/login"}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="Username"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="********"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-start space-x-2">
                                    <FormControl>
                                        <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Admin</FormLabel>
                                        <FormDescription>Login as admin?</FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

function login(token: any) {
    throw new Error("Function not implemented.");
}
