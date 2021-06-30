import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {ScrollView, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useDispatch} from "react-redux";

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from "../../constants/Colors";
import {login, signup} from "../../store/actions/auth";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };

        let formIsValid = Object.values(updatedValidities).every(isValid => isValid);

        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: formIsValid
        };
    }

    return state;
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const inputChangeHandler = useCallback((inputIdentifier, value, isValid) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: value,
            isValid: isValid,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{
                text: 'Okay'
            }]);
        }
    }, [error]);

    const authHandler = async () => {
        const actionCreator = isSignup ? signup : login;
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(actionCreator(
                formState.inputValues.email,
                formState.inputValues.password
            ));
            props.navigation.navigate('Shop');
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVertivalOffset={50}
            style={styles.screen}>
            <LinearGradient style={styles.gradient} colors={['#ffedff', '#ffe3ff']}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType='email-address'
                            requires
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType='default'
                            secureTextEntry
                            requires
                            minLength={6}
                            autoCapitalize="none"
                            errorText="Please enter a valid email password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator
                                    size='small'
                                    color={Colors.primary}
                                />) : (
                                <Button
                                    title={isSignup ? "Sign Up" : "Login"}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />)
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                color={Colors.secondary}
                                onPress={() => {
                                    setIsSignup(!isSignup);
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;