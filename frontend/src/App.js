import "./App.css";
import Auth from "./pages/Auth";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const login = (token, userId, tokenExpiration) => {
    setToken(token)
    setUserId(userId)
  }
  const logout = () => {
    setToken(null)
    setUserId(null)
  }
  return (
    // useRoutes
    <BrowserRouter>
      <AuthContext.Provider value={{token: token, userId: userId, login: login, logout: logout}}>
        <MainNavigation />
        <main className="main">
          <Routes>
            { token && <Route path="/" element={<Navigate to="/events" replace />} />}
            { token && <Route path="/auth" element={<Navigate to="/events" replace />} />}
            { !token && <Route path="/auth" Component={Auth} />}
            { !token && <Route path="/" Component={Auth} />}
            <Route path="/events" Component={Events} />
           { token && <Route path="/bookings" Component={Bookings} />}
          </Routes>
        </main>
        {!token && <Navigate to='/auth' replace/>}
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
