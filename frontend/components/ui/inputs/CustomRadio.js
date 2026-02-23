/*  Author - Kayla Thornton
    Purpose - Function accepts a list of options to render as radio buttons and updates UI 
    to reflect the option selected by the user
 */
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CustomRadio = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState("");
  console.log(selectedOption);

  {/* render each option to screen and indicate when option has been selecte */}
  return (
    <View>
      {options && options.map((option, index) => {
        let isActive = selectedOption == option;
        console.log(`${option} status: ${isActive}`)

          // updates UI to reflect currently selected value
          return (
            <View key={index}>
              <TouchableOpacity accessibilityLabel={option} onPress={() => setSelectedOption(option)} 
              style={ styles.container }>
                <Text style={ isActive ? styles.active : null  }>{option}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5
  },
  active: {
    backgroundColor: "blue"
  }
})
