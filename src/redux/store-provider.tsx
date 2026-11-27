"use client";

import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(makeStore);
  /** Pre-rehydration state, so hydration matches the server-rendered empty store. */
  const [serverState] = useState(store.getState);

  return (
    <Provider store={store} serverState={serverState}>
      {children}
    </Provider>
  );
};
