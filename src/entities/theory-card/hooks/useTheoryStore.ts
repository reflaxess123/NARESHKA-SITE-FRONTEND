import { useStores } from "@/app/providers/StoreProvider";
import { TheoryStore } from "../model/TheoryStore";

export const useTheoryStore = (): TheoryStore => {
  const rootStore = useStores();
  return rootStore.theoryStore;
};
