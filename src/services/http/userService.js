
import { BaseService } from "../../redux/reduxQuery";
import { apiUrl } from "../../utils/constants";


export const UserService = BaseService.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => ({
                url: `${apiUrl}/verify`,
                method: "get",
                headers: {
                    Authorization: localStorage.getItem("userToken"),
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
                url: `${apiUrl}/register`,
                method: "post",
                data: body,
            }),
        }),

       
    }),
    overrideExisting: false,
});

export const {useGetUserQuery,useLoginUserMutation,useRegisterUserMutation}=UserService
