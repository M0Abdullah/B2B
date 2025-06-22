"use client";
import React from "react";
import Navbar from "../../components/navbar/page";
import StripeProviderWrapper from "./StripeProviderWrapper";
import CheckoutForm from "./CheckoutForm";

function StripePage() {
  return (
    <div>
      <Navbar
        addModal={false}
        setAddModal={() => {}}
        premium={false}
        setPremium={() => {}}
        selectedPlan=""
        setSelectedPlan={() => {}}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <StripeProviderWrapper>
          <CheckoutForm />
        </StripeProviderWrapper>
      </div>
    </div>
  );
}

export default StripePage;
