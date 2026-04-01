import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}}/>
            <Stack.Screen name="Login" options={{ headerShown: false}}/>
            <Stack.Screen name="Registration" options={{ headerTitle: ''}}/>
            <Stack.Screen name="ForgotPassword" options={{ headerTitle: ''}}/>
        </Stack>
    )
}

export default Layout; 