import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Newsletter from "./pages/Newsletter";
import Dashboard from "./pages/dashboard/Index";
import Payment from "./pages/payment/Index";
import Maintenance from "./pages/Maintenance";

// Mettez cette variable à true pour activer le mode maintenance
const MAINTENANCE_MODE = false;

function App() {
  // Si le mode maintenance est activé, afficher la page de maintenance
  if (MAINTENANCE_MODE) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Maintenance />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
