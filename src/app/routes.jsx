import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import Explore from "../pages/volunteer/Explore";
import MyApplications from "../pages/volunteer/MyApplications";
import HoursTracker from "../pages/volunteer/HoursTracker";
import Reviews from "../pages/volunteer/Reviews";

import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import ManageApplications from "../pages/organization/ManageApplications";
import CreateOpportunity from "../pages/organization/CreateOpportunity";

import Calendar from "../pages/shared/Calendar";
import Messages from "../pages/shared/Messages";
import Resources from "../pages/shared/Resources";

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
      <Route
        path="/volunteer/hours"
        element={
          <ProtectedRoute role="volunteer">
            <HoursTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/reviews"
        element={
          <ProtectedRoute role="volunteer">
            <Reviews />
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
      <Route
        path="/organization/create"
        element={
          <ProtectedRoute role="organization">
            <CreateOpportunity />
          </ProtectedRoute>
        }
      />

      {/* Shared */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}