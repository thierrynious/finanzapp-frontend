import { Routes, Route, Navigate } from "react-router-dom";
import CategoriesPage from "./categories/CategoriesPage";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import DashboardPage from "./dashboard/DashboardPage";
import TransactionsPage from "./transactions/TransactionsPage";
import BankStatementUpload from "./bank/BankStatementUpload";
import AppLayout from "./layout/AppLayout";
import SettingsPage from "./settings/SettingsPage";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
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
          !isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />
        }
      />

      {isLoggedIn ? (
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/upload" element={<BankStatementUpload />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
