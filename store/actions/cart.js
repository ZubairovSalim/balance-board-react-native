export const ADD_TO_CART = 'ADD_TO_CART';
export const DElETE_FROM_CART = 'DElETE_FROM_CART';

export const addToCart = product => {
    return {
        type: ADD_TO_CART,
        product: product
    }
}

export const deleteFromCart = product => {
    return {
        type: DElETE_FROM_CART,
        product: product
    }
}

