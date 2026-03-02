/*
Author - Kayla Thornton
Purpose - Provide user with login options so that they may get access to the app
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function LandingPage() {

    const fetchGoogleCred = async () => {
        // connect to google service 
    }

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

            <TouchableOpacity
                accessibilityLabel="login with Google"
                onPress={fetchGoogleCred}
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
                accessibilityLabel="login with email"
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