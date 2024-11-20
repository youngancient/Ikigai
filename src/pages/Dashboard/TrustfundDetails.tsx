import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { ethers } from "ethers";
import { useTrustFund } from "../../hooks/useTrustFund";
import { useTrustFundEvents } from "../../hooks/useContractEvents";
import useRunners from "../../hooks/useRunners";
import type {
  Fund,
  FundDepositEvent,
  FundWithdrawalEvent,
} from "../../types/trustfund";
import { WithdrawModal } from "../../components/trustfund/WithdrawModal";
import { DepositModal } from "../../components/trustfund/DepositModal";
import {
  formatTimeRemaining,
  formatTransactionDate,
} from "../../utils/dateUtils";
import { FundStatus } from "../../components/trustfund/FundStatus";

interface FundHistory {
  type: "Deposit" | "Withdrawal";
  title: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

export const TrustFundDetails = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const { signer } = useRunners();
  const {
    getFundDetails,
    withdrawFund,
    depositToFund,
    isWithdrawable,
    txState,
  } = useTrustFund();
  const { deposits: depositEvents, withdrawals: withdrawalEvents } =
    useTrustFundEvents(fundId ? BigInt(fundId) : undefined);

  const [showHistory, setShowHistory] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [fund, setFund] = useState<Fund | null>(null);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isBeneficiary, setIsBeneficiary] = useState(false);

  // Fetch fund details and user address
  useEffect(() => {
    const fetchData = async () => {
      if (!fundId || !signer) return;

      try {
        const fundData = await getFundDetails(fundId);
        if (!fundData) {
          navigate("/trustfund");
          return;
        }
        setFund(fundData);

        const address = await signer.getAddress();
        setUserAddress(address);
        setIsBeneficiary(
          address.toLowerCase() === fundData.beneficiary.toLowerCase()
        );

        const withdrawable = await isWithdrawable(fundId);
        setCanWithdraw(withdrawable);
      } catch (error) {
        console.error("Error fetching fund details:", error);
        navigate("/trustfund");
      }
    };

    fetchData();
  }, [fundId, signer, getFundDetails, navigate, isWithdrawable]);

  // Combine and sort history
  const history: FundHistory[] = [
    ...(depositEvents as FundDepositEvent[]).map((event) => ({
      type: "Deposit" as const,
      title: `Deposit to ${fund?.fundName || "Trust Fund"}`,
      amount: ethers.formatEther(event.amount),
      timestamp: event.timestamp
        ? Number(event.timestamp)
        : Math.floor(Date.now() / 1000),
      txHash: event.transactionHash || "",
    })),
    ...(withdrawalEvents as FundWithdrawalEvent[]).map((event) => ({
      type: "Withdrawal" as const,
      title: `Withdrawal from ${fund?.fundName || "Trust Fund"}`,
      amount: ethers.formatEther(event.amount),
      timestamp: Number(event.withdrawalTime),
      txHash: event.transactionHash || "",
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const handleDeposit = async (amount: string) => {
    if (!fundId) return;
    const success = await depositToFund(fundId, amount);
    if (success) {
      setShowDepositModal(false);
      // Refresh fund details
      const updatedFund = await getFundDetails(fundId);
      setFund(updatedFund);
    }
  };

  const handleWithdraw = async () => {
    if (!fundId) return;
    const success = await withdrawFund(fundId);
    if (success) {
      setShowWithdrawModal(false);
      // Refresh fund details
      const updatedFund = await getFundDetails(fundId);
      setFund(updatedFund);
    }
  };

  if (!fund) return null;

  const targetAmount = ethers.formatEther(fund.targetAmount);
  const currentBalance = ethers.formatEther(fund.currentBalance);
  const percentage = Number(
    ((Number(currentBalance) / Number(targetAmount)) * 100).toFixed(2)
  );

  return (
    <Layout title="Trust Fund">
      <div className="w-full">
        <div className="w-full p-5">
          <Link to="/trustfund">
            <div className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[2px] w-fit rounded-xl cursor-pointer">
              <div className="w-full h-full rounded-inherit bg-black px-5 py-2 text-white flex items-center">
                <span>
                  <FaChevronLeft />
                </span>
                <h3 className="text-xl ml-3">Back</h3>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full p-5">
          <div className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[2px] rounded-xl w-full">
            <div className="w-full h-full rounded-inherit bg-black px-5 py-10 text-white flex items-center flex-col">
              <div className="w-full text-white">
                <h3 className="text-xl">Trust Fund Progress</h3>
              </div>

              <div className="w-full border border-gray-500 rounded-xl p-2 mt-10">
                <div className="w-full flex items-center justify-center flex-col py-3">
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

                  <h3 className="text-white">{fund.fundName}</h3>
                  <p className="text-gray-400 mt-1">{fund.purpose}</p>
                </div>

                <div className="w-full p-3">
                  <div className="w-full bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] via-[#FF56A999] to-[#FFAA6C99] p-[1px] py-5 px-5 flex flex-col items-center justify-center rounded-xl">
                    <div className="w-full flex items-center justify-center lg:flex-row flex-col">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        {targetAmount} ETH
                      </h3>

                      <p className="text-white ml-2">
                        ~ saved so far {currentBalance} ETH
                      </p>
                    </div>

                    <div className="w-full mt-3">
                      <div className="w-full border border-[#672D03B2] h-8 rounded-lg bg-[#262626]">
                        <div
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                          className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] h-full rounded-inherit"
                        >
                          <h3 className="text-center text-xl text-white">
                            {percentage}%
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full px-10 py-3 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] via-[#FF56A999] to-[#FFAA6C] text-white rounded-2xl w-[200px]"
                  >
                    Deposit
                  </button>

                  {isBeneficiary ? (
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => setShowWithdrawModal(true)}
                        disabled={!canWithdraw}
                        className={`px-5 py-3 ${
                          canWithdraw
                            ? "bg-gradient-to-r from-[#FF56A999] to-[#FFAA6C] cursor-pointer"
                            : "bg-gray-600 cursor-not-allowed"
                        } text-white rounded-2xl w-[200px]`}
                      >
                        Withdraw
                      </button>
                      {!canWithdraw && (
                        <p className="text-sm text-gray-400">
                          {!fund.isActive
                            ? "Fund is inactive"
                            : Number(fund.targetDate) * 1000 > Date.now()
                            ? `Available for withdrawal after ${new Date(
                                Number(fund.targetDate) * 1000
                              ).toLocaleDateString()}`
                            : fund.isWithdrawn
                            ? "Fund has already been withdrawn"
                            : Number(fund.currentBalance) === 0
                            ? "No balance to withdraw"
                            : "Fund is not yet withdrawable"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Only the beneficiary ({fund.beneficiary}) can withdraw
                      from this fund
                    </p>
                  )}
                </div>

                <div className="w-full p-3">
                  <div className="w-full flex items-center justify-between text-gray-500">
                    <h3>Fund Status</h3>
                    <FundStatus
                      isActive={fund.isActive}
                      isWithdrawn={fund.isWithdrawn}
                      targetDate={fund.targetDate}
                      currentBalance={fund.currentBalance}
                      targetAmount={fund.targetAmount}
                    />
                  </div>

                  <div className="w-full flex items-center justify-between text-gray-500 mt-3">
                    <h3>Time Remaining</h3>
                    <h3>{formatTimeRemaining(Number(fund.targetDate))}</h3>
                  </div>

                  <div className="w-full flex items-center justify-between text-gray-500 mt-3">
                    <h3>Target Date</h3>
                    <h3>
                      {new Date(
                        Number(fund.targetDate) * 1000
                      ).toLocaleDateString()}
                    </h3>
                  </div>

                  <div className="w-full flex items-center justify-between text-gray-500 mt-3">
                    <h3>Beneficiary</h3>
                    <h3 className="text-sm">{fund.beneficiary}</h3>
                  </div>

                  <div className="w-full flex items-center justify-between text-gray-500 mt-3">
                    <h3>Category</h3>
                    <h3>{fund.category}</h3>
                  </div>
                </div>
              </div>

              <div className="w-full p-3 mt-4 border border-gray-500 rounded-lg">
                <h4 className="text-white mb-2">Withdrawal Requirements</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        isBeneficiary ? "text-green-500" : "text-red-500"
                      }
                    >
                      {isBeneficiary ? "✓" : "✗"}
                    </span>
                    Connected wallet must be the beneficiary
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        fund.isActive ? "text-green-500" : "text-red-500"
                      }
                    >
                      {fund.isActive ? "✓" : "✗"}
                    </span>
                    Fund must be active
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        Number(fund.targetDate) * 1000 <= Date.now()
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {Number(fund.targetDate) * 1000 <= Date.now() ? "✓" : "✗"}
                    </span>
                    Target date must be reached
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        !fund.isWithdrawn ? "text-green-500" : "text-red-500"
                      }
                    >
                      {!fund.isWithdrawn ? "✓" : "✗"}
                    </span>
                    Fund must not be already withdrawn
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        Number(fund.currentBalance) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {Number(fund.currentBalance) > 0 ? "✓" : "✗"}
                    </span>
                    Fund must have a balance
                  </li>
                </ul>
              </div>

              <div className="w-full mt-10 p-2">
                <div
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between text-xl text-white mb-5 cursor-pointer"
                >
                  <h3>History</h3>
                  <span>
                    <FaChevronDown />
                  </span>
                </div>

                <div className="w-full">
                  {showHistory &&
                    history.map((item, i) => (
                      <div
                        key={i}
                        className="w-full flex items-center justify-between mb-4"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-[50px] w-[50px] ${
                              item.type === "Deposit"
                                ? "bg-gradient-to-r"
                                : "bg-[#FFE7EC]"
                            } rounded-full flex items-center justify-center`}
                          >
                            {item.type === "Deposit" ? (
                              // Deposit icon
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 3L12 21M12 21L5 14M12 21L19 14"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              // Withdrawal icon
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 21L12 3M12 3L5 10M12 3L19 10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>

                          <div className="ml-3">
                            <h3>{item.title}</h3>
                            <p className="text-gray-500">
                              {formatTransactionDate(item.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <h3 className="text-gray-500">
                            {item.type === "Deposit" ? "+" : "-"}
                            {item.amount} ETH
                          </h3>
                          {item.txHash && (
                            <a
                              href={`https://sepolia-blockscout.lisk.com/tx/${item.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline"
                              title="View on Lisk Blockscout"
                            >
                              View Transaction
                            </a>
                          )}
                        </div>
                      </div>
                    ))}

                  {showHistory && history.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No transaction history available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        fund={fund}
        loading={txState.loading}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        fund={fund}
        loading={txState.loading}
      />
    </Layout>
  );
};
