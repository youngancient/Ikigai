import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "../../../utils/helpers";
import logo from "../../../assets/images/logo.png";
import hexagon from "../../../assets/images/hexagon.png";
import slantrings from "../../../assets/icons/slantrings.svg";
import folder from "../../../assets/icons/avatar.svg";

import "./style.scss";
import { Button } from "@mui/material";
import { useState } from "react";
import ClaimWillModal, { ISelectedItem } from "./ClaimWillModal";
const Claim = () => {
  const [openSignatureModal, setOpenSignatureModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISelectedItem | null>(null);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const handleConnectWallet = () => {
    open();
  };
  return (
    <>
      <div className="claim-page">
        <div className="claim-page-content">
          <nav className="flex justify-between items-center">
            <img src={logo} className="w-[114px]" alt="logo" />

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
              <h3>Some content here</h3>
              <p>Here too</p>
            </div>

            <img src={hexagon} className="hexagon" alt="hexagon" />
          </div>

          <div className="will-and-trust">
            <h4 className="title">Will & Trust Fund</h4>

            <div className="will-trust-flex">
              <div className="item">
                <p className="total">Total Amount Willed</p>
                <p className="amount logo-text">20eth</p>
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
                      type: "will",
                      name: "London will",
                      address: "0x2A95B9242EA682DF14FB4d0bf6cba42D2ED63E18",
                      amount: "234WCXT",
                      sender_address:
                        "0x2A95B9242EA682DF14FB4d0bf6cba42D2ED63E18",
                    });
                  }}
                  className="radiant-btn"
                >
                  Claim Will
                </Button>
              </div>

              <div className="item">
                <div className="name-flex">
                  <img src={folder} alt="folder" />
                  <div>
                    <p className="bold">Tam’s Azeibe School Fees</p>
                    <p className="category">Category here</p>
                  </div>
                </div>

                <p className="amount logo-text">2eth</p>
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
