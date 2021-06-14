import React, {useCallback, useEffect, useReducer} from "react";
import {View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView} from "react-native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import {useDispatch, useSelector} from "react-redux";
import {createProduct, updateProduct} from "../../store/actions/products";
import Input from "../../components/UI/Input";

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

const EditProductsScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            price: editedProduct ? editedProduct.price : '',
            description: editedProduct ? editedProduct.description : ''
        },
        inputValidities: {
            title: !!editedProduct,
            imageUrl: !!editedProduct,
            price: !!editedProduct,
            description: !!editedProduct
        },
        formIsValid: !!editedProduct
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                {text: 'Okay'}
            ]);
            return;
        }

        if (editedProduct) {
            dispatch(updateProduct(
                prodId,
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl));
        } else {
            dispatch(createProduct(
                formState.inputValues.title ,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
                +formState.inputValues.price));
        }
        props.navigation.goBack();
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({'submit': submitHandler});
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, value, isValid) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: value,
            isValid: isValid,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        errorText='Please enter a valid title'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        errorText='Please enter a valid image url'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {!editedProduct && (
                        <Input
                            id='price'
                            label='Price'
                            returnKeyType='next'
                            errorText='Please enter a valid price'
                            keyboardType='decimal-pad'
                            onInputChange={inputChangeHandler}
                            initialValue={editedProduct ? editedProduct.price : ''}
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        id='description'
                        label='Description'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        errorText='Please enter a valid description'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductsScreen.navigationOptions = navData => {
    const submitFunc = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFunc} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
});

export default EditProductsScreen;