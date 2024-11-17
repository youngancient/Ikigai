import { EmptyState } from "../EmptyState";

export const TrustFundActivityContainer = () => {
  return (
    <div className="w-full h-[300px] border-2 border-[#3E3E3E] rounded-xl p-5">
      <div>
        <h3 className="text-2xl text-white">Transaction History</h3>
      </div>

      <EmptyState />
    </div>
  );
};
