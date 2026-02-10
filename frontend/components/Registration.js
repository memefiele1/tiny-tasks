/*
Author - Kayla Thornton
Purpose - Create a new account if one doesn't already exist. After creating an account, users will be prompted 
to set basic configurations for the app.
 */
import { React, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function Registration () {
    const [ userData, setUserData ] = useState({
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "",
        confirmPassword: ""
    });

    // validate form
    const validateRegistration = () => {
        // ensure no input is empty
        const errors = userData.filter((data) => !userData.data)
        console.log(errors)

        if (errors) {
            return false;
        }
        else {
            return true;
        }
        // validate user doesn't already exist
    }

    // create new account if the user is a new user
    const onRegister = () => {
        // if no errors with registration form, create new user
        if (validateRegistration()){
            // create new user
            console.log("Account has been successfully created");
            // route to configurations so user can customize app
        }
        else {
            console.log("There was an error creating a new account");
        }
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView>
            {/* render each input field to screen */}
            { userData.map((data, index) => {
                    return(
                        <View key={index}>
                            <Text>{data}</Text>
                            <TextInput 
                                value={userData.data}
                                onChangeText={(value) => setUserData({...userData, data: value})} 
                                autoCapitalize="none"
                                autoCorrect={false}
                                // secureTextEntry={ data === password || data === confirmPassword}
                                // FIX - add secure entry to passwords
                            />
                        </View>
                    );
                })}
            <Text> Password requirements will be listed here </Text>
            <Button accessibilityLabel="create new account" title="Create Account" onPress={onRegister}/>
            </ScrollView>
        </View>
    )
}