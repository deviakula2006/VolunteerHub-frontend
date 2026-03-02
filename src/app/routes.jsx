import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import Explore from "../pages/volunteer/Explore";
import MyApplications from "../pages/volunteer/MyApplications";

import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import ManageApplications from "../pages/organization/ManageApplications";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Volunteer */}
      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute role="volunteer">
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/explore"
        element={
          <ProtectedRoute role="volunteer">
            <Explore />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/applications"
        element={
          <ProtectedRoute role="volunteer">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* Organization */}
      <Route
        path="/organization/dashboard"
        element={
          <ProtectedRoute role="organization">
            <OrganizationDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organization/manage"
        element={
          <ProtectedRoute role="organization">
            <ManageApplications />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}