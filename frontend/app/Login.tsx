/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */
import API_BASE_URL from "@/utils/config";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function Login() {
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
        setErrors("");
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
    // route to dashboard
  };

  
  // TO-DO - add "forgot password" and "sign-up" links to this page (I think these should be buttons on the homescreen)
  return (
    <View>
      <KeyboardAvoidingView>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>
            {" "}
            Tiny Tasks{" "}
          </Text>
          <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
            Task management app for students
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 16 }}>
          { errors  ? (
            <Text style={{ fontSize: 12, color: "red" }}> {errors} </Text>
          ) : null}

          <Text style={{ fontSize: 14, fontWeight: "700" }}> Username </Text>
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

          <Text style={{ fontSize: 14, fontWeight: "700" }}> Password </Text>
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
        </View>

        <TouchableOpacity
          accessibilityLabel="log in"
          onPress={validateUser}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}> Log In </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
          {" "}
          Don&apos;t have an account? <Link href={"/Registration"}> Register here </Link>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}
