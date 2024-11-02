import { create } from 'zustand';

interface DateRange {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export const useDateRangeStore = create<DateRange>((set) => ({
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  setStartDate: (date: Date) => set(() => ({ startDate: date })),
  setEndDate: (date: Date) => set(() => ({ endDate: date })),
}));
