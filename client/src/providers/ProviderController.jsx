import React from "react";
import UserProvider from "./UserProvider";

export default function ProviderController({ children }) {
  return (
    <div>
      <UserProvider>
        {children}
      </UserProvider>
    </div>
  );
}