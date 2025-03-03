import { BaseService } from "../../redux/reduxQuery";
import { apiUrl } from "../../utils/constants";

export const UserService = BaseService.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `${apiUrl}/verify`,
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: `${apiUrl}/auth/login`,
        method: "post",
        data: body,
      }),
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        url: `${apiUrl}/registerUpdate`,
        method: "post",
        data: body,
      }),
    }),
   syncCart: builder.mutation({
  query: ({ userId, cartItems, token }) => {
   
    const transformedItems = cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price,
    }));
    return {
      url: `${apiUrl}/cart/add`,
      method: "post",
      body: {
        userId: userId,
        items: transformedItems, // Send the transformed array
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
  async onQueryStarted({ userId, cartItems, token }, { dispatch, queryFulfilled }) {
    if (!userId || !cartItems || cartItems.length === 0) {
      return; // No cart data or no user, nothing to sync
    }
    try {
      await queryFulfilled;
      NotificationService.sendSuccessMessage('Cart synchronized successfully!');
    } catch (error) {
      console.error('Error syncing cart:', error);
      NotificationService.sendErrorMessage('Failed to synchronize cart.');
    }
  },
}),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useSyncCartMutation, // Add the new mutation
} = UserService;