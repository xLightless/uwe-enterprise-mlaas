import React, { createContext, useContext, useState } from "react";
import { UserProps } from "../../interfaces";



interface UserContextProps {
    setUser: (user: UserProps) => void;
    removeUser: () => void;
    getUser: () => UserProps | null;
}

const UserContext = createContext<UserContextProps>({
    setUser: () => {},
    removeUser: () => {},
    getUser: () => null,
});

interface UserProviderProps {
    children: React.ReactNode;
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUserData] = useState<UserProps | null>(null);

    const setUser = (user: UserProps) => {
        setUserData(user);
    };

    const removeUser = () => {
        setUserData(null);
    };

    const getUser = () => {
        if (user) return user;
        return null;
    }

    return (
        <UserContext.Provider value={{setUser, removeUser, getUser}}>
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export { UserProvider, useUserContext };