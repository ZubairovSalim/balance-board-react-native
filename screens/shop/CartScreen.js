import React from 'react';
import {View, Text, FlatList, Button, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import {deleteFromCart} from "../../store/actions/cart";
import {addOrder} from "../../store/actions/orders";
import Card from "../../components/UI/Card";

const CartScreen = props => {
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const arrayCartItems = [];
        const items = state.cart.items;
        for (const key in items) {
            arrayCartItems.push({
                productId: key,
                productTitle: items[key].productTitle,
                quantity: items[key].quantity,
                productPrice: items[key].productPrice,
                sum: items[key].sum
            })
        }
        return arrayCartItems;
    });

    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
                </Text>
                <Button
                    color={Colors.secondary}
                    title='OrderNow'
                    disabled={cartItems.length === 0}
                    onPress={() => dispatch(addOrder(cartItems, cartTotalAmount))}
                />
            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData => {
                    return (
                        <CartItem
                            quantity={itemData.item.quantity}
                            title={itemData.item.productTitle}
                            amount={itemData.item.sum}
                            deletable
                            onRemove={() => dispatch(deleteFromCart({
                                ...itemData.item,
                                id: itemData.item.productId,
                            }))}
                        />
                    )
                }}
            />
        </View>
    )
}

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        margin: 20,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
});

export default CartScreen;