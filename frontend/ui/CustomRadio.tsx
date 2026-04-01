/*  Author - Kayla Thornton
    Purpose - Function accepts a list of options to render as radio buttons and updates UI 
    to reflect the option selected by the user
 */
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";

const COLORS = {
  primaryBlue: "#0039A6",
  white: "#FFFFFF",
  redAccent: "#CC0000",
  blueSteel: "#374057",
  vibrantBlue: "#00AEEF",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

interface Props { options: string[] }

export const CustomRadio = ({ options }: Props) => {
  const [selectedOption, setSelectedOption] = useState("");

  {/* render each option to screen and indicate when option has been selecte */}
  return (
    <View>
      {options && options.map((option, index) => {
        let isActive = selectedOption == option;

          // updates UI to reflect currently selected value
          return (
            <View key={index} style={styles.container}>
              <Button label={option} onPress={() => setSelectedOption(option)} style={ isActive ? styles.active : styles.inactive}/>
              {/* <TouchableOpacity accessibilityLabel={option} onPress={() => setSelectedOption(option)} 
              style={ styles.optionContainer }>
                <Text style={ isActive ? styles.active : styles.inactive  }>{option}</Text>
              </TouchableOpacity> */}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    padding: SPACING.xs,
    margin: SPACING.xs
  },
  active: {
    color: COLORS.white,
    backgroundColor: COLORS.vibrantBlue
  },
  inactive: {
    color: COLORS.primaryBlue,
    backgroundColor: COLORS.white
  }
})
