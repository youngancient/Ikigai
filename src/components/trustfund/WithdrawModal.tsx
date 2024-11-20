import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ethers } from "ethers";
import type { Fund } from "../../types/trustfund";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: () => Promise<void>;
  fund: Fund;
  loading: boolean;
}

export const WithdrawModal = ({
  isOpen,
  onClose,
  onWithdraw,
  fund,
  loading,
}: WithdrawModalProps) => {
  const currentBalance = ethers.formatEther(fund.currentBalance);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] max-w-[95%] p-1 bg-gradient-to-r from-[#FF56A999] to-[#FFAA6C99] rounded-xl">
        <div className="bg-[#141414] w-full rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Withdraw from {fund.fundName}
            </h2>
            <button onClick={onClose}>
              <IoCloseSharp size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Available Balance:</span>
                <span>{currentBalance} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Target Date:</span>
                <span>
                  {new Date(Number(fund.targetDate) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-sm text-yellow-500">
                Warning: This action will withdraw the entire balance and deactivate the fund.
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-600 rounded-xl hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={onWithdraw}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#FF56A999] to-[#FFAA6C99] rounded-xl disabled:opacity-50"
              >
                {loading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};