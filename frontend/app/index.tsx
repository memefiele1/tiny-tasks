import PostRegistration from "@/components/PostRegistration";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Login /> */}
      {/* <Registration /> */}
      <PostRegistration />
    </View>
  );
}
