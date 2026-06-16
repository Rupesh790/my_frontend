import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
// google login 
import Login from "./googlelogin/login";
import Profile from "./googlelogin/Profile";

function App() {
  return (
    <>
      <Header />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;