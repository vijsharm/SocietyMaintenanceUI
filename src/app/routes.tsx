import { createBrowserRouter } from "react-router";
import { MemberList } from "@/app/components/member-list";
import { AddPayment } from "@/app/components/add-payment";
import { MemberStatement } from "@/app/components/member-statement";
import { Dashboard } from "@/app/components/dashboard";
import { AddMember } from "@/app/components/add-member";
import { EditMember } from "@/app/components/edit-member";
import { Reports } from "@/app/components/reports";
import { Login } from "@/app/components/login";
import { DuesManagement } from "@/app/components/dues-management";
import { ElectricityDues } from "@/app/components/electricity-dues";
import { SocietyBalance } from "@/app/components/society-balance";
import { ExpendituresList } from "@/app/components/expenditures-list";
import { AddExpenditure } from "@/app/components/add-expenditure";
import { ProtectedRoute } from "@/app/components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/members",
    element: <ProtectedRoute><MemberList /></ProtectedRoute>,
  },
  {
    path: "/add-member",
    element: <ProtectedRoute adminOnly><AddMember /></ProtectedRoute>,
  },
  {
    path: "/edit-member/:memberId",
    element: <ProtectedRoute adminOnly><EditMember /></ProtectedRoute>,
  },
  {
    path: "/add-payment",
    element: <ProtectedRoute adminOnly><AddPayment /></ProtectedRoute>,
  },
  {
    path: "/statement/:memberId",
    element: <ProtectedRoute><MemberStatement /></ProtectedRoute>,
  },
  {
    path: "/reports",
    element: <ProtectedRoute><Reports /></ProtectedRoute>,
  },
  {
    path: "/dues",
    element: <ProtectedRoute><DuesManagement /></ProtectedRoute>,
  },
  {
    path: "/electricity-dues",
    element: <ProtectedRoute adminOnly><ElectricityDues /></ProtectedRoute>,
  },
  {
    path: "/society-balance",
    element: <ProtectedRoute><SocietyBalance /></ProtectedRoute>,
  },
  {
    path: "/expenditures",
    element: <ProtectedRoute><ExpendituresList /></ProtectedRoute>,
  },
  {
    path: "/add-expenditure",
    element: <ProtectedRoute adminOnly><AddExpenditure /></ProtectedRoute>,
  },
]);