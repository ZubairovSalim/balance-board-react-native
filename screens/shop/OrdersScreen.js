import React, {useCallback, useEffect, useState} from 'react';
import {Text, FlatList, StyleSheet, Platform, View, Button, ActivityIndicator} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import {fetchOrders} from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(fetchOrders());
        } catch(error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    // useEffect(() => {
    //     const willFocusSubscription = props.navigation.addListener('willFocus', loadOrders);
    //     return () => willFocusSubscription.remove();
    // }, [loadOrders]);

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Ann error occurred!</Text>
                <Button title='Try again' onPress={loadOrders} color={Colors.primary} />
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

    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No orders found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orders}
            renderItem={itemData => {
                return (
                    <OrderItem
                        amount={itemData.item.totalAmount}
                        date={itemData.item.readableDate}
                        items={itemData.item.items}
                    />
                )
            }} />
    )
}

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer()
                }} />
        </HeaderButtons>
    )};
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;