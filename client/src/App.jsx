import ProviderController from "./providers/ProviderController";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const PrivateRoute = ({ element }) => {
  const [cookies] = useCookies(['token']);
  return cookies.token ? element : <Navigate to="/" />;
};

export default function App() {
  return (
    <ProviderController>
      <Router>
        <Routes>

        </Routes>
      </Router>
    </ProviderController>
  )
}