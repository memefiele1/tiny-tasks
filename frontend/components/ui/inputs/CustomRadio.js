/*  Author - Kayla Thornton
    Purpose - Render radio button options to forms
 */
import { Text, TouchableOpacity, View } from "react-native";

const CustomRadio = ({ options, checkedValue, onChange }) => {
  return (
    <View>
      {/* render each option to screen and indicate when option has been selecte */}
      {options &&
        options.map((option, index) => {
          let isActive = checkedValue === option; // checks if current option matches value saved in useState variable
          console.log(option);
          // changes currently selected value
          return (
            <View key={index}>
              <TouchableOpacity onPress={(option) => onChange(option)}>
                <Text>{option}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
};

export default CustomRadio;
