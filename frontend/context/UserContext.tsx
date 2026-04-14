/*
    Author - Kayla Thornton
    Purpose - Make user data accessible to all pages
 */
import { createContext, useContext, useState } from "react";

export type User = {
    id: number,
    username: string,
    email: string
}

type UserContextType = {
    user: User | undefined,
    setUser: (user: User) => void
}

const context = createContext<UserContextType | undefined >(undefined);


export const UserProvider = ({children}: { children: React.ReactNode }) => {
   const [ user, setUser ] = useState<User>();

   const addUser = () => {
    setUser(user)
   }
   
   return (
    <context.Provider value={{ user, setUser }}>
        { children }
    </context.Provider>
    )
}

export default function useUserContext() {
    const ctx = useContext( context );

    if ( !ctx ) throw new Error("Must provide user info");
    
    // ensure user has a value
    const { user, setUser } = ctx;
    if (!user) throw new Error("User has not been set yet");

    return { user, setUser };
}