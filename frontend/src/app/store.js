import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "@/features/authSlice.js";
// import { authApi } from "@/features/api/authApi";
// import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer";
// import { courseApi } from "@/features/api/courseApi";

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     //   serializableCheck: false,
  //   }).concat(authApi.middleware, courseApi.middleware),
});

// this will refetch user in page load
// setupListeners(
//   store.dispatch(authApi.endpoints.getUser.initiate({}, { forceRefetch: true }))
// );

// const mountUserOnRefreshWindow = async () => {
//   await store.dispatch(
//     authApi.endpoints.getUser.initiate({}, { forceRefetch: true })
//   );
// };

// mountUserOnRefreshWindow();
