/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */

import useUserContext from "@/context/UserContext";
import Button from "@/ui/Button";
import { COLORS, SPACING } from "@/ui/CustomStyles";
import Screen from "@/ui/Screen";
import { BodyText, Heading, Subheading } from "@/ui/Text";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";


export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState("");

  const { validateUser } = useUserContext();
  
  // clear form and route to dashboard on successful login 
  const onLogin = async () => {
    const response = await validateUser(username.toLowerCase().trim(), password);
    console.log(response);

    // only log user in if login attempt successful
    if ( response.ok ) {
      setUsername("");
      setPassword("");
      setErrors("");
      router.replace("/(tabs)");
    } else {
      setErrors("User not found");
      return;
    } 
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
            onPress={() => onLogin()} 
          />

          <BodyText>
            Don&apos;t have an account? <Link href={"./Register"} style={{ color: COLORS.vibrantBlue }}> Register here </Link>
          </BodyText>
        </Screen>
        
      </KeyboardAvoidingView>
  );
}
