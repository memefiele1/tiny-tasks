/*
    Author - Kayla Thornton
    Purpose - Make user data accessible to all pages
 */
import API_BASE_URL from "@/utils/config";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
    user_id: number,
    username: string,
    email: string
}

type UserContextType = {
    user: User,
    validateUser: (email: string, password: string) => Promise<any>
}

const context = createContext<UserContextType | undefined >(undefined);

// provider contains setter functions to ensure user has or receives a value
export function UserProvider ({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const [ user, setUser ] = useState<User>({
        user_id: 0,
        username: "",
        email: ""
    });
    const [token, setToken] = useState(null);

    // grant access to app if user already signed-in
    useEffect(() => { if (token) router.replace('/(tabs)'); }, [] )

    // set user value when user logs in
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
        }
        return response;
        
        } catch (error) {
            console.log(error);
            return "User not found"
        }
    }

    console.log("Context user:", user);

    return (
        <context.Provider value={{ user, validateUser }}>
            { children }
        </context.Provider>
        )
    }

export default function useUserContext() {
    const ctx = useContext( context );

    if ( !ctx ) throw new Error("Must provide user info");
    console.log("Context ctx:", ctx)
    return ctx;
}