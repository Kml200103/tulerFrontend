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
      const itemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId // Check for variantId as well
      );

      if (itemIndex >= 0) {
        // If item exists, increase quantity and update totalPrice
        state.items[itemIndex].quantity += 1;
        state.items[itemIndex].totalPrice =
          state.items[itemIndex].quantity * state.items[itemIndex].price; // Update totalPrice
      } else {
        // Add new item with totalPrice
        const tempProduct = {
          ...action.payload,
          quantity: 1, // Default quantity
          price: action.payload.price, // Ensure price is included
          totalPrice: action.payload.price, // Initialize totalPrice
        };
        state.items.push(tempProduct);
      }

      // Recalculate total amount
      getTotalAmount(state);
    },

    removeItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.filter(
        (product) =>
          product.productId !== productId ||
          (product.productId === productId && product.variantId !== variantId) // Ensure only the matching variant gets removed
      );

      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    decreaseQuantity: (state, action) => {
      const cartItem = state.items.find(
        (pd) =>
          pd.productId === action.payload.productId &&
          pd.variantId === action.payload.variantId // Check for both productId and variantId
      );
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1; // Decrease quantity
        cartItem.totalPrice = cartItem.quantity * cartItem.price; // Update totalPrice based on new quantity
      } else if (cartItem) {
        const nextCartItems = state.items.filter(
          (product) =>
            product.productId !== action.payload.productId ||
            product.variantId !== action.payload.variantId // Check for both productId and variantId
        );
        state.items = nextCartItems;
      }
      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    increaseQuantity: (state, action) => {
      const cartItem = state.items.find(
        (pd) =>
          pd.productId === action.payload.productId &&
          pd.variantId === action.payload.variantId // Check for both productId and variantId
      );
      if (cartItem) {
        cartItem.quantity += 1; // Increase quantity
        cartItem.totalPrice = cartItem.quantity * cartItem.price; // Update totalPrice based on new quantity
      }
      // Recalculate total price and quantity
      getTotalAmount(state);
    },

    getTotalAmount: (state) => {
      let quantity = 0;
      let total = 0;
      state.items.forEach((item) => {
        quantity += item.quantity; // Use quantity
        total += item.totalPrice; // Calculate total price based on totalPrice of each item
      });

      state.cartQuantity = quantity; // Update total quantity
      state.totalPrice = total; // Update total price in state
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
