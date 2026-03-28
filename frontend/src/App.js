import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import Meetings from "./pages/Meetings";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";



function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/" element={<Home />} />
        <Route path="/book/:slug" element={<Booking />} />
        <Route path="/success" element={<Success />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/edit/:id" element={<EditEvent />} />
      </Routes>
    </div>
  );
}

export default App;