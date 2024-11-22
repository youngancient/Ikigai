import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "../../../utils/helpers";
import logo from "../../../assets/images/logo.png";
import hexagon from "../../../assets/images/hexagon.png";
import slantrings from "../../../assets/icons/slantrings.svg";
import folder from "../../../assets/icons/avatar.svg";

import "./style.scss";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
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
            <h4 className="title">Will & Trust Fund</h4>

            <div className="will-trust-flex">
              {!address ? (
                <EmptyState text="Connect wallet to see Eligible claims" />
              ) : isLoading ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : wills != null ? (
                <>
                  <>
                    {wills.map((will: IBeneficiaryWill) => (
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

                  <div className="item">
                    <div className="name-flex">
                      <img src={folder} alt="folder" />
                      <div>
                        <p className="bold">Tam’s Azeibe School Fees</p>
                        <p className="category">Category here</p>
                      </div>
                    </div>

                    <p className="amount logo-text">$2,000</p>
                    <p className="will-name">Tam’s Azeibe Will</p>
                    <div className="d-flex">
                      <p className="type">Token Type</p>
                      <p>Ethereum ETH</p>
                    </div>
                    <div className="d-flex">
                      <p>Value</p>
                      <p>20 ETH</p>
                    </div>

                    <Button
                      onClick={() => {
                        setOpenSignatureModal(true);
                        setSelectedItem({
                          type: "trust",
                          name: "London will",
                          address: "0x2A95B9242EA682DF14FB4d0bf6cba42D2ED63E18",
                          amount: "234WCXT",
                          sender_address:
                            "0x2A95B9242EA682DF14FB4d0bf6cba42D2ED63E18",
                        });
                      }}
                      className="radiant-btn"
                    >
                      Claim Trust Fund
                    </Button>
                  </div>
                </>
              ) : (
                <h3 className="text-white text-2xl font-bold mt-4">
                  No wills found
                </h3>
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
