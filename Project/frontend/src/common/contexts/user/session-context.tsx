import React, { createContext, JSX, useState } from "react";
import { SessionContextProps } from "../../interfaces";
import Overlay from "../../../components/overlay";


interface SessionProviderProps {
  sessionContext: SessionContextProps | null;
  updateSessionContext: (me: SessionContextProps) => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  PermissionDenied: () => JSX.Element;
}

const SessionContext = createContext<SessionProviderProps | null >(null);

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionContext, setSessionContext] = useState<SessionContextProps | null>(null);

  async function updateSessionContext(me: SessionContextProps) {
    const { userId, role } = me as SessionContextProps;
    setSessionContext({
      userId: userId,
      role: {
        roleId: role.roleId,
        roleName: role.roleName,
        permissions: role.permissions,
      }
    } as SessionContextProps);
  }

  function hasPermission(permissionName: string): boolean {
    return sessionContext?.role.permissions?.some(
      (permission) => permission.permissionName === permissionName
    ) || false;
  }

  const PermissionDenied = () => {
    return (
      <Overlay onClose={() => {}}>
        <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gray-800 bg-opacity-50">
          <div className="w-full">
            <h2 className="text-lg font-bold !text-red-500">Permission Denied.</h2>
            <p className="text-lg text-white">You do not have permission to access this resource.</p>
          </div>
        </div>
      </Overlay>
    )
  };

  return (
    <SessionContext.Provider value={{ sessionContext, updateSessionContext, hasPermission, PermissionDenied }}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}


export { SessionProvider, useSession };