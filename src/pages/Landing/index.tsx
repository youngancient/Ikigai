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
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"; // import useAppKitProvider
import { formatAddress } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  textVariant,
  leftVariant,
  contVariant,
} from "../../animations/landing";
import logo from "../../assets/images/logo.png";
// import { BrowserProvider } from "ethers"; // uncomment
// import { Eip1193Provider } from "ethers"; // uncomment


const Landing = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const navigate = useNavigate();

  // const {walletProvider} = useAppKitProvider("eip155"); // uncomment 

  const handleConnectWallet = () => {
    open();
  };
  const goToApp = async () => {
    if (!isConnected) {
      open();
    } else {
      // onSignMessage();
      navigate("/dashboard");
    }
  };
    
// signMessage here
  // const onSignMessage = async()=> {
  //   const provider = new BrowserProvider(walletProvider as Eip1193Provider)
  //   const signer = await provider.getSigner()
  //   const signature = await signer?.signMessage('Hello, this is LegacyX')
  //   console.log(signature)
  // }

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
          {/* <p>LegacyX</p> */}
          <img src={logo} className="w-[114px]" alt="logo" />
          <button className="get-started-btn" onClick={goToApp}>
            {isConnected ? "Open App" : "Connect Wallet"}
          </button>
        </nav>

        <div className="first-section">
          <div className="info">
            <img src={star} alt="star" />
            <p>Create, Innovate, and Automate</p>
          </div>

          <motion.h1
            initial="initial"
            whileInView="final"
            // viewport={{ once: true }}
            variants={textVariant}
          >
            <span>Redefining Legacy Planning and</span>
            <span> Trust Fund Management</span>
          </motion.h1>

          <motion.p
            className="desc"
            initial="initial"
            whileInView="final2"
            // viewport={{ once: true }}
            variants={textVariant}
          >
            Create, grow, and protect your assets with a decentralised crypto
            will and trust fund solution that ensures your wishes are always
            fulfilled.
          </motion.p>

          <motion.button
            className="get-started-btn"
            onClick={goToApp}
            initial="initial"
            whileInView="final"
            viewport={{ once: true }}
            variants={leftVariant}
          >
            Get Started
          </motion.button>

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
                LegacyX ensures your assets reach loved ones as per your exact
                instructions. No intermediaries, no delays.
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
            <motion.h3
              initial="initial"
              whileInView="final"
              variants={leftVariant}
            >
              Secure Your Future Today
            </motion.h3>
            <motion.p
              initial="initial"
              whileInView="final2"
              variants={leftVariant}
            >
              Get started with our decentralized trust and will platform and
              take control of your legacy.
            </motion.p>
            <motion.div
              initial="initial"
              whileInView="final3"
              variants={leftVariant}
            >
              <div className="flex gap-2">
                <a href="#hero">
                  <button>Get Started</button>
                </a>

                <a href="/claim">
                  <button>Claim will</button>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="initial"
            whileInView="final"
            // viewport={{ once: true }}
            variants={contVariant}
          >
            <img src={iphone} alt="iphone" />
          </motion.div>
        </div>

        <div className="connect-wallet-flex">
        <img src={logo} className="w-[114px]" alt="logo" />
          <button className="get-started-btn" onClick={handleConnectWallet}>
            {isConnected ? formatAddress(address ?? "") : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
