/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { postRegistrationData } from "@/data/postRegistrationData";
import { CustomRadio } from "@/ui/CustomRadio";
import Screen from "@/ui/Screen";
import { Heading } from "@/ui/Text";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function PreferenceForm() {
  const router = useRouter();
  const indexRef = useRef<number>(0); // track current selected option
  const formLength = postRegistrationData.length;
  const [currQuestion, setCurrQuestion] = useState(postRegistrationData[indexRef.current]);
  
  {/*for routing to google permissions screen*/}
  const toGooglePermissions = () => {
    router.push("./google-permissions");
  };

  // update currQuestion to object at current postRegistrationData index
  const onNext = () => {
    indexRef.current++;

    // route to dashboard when user has answered all questions
    if (indexRef.current > formLength) router.navigate('./(tabs)');

    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  const onBack = () => {
    indexRef.current--;
    setCurrQuestion(postRegistrationData[indexRef.current]);
  };

  // render each question to screen
  return (
    <Screen> 
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
      <Heading> {currQuestion.title} </Heading> 

      {/* answer section */}
      <CustomRadio options={currQuestion.options} />

      {/* skip */}
      <Link href="/(tabs)"> Skip </Link>
    </Screen>
  );
}
