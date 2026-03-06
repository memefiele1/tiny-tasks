/*
Author - Kayla Thornton
Purpose - Provide user with login options so that they may get access to the app
 */
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

GoogleSignin.configure({
    webClientId: process.env.GOOGLE_CLIENT_ID,
    profileImageSize: 100,
})

export default function LandingPage() {
    const [error, setError] = useState("");
    // check if user has already signed in

    // allow user to sign in using google credentials
    const handleGoogleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            if (isSuccessResponse(response)) {
                console.log('Success');
                setError('');
                // make call to backend
            } else {
                setError('Request canceled by user')
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

    useEffect(() => { handleGoogleSignin() }, [])

    const handleLogin = () : void => {
        // route to login screen
    }

    const handleRegistration = () : void => {
        // route to registration page
    }

    return(
        <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 24, textAlign: "center" }}>
            {" "}
                Tiny Tasks{" "}
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
                Task management app for students
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
                Login or create an account to get started!
            </Text>

            {error ? <Text>{ error } </Text> : null}
            <TouchableOpacity
                accessibilityLabel="Login with Google"
                onPress={handleGoogleSignin}
                style={{
                flex: 1,
                padding: 10,
                borderRadius: 14,
                borderWidth: 1,
                alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 18 }}> Sign-in with Google </Text>
            </TouchableOpacity>

            <TouchableOpacity
                accessibilityLabel="Login with email"
                onPress={handleLogin}
                style={{
                flex: 1,
                padding: 10,
                borderRadius: 14,
                borderWidth: 1,
                backgroundColor: "black",
                alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 18, color: "white" }}> Sign-in with Email </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
                Don't have an account? Create one here
            </Text>
        </View>
    )
}