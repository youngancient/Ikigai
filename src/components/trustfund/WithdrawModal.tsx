import { useState } from "react";
import { ethers } from "ethers";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { useTrustFund } from "../../hooks/useTrustFund";
import type { Fund } from "../../types/trustfund";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund;
  fundId: string;
  onWithdrawSuccess: () => void;
}

export const WithdrawModal = ({
  isOpen,
  onClose,
  fund,
  fundId,
  onWithdrawSuccess,
}: WithdrawModalProps) => {
  const { withdrawFund, txState } = useTrustFund();
  const [withdrawalChecks, setWithdrawalChecks] = useState({
    confirmWithdrawal: false,
  });

  const handleWithdraw = async () => {
    if (!withdrawalChecks.confirmWithdrawal) return;

    try {
      const success = await withdrawFund(fundId);
      if (success) {
        onWithdrawSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[500px] max-w-[95%] p-1 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl">
        <div className="bg-[#141414] w-full rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Withdraw Funds</h2>
            <button onClick={onClose}>
              <IoCloseSharp size={24} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg mb-2">{fund.fundName}</h3>
            <p className="text-gray-400 mb-4">{fund.purpose}</p>
            
            <div className="mb-4">
              <p className="text-2xl font-bold">
                {ethers.formatEther(fund.currentBalance)} ETH
              </p>
              <p className="text-gray-400">Available for withdrawal</p>
            </div>

            <div className="text-sm text-gray-400">
              <p>Target Date: {new Date(Number(fund.targetDate) * 1000).toLocaleDateString()}</p>
              <p>Category: {fund.category}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={withdrawalChecks.confirmWithdrawal}
                onChange={(e) =>
                  setWithdrawalChecks(prev => ({
                    ...prev,
                    confirmWithdrawal: e.target.checked
                  }))
                }
                className="form-checkbox"
              />
              <span className="text-sm">
                I confirm that I want to withdraw these funds
              </span>
            </label>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!withdrawalChecks.confirmWithdrawal || txState.loading}
            className="w-full py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl disabled:opacity-50"
          >
            {txState.loading ? "Processing Withdrawal..." : "Withdraw Funds"}
          </button>

          {txState.error && (
            <p className="mt-2 text-red-500 text-sm">{txState.error}</p>
          )}

          {txState.hash && (
            <a
              href={`https://sepolia-blockscout.lisk.com/tx/${txState.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 underline block text-center"
            >
              View transaction on Blockscout
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};