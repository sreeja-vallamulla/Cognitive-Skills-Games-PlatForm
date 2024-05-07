import { create } from "zustand";

export interface IInitialData {
  name: string;
  email: string;
  uid: string;
  photoURL: string;
  refreshToken: string;
  //   accessToken: string;
}

interface IProps {
  userDetails: IInitialData;
  updateUserDetails: (data: IInitialData) => any;
}

export const UserStore = create<IProps>((set) => ({
  userDetails: {
    name: "",
    email: "",
    // accessToken: "",
    photoURL: "",
    refreshToken: "",
    uid: "",
  },
  updateUserDetails: (data: IInitialData) =>
    set(() => ({
      userDetails: {
        ...data,
      },
    })),
}));
