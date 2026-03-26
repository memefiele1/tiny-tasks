/*
    Author - Kayla Thornton
    Purpose - securely sign out user 
 */

import Button from '@/ui/Button';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

// logout button that when pressed securely logs user out
export const LogoutButton = () => {
    const router = useRouter();

    // check if user logged in with google
    const isGoogleUser = async () => {
        const isSignedIn = await GoogleSignin.getCurrentUser();

        if ( isSignedIn ) { // if google user found, log out
            GoogleSignin.signOut();
            router.navigate('./index');
        } 
        else signOut(); // if user not logged in with google, do custom signout
    }

    // TO-DO custom log out function if not logged in with google
    const signOut = () => {
        console.log('User has logged out')
        router.navigate('./index');
    }

    <Button
        label = 'Sign Out'
        onPress = {isGoogleUser}
    />
}