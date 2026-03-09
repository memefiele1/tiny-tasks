import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}}/>
            <Stack.Screen name="Login" options={{ headerTitle: 'Back'}}/>
            <Stack.Screen name="Registration" options={{ headerTitle: 'Back'}}/>
        </Stack>
    )
}

export default Layout; 