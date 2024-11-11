//create a zustand store for a token of a user
import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { v4 as uuidv4 } from "uuid";

type InterfaceState = {
  errors: { type: string; message: string; id?: string }[];
  setErrors: (errors: any[]) => void;
  addError: (error: { type: string; message: string; id?: string }, timeout?: number) => void;
  removeError: (id: string) => void;
};

export const useInterfaceStore = create<InterfaceState>((set: any, get: any) => ({
  errors: [],
  setErrors: (errors: any[]) => set({ errors }),

  addError: (error: any, timeout = 5000) => {
    const { errors } = get();
    const id = uuidv4();
    set({ errors: [...errors, { id, ...error }] });

    setTimeout(() => {
      const { errors } = get();
      set({ errors: errors.filter((e: any) => e.id !== id) });
    }, timeout);
  },

  removeError: (id: string) => {
    set((state: any) => ({
      errors: state.errors.filter((error: any) => error.id !== id),
    }));
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useInterfaceStore);
}
