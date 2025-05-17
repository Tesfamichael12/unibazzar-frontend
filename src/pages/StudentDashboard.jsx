import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboardLayout from "../components/StudentDashboard/StudentDashboardLayout";
import StudentDashboardHome from "../components/StudentDashboard/StudentDashboardHome";
import MyListings from "../components/StudentDashboard/MyListings";
import AddListing from "../components/StudentDashboard/AddListing";
import MyServices from "../components/StudentDashboard/MyServices";
import AddService from "../components/StudentDashboard/AddService";
import StudentSettings from "../components/StudentDashboard/StudentSettings";

export default function StudentDashboard() {
  return (
    <Routes>
      <Route element={<StudentDashboardLayout />}>
        <Route index element={<StudentDashboardHome />} />
        <Route path="my-listings" element={<MyListings />} />
        <Route path="add-listing" element={<AddListing />} />
        <Route path="my-services" element={<MyServices />} />
        <Route path="add-service" element={<AddService />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route
          path="*"
          element={<Navigate to="/student-dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}
