import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  items: [],
  cartQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.cartQuantity = 0;
      state.totalPrice = 0;

    
    },

    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].productQuantity += 1;
        state.cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, productQuantity: 1 };
        state.items.push(tempProduct);
        state.cartQuantity += 1;
      }
    },

    removeItem: (state, action) => {
      const nextCartItems = state.items.filter(
        (product) => product.id !== action.payload
      );
      state.items = nextCartItems;
      state.cartQuantity = state.items.reduce((total, item) => total + item.productQuantity, 0);

    },

    decreaseQuantity: (state, action) => {
      const cartItem = state.items.find(
        (pd) => pd.id === action.payload
      );
      if (cartItem && cartItem.productQuantity > 1) {
        cartItem.productQuantity -= 1;
        state.cartQuantity -= 1;
      } else if (cartItem) {
        const nextCartItems = state.items.filter(
          (product) => product.id !== action.payload
        );
        state.cartItems = nextCartItems;
        state.cartQuantity -= 1;
      }
    },

    increaseQuantity: (state, action) => {
      const cartItem = state.items.find((pd) => pd.id === action.payload);
      if(cartItem){
        cartItem.productQuantity += 1;
        state.cartQuantity += 1;
      }
    },

    getTotalAmount: (state) => {
      let quantity = 0;
      let total = 0;
      state.items.forEach((item) => {
        quantity += item.productQuantity;
        total += item.price * item.productQuantity;
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