import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import SkippedSectionsReducer from "@/redux/features/skipped-sections/skippedSectionSlice";
import CustomStyleReducer from "@/redux/features/custom-styles/customStyleSlice";
import ResumeDataReducer from "@/redux/features/resume-data/resumeDataSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["resumeData", "skippedSections", "customStyles"],
};

const rootReducer = combineReducers({
  resumeData: ResumeDataReducer,
  skippedSections: SkippedSectionsReducer,
  customStyles: CustomStyleReducer,
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore();
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  persistStore(store);

  return store;
};

type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
