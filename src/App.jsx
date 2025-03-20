import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Calendar from "./Calendar";
import Profile from "./Profile";
import Shop from "./Shop";
import Pets from "./Pets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pets" element={<Pets />} />
      </Routes>
    </Router>
  );
}

export default App;
