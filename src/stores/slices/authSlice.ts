import supabase from "../../supabase-client";

let authSubscription: any = null;

const authSlice = (set: any, get: any) => ({
  profile: null,
  user: null,
  authenticated: false,
  authHydrated: false,
  loading: true,
  refreshProfile: async () => {
    const currentUser = get().user;
    const input_uuid_id = currentUser?.id;

    if (!input_uuid_id) {
      return null;
    }

    const { data, error } = await supabase
      .rpc("get_user_info", {
        input_uuid_id,
      })
      .single();

    if (error) {
      console.log(error);
      set({ error });
      return null;
    }

    set({ profile: data });
    return data;
  },
  getUser: async () => {
    if (authSubscription) {
      return;
    }

    authSubscription = supabase.auth.onAuthStateChange((event, session: any) => {
      set({ loading: true });
      const fetchPublicUser = async (input_uuid_id: string) => {
        let { data, error } = await supabase
          .rpc("get_user_info", {
            input_uuid_id,
          })
          .single();
        if (error) {
          console.log(error);
          set({ profile: null, authHydrated: true, loading: false });
        } else {
          set({ profile: data, authHydrated: true, loading: false });
        }
      };
      set({ user: session?.user });
      switch (event) {
        case "SIGNED_IN":
          set({ authenticated: true });
          fetchPublicUser(session.user.id);
          break;

        case "SIGNED_OUT":
          set({ authenticated: false, profile: null, authHydrated: true });
          break;
        case "TOKEN_REFRESHED":
          if (session) {
            set({ authenticated: true });
            fetchPublicUser(session.user.id);
          } else {
            set({ authenticated: false, profile: null, authHydrated: true });
          }
          break;
        case "INITIAL_SESSION":
          if (session) {
            set({ authenticated: true });
            fetchPublicUser(session.user.id);
          } else {
            set({ authenticated: false, profile: null, authHydrated: true, loading: false });
          }
          break;

        case "USER_UPDATED":
          if (session) {
            set({ authenticated: true });
            fetchPublicUser(session.user.id);
          } else {
            set({ authenticated: false, profile: null, authHydrated: true });
          }
          break;

        default:
          set({ authHydrated: true });
          break;
      }
      set({ loading: false });
    });
  },

  createNewUser: async (payload: any) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.log("error", error);
      set({ error });
      set({ loading: false });
      return null;
    }
    if (data) {
      set({ profile: data });
      set({ loading: false });
      return data;
    }
    set({ loading: false });
  },

  signupWithEmail: async (email: string, password: string) => {
    set({ loading: true });
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log("error", error);
      set({ error });
      set({ loading: false });
      return null;
    }
    if (user) {
      set({ user: user });
      set({ authenticated: true });
      set({ loading: false });
    }
    set({ loading: false });
  },
  loginWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ authenticated: false });
      return { error: error.message };
    }

    if (data) {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("uuid", data.user.id)
        .single();

      set({ profile: user });
      set({ authenticated: true });
      return data;
    }
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out", error);
    } else {
      set({ authenticated: false });
      set({ profile: null });
    }
  },
  updateProfile: async (payload: any) => {
    const currentUser = get().user;

    if (!currentUser?.id) {
      const error = { message: "No authenticated user found." };
      set({ error });
      return { error };
    }

    set({ loading: true });
    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("uuid", currentUser.id)
      .select("*")
      .single();

    if (error) {
      console.log("Error updating profile", error);
      set({ error, loading: false });
      return { error };
    }

    set({ profile: data, loading: false });
    return { data };
  },
  uploadAvatarFile: async (file: File) => {
    const currentUser = get().user;

    if (!currentUser?.id) {
      const error = { message: "No authenticated user found." };
      set({ error });
      return { error };
    }

    if (!file) {
      const error = { message: "No file selected." };
      return { error };
    }

    const avatarBucket =
      process.env.REACT_APP_SUPABASE_AVATAR_BUCKET || "avatars";
    const fileExt = file.name.split(".").pop() || "png";
    const filePath = `${currentUser.id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(avatarBucket)
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.log("Error uploading avatar", uploadError);
      set({ error: uploadError });
      return { error: uploadError };
    }

    const { data } = supabase.storage.from(avatarBucket).getPublicUrl(filePath);
    return { data: { publicUrl: data.publicUrl } };
  },
  uploadProfileAvatar: async (file: File) => {
    set({ loading: true });
    const uploadResponse = await get().uploadAvatarFile(file);
    if (uploadResponse?.error) {
      set({ loading: false });
      return uploadResponse;
    }

    const updateResponse = await get().updateProfile({
      avatar_url: uploadResponse.data.publicUrl,
    });

    set({ loading: false });
    return updateResponse;
  },
});

export default authSlice;
