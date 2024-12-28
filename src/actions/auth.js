'use server'

import { LoginFormSchema } from "@/lib/rules";
import { RegisterFormSchema } from "@/lib/rules";
import { getCollection } from "@/lib/db.js";
import bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import {createSession} from "@/lib/sessions";
import {cookies} from "next/headers";




export async function register(state, formData) {
    //crate a promise
   // await new Promise((resolve)=> setTimeout(resolve, 3000)) ;

   const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
   });

   if (!validatedFields.success ) {
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        email: formData.get("email"),
    }
   }

   const {email, password} = validatedFields.data
   const userCollection  = await getCollection('users');

   if(!userCollection)    return {errors: { email: "Server erro"} }
   
   const existingUser = await userCollection.findOne({email});

   if (existingUser) {
    return {
        errors: 
        { email : "Email already exist in our database!"}
    };
   }

   //hash the password 
   const hashedPassword = await bcrypt.hash(password, 10);


   //save in the db
   const result = await userCollection.insertOne({email, password: hashedPassword });

   //create a session
   await createSession(result.insertedId.toString());

   //redirect
   redirect("/dashboard")

   console.log(result);
    //console.log( validatedFields.error.flatten().fieldErrors);
}

export async function login(state, formData){
   
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),      
    });

    if (!validatedFields.success ) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            email: formData.get("email"),
        }
    }
    //extract form field
    const {email, password} = validatedFields.data;

    //chek if email exist

    const userCollection = await getCollection('users');
    if(!userCollection ) return {errors: { email: "Server error!"} } 

    const existingUser = await userCollection.findOne({email})

    if(!existingUser ) return {errors: { email: "Invalid credentials!"} } 

    //check the password
    const matchedPassword = await bcrypt.compare(password, existingUser.password)

    if(!matchedPassword ) return {errors: { email: "Invalid credentials!"} } 


    //create a session
    await createSession(existingUser._id.toString())

    //redirect to dashboard
    redirect('/dashboard');
}

export async function logout(){
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/");
}