import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { AddTrustFundButton } from "../../components/trustfund/AddTrustFundButton";
import { AddTrustFundModal } from "../../components/trustfund/AddTrustFundModal";
import { TrustFundActivityContainer } from "../../components/trustfund/TrustFundActivityContainer";
import { TrustFundItem } from "../../components/trustfund/TrustFundItem";

export const Trustfund = () => {
  const [isOpen, setIsOpen] = useState(false);

 
  return (
    <Layout title="Trust Fund">
      <AddTrustFundModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="w-full pb-20">
        <div className="w-full flex">
          <TrustFundItem />
          <AddTrustFundButton onClick={() => setIsOpen(true)} />
        </div>

        <div className="mt-5 w-full">
          <TrustFundActivityContainer />
        </div>
      </div>
    </Layout>
  );
};
