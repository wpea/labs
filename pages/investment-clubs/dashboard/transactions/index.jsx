import React from "react";
import DashboardLayout from "../../../../components/investment-club/DashboardLayout";
import KYC from "./kyc";

const index = () => {
  return (
    <DashboardLayout>
      <h1 className="text-[#2D2D2D] text-2xl font-semibold">Transactions</h1>

      <KYC />
    </DashboardLayout>
  );
};

export default index;
