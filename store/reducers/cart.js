import {ADD_TO_CART, DElETE_FROM_CART} from "../actions/cart";
import CartItem from "../../models/cart-item";
import {ADD_ORDER} from "../actions/orders";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice);
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedProduct.id]: updatedOrNewCartItem
                },
                totalAmount: state.totalAmount + productPrice
            }
        case DElETE_FROM_CART:
            const deletedProduct = action.product;
            let newState = {
                ...state,
                items: {
                    ...state.items,
                },
            };

            if (state.items[deletedProduct.id]) {
                if (state.items[deletedProduct.id].quantity > 1) {
                    newState.items[deletedProduct.id] = new CartItem(
                        state.items[deletedProduct.id].quantity - 1,
                        deletedProduct.productPrice,
                        deletedProduct.productTitle,
                        deletedProduct.sum - deletedProduct.productPrice
                    );
                    newState.totalAmount -= deletedProduct.productPrice;
                } else {
                    delete newState.items[deletedProduct.id];
                    newState.totalAmount -= deletedProduct.sum;
                }
                return newState;
            }

            return {...state};
        case ADD_ORDER:
            return initialState;
    }
    return state;
};

