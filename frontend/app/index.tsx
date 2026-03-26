/*
Author - Kayla Thornton
Purpose - Provide user with login options so that they may get access to the app
 */
import Button from '@/ui/Button';
import { COLORS, SPACING } from '@/ui/CustomStyles';
import Screen from '@/ui/Screen';
import { BodyText, Heading, Subheading } from '@/ui/Text';
import API_BASE_URL from '@/utils/config';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

GoogleSignin.configure({
    webClientId: process.env.GOOGLE_CLIENT_ID,
    profileImageSize: 100,
})

export default function LandingPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => { currentSession() }, []);
    
    // route to dashboard if user is signed in, run on mount
    const currentSession = async () => {
        const isSignedIn = GoogleSignin.getCurrentUser();
        if (isSignedIn) router.navigate('./(tabs)'); // UPDATE - SEND USER ID TO HOMEPAGE
    }

    // allow user to sign in using google credentials
    const handleGoogleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const user = await response.data; // user info which includes access token, email, id, ...

            if (isSuccessResponse(response)) {
                console.log('Success');
                // verifyUser(user);
                setError('');
            } else {
                setError('Request canceled by user');
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        setError('Signin in progress');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        setError('Play services not available');
                        break;
                    default:
                        setError('An error occured while signing in');
                }
            } else {
                setError('An error occured while signing in');
            }
        }
    }

    // send google signin response to backend
    const verifyUser = async (user: object) => {
        const response = await fetch(`${API_BASE_URL}/auth/googleAuth`, 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user })
        });
    }

    return(
        <Screen style={{ backgroundColor: COLORS.primaryBlue, justifyContent: 'space-between' }}>
            <View>
                <Heading style={{ color: COLORS.white }}> Tiny Tasks </Heading>
                <Subheading style={{ color: COLORS.white }}> Task management app for students </Subheading>
                <Subheading style={{ color: COLORS.white }}> Login or create an account to get started! </Subheading>

                {error ? <BodyText > { error } </BodyText> : null}
            </View>
            
            <View>
               <Button 
                    label="Login with Google" 
                    onPress={handleGoogleSignin}
                    variant="secondary"
                    style={{ margin: SPACING.sm }} />
            
                <Button 
                    label="Login with email"
                    onPress={() => router.navigate('./Login')} 
                    style={{ margin: SPACING.sm }} />

                <BodyText style={{ color: COLORS.white, textAlign: 'center' }}> 
                    Don't have an account? <Link href={"/Registration"} style={{ color: COLORS.vibrantBlue}}> Register here </Link>
                </BodyText> 
            </View>
            
        </Screen>
    )
}
