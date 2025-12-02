'use client'
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import FormField from "@/component/formfield"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"   
import { createUserWithEmailAndPassword } from "firebase/auth"
import { signUp, signIn } from "@/lib/actions/auth.action"
import { signInWithEmailAndPassword } from "firebase/auth"
import Image from "next/image"
import {auth} from "@/firebase/client";

const authFormSchema=(type:FormType)=> {
    return z.object({
        name: type==="sign-up" ? z.string().min(3, "Name is required") : z.string().optional(),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    })
}

const Authform=({type}:{type:FormType}) => {
    const router=useRouter();
    const formSchema=authFormSchema(type);
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
            email:"",
            password:"",
        },
    })

    
    async function onSubmit(data:z.infer<typeof formSchema>){
        try {
            if(type==="sign-in"){
                // Handle sign-in logic here
                const {email,password}=data;
                const userCredentials=await signInWithEmailAndPassword(auth,email,password);
                const idToken=await userCredentials.user.getIdToken();
                if(!idToken){
                    toast.error("Failed to retrieve ID token");
                    return;
                }
                await signIn({
                    email,idToken
                });
                toast.success("Signed in successfully!");
                router.push("/");
            } else {
                // Handle sign-up logic here
                const {name,email,password}=data;
                
                const userCredentials=await createUserWithEmailAndPassword(auth,email,password);

                const result=await signUp({
                    uid:userCredentials.user.uid,
                    name:name!,
                    email,
                    password,
                })

                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }

                console.log("Signing up with data:", data);
                toast.success("Account created successfully!");
                router.push("/sign-in");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
    }
}

    const isSignIn=type==="sign-in";
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">Preparator.AI</h2>
            </div>
            <h3>Practice Job Interviews with AI</h3>
           
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-4 form">
                {!isSignIn && (<FormField
                    control={form.control}
                    name="name" 
                    label="name"
                    placeholder="Your Name"/>)}
                <FormField
                    control={form.control}
                    name="email" 
                    label="email"
                    placeholder="Your email address"
                    type="email"/>
                <FormField
                    control={form.control}
                    name="password"
                    label="password" 
                    placeholder="Enter Your password"
                    type="password"/>
                <Button type="submit" className="btn">{isSignIn ? 'Sign In' : 'Create an Account'}</Button>
                </form>
            </Form>
            <p className="text-center">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <a href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
                    {isSignIn ? "Sign Up" : "Sign In"}
                </a>
            </p>
            </div>
            </div>
    )
}
export default Authform;
