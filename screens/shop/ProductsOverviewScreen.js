import React from 'react';
import {Text, FlatList, Platform, Button, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from '../../store/actions/cart';
import CustomHeaderButton from "../../components/UI/HeaderButton";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const selectItemHandler = (product) => {
        props.navigation.navigate('ProductDetail', {
            productId: product.id,
            productTitle: product.title
        });
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

export default ProductsOverviewScreen;