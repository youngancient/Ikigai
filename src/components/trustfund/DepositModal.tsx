import { useState } from "react";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ethers } from "ethers";
import type { Fund } from "../../types/trustfund";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => Promise<void>;
  fund: Fund;
  loading: boolean;
}

export const DepositModal = ({
  isOpen,
  onClose,
  onDeposit,
  fund,
  loading,
}: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const targetAmount = ethers.formatEther(fund.targetAmount);
  const currentBalance = ethers.formatEther(fund.currentBalance);
  const remaining = (
    Number(targetAmount) - Number(currentBalance)
  ).toFixed(4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await onDeposit(amount);
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Failed to deposit");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] max-w-[95%] p-1 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl">
        <div className="bg-[#141414] w-full rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Deposit to {fund.fundName}
            </h2>
            <button onClick={onClose}>
              <IoCloseSharp size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="w-full p-3 bg-transparent border rounded-xl"
                placeholder="Enter amount"
                min="0"
                max={remaining}
                disabled={loading}
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <div className="text-sm text-gray-400 space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Target Amount:</span>
                <span>{targetAmount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span>{currentBalance} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span>{remaining} ETH</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl disabled:opacity-50"
            >
              {loading ? "Processing..." : "Deposit"}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
