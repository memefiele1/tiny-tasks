/*
    Author - Kayla Thornton
    Purpose - Allow users to reset passwords 
 */
import Button from '@/ui/Button';
import { SPACING } from '@/ui/CustomStyles';
import Screen from '@/ui/Screen';
import { BodyText, Heading } from '@/ui/Text';
import { useState } from 'react';
import { TextInput } from 'react-native';

export default function ForgotPassword() {
    // capture password information
    const [ password, setPassword ] = useState("");
    const [ confirmPswd, setConfirmPswd ] = useState("");
    const [ errors, setErrors ] = useState("");

    // send password request to backend
    const handlePasswordReset = () => {
        console.log('Reset Password');

        // send password to backend to validate new password
        setPassword('');
        setConfirmPswd('');
    }

    // render form parts to screen
    return(
        <Screen>
            
            <Heading> Password Reset </Heading>

            { errors ? <BodyText> {errors} </BodyText> : null }
            <TextInput 
                placeholder='Enter Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 10,
                    fontSize: 14,
                    marginBottom: SPACING.lg
                }}
            />

            <TextInput
                placeholder='Confirm Password'
                value={confirmPswd}
                onChangeText={setConfirmPswd}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 10,
                    fontSize: 14,
                    marginBottom: SPACING.lg
                }}
            />

            <BodyText variant='caption'>
                Passwords must: be 8 characters long (minimum), one numeric value, one
                uppercase letter, and one lowecase letter
            </BodyText>
            
            <Button 
                label='Submit'
                onPress={handlePasswordReset}
            />
        </Screen>
    );
}