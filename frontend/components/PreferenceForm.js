/*  Author - Kayla Thornton
    Purpose - Allow users to set customized preferences after creating a new account.
 */
import { useState } from "react";
import { Text, View } from "react-native";
import CustomRadio from "./ui/inputs/CustomRadio";

const preferenceOptions = [
  {
    title: "What are you using this app for?",
    options: ["School", "Work", "Personal"],
    type: "multiple choice",
  },
  {
    title: "How many courses are you taking?",
    options: [""],
    type: "numeric",
  },
  {
    title: "How many tasks would you like displayed at a time?",
    options: ["2", "4", "other"],
    type: "numeric",
  },
];

export default function PreferenceForm() {
  // track current selected option
  const [selectedVal, setSelectedVal] = useState("");
  let index = 0;

  // store user selections
  const handleSelection = (option) => {
    setSelectedVal(option);
    console.log(`Value ${[option]} is selected`);
  };

  return (
    // render each question to screen
    <View>
      <Text>{preferenceOptions[index].title}</Text>
      <CustomRadio
        options={preferenceOptions[index].options}
        checkedValue={selectedVal}
        onChange={(option) => handleSelection(option)}
      />
    </View>
  );
}
