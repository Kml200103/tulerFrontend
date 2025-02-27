import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  cartQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.cartQuantity = 0;
      state.totalPrice = 0;
    },

    addToCart: (state, action) => {
      const { productId, variant, price } = action.payload; // Extract weight from variant

      const itemIndex = state.items.findIndex(
        (item) =>
          item.productId === productId && item.variant.weight === variant.weight
      );

      if (itemIndex >= 0) {
        // If item exists, increase quantity and update totalPrice
        state.items[itemIndex].quantity += 1;
        state.items[itemIndex].totalPrice =
          state.items[itemIndex].quantity * state.items[itemIndex].price;
      } else {
        // Add new item with totalPrice
        const tempProduct = {
          ...action.payload,
          quantity: 1, // Default quantity
          price, // Ensure price is included
          totalPrice: price, // Initialize totalPrice
        };
        state.items.push(tempProduct);
      }

      // Recalculate total amount
      getTotalAmount(state);
    },

    removeItem: (state, action) => {
      const { productId, weight } = action.payload;

      state.items = state.items.filter(
        (product) =>
          product.productId !== productId || product.variant.weight !== weight
      );

      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    decreaseQuantity: (state, action) => {
      const { productId, weight } = action.payload;

      const cartItem = state.items.find(
        (item) => item.productId === productId && item.variant.weight === weight
      );

      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
      } else if (cartItem) {
        state.items = state.items.filter(
          (product) =>
            product.productId !== productId || product.variant.weight !== weight
        );
      }

      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    increaseQuantity: (state, action) => {
      const { productId, weight } = action.payload;

      const cartItem = state.items.find(
        (item) => item.productId === productId && item.variant.weight === weight
      );

      if (cartItem) {
        cartItem.quantity += 1;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
      }

      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    getTotalAmount: (state) => {
      let quantity = 0;
      let total = 0;
      state.items.forEach((item) => {
        quantity += item.quantity;
        total += item.totalPrice;
      });

      state.cartQuantity = quantity;
      state.totalPrice = total;
    },
  },
});

export const {
  clearCart,
  addToCart,
  removeItem,
  decreaseQuantity,
  increaseQuantity,
  getTotalAmount,
} = cartSlice.actions;

export default cartSlice.reducer;
