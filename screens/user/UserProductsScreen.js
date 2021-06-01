import React from 'react';
import {Button, FlatList, Platform, StyleSheet} from "react-native";
import ProductItem from "../../components/shop/ProductItem";
import {useDispatch, useSelector} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import {deleteProduct} from "../../store/actions/products";

const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    return <FlatList
        data={userProducts}
        renderItem={itemData => {
            return (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {}}>
                    <Button color={Colors.primary} title="Edit"
                            onPress={() => {}} />
                    <Button color={Colors.primary} title="Delete"
                            onPress={() => dispatch(deleteProduct(itemData.item.id))} />
                </ProductItem>
            )
        }}
        keyExtractor={item => item.id}
    />

};

UserProductsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
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
    }
}

const styles = StyleSheet.create({

});

export default UserProductsScreen;