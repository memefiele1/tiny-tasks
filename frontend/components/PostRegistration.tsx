/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { postRegistrationData } from "./data/postRegistrationData";
import { CustomRadio } from "./ui/inputs/CustomRadio";

export default function PreferenceForm() {
  // track current selected option
  const indexRef = useRef<number>(0);
  const formLength = postRegistrationData.length;
  const [currQuestion, setCurrQuestion] = useState(postRegistrationData[indexRef.current]);
  
  // update currQuestion to object at current postRegistrationData index
  const onNext = () => {
    // once user has answered all questions, route to dashboard
    indexRef.current++;
    // if (indexRef.current > formLength) { 
    //   toDashboard();
    // };

    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  const onBack = () => {
    indexRef.current--;
    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  const toDashboard = () => {
    console.log("Route to dashboard");
  }

  // render each question to screen
  return (
    <View>
      {/* progress indicator */}
      <TouchableOpacity accessibilityLabel="back" onPress={ indexRef.current == 0 ? undefined : onBack } style={{
            flex: 1,
            padding: 10,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: "black",
            alignItems: "center",
          }}>
          <Text style={{fontSize: 12, color: 'white'}}> Back </Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityLabel="next" onPress={ indexRef.current == (formLength - 1) ? undefined : onNext } style={{
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
