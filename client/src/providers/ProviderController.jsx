import React from "react";
import UserProvider from "./UserProvider";
import FittingsProvider from "./FittingsProvider";

export default function ProviderController({ children }) {
  return (
    <div>
      <FittingsProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </FittingsProvider>
    </div>
  );
}