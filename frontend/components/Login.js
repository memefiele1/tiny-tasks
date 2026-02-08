/*
Author - Kayla Thornton
Purpose - This function accepts login data from the user. When the user submits, this component validates their data and 
redirects them to the dashboard upon successful login.
 */
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  // count how many attempts user makes and lock account after 3 unsuccessful attempts

  // Validate user login information
  const validateForm = () => {
    if (!username || !password) {
      setErrors("Incorrect username or password");

      return true;
    }
  };

  // route user to dashboard if data provided is successful
  const onLogin = () => {
    if (validateForm()) {
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
        <Text> Username </Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <Text> Password </Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry
        />

        <Button accessibilityLabel="log in" title="Log In" onPress={onLogin} />

        {{ errors } ? <Text> {errors} </Text> : null}
      </KeyboardAvoidingView>
    </View>
  );
}
