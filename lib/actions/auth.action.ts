'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK_MS=7*24*60*60;
export async function signUp(params:SignUpParams) {
    const {uid,name,email}=params;
    try{
        const userRecord=await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return{
                success:false,
                message:"User already exists"
            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email,
        });
        return{
            success:true,
            message:"User created successfully"
        }
    }catch(error:any){
        const errorMessage = error?.message || JSON.stringify(error);
        console.error("Error creating user:", errorMessage);
        if(error.code==="auth/email-already-exists"){
            return{
                success:false,
                message:"Email already in use"
            }
        }

        return{
            success:false,
            message: `Failed to create user: ${errorMessage}`
        }
    }
}

export async function signIn(params:SignInParams){
    const {email,idToken}=params;
    try{
        const userRecord=await auth.getUserByEmail(email);

        if(!userRecord){
            return{
                success:false,
                message:"User not found"
            }
        }
        await setSessionCookie(idToken);
    }catch(error){
        console.log(error);

        return{
            success:false,
            message:"Failed to sign in user"
        }
    }

}

export async function setSessionCookie(idToken:string){
    const cookieStore=await cookies();

    const sessionCookie=await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK_MS*1000, //7 days
    });

    cookieStore.set('session',sessionCookie,{
        httpOnly:true,
        maxAge:ONE_WEEK_MS,
        secure:process.env.NODE_ENV==='production',
        path:'/',
        sameSite:'lax',
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        }as User;
    }catch(error){
        console.log("Error verifying session cookie:", error);
        return null;
    }
}

export async function isAuthenticated(){
    const user=await getCurrentUser();
    return !!user;
}