import { Layout } from "../../components/layout/Layout";
import { AddTrustFundButton } from "../../components/trustfund/AddTrustFundButton";
import { TrustFundActivityContainer } from "../../components/trustfund/TrustFundActivityContainer";

export const Trustfund = () => {
  return (
    <Layout title="Trust Fund">
      <div className="w-full pb-20">
        <div className="w-full">
          <AddTrustFundButton />
        </div>

        <div className="mt-5 w-full">
          <TrustFundActivityContainer />
        </div>
      </div>
    </Layout>
  );
};
