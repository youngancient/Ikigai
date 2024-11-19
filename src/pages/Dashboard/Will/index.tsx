import { useEffect, useState } from "react";
import { Layout } from "../../../components/layout/Layout";
import trustfund from "../../../assets/images/trustfund.png";
import folder from "../../../assets/icons/avatar.svg";

import "./style.scss";
import { EmptyState } from "../../../components/EmptyState";
import CreateWill from "./Createwill";
import { Button, IconButton } from "@mui/material";
import DropDownWrapper from "../../../components/DropDownWrapper";
import { PrimaryFillIcon } from "../../../assets/icons/PrimaryFillIcon";
import { EyeIcon } from "../../../assets/icons/EyeIcon";
import { EditIcon } from "../../../assets/icons/EditIcon";
import ViewWill from "./ViewWill";
import AddBeneficiaryToWill from "./AddBeneficiary";
import { useWill } from "../../../hooks/specific/useCreateWill";
import { useTokenBalance } from "../../../hooks/specific/useERC20";
import { ethers } from "ethers";
import { floorToDecimals } from "../../../utils/helpers";

const userToken = [
  { symbol: "CWT", address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461" },
  { symbol: "WT", address: "0xf373b5fbF1F4075E240Ea2EB76bdE01f54bf75f6" },
  { symbol: "CPGT", address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461" },
];

const WillPage = () => {
  const [userSelectedToken, setUserSelectedToken] = useState({
    symbol: "CWT",
    address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461",
  });
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAddBeneficiaryModal, setOpenAddBeneficiaryModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [balance, setBalance] = useState(60);
  const [walletBalance, setWalletBalance] = useState(40);
  const [sentBalance, setSentBalance] = useState(20);
  const [balancePercentage, setBalancePercentage] = useState({
    wallet: 0,
    sent: 0,
  });
  const [selectedWill, setSelectedWill] = useState<any>(null);
  const { will } = useWill();
  const changeUserToken = (token: { symbol: string; address: string }) => {
    setUserSelectedToken(token);
  };
  console.log(will);

  const { tokenBalance, isLoadingBalance } = useTokenBalance(
    userSelectedToken.address
  );
  if (tokenBalance !== null) {
    console.log(ethers.formatUnits(tokenBalance, 18));
  }

  useEffect(() => {
    setBalancePercentage({
      wallet: (walletBalance / balance) * 100,
      sent: (sentBalance / balance) * 100,
    });
  }, [sentBalance, walletBalance, balance]);

  // remove this block later
  useEffect(() => {
    setBalance(0);
    setWalletBalance(0);
    setSentBalance(0);
  }, []);

  return (
    <>
      <Layout
        title="Vault"
        titleChild={
          <Button
            onClick={() => setOpenModal(true)}
            className="create-will-button"
          >
            <div className="button-cover-bg">Create Will</div>
          </Button>
        }
      >
        <div className="will-page">
          <div className="summary-container">
            <div className="balance-container">
              <div className="balance-token-container mb-4 flex justify-between items-center">
                <p className="balance">Balance</p>

                <DropDownWrapper
                  origin="right"
                  closeOnChildClick
                  className="navbar_dropdown location_picker"
                  action={
                    <Button
                      className="grey_btn"
                      endIcon={<PrimaryFillIcon stroke={"#ffff"} />}
                    >
                      {userSelectedToken.address
                        ? userSelectedToken.symbol
                        : " Select token"}
                    </Button>
                  }
                >
                  <div className="cover_buttons">
                    <ul className="select_list btn_list">
                      {userToken?.map((item, i) => (
                        <li key={i}>
                          <Button
                            onClick={() => {
                              changeUserToken(item);
                            }}
                          >
                            {item.symbol}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DropDownWrapper>
              </div>

              <div className="total-balance">
                <p>Total Balance</p>
                <h3>
                  {isLoadingBalance
                    ? "Loading..."
                    : tokenBalance != null
                    ? floorToDecimals(
                        parseFloat(ethers.formatUnits(tokenBalance, 18)),
                        2
                      )
                    : 0.0}{" "}
                  {isLoadingBalance ? "" : userSelectedToken?.symbol}
                </h3>
              </div>

              <div className="wallet-will-container">
                <div className="balance-summary">
                  <div className="wallet">
                    <div className="d-flex">
                      <div className="circle"></div>
                      <p>In Wallet</p>
                    </div>

                    <p className="amount">
                      {walletBalance} {userSelectedToken?.symbol}
                    </p>
                  </div>

                  <div className="wallet">
                    <div className="d-flex">
                      <div className="circle"></div>
                      <p>Willed Away</p>
                    </div>

                    <p className="amount">
                      {sentBalance} {userSelectedToken?.symbol}
                    </p>
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
                <p>Will Vault</p>
              </div>

              <div className="vault-list">
                {[1, 2].map((item) => (
                  <div className="vault-item" key={item}>
                    <img src={folder} alt="folder" />

                    <div className="name-and-view">
                      <div className="name">
                        <h5>Donald</h5>
                        <p>Asset willed: 2 ETH</p>
                      </div>

                      <button>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`activity-container ${true && "empty"}`}>
            <p className="topic">Activity</p>

            <div className={`activity-table `}>
              {true ? (
                <div className="relative overflow-x-auto shadow-md ">
                  <table className="w-full text-sm text-left border-[#FFD505] border-solid border-[1px]">
                    <thead className="text-xs uppercase ">
                      <tr className="border-[#FFD505] border-b ">
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center"
                        >
                          Beneficiaries
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center"
                        >
                          Asset
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center "
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center"
                        >
                          Activity Period
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center"
                        >
                          Grace Period
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-8 text-[#ffffff] text-center"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map((item) => (
                        <tr className=" border-[#FFD505] border-b  ">
                          <td
                            scope="row"
                            className=" text-center px-6 py-4 font-medium  whitespace-nowrap text-[#ffffff]"
                          >
                            7
                          </td>
                          <td className="text-center px-6 py-4 text-[#ffffff]">
                            CTF
                          </td>
                          <td className="text-center px-6 py-4 text-[#ffffff]">
                            1,000
                          </td>
                          <td className="text-center px-6 py-4 text-[#ffffff]">
                            200 days
                          </td>
                          <td className="text-center px-6 py-4 text-[#ffffff]">
                            20 days
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-center">
                              <IconButton
                                onClick={() => {
                                  setSelectedWill(item);
                                  setOpenViewModal(true);
                                }}
                              >
                                <EyeIcon />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setSelectedWill(item);
                                  setOpenAddBeneficiaryModal(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState text="You have no activity yet" />
              )}
            </div>
          </div>
        </div>
      </Layout>
      <CreateWill
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
      <ViewWill
        openModal={openViewModal}
        closeModal={() => setOpenViewModal(false)}
        selectedWill={selectedWill}
      />
      <AddBeneficiaryToWill
        openModal={openAddBeneficiaryModal}
        selectedWill={selectedWill}
        closeModal={() => setOpenAddBeneficiaryModal(false)}
      />
    </>
  );
};

export default WillPage;
