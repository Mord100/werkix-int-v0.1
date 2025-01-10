import React from "react";
import UserProvider from "./UserProvider";
import FittingsProvider from "./FittingsProvider";
import SwingAnalysisProvider from "./SwingAnalysisProvider";

export default function ProviderController({ children }) {
  return (
    <div>
      <SwingAnalysisProvider>
        <FittingsProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </FittingsProvider>
      </SwingAnalysisProvider>
    </div>
  );
}