import React from "react";
import UserProvider from "./userProvider";

export default function ProviderController({ children }) {
  return (
    <div>
      <UserProvider>
        {children}
      </UserProvider>
    </div>
  );
}