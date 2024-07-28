import { create } from "zustand";
import { devtools } from "zustand/middleware";
import authSlice from "./slices/authSlice";
import usersSlice from "./slices/usersSlice";
import messageSlice from "./slices/messageSlice";

const useStore = create(
  devtools((set: any, get: any) => {
    return {
      ...authSlice(set, get),
      ...usersSlice(set, get),
      ...messageSlice(set, get),
    };
  })
);

useStore.getState().getUser();

export default useStore;
