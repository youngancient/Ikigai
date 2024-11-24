import { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useTrustFund } from "../../hooks/useTrustFund";
import type { Fund } from "../../types/trustfund";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";

interface TrustFundItemProps {
  fund: Fund;
  fundId: string;
}

export const TrustFundItem = ({ fund, fundId }: TrustFundItemProps) => {

  if (!fund || !fundId) {
    return (
      <div className="mr-5 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[1px] h-[280px] rounded-xl">
        <div className="w-full h-full bg-black rounded-inherit p-5 flex flex-col justify-center">
          <p className="text-white">Error: Missing fund data</p>
        </div>
      </div>
    );
  }

  const [showDepositModal, setShowDepositModal] = useState(false);
  const { depositToFund, txState } = useTrustFund();
  const [depositAmount, setDepositAmount] = useState("");

  const targetAmount = fund.targetAmount ? ethers.formatEther(fund.targetAmount) : "0";
  const currentBalance = fund.currentBalance ? ethers.formatEther(fund.currentBalance) : "0";
  const percentage = Number(
    ((Number(currentBalance) / Number(targetAmount)) * 100).toFixed(2)
  ) || 0;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;

    try {
      const success = await depositToFund(fundId, depositAmount);
      if (success) {
        setDepositAmount("");
        setShowDepositModal(false);
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <Link to={`/trustfund/details/${fundId}`} className="block">
          <div className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[1px] h-[280px] rounded-xl cursor-pointer">
            <div className="w-full h-full bg-black rounded-inherit p-5 flex flex-col justify-center">
              <div>
                <div className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[1px] w-[50px] h-[50px] rounded-full">
                  <div className="w-full h-full bg-black rounded-inherit flex items-center justify-center">
                    <span>
                      <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.22476 3.5C3.44378 3.5 2 4.94377 2 6.72476V17.5C2 19.7091 3.79086 21.5 6 21.5H18C20.2091 21.5 22 19.7091 22 17.5V11.0556C22 8.84684 20.2105 7.05556 18.001 7.05556H14.8897C14.8498 6.99686 14.8038 6.92219 14.7518 6.82912C14.6109 6.57715 14.4738 6.28111 14.3166 5.94151C14.2793 5.86093 14.2409 5.77786 14.201 5.69239C14.0098 5.2827 13.7781 4.80151 13.5099 4.41975C13.2873 4.10286 12.8009 3.5 12.0138 3.5H5.22476ZM12.4877 6.75176C12.5332 6.85036 12.5804 6.95243 12.6288 7.05556H4V6.72476C4 6.04834 4.54834 5.5 5.22476 5.5H11.8219C11.8368 5.51884 11.854 5.54178 11.8734 5.5695C12.026 5.78671 12.1903 6.11316 12.3886 6.5382C12.4206 6.60678 12.4537 6.67835 12.4877 6.75176ZM6 19.5C4.89543 19.5 4 18.6046 4 17.5V9.05556H14.4782C14.4808 9.05561 14.4834 9.05566 14.4861 9.05569C14.4975 9.05584 14.5089 9.0558 14.5203 9.05556H18.001C19.1051 9.05556 20 9.95056 20 11.0556V11.5H18C16.3431 11.5 15 12.8431 15 14.5C15 16.1569 16.3431 17.5 18 17.5H20C20 18.6046 19.1046 19.5 18 19.5H6ZM17 14.5C17 13.9477 17.4477 13.5 18 13.5H20V15.5H18C17.4477 15.5 17 15.0523 17 14.5ZM11.7514 5.42323C11.7514 5.42272 11.7555 5.42566 11.7637 5.43356C11.7555 5.42769 11.7514 5.42374 11.7514 5.42323Z"
                        fill="url(#paint0_linear_182_1354)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_182_1354"
                          x1="2"
                          y1="3.5"
                          x2="22.4268"
                          y2="3.99814"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8AD4EC" />
                          <stop offset="0.217372" stop-color="#EF96FF" />
                          <stop offset="0.540308" stop-color="#FF56A9" />
                          <stop offset="0.852826" stop-color="#FFAA6C" />
                        </linearGradient>
                      </defs>
                    </svg>
                    </span>
                  </div>
                </div>

                <h3 className="text-xl text-white mt-3">{fund.fundName}</h3>
                <p className="text-sm text-gray-400">{fund.purpose}</p>
              </div>

              <div className="w-full flex items-center mt-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  {targetAmount} ETH
                </h3>

                <p className="text-gray-600 ml-2">
                  ~ saved so far {currentBalance} ETH
                </p>
              </div>

              <div className="w-full mt-3">
                <div className="w-full border border-[#672D03B2] h-8 rounded-lg overflow-hidden">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] h-full"
                  >
                    <h3 className="text-center text-xl text-white">
                      {percentage}%
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {fund.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-gray-400">
                  Target: {new Date(Number(fund.targetDate) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowDepositModal(true);
          }}
          className="absolute top-4 right-4 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] px-4 py-2 rounded-lg text-white"
        >
          Deposit
        </button>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)}>
        <div className="w-[400px] max-w-[95%] p-1 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl">
          <div className="bg-[#141414] w-full rounded-xl shadow-lg p-5 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Deposit to {fund.fundName}</h2>
              <button onClick={() => setShowDepositModal(false)}>
                <IoCloseSharp size={24} />
              </button>
            </div>

            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-3 bg-transparent border rounded-xl"
                  placeholder="Enter amount to deposit"
                  min="0"
                  required
                />
              </div>

              <div className="text-sm text-gray-400 mb-4">
                <p>Target Amount: {targetAmount} ETH</p>
                <p>Current Balance: {currentBalance} ETH</p>
                <p>Remaining: {(Number(targetAmount) - Number(currentBalance)).toFixed(4)} ETH</p>
              </div>

              <button
                type="submit"
                disabled={txState.loading || !depositAmount}
                className="w-full py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl disabled:opacity-50"
              >
                {txState.loading ? "Processing..." : "Deposit"}
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
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

TrustFundItem.defaultProps = {
  fund: null,
  fundId: '',
};