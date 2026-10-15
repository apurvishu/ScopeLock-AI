// frontend/src/context/UserContext.tsx
import React, { createContext, useContext, useState } from "react";
import { DEMO_USERS } from "../api";
import type { DemoUser } from "../api";


export { DEMO_USERS };


interface UserCtx {
  user: DemoUser;
  setUser: (u: DemoUser) => void;
}

const UserContext = createContext<UserCtx>({
  user: DEMO_USERS[0],
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser>(DEMO_USERS[0]);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
