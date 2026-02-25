/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registraionData } from "./data/registrationData";

let initialData = {
  fullName: "",
  email: "",
  pswd: "",
  confirmPswd: ""
}
export default function Registration() {
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState(initialData);

  const handleRegistration = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  // validate user entered appropriate data and that the user doesn't already exist
  const validateRegistration = () => {
    const isEmpty = Object.values(userData).some((val) => !val);

    if (isEmpty) {
      setErrors("Please fix any errors");
      return false;
    }

    setErrors("");
    return true;
  };

  // create new account if the user is a new user
  const onRegister = () => {
    if (validateRegistration()) {
      console.log("Account has been successfully created");
      setErrors("");
      setUserData(initialData);
    } else {
      console.log("There was an error creating a new account");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 24, textAlign: "center" }}>
          {" "}
          Create an Account{" "}
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", color: "gray" }}>
          {" "}
          Join Tiny Tasks Today!{" "}
        </Text>
      </View>

      <ScrollView>
        { errors  ? (
          <Text style={{ fontSize: 16, color: "red" }}>{errors}</Text>
        ) : null}
        {/* render each input field to screen */}
        {registraionData.map((data) => {
          return (
            <View key={data.key} style={{ margin: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "700" }}>
                {data.label}
              </Text>
              <TextInput
                placeholder={data.placeholder}
                value={userData[data.key as keyof typeof userData]}
                onChangeText={(value) => handleRegistration(data.key, value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={data.isSecureEntry ? true : undefined}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 10,
                  fontSize: 14,
                }}
              />
            </View>
          );
        })}

        <Text style={{ fontSize: 12, color: "gray", margin: 10 }}>
          {" "}
          Passwords must: be 8 characters long (minimum), one numeric value, one
          uppercase letter, and one lowecase letter{" "}
        </Text>
        <TouchableOpacity
          accessibilityLabel="create new account"
          onPress={onRegister}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}> Create Account </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
