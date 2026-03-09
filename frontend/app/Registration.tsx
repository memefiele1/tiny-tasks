/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import { registraionData } from "@/data/registrationData";
import API_BASE_URL from "@/utils/config";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

let initialData = {
  fullName: "",
  username: "",
  email: "", 
  pswd: "",
  confirmPswd: ""
}

export default function Registration() {
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState(initialData);

  // update the UI as users complete form
  const handleRegistration = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  // create new account if the user is a new user
  const onRegister = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, 
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.pswd
          })
        });

        const data = await response.json();
        console.log(data);
        
        if (response.ok) {
          console.log("Account has been successfully created");
          setErrors("");
          setUserData(initialData);
        } else {
          setErrors(data.message || "Error creating account");
        }
      } catch (error) {
        console.log(error);
        setErrors("Network error, please try again");
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
