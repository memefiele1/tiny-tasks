/*
    Author - Kayla Thornton
    Purpose - Allow users to reset passwords 
 */
import Button from '@/ui/Button';
import Screen from '@/ui/Screen';
import { Heading } from '@/ui/Text';
import { useState } from 'react';
import { TextInput } from 'react-native';

export default function ForgotPassword() {
    // capture password information
    const [ password, setPassword ] = useState("");
    const [ confirmPswd, setConfirmPswd ] = useState("");

    // send password request to backend
    const handlePasswordReset = () => {
        console.log('Reset Password');

        setPassword('');
        setConfirmPswd('');
    }

    // render form parts to screen
    return(
        <Screen>
            
            <Heading> Password Reset </Heading>

            <TextInput // ask Tiff to update to include autoCapitalize and auoCorrect
                placeholder='Enter Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />

            <TextInput
                placeholder='Enter Password'
                value={confirmPswd}
                onChangeText={setConfirmPswd}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />

            <Button 
                label='Submit'
                onPress={handlePasswordReset}
            />
        </Screen>
    );
}