import { useEffect, useState } from "react";
import { Layout } from "../../../components/layout/Layout";
import trustfund from "../../../assets/images/trustfund.png";
import folder from "../../../assets/icons/avatar.svg";

import "./style.scss";
import { EmptyState } from "../../../components/EmptyState";
import CreateWill from "./Createwill";

const WillPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [balance, setBalance] = useState(60);
  const [walletBalance, setWalletBalance] = useState(40);
  const [sentBalance, setSentBalance] = useState(20);
  const [balancePercentage, setBalancePercentage] = useState({
    wallet: 0,
    sent: 0,
  });

  useEffect(() => {
    setBalancePercentage({
      wallet: (walletBalance / balance) * 100,
      sent: (sentBalance / balance) * 100,
    });
  }, [sentBalance, walletBalance, balance]);

  return (
    <>
      <Layout
        title="Vault"
        titleChild={
          <button
            onClick={() => setOpenModal(true)}
            className="create-will-button"
          >
            Create Will
          </button>
        }
      >
        <div className="will-page">
          <div className="summary-container">
            <div className="balance-container">
              <p className="balance">Balance</p>

              <div className="total-balance">
                <p>Total Balance</p>
                <h3>{balance} ETH</h3>
              </div>

              <div className="wallet-will-container">
                <div className="balance-summary">
                  <div className="wallet">
                    <div className="d-flex">
                      <div className="circle"></div>
                      <p>In Wallet</p>
                    </div>

                    <p className="amount">{walletBalance} ETH</p>
                  </div>

                  <div className="wallet">
                    <div className="d-flex">
                      <div className="circle"></div>
                      <p>Willed Away</p>
                    </div>

                    <p className="amount">{sentBalance} ETH</p>
                  </div>
                </div>

                <div className="progress-container">
                  <div
                    className="will-percentage"
                    style={{
                      width: `${balancePercentage.wallet}%`,
                    }}
                  ></div>

                  <div
                    className="sent-percentage"
                    style={{
                      width: `${balancePercentage.sent}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="will-vault-container">
              <div className="d-flex">
                <img src={trustfund} alt="trustfund" />
                <p>Wall Vault</p>
              </div>

              <div className="vault-list">
                {[1, 2].map((item) => (
                  <div className="vault-item" key={item}>
                    <img src={folder} alt="folder" />

                    <div className="name-and-view">
                      <div className="name">
                        <h5>Name of Beneficiary</h5>
                        <p>Asset willed: 2 ETH</p>
                      </div>

                      <button>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="activity-container">
            <p className="topic">Activity</p>

            <div className="activity-table">
              {false ? "" : <EmptyState text="You have no fund yet" />}
            </div>
          </div>
        </div>
      </Layout>

      <CreateWill
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  );
};

export default WillPage;
