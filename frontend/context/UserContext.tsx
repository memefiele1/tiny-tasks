// /*
//     Author - Kayla Thornton
//     Purpose - Make user data accessible to all pages
//  */
// import { createContext, useContext, useState } from "react";

// export type User = {
//     id: number,
//     username: string,
//     email: string
// }

// const context = createContext<User | undefined>(undefined);

// const UserProvider = ({children}: { children: React.ReactNode }) => {
//    const [ user, setUser ] = useState<User>();

//    return <context.Provider value={{ user, setUser }}>{ children }</context.Provider>
// }

// export default function UserContext({children}: { children: React.ReactNode }) {
//     const user = useContext( context );

//     if ( user === undefined ) throw new Error("Must provide user info");
//     return user;
// }