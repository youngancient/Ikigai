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
        console.log(totalFunds)
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

  const renderLoadingState = () => (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="text-white font-medium">Loading your trust funds...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      <div className="bg-red-500/10 rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-red-500 text-xl">⚠️</div>
          <h3 className="text-red-500 font-semibold">{error}</h3>
          <button 
            onClick={fetchFunds}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                     transition-colors duration-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-4xl">💰</div>
          <h3 className="text-white font-semibold text-xl">No Trust Funds Yet</h3>
          <p className="text-gray-400 text-sm">
            Create your first trust fund to get started with secure asset management.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors duration-200 text-sm"
            >
              Create Fund
            </button>
            <button 
              onClick={fetchFunds}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg 
                       hover:bg-gray-700 transition-colors duration-200 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CardContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="h-full bg-gray-800/40 rounded-xl overflow-hidden 
                    border border-gray-700/50 hover:border-gray-600/50 
                    transition-all duration-200 
                    flex flex-col
                    min-h-[280px]
                    shadow-lg hover:shadow-xl">
      {children}
    </div>
  );

  return (
    <Layout title="Trust Fund">
      <AddTrustFundModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        onSuccess={handleFundCreated}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Trust Funds</h1>
          <p className="text-gray-400">Manage and monitor your trust fund portfolio</p>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 
                  auto-rows-fr">
    {loading ? (
      <div className="col-span-full">{renderLoadingState()}</div>
    ) : error ? (
      <div className="col-span-full">{renderErrorState()}</div>
    ) : funds.length > 0 ? (
      <>
        {funds.map((fund) => (
          <CardContainer key={fund.id}>
            <TrustFundItem
              fund={fund.data}
              fundId={fund.id}
            />
          </CardContainer>
        ))}
        <CardContainer>
          <div className="flex items-center justify-center h-full">
            <AddTrustFundButton onClick={() => setIsOpen(true)} />
          </div>
        </CardContainer>
      </>
    ) : (
      <div className="col-span-full">{renderEmptyState()}</div>
    )}
  </div>
</div>

        <div className="bg-gray-900/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <TrustFundActivityContainer />
        </div>
      </div>
    </Layout>
  );
};