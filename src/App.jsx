import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./Home";
import Calendar from "./Calendar";
import Profile from "./Profile";
import Shop from "./Shop";
import Pets from "./Pets";
import Habits from "./Habits";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./Login";
import DailyUpdate from "./DailyUpdate";

// 🔹 PrivateRoute - Protects all authenticated routes
function PrivateRoute() {
  const [user] = useAuthState(auth);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Only accessible after login */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} /> {/* Default child of "/" */}
          <Route path="habits" element={<Habits />} />
          <Route path="dailyupdate" element={<DailyUpdate />} />

          <Route path="shop" element={<Shop />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="pets" element={<Pets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
