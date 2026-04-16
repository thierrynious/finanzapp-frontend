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
        <Route
          path="/login"
          element={
            !isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <RegisterPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/transactions"
          element={
            isLoggedIn ? <TransactionsPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/upload"
          element={
            isLoggedIn ? (
              <BankStatementUpload />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
