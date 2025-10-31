import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  initialRoute: null, 

  setUser: (user) => set({ user }),

  setToken: async (token) => {
    await AsyncStorage.setItem("token", token);
    set({ token });
  },

  setInitialRoute: (route) => set({ initialRoute: route }),

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null, initialRoute: "GetStarted" });
  },

  fetchUser: async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (!storedToken) {
      console.warn("⚠️ No stored token found.");
      set({ initialRoute: "GetStarted" });
      return;
    }

    try {
      const url = "https://odara-app.onrender.com/api/auth/me";
      console.log("🔍 Fetching user from:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) {
          console.log("✅ User fetched successfully:", data.user);
          set({ user: data.user, token: storedToken });

          // ✅ Decide route here
          if (data.user?.isVerified) {
            set({ initialRoute: "navigation" });
          } else {
            set({ initialRoute: "GetStarted" });
          }
        } else {
          console.error("❌ Failed to fetch user:", data.message);
          set({ initialRoute: "Login" });
        }
      } else {
        const text = await res.text();
        console.error("❌ Unexpected response:", text);
        set({ initialRoute: "Login" });
      }
    } catch (err) {
      console.error("❌ Fetch user error:", err);
      set({ initialRoute: "Login" });
    }
  },
}));

export default useAuthStore;
