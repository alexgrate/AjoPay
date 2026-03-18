import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Nav/Navbar";
import HomePage from "./components/Home/HomePage";
import Footer from "./components/Footer/Footer";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPassword/ForgotPasswordPage";
import Dashboardpage from "./components/DashBoard/Dashboardpage";
import GroupsPage from "./components/Group/Groupspage";
import GroupDetail from "./components/Group/GroupDetail";
import CreateGroup from "./components/Group/Creategroup";
import InvitePage from "./components/Group/Invitepage";
import ProfilePage from "./components/Profile/Profilepage";
import TransactionHistory from "./components/Profile/Transactionhistory";
import BVNVerification from "./components/Register/BVNVerification";

import AboutPage from "./components/Legal/AboutPage";

import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/ErrorPages/NotFound";


import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotten-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route element={<ProtectedRoute />} >
          <Route path="/dashboard" element={<Dashboardpage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/verify-bvn" element={<BVNVerification />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
