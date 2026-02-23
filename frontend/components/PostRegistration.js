/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { preferenceOptions } from "./data/preferenceOptions";
import { CustomRadio } from "./ui/inputs/CustomRadio";

export default function PreferenceForm() {
  // track current selected option
  const indexRef = useRef(0);
  const formLength = preferenceOptions.length;
  const [currQuestion, setCurrQuestion] = useState(preferenceOptions[indexRef.current]);
  
  // update currQuestion to object at current preferenceOptions index
  const onNext = () => {
    // once user has answered all questions, route to dashboard
    indexRef.current++;
    if (indexRef > formLength) { 
      toDashboard();
    };

    setCurrQuestion(preferenceOptions[indexRef.current]);
  };

  const onBack = () => {
    indexRef.current--;
    setCurrQuestion(preferenceOptions[indexRef.current]);
  };

  const toDashboard = () => {
    console.log("Route to dashboard");
  }

  // render each question to screen
  return (
    <View>
      {/* progress indicator */}
      <TouchableOpacity accessibilityLabel="back" onPress={ indexRef.current == 0 ? null : onBack } style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "black",
            alignItems: "center",
          }}>
          <Text style={{fontSize: 12, color: 'white'}}> Back </Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityLabel="next" onPress={ onNext } style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "black",
            alignItems: "center",
          }}>
          <Text style={{fontSize: 12, color: 'white'}}> Next </Text>
      </TouchableOpacity>

      {/* title component */}
      <Text style={{fontSize: 24}}>{currQuestion.title}</Text> 

      {/* answer section */}
      <CustomRadio options={currQuestion.options} />

      {/* skip */}
      <TouchableOpacity accessibilityLabel="skip" onPress={toDashboard} style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "white",
            alignItems: "center",
          }}>
        <Text style={{fontSize: 12}}> Skip </Text>
      </TouchableOpacity>
    </View>
  );
}
