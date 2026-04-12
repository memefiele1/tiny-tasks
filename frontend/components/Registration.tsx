/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import Button from "@/ui/Button";
import API_BASE_URL from "@/utils/config";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { registraionData } from "./data/registrationData";

let initialData = {
  fullName: "",
  username: "",
  email: "", 
  pswd: "",
  confirmPswd: ""
}

export default function Registration() {
  const router = useRouter();
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState(initialData);

  // update the UI as users complete form
  const handleRegistration = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  // create new account if the user is a new user
  const onRegister = async () => {
<<<<<<<< HEAD:frontend/app/Register/index.tsx
    if ( userData.pswd != userData.confirmPswd ) {
      setErrors("Passwords don't match");
      return;
    } 
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
      // TO-DO - GET USER ID FROM RESPONSE
      
      if (response.ok) {
        console.log("Account has been successfully created");
        setErrors("");
        setUserData(initialData);
        router.replace("/Register/PostRegistration"); 
      } else {
        setErrors(data.message || "Error creating account");
========
      if (userData.pswd !== userData.confirmPswd) {
        setErrors("Passwords do not match");
      }

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
        const id = data.userId;
        
        if (response.ok) {
          console.log("Account has been successfully created");
          setErrors("");
          setUserData(initialData);
          router.replace("./app/(tabs)"); 
        } else {
          setErrors(data.message || "Error creating account");
        }
      } catch (error) {
        console.log(error);
        setErrors("Network error, please try again");
>>>>>>>> task-view-update:frontend/components/Registration.tsx
      }
    } catch (error) {
      console.log(error);
      setErrors("Network error, please try again");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1, padding: 20 }}
    >
      <View > 
        <Text> Create an Account </Text>
        <Text> Join Tiny Tasks Today! </Text>
      

      <View>
        { errors  ? ( <Text>{errors}</Text> ) : null }
        
        {/* render each input field to screen */}
        {registraionData.map((data) => {
          return (
            <View key={data.key} style={{ margin: 14 }}>
              <Text> { data.label } </Text>

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

        <Text >
          Passwords must: be 8 characters long (minimum), one numeric value, one
          uppercase letter, and one lowecase letter
        </Text>

        <Button
          label="Create Account"
          onPress={onRegister}
        />
        
        </View>
      </View>
      </KeyboardAvoidingView>

  );
}