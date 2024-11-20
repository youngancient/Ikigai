import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { AddTrustFundButton } from "../../components/trustfund/AddTrustFundButton";
import { AddTrustFundModal } from "../../components/trustfund/AddTrustFundModal";
import { TrustFundActivityContainer } from "../../components/trustfund/TrustFundActivityContainer";
import { TrustFundItem } from "../../components/trustfund/TrustFundItem";
import { useTrustFund } from "../../hooks/useTrustFund";
import useRunners from "../../hooks/useRunners";
import type { Fund } from "../../types/trustfund";

export const Trustfund = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [funds, setFunds] = useState<{ id: string; data: Fund }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signer } = useRunners();
  const { getTrusteeFunds, getFundDetails, getTotalFunds } = useTrustFund();
  
  const fetchFunds = async () => {
    if (!signer) {
      setError("Please connect your wallet");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const address = await signer.getAddress();

      const fundIds = await getTrusteeFunds(address);

      if (!fundIds || fundIds.length === 0) {
        const totalFunds = await getTotalFunds();
      }

      const fundDetails = await Promise.all(
        fundIds.map(async (id) => {
          try {
            const details = await getFundDetails(id);
            return { id, data: details! };
          } catch (err) {
            console.error(`Error fetching details for fund ${id}:`, err);
            return null;
          }
        })
      );

      const validFunds = fundDetails.filter((fund): fund is { id: string; data: Fund } => 
        fund !== null && fund.data !== null
      );

      setFunds(validFunds);
    } catch (err) {
      console.error("Error in fetchFunds:", err);
      setError("Failed to fetch trust funds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [signer]);

  // Refresh funds after creation
  const handleFundCreated = () => {
    console.log("Refreshing funds after creation");
    fetchFunds();
  };

  return (
    <Layout title="Trust Fund">
      <AddTrustFundModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        onSuccess={handleFundCreated}
      />

      <div className="w-full pb-20">
        <div className="w-full flex flex-wrap gap-5">
          {loading ? (
            <div className="text-white">Loading trust funds...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : funds.length > 0 ? (
            funds.map((fund) => (
              <TrustFundItem
                key={fund.id}
                fund={fund.data}
                fundId={fund.id}
              />
            ))
          ) : (
            <div className="text-white flex flex-col items-center gap-2">
              <p>No trust funds found</p>
              <button 
                onClick={fetchFunds}
                className="text-sm text-blue-400 underline"
              >
                Refresh funds
              </button>
            </div>
          )}
          <AddTrustFundButton onClick={() => setIsOpen(true)} />
        </div>

        <div className="mt-5 w-full">
        <TrustFundActivityContainer funds={funds}/>
      </div>
      </div>
    </Layout>
  );
};