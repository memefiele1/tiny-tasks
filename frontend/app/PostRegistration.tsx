/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { postRegistrationData } from "@/data/postRegistrationData";
import { CustomRadio } from "@/ui/CustomRadio";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PreferenceForm() {
  const router = useRouter();
  const indexRef = useRef<number>(0); // track current selected option
  const formLength = postRegistrationData.length;
  const [currQuestion, setCurrQuestion] = useState(postRegistrationData[indexRef.current]);
  
  // update currQuestion to object at current postRegistrationData index
  const onNext = () => {
    indexRef.current++;
    // if (indexRef.current > formLength) {  // route to dashboard when user has answered all questions
    //   toDashboard();
    // };

    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  const onBack = () => {
    indexRef.current--;
    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  // route to dashboard if users skip form or have finished 
  const toDashboard = () => {
    console.log("Route to dashboard");
    // router.navigate('./(tabs)');
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
