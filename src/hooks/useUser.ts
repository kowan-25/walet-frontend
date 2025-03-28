import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface User {
  userId: string;
  username: string;
}

interface UserStore {
  userId: string;
  username: string;
  setId: (userId: string) => void;
  setUsername: (username: string) => void;
  logout: () => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      userId: "",
      username: "",
      setId: (userId) => set({ userId }),
      setUsername: (username) => set({ username }),
      logout: () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        set({ userId: "", username: "" });
      }
    }),
    {
      name: "user",
    }
  )
);

export default useUser;
