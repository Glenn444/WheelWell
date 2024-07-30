import AsyncStorage from "@react-native-async-storage/async-storage";
import { Store } from "@/types/store";
import { create,  } from "zustand";
import { createUserSlice } from "./userSlice";
import { immer } from "zustand/middleware/immer";
// import { createCartSlice } from "./cartSlice";
import {
  persist,
  subscribeWithSelector,
  createJSONStorage,
} from "zustand/middleware";
import { useEffect, useState } from "react";

//wrap immer inside devtools
export const useStore = create<Store>()(
  persist(
  subscribeWithSelector(
    immer((...a) => ({
      ...createUserSlice(...a),
      //...createCartSlice(...a)
    }))
  ),
{
  name:'local',
  storage:createJSONStorage(()=> AsyncStorage),
  partialize: (state) =>
    Object.fromEntries(
      Object.entries(state).filter(([key]) => !['socketConnection'].includes(key)),
    )
})
);
export const useHydration = () => {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
