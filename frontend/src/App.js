import "./App.css";
import Auth from "./pages/Auth";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" Component={Auth} />
          <Route path="/events" Component={Events} />
          <Route path="/bookings" Component={Bookings} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
