import { useEffect, useState } from "react";
import { useTrustFund } from "../../../hooks/useTrustFund";
import useRunners from "../../../hooks/useRunners";
import { Fund } from "../../../types/trustfund";
import { WithdrawModal } from "../../../components/trustfund/WithdrawModal";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "../../../utils/helpers";
import logo from "../../../assets/images/logo.png";
import hexagon from "../../../assets/images/hexagon.png";
import slantrings from "../../../assets/icons/slantrings.svg";

import "./style.scss";
import { Button, CircularProgress } from "@mui/material";
import ClaimWillModal, { ISelectedItem } from "./ClaimWillModal";
import { useNavigate } from "react-router-dom";
import {
  IBeneficiaryWill,
  useBeneficiaryWills,
} from "../../../hooks/specific/useBeneficiary";
import { multiplyByPrice } from "../../../utils/getPrice";
import { ethers } from "ethers";
import { claimContVariants } from "../../../animations/claim";
import { motion } from "framer-motion";
import { EmptyState } from "../../../components/EmptyState";

interface WithdrawableFund {
  fund: Fund;
  id: string;
}

enum TokenType {
  ERC20 = 1,
  NFT = 2,
}

const Claim = () => {
  const [openSignatureModal, setOpenSignatureModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISelectedItem | null>(null);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const handleConnectWallet = () => {
    open();
  };
  const navigate = useNavigate();
  const { wills, isLoading } = useBeneficiaryWills();

  const { signer } = useRunners();
  const { getFundDetails, getTotalFunds, isWithdrawable } = useTrustFund();
  const [withdrawableFunds, setWithdrawableFunds] = useState<
    WithdrawableFund[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState<WithdrawableFund | null>(
    null
  );
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    const fetchWithdrawableFunds = async () => {
      if (!signer) return;

      try {
        setLoading(true);
        const userAddress = await signer.getAddress();

        const totalFunds = await getTotalFunds();

        const fundIndices = Array.from(
          { length: Number(totalFunds) },
          (_, i) => i
        );

        const withdrawableFundsPromises = fundIndices.map(
          async (index: number) => {
            try {
              const fund = await getFundDetails(index.toString());
              const canWithdraw = await isWithdrawable(index.toString());

              if (
                fund &&
                canWithdraw &&
                fund.beneficiary.toLowerCase() === userAddress.toLowerCase()
              ) {
                return {
                  fund,
                  id: index.toString(),
                };
              }
            } catch (error) {
              console.error(`Error checking fund ${index}:`, error);
            }
            return null;
          }
        );

        const results = await Promise.all(withdrawableFundsPromises);
        const validFunds = results.filter(
          (fund): fund is WithdrawableFund => fund !== null
        );

        setWithdrawableFunds(validFunds);
      } catch (error) {
        console.error("Error fetching withdrawable funds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawableFunds();
  }, [signer, getFundDetails, getTotalFunds, isWithdrawable]);

  return (
    <>
      <div className="claim-page">
        <div className="claim-page-content">
          <nav className="flex justify-between items-center">
            <img
              src={logo}
              className="w-[114px] cursor-pointer"
              alt="logo"
              onClick={() => navigate("/")}
            />

            <div className="flex gap-4">
              <button
                className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] px-4 py-2 rounded-xl"
                onClick={handleConnectWallet}
              >
                {isConnected ? formatAddress(address ?? "") : "Connect Wallet"}
              </button>
            </div>
          </nav>

          <h1 className="page-title">Overview</h1>

          <div className="hexacon-container">
            <img src={slantrings} alt="slant" className="slant-rings" />
            <div className="text-box">
              <h3>Claim Inheritance</h3>
              <p>Get access to claim trust fund and wills</p>
            </div>

            <img src={hexagon} className="hexagon" alt="hexagon" />
          </div>

          <div className="will-and-trust">
            <h1 className="text-2xl font-bold text-white mb-6">Will Claims</h1>

            <div className="will-trust-flex">
              {!address ? (
                <EmptyState text="Connect wallet to see Eligible claims" />
              ) : isLoading ? (
                <div className="flex justify-center items-center h-32 w-full">
                  <CircularProgress size="2rem" sx={{ color: "#ffffff" }} />
                </div>
              ) : wills?.length == 0 ? (
                <EmptyState text="No will claims found" />
              ) : (
                <>
                  <>
                    {wills && wills.map((will: IBeneficiaryWill) => (
                      <motion.div
                        className="item"
                        variants={claimContVariants}
                        viewport={{ once: true }}
                        initial="initial"
                        whileInView="final"
                      >
                        <p className="total">Total Amount Willed</p>
                        <p className="amount logo-text">
                          {"$" +
                            multiplyByPrice(
                              Number(
                                ethers.formatUnits(will.amount.toString(), 18)
                              )
                            ).toLocaleString()}
                        </p>
                        <p className="will-name">{will.willName}</p>
                        <div className="d-flex">
                          <p className="type">Token Type</p>
                          <p>{TokenType[will.tokenType]}</p>
                        </div>
                        <div className="d-flex">
                          <p>Token Amount</p>
                          <p>
                            {Number(
                              ethers.formatUnits(will.amount.toString(), 18)
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="type">Benefactor</p>
                          <p>{formatAddress(will.willOwner)}</p>
                        </div>

                        <Button
                          onClick={() => {
                            setOpenSignatureModal(true);
                            setSelectedItem({
                              type: "will",
                              id: will.willId.toString(),
                              name: will.willName,
                              address: address,
                              amount:
                                Number(
                                  ethers.formatUnits(will.amount.toString(), 18)
                                ).toLocaleString() + "CWT",
                              sender_address: will.willOwner,
                            });
                          }}
                          className="radiant-btn"
                          disabled={will.claimed}
                        >
                          {will.claimed ? "Claimed" : "Claim Will"}
                        </Button>
                      </motion.div>
                    ))}
                  </>
                </>
              )}
            </div>
            {/* MEOW MEOW NIGGAAAA */}
            <div className="">
              <h1 className="text-2xl font-bold text-white mb-6">
                Trust Funds
              </h1>
              {!address ? (
                <EmptyState text="Connect wallet to see Eligible claims" />
              ) : loading ? (
                <div className="flex justify-center items-center h-32 w-full">
                  <CircularProgress size="2rem" sx={{ color: "#ffffff" }} />
                </div>
              ) : withdrawableFunds.length === 0 ? (
                <EmptyState text="No trust fund found" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {withdrawableFunds.map(({ fund, id }) => (
                    <div
                      key={id}
                      className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[1px] rounded-xl"
                    >
                      <div className="bg-black rounded-xl p-5">
                        <h3 className="text-xl text-white mb-2">
                          {fund.fundName}
                        </h3>
                        <p className="text-gray-400 mb-4">{fund.purpose}</p>
                        <div className="mb-4">
                          <p className="text-white text-2xl font-bold">
                            {ethers.formatEther(fund.currentBalance)} ETH
                          </p>
                          <p className="text-gray-400">
                            Available for withdrawal
                          </p>
                        </div>
                        <div className="text-sm text-gray-400 mb-4">
                          <p>
                            Target Date:{" "}
                            {new Date(
                              Number(fund.targetDate) * 1000
                            ).toLocaleDateString()}
                          </p>
                          <p>Category: {fund.category}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFund({ fund, id });
                            setShowWithdrawModal(true);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl text-white"
                        >
                          Withdraw Funds
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFund && (
                <WithdrawModal
                  isOpen={showWithdrawModal}
                  onClose={() => {
                    setShowWithdrawModal(false);
                    setSelectedFund(null);
                  }}
                  fund={selectedFund.fund}
                  fundId={selectedFund.id}
                  onWithdrawSuccess={() => {
                    setWithdrawableFunds((prev) =>
                      prev.filter((f) => f.id !== selectedFund.id)
                    );
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ClaimWillModal
        openModal={openSignatureModal}
        closeModal={() => {
          setOpenSignatureModal(false);
        }}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default Claim;
