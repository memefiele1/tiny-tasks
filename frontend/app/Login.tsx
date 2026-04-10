/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */

import Button from "@/ui/Button";
import { COLORS, SPACING } from "@/ui/CustomStyles";
import Screen from "@/ui/Screen";
import { BodyText, Heading, Subheading } from "@/ui/Text";
import API_BASE_URL from "@/utils/config";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";


export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  // const [token, setToken] = useState(null);

  // grant access to app if user already signed-in
 
  // make request to backend endpoint to validate user credentials
  const validateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password: password })
      });
      const data = await response.json();
      console.log(data);
      // TO-DO - GET USER ID FROM RESPONSE
      // const id = data.user.user_id;
      
      // route to login page if login successful
      if (response.ok) onLogin();
      else setErrors(data.message);
      
    } catch (error) {
      console.log(error);
      setErrors("User not found");
    }
  };
  
  // clear form and route to dashboard on successful login 
  const onLogin = (  ) => {
    setUsername("");
    setPassword("");
    setErrors("");
    router.replace(`../(tabs)`); // use id as parameter to get user
  };

  
  return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={{ flex: 1, padding: 20 }}
      >

        <Screen>
          <Heading> Tiny Tasks </Heading>
          <Subheading> Task management app for students </Subheading>
        </Screen>

        <Screen>
          { errors  ? ( <BodyText variant="error"> {errors} </BodyText> ) : null}

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
              marginBottom: SPACING.lg
            }}
          />

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
              marginBottom: SPACING.lg
            }}
          />
        
          <BodyText>
            <Link href={"./ForgotPassword"} style={{ color: COLORS.vibrantBlue }}> Forgot Password? </Link>
          </BodyText>

          <Button 
            label="Log In"
            onPress={() => validateUser()} 
          />

          <BodyText>
            Don&apos;t have an account? <Link href={"./Register"} style={{ color: COLORS.vibrantBlue }}> Register here </Link>
          </BodyText>
        </Screen>
        
      </KeyboardAvoidingView>
  );
}
