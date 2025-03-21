import { createContext, useContext, useState } from "react";
import { UserProps } from "../../interfaces";



interface UserContextProps {
    user: UserProps | null;
    setUser: (user: UserProps) => void;
    removeUser: () => void;
}

const UserContext = createContext<UserContextProps>({
    user: {} as UserProps,
    setUser: () => {},
    removeUser: () => {}
});

const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null);

    const setUserData = (user: UserProps) => {
        setUser(user);
    };

    const removeUserData = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{user, setUser: setUserData, removeUser: removeUserData}}>
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