import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute, { OnboardingRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./googlelogin/login";
import Profile from "./googlelogin/Profile";

import BrokerSelection from "./pages/brokers/BrokerSelection";
import BrokerConnect, { BrokerManage } from "./pages/brokers/BrokerConnect";
import ZerodhaCallback from "./pages/brokers/ZerodhaCallback";

import StrategyList from "./pages/strategies/StrategyList";
import StrategyBuilder from "./pages/strategies/StrategyBuilder";
import AutoTrading from "./pages/AutoTrading";
import Trades from "./pages/Trades";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function AppLayout({ children, showSidebar = true }) {
  return (
    <>
      <Header />
      <div className="dashboard-layout">
        {showSidebar && <Sidebar />}
        <main className="main-content" id="main-content">
          {children}
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/services" element={<AppLayout><Services /></AppLayout>} />
      <Route path="/Services" element={<AppLayout><Services /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />

      {/* Auth */}
      <Route path="/login" element={<AppLayout showSidebar={false}><Login /></AppLayout>} />

      {/* Onboarding (auth required, no broker required) */}
      <Route path="/brokers/select" element={
        <ProtectedRoute><AppLayout showSidebar={false}><BrokerSelection /></AppLayout></ProtectedRoute>
      } />
      <Route path="/brokers/connect" element={
        <ProtectedRoute><AppLayout showSidebar={false}><BrokerConnect /></AppLayout></ProtectedRoute>
      } />
      <Route path="/brokers/zerodha/callback" element={
        <ProtectedRoute><AppLayout showSidebar={false}><ZerodhaCallback /></AppLayout></ProtectedRoute>
      } />

      {/* Protected app routes (require broker connected) */}
      <Route path="/dashboard" element={
        <OnboardingRoute><AppLayout><Dashboard /></AppLayout></OnboardingRoute>
      } />
      <Route path="/strategies" element={
        <OnboardingRoute><AppLayout><StrategyList /></AppLayout></OnboardingRoute>
      } />
      <Route path="/strategies/new" element={
        <OnboardingRoute><AppLayout><StrategyBuilder /></AppLayout></OnboardingRoute>
      } />
      <Route path="/strategies/:id/edit" element={
        <OnboardingRoute><AppLayout><StrategyBuilder /></AppLayout></OnboardingRoute>
      } />
      <Route path="/auto-trading" element={
        <OnboardingRoute><AppLayout><AutoTrading /></AppLayout></OnboardingRoute>
      } />
      <Route path="/brokers" element={
        <OnboardingRoute><AppLayout><BrokerManage /></AppLayout></OnboardingRoute>
      } />
      <Route path="/trades" element={
        <OnboardingRoute><AppLayout><Trades /></AppLayout></OnboardingRoute>
      } />
      <Route path="/reports" element={
        <OnboardingRoute><AppLayout><Reports /></AppLayout></OnboardingRoute>
      } />
      <Route path="/settings" element={
        <OnboardingRoute><AppLayout><Settings /></AppLayout></OnboardingRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
