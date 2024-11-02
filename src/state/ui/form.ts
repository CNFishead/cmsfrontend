import { FormInstance } from "antd";
import { create } from "zustand";

/**
 * @description state management to help in the implementation of forms
 */
interface Form {
  setCurrentForm: (form: any) => void;
  currentForm: any;
}

export const useFormStore = create<Form>((set) => ({
  currentForm: undefined,
  setCurrentForm: (form: FormInstance) => set({ currentForm: form }),
}));
