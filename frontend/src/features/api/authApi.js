import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, logout } from "../authSlice";
import { toast } from "sonner";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/user",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          console.log("response", response);
          dispatch(login({ user: response.data.user }));
        } catch (error) {
          console.log("loginUser error", error);
        }
      },
    }),

    getUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          console.log("response", response);
          dispatch(login({ user: response.data.user }));
        } catch (error) {
          console.log("loginUser error", error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(logout());
          // console.log("logout response", response);
          toast.success(response?.data?.message || "Logout successful");
        } catch (error) {
          console.log("logoutUser error", error);
          toast.error(error?.data?.error || "Logout failed");
        }
      },
    }),

    // getProfile: builder.query({
    //   query: (credentials) => ({
    //     url: "/profile",
    //     method: "GET",
    //     body: credentials,
    //   }),
    // }),

    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "/profile/update",
        method: "PUT",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = authApi;
