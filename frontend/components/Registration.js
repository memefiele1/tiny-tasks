/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import { React, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

const formData = [
  {
    key: "firstName",
    label: "First Name",
    placeholder: "First Name",
    isSecureEntry: false,
  },
  {
    key: "lastName",
    label: "Last Name",
    placeholder: "Last Name",
    isSecureEntry: false,
  },
  {
    key: "email",
    label: "Email",
    placeholder: "example@gmail.com",
    isSecureEntry: false,
  },
  {
    key: "pswd",
    label: "Password",
    placeholder: "Password",
    isSecureEntry: true,
  },
  {
    key: "confirmPswd",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    isSecureEntry: true,
  },
];

export default function Registration() {
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pswd: "",
    confirmPswd: "",
  });

  const handleRegistration = (key, value) => {
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
      for (let key in userData) {
        setUserData((prev) => ({ ...prev, [key]: "" }));
      }
    } else {
      console.log("There was an error creating a new account");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {{ errors } ? <Text>{errors}</Text> : null}
        {/* render each input field to screen */}
        {formData.map((data) => {
          return (
            <View key={data.key}>
              <Text>{data.label}</Text>
              <TextInput
                placeholder={data.placeholder}
                value={userData[data.key]}
                onChangeText={(value) => handleRegistration(data.key, value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={data.isSecureEntry ? true : null}
              />
            </View>
          );
        })}
        <Text>
          {" "}
          Passwords must: be 8 characters long (minimum), one numeric value, one
          uppercase letter, and one lowecase letter{" "}
        </Text>
        <Button
          accessibilityLabel="create new account"
          title="Create Account"
          onPress={onRegister}
        />
      </ScrollView>
    </View>
  );
}
