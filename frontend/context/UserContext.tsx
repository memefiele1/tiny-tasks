/*
    Author - Kayla Thornton
    Purpose - Make user data accessible to all pages
 */
import API_BASE_URL from "@/utils/config";
import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";

export type User = {
    id: number,
    username: string,
    email: string
}

type UserContextType = {
    user: User | undefined,
    validateUser: (email: string, password: string) => Promise<any>
}

const context = createContext<UserContextType | undefined >(undefined);


export function UserProvider ({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const [ user, setUser ] = useState<User>();
    const [token, setToken] = useState(null);

    // grant access to app if user already signed-in
    if (token) router.replace('../app/(tabs)');

    // set provider value by calling login function from Login.tsx
    const validateUser = async ( email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
            }
        );
        const data = await response.json();
        
        // route to login page if login successful
        if (response.ok) { 
            console.log("SUCCESSFUL LOGIN:", data);
            setToken(data.token);
            setUser(data.user);
        } else return data
        
        } catch (error) {
            console.log(error);
            return "User not found"
        }
    }

    return (
    <context.Provider value={{ user, validateUser }}>
        { children }
    </context.Provider>
    )
    }

export default function useUserContext() {
    const ctx = useContext( context );

    if ( !ctx ) throw new Error("Must provide user info");
    
    // ensure user has a value
    // const { user, setUser } = ctx;
    // if (!user) throw new Error("User has not been set yet");

    return ctx;
}