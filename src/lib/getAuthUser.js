import {cookies } from "next/headers";
import {decrypt } from "./sessions";


export default async function getAuthUser(name){
        //read cookie value
        const cookieStore = await cookies();
        const session = await cookieStore.get('session')?.value 

        if (session) {
            const user =  await decrypt(session);
            return user;
        }

}