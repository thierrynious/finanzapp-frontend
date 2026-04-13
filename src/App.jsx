import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import DashboardPage from "./dashboard/DashboardPage";
import TransactionsPage from "./transactions/TransactionsPage";
import BankStatementUpload from "./bank/BankStatementUpload";
import Navbar from "./components/Navbar";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <>
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/transactions"
          element={isLoggedIn ? <TransactionsPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/upload"
          element={
            isLoggedIn ? <BankStatementUpload /> : <Navigate to="/login" />
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;
