import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { AddTrustFundButton } from "../../components/trustfund/AddTrustFundButton";
import { AddTrustFundModal } from "../../components/trustfund/AddTrustFundModal";
import { TrustFundActivityContainer } from "../../components/trustfund/TrustFundActivityContainer";

export const Trustfund = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <Layout title="Trust Fund">
      <AddTrustFundModal isOpen={isOpen} onClose={handleCloseModal} />

      <div className="w-full pb-20">
        <div className="w-full">
          <AddTrustFundButton onClick={() => setIsOpen(true)} />
        </div>

        <div className="mt-5 w-full">
          <TrustFundActivityContainer />
        </div>
      </div>
    </Layout>
  );
};
