/*  Author - Kayla Thornton
    Purpose - Function accepts a list of options to render as radio buttons and updates UI 
    to reflect the option selected by the user
 */
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CustomRadio = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isActive, setIsActive] = useState(false);
  console.log(selectedOption);

  {/* render each option to screen and indicate when option has been selecte */}
  return (
    <View>
      {options && options.map((option, index) => {
          if (selectedOption == option) setIsActive(true);
          console.log(`${option} status: ${isActive}`);

          // updates UI to reflect currently selected value
          return (
            <View key={index}>
              <TouchableOpacity accessibilityLabel={option} onPress={(option) => setSelectedOption(option)} 
              style={ [styles.container, isActive ? styles.active : null ] }>
                <Text style={{fontSize: 12}}>{option}</Text>
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
    color: "blue",
    backgroundColor : "blue",
  }
})
