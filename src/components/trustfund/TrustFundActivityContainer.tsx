// src/components/trustfund/TrustFundActivityContainer.tsx

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ethers, EventLog } from "ethers";
import { EmptyState } from "../EmptyState";
import { useTrustFundContract } from "../../hooks/useContracts";
import useRunners from "../../hooks/useRunners";

interface ActivityItemProps {
  type: string;
  message: string;
  timestamp: number;
}

const ActivityItem = ({ type, message, timestamp }: ActivityItemProps) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#3E3E3E] last:border-0">
    <div 
      className={`w-2 h-2 rounded-full ${
        type === 'created' ? 'bg-green-500' :
        type === 'deposit' ? 'bg-blue-500' :
        type === 'withdrawn' ? 'bg-yellow-500' :
        'bg-gray-500'
      }`}
    />
    <div className="flex-1">
      <p className="text-sm text-white">{message}</p>
      <p className="text-xs text-gray-400">
        {formatDistanceToNow(timestamp * 1000, { addSuffix: true })}
      </p>
    </div>
  </div>
);

interface TrustFundActivityContainerProps {
  funds?: { id: string; data: any }[];
}

export const TrustFundActivityContainer = ({ funds = [] }: TrustFundActivityContainerProps) => {
  const [activities, setActivities] = useState<ActivityItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const contract = useTrustFundContract(false);
  const { readOnlyProvider } = useRunners();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!contract || !readOnlyProvider) {
        console.log("No contract or provider available");
        setLoading(false);
        return;
      }

      try {
        const currentBlock = await readOnlyProvider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 1000);
        
        // Get all events
        const allEvents = await contract.queryFilter('*', fromBlock);
        console.log("All events:", allEvents);

        const processedActivities: ActivityItemProps[] = [];

        for (const event of allEvents) {
          if (!(event instanceof EventLog)) continue;

          const block = await event.getBlock();
          const timestamp = block.timestamp;

          switch (event.eventName) {
            case 'FundCreated':
              processedActivities.push({
                type: 'created',
                message: `New fund created with ID: ${event.args[0]}`,
                timestamp
              });
              break;

            case 'FundDeposit':
              const amount = event.args[2];
              processedActivities.push({
                type: 'deposit',
                message: `Deposit of ${ethers.formatEther(amount)} ETH to fund #${event.args[0]}`,
                timestamp
              });
              break;

            case 'FundWithdrawn':
              const withdrawnAmount = event.args[2];
              processedActivities.push({
                type: 'withdrawn',
                message: `Withdrawal of ${ethers.formatEther(withdrawnAmount)} ETH from fund #${event.args[0]}`,
                timestamp
              });
              break;
          }
        }

        // Sort by timestamp, most recent first
        processedActivities.sort((a, b) => b.timestamp - a.timestamp);
        console.log("Processed activities:", processedActivities);
        setActivities(processedActivities);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [contract, readOnlyProvider, funds]);

  if (loading) {
    return (
      <div className="w-full h-[300px] border-2 border-[#3E3E3E] rounded-xl p-5">
        <div>
          <h3 className="text-2xl text-white">Transaction History</h3>
        </div>
        <div className="mt-4 flex items-center justify-center h-[calc(300px-80px)]">
          <div className="text-white">Loading activities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] border-2 border-[#3E3E3E] rounded-xl p-5">
      <div>
        <h3 className="text-2xl text-white">Transaction History</h3>
      </div>

      <div className="mt-4 h-[calc(300px-80px)] overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={index}
              {...activity}
            />
          ))
        ) : (
          <div>
            <EmptyState />
            <div className="text-white text-center mt-2">
              {!contract ? "Contract not initialized" : 
               !readOnlyProvider ? "Provider not available" : 
               "No activities found"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};