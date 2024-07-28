import supabase from "../../supabase-client";

const usersSlice = (set: any, get: any) => ({
  users: [],
  selectedUser: null,

  getUsers: async (myId: number) => {
    const { data: users, error } = await supabase
      .from("users")
      .select()
      .not("id", "eq", myId);

    if (error) {
      console.log("error", error);
      set({ error, loading: false });
      return null;
    }

    if (!users || users.length === 0) {
      set({
        error: { message: "No users found" },
        loading: false,
        users: [],
      });
      return null;
    }

    set({ users: users, loading: false });
    return users;
  },
  getUserById: async (userId: number) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("error", error);
      set({ error, loading: false });
      return null;
    }

    if (!user) {
      set({
        error: { message: "User not found" },
        loading: false,
        selectedUser: null,
      });
      return null;
    }

    set({ selectedUser: user, loading: false });
    return user;
  },
});

export default usersSlice;
