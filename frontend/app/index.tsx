import Login from "@/components/Login";
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
      <Login />
      {/* <Registration /> */}
      {/* <PostRegistraion /> */}
      {/* <LandingPage /> */}
    </View>
  );
}
