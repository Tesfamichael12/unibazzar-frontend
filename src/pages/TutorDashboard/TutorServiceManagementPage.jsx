import React from "react";
import { useSelector } from "react-redux";
import MyTutoringServices from "../../components/TutorDashboard/MyTutoringServices";

export default function TutorServiceManagementPage() {
  const { token } = useSelector((state) => state.auth);

  return <MyTutoringServices token={token} />;
}
