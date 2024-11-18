import star from "../../assets/images/star.png";
import lisk from "../../assets/images/lisk.png";
import willlock from "../../assets/images/willlock.png";
import trustfund from "../../assets/images/trustfund.png";
import iphone from "../../assets/images/iphone.png";
import eth1 from "../../assets/images/eth1.png";
import eth2 from "../../assets/images/eth2.png";
import eth3 from "../../assets/images/eth3.png";
import eth4 from "../../assets/images/eth4.png";
import rings from "../../assets/icons/rings.svg";

import "./style.scss";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { formatAddress } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    open();
  };
  const goToApp = () => {
    if (!isConnected) {
      open();
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <div className="landing-page">
      <div className="ring-parent">
        <img src={rings} alt="rings" />
      </div>
      <div className="gradient-box"></div>

      <div className="hero">
        <img src={eth1} className="eth-coin one" alt="eth" />
        <img src={eth2} className="eth-coin two" alt="eth" />
        <img src={eth3} className="eth-coin three" alt="eth" />
        <img src={eth4} className="eth-coin four" alt="eth" />

        <nav>
          <p
          >
            LegacyX
          </p>
          <button className="get-started-btn" onClick={goToApp}>
            {isConnected ? "Open App" : "Connect Wallet"}
          </button>
        </nav>

        <div className="first-section">
          <div className="info">
            <img src={star} alt="star" />
            <p>Create, Innovate, and Automate</p>
          </div>

          <h1>
            <span>Redefining Legacy Planning and</span>
            <span> Trust Fund Management</span>
          </h1>

          <p className="desc">
            Create, grow, and protect your assets with a decentralised crypto
            will and trust fund solution that ensures your wishes are always
            fulfilled.
          </p>

          <button className="get-started-btn" onClick={goToApp}>
            Get Started
          </button>

          <div className="supported-chain">
            <p>Powered By:</p>

            <button>
              <img src={lisk} alt="lisk" />
            </button>
          </div>
        </div>
      </div>

      <div className="second-section">
        <div className="d-flex">
          <div className="about-app">
            <h4>Ready to get started?</h4>
            <p>
              Choose a service to get started. Each path is designed to help you
              seamlessly manage your assets and protect your legacy in a
              decentralized, secure way.
            </p>
          </div>

          <div className="app-sections">
            <div className="section-item">
              <img src={willlock} alt="willlock" />

              <p className="title">Will Lock</p>
              <p className="desc">
                Our crypto will ensures your assets reach loved ones as per your
                exact instructions. No intermediaries, no delays.
              </p>
            </div>

            <div className="section-item">
              <img src={trustfund} alt="trustfund" />

              <p className="title">Trust Fund</p>
              <p className="desc">
                Set up and customize your trust fund, choose beneficiaries, and
                generate additional income through safe staking or liquidity
              </p>
            </div>
          </div>
        </div>

        <div className="secure-container">
          <div className="text-container">
            <h3>Secure Your Future Today</h3>
            <p>
              Get started with our decentralized trust and will platform and
              take control of your legacy.
            </p>

            <button>Get Started</button>
          </div>

          <img src={iphone} alt="iphone" />
        </div>

        <div className="connect-wallet-flex">
          <p>Crypto will</p>
          <button className="get-started-btn" onClick={handleConnectWallet}>
            {isConnected ? formatAddress(address ?? "") : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
