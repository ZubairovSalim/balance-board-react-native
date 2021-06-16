import PRODUCTS from "../../data/dummy-data";
import {CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT} from "../actions/products";
import Product from "../../models/product";

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.products.filter(prod => prod.ownerId === 'u1')
            }
        case CREATE_PRODUCT:
            const {id, title, description, imageUrl, price} = action.productData;
            const newProduct = new Product(
                id,
                'u1',
                title,
                description,
                imageUrl,
                +price
                )
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct),
            }
        case UPDATE_PRODUCT:
            const {title: upTitle, description: upDescription, imageUrl: upImageUrl} = action.productData;
            const updatedAvailableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
            const updatedUserProductIndex = state.userProducts.findIndex(prod => prod.id === action.pid)
            const updatedProduct = {
                ...state.userProducts[updatedUserProductIndex],
                title: upTitle,
                description: upDescription,
                imageUrl: upImageUrl
            };

            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[updatedAvailableProductIndex] = updatedProduct;

            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[updatedUserProductIndex] = updatedProduct;

            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts,
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
            }
    }
    return state;
}