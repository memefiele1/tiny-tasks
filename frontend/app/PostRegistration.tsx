/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { postRegistrationData } from "@/data/postRegistrationData";
import { CustomRadio } from "@/ui/CustomRadio";
import { COLORS } from '@/ui/CustomStyles';
import Screen from "@/ui/Screen";
import { Heading } from "@/ui/Text";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <Screen style={{ backgroundColor: COLORS.white, justifyContent: "space-between" }}> 
      {/* Form Navigation */}
      <View style={ styles.navigation }>
        <TouchableOpacity 
          accessibilityLabel="back" 
          onPress={ indexRef.current == 0 ? undefined : onBack } 
          style={ styles.button }>
            <Text style={ styles.text }> Back </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          accessibilityLabel="next" 
          onPress={ indexRef.current == (formLength - 1) ? undefined : onNext } 
          style={ styles.button }>
            <Text style={ styles.text }> Next </Text>
        </TouchableOpacity>
      </View>
      

      {/* title component */}
      <View style={ styles.form }>
        <Heading> {currQuestion.title} </Heading> 

        {/* answer section */}
        <CustomRadio options={currQuestion.options} />
      </View>
      

      {/* skip */}
      <Link href="/(tabs)"> Skip </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "white"
  },
  navigation: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 24
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
    maxHeight: '50%'
  }
});