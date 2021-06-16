import React, {useCallback, useEffect, useState} from 'react';
import {Text, FlatList, Platform, Button, ActivityIndicator, View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from '../../store/actions/cart';
import CustomHeaderButton from "../../components/UI/HeaderButton";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";
import {fetchProducts} from "../../store/actions/products";

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(fetchProducts());
        } catch(error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadProducts();
    }, [dispatch, loadProducts]);

    const selectItemHandler = (product) => {
        props.navigation.navigate('ProductDetail', {
            productId: product.id,
            productTitle: product.title
        });
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Ann error occurred!</Text>
                <Button title='Try again' onPress={loadProducts} color={Colors.primary} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList
            keyExtractor={item => item.id}
            data={products}
            renderItem={itemData => {
                return (
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onSelect={() => selectItemHandler(itemData.item)}>
                        <Button color={Colors.primary} title="View Details"
                                onPress={() => selectItemHandler(itemData.item)} />
                        <Button color={Colors.primary} title="To Cart"
                                onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }} />
                    </ProductItem>
                )
            }}
        />
    )
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }} />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;