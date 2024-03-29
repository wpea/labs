import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [sharedState, updateSharedState] = useState({
    refresh: false,
    token: "",
    projects: [],
    milestones: [],
    tasks: [],
    activity: [],
    reg: {
      step_one: {
        info: {},
        res: {},
      },
      step_two: {},
      step_three: {},
      step_four: {},
    },
  });

  const contextValue = useMemo(() => {
    return [sharedState, updateSharedState];
  }, [sharedState, updateSharedState]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
