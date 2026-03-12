/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */

import Button from "@/ui/Button";
import Screen from "@/ui/Screen";
import { BodyText, Heading, Subheading } from "@/ui/Text";
import API_BASE_URL from "@/utils/config";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput
} from "react-native";


export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  // store user info

  // Validate user login information
  const validateUser = async () => {
    // make request to backend endpoint to validate user credentials
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password: password })
      });
      const data = await response.json();

      // route to login page if login successful
      if (response.ok) {
        onLogin();
      } else if (response.status > 400){
        setErrors("User not found");
      }
    } catch (error) {
      console.log(error);
      setErrors("Network error, please try again");
    }
  };
  
  // clear form and route to dashboard on successful login 
  const onLogin = async () => {
    console.log("User has logged in");
    setUsername("");
    setPassword("");
    setErrors("");
    router.navigate('./(tabs)');
  };

  
  // TO-DO - add "forgot password" and "sign-up" links to this page (I think these should be buttons on the homescreen)
  return (
    <Screen>
      <KeyboardAvoidingView>
        <Screen>
          <Heading>
            Tiny Tasks
          </Heading>
          <Subheading>
            Task management app for students
          </Subheading>
        </Screen>

        <Screen>
          { errors  ? (
            <BodyText variant="error"> {errors} </BodyText>
          ) : null}

          <BodyText> Username </BodyText>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCorrect={false}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 10,
              fontSize: 14,
            }}
          />

          <BodyText> Password </BodyText>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 10,
              fontSize: 14,
            }}
          />
        </Screen>

        <Link href="/ForgotPassword"> Forgot Password? </Link>

        <Button 
          label="Log In"
          onPress={validateUser}
        />

        <BodyText>
          Don&apos;t have an account? <Link href={"/Registration"}> Register here </Link>
        </BodyText>

      </KeyboardAvoidingView>
    </Screen>
  );
}
