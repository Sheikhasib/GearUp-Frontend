import { create } from "zustand"

interface RentSelection {
  gearItemId: string | null
  gearName: string
  priceRatePerDay: number
  startDate: Date | null
  endDate: Date | null
  days: number
  totalPrice: number
  quantity: number
  maxQuantity: number
}

interface RentSelectionActions {
  setGear: (gear: {
    id: string
    name: string
    priceRatePerDay: number
    availableQuantity: number
  }) => void
  setRentalDetails: (details: {
    startDate: Date
    endDate: Date
    days: number
    totalPrice: number
    quantity: number
  }) => void
  setQuantity: (qty: number) => void
  reset: () => void
}

const initialState: RentSelection = {
  gearItemId: null,
  gearName: "",
  priceRatePerDay: 0,
  startDate: null,
  endDate: null,
  days: 0,
  totalPrice: 0,
  quantity: 1,
  maxQuantity: 1,
}

export const useRentSelectionStore = create<RentSelection & RentSelectionActions>((set) => ({
  ...initialState,
  setGear: (gear) =>
    set({
      gearItemId: gear.id,
      gearName: gear.name,
      priceRatePerDay: gear.priceRatePerDay,
      maxQuantity: gear.availableQuantity,
      quantity: 1,
    }),
  setRentalDetails: (details) =>
    set({
      startDate: details.startDate,
      endDate: details.endDate,
      days: details.days,
      totalPrice: details.totalPrice,
      quantity: details.quantity,
    }),
  setQuantity: (qty) => set({ quantity: qty }),
  reset: () => set(initialState),
}))
