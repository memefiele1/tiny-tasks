/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import useUserContext from "@/context/UserContext";
import { registraionData } from "@/data/registrationData";
import Button from "@/ui/Button";
import Screen from "@/ui/Screen";
import { BodyText, Heading, Subheading } from "@/ui/Text";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

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
  const { registerUser } = useUserContext();
  const [userData, setUserData] = useState(initialData);

  // update the UI as users complete form
  const handleRegistration = (key: string, value: string) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  // create new account if the user is a new user
  const onRegister = async () => {
    if ( userData.pswd != userData.confirmPswd ) {
      setErrors("Passwords don't match");
      return;
    } 
    
    //  send user data to conect file to register new user
    const response = await registerUser({
        username: userData.username.toLowerCase().trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.pswd.trim()
    })
      
    if (response.ok) {
        console.log("Account has been successfully created");
        setErrors("");
        setUserData(initialData);
        router.replace("./Register/PostRegistration"); 
    } else setErrors(response); 
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1, padding: 20 }}
    >
      <Screen scrollable={true}>
          <Heading> Create an Account </Heading>
          <Subheading> Join Tiny Tasks Today! </Subheading>

        <Screen>
          { errors  ? ( <BodyText variant="error">{errors}</BodyText> ) : null }
          
          {/* render each input field to screen */}
          {registraionData.map((data) => {
            return (
              <View key={data.key} style={{ margin: 14 }}>
                <BodyText> { data.label } </BodyText>

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

          <BodyText variant="caption" >
            Passwords must: be 8 characters long (minimum), one numeric value, one
            uppercase letter, and one lowecase letter
          </BodyText>

          <Button
            label="Create Account"
            onPress={onRegister}
          />
          
        </Screen>
        </Screen>
      
      </KeyboardAvoidingView>

  );
}