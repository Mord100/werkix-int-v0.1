import React from "react";
import UserProvider from "./UserProvider";
import FittingsProvider from "./FittingsProvider";
import SwingAnalysisProvider from "./SwingAnalysisProvider";
import ContentProvider from "./ContentProvider";

export default function ProviderController({ children }) {
  return (
    <div>
      <ContentProvider>
        <SwingAnalysisProvider>
          <FittingsProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </FittingsProvider>
        </SwingAnalysisProvider>
      </ContentProvider>
    </div>
  );
}