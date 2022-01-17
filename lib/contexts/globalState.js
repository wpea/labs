import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {

    const [sharedState, setSharedState] = useState({
        refresh: false,
        projects: [],
        activity: []
    });

    const contextValue = useMemo(() => {
        return [sharedState, setSharedState];
    }, [sharedState, setSharedState]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}