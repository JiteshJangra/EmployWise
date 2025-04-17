import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./components/Auth";
import UsersList from "./components/UsersList";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <div className="h-screen w-full">      
        <Router>
          <div className="h-full flex flex-col">
            <Navbar />
              <div className="h-full">
            <Routes>                
              <Route path="/login" element={<Auth />} />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
                />
              <Route path="/" element={<Navigate to="/users" />} />
            </Routes>
                </div>
          </div>
        </Router>
    </div>
  );
};

export default App;
