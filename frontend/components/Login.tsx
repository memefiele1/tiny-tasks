/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API_BASE_URL from "../utils/config";

// export type error = string | undefined;
interface loginResponse {
  user_id: number,
  username: string,
  email: string
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  // Validate user login information
  const validateForm = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  // clear form and route to dashboard if login attempt was successful
  const onLogin = () : void => {
    validateForm()
    if (!errors) {
      console.log("User has logged in");
      setUsername("");
      setPassword("");
      setErrors("");
      // route to dashboard
    } 
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
          onPress={onLogin}
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
          Don&apos;t have an account? Register Here
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}
