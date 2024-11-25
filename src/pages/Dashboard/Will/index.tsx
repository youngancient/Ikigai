import { useEffect, useState } from "react";
import { Layout } from "../../../components/layout/Layout";
import trustfund from "../../../assets/images/trustfund.png";
import folder from "../../../assets/icons/avatar.svg";

import "./style.scss";
import { EmptyState } from "../../../components/EmptyState";
import CreateWill from "./Createwill";
import { Button, CircularProgress, IconButton } from "@mui/material";
import DropDownWrapper from "../../../components/DropDownWrapper";
import { PrimaryFillIcon } from "../../../assets/icons/PrimaryFillIcon";

import { EyeIcon } from "../../../assets/icons/EyeIcon";
import ViewWill from "./ViewWill";
import AddBeneficiaryToWill from "./AddBeneficiary";
// import { useWill } from "../../../hooks/specific/useCreateWill";
import { useTokenBalance } from "../../../hooks/specific/useERC20";
import { ethers } from "ethers";
import { floorToDecimals } from "../../../utils/helpers";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { useWills } from "../../../hooks/specific/useWills";
import { multiplyByPrice } from "../../../utils/getPrice";
import { formatActivityPeriod, formatGracePeriod } from "../../../utils/format";

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
  const changeUserToken = (token: { symbol: string; address: string }) => {
    setUserSelectedToken(token);
  };

  const { tokenBalance, isLoadingBalance } = useTokenBalance(
    userSelectedToken.address
  );
  if (tokenBalance !== null) {
    console.log(ethers.formatUnits(tokenBalance, 18));
  }

  const { address } = useAppKitAccount();

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

  const handleOpenModal = () => {
    if (!address) {
      toast.error("Connect your wallet!");
      return;
    }
    setOpenModal(true);
  };

  const { wills, isFetching, setRefetch } = useWills();

  return (
    <>
      <Layout
        title="Vault"
        titleChild={
          <Button onClick={handleOpenModal} className="create-will-button">
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
                      className="radiant-btn"
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
                  {isLoadingBalance ? (
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    </div>
                  ) : tokenBalance != null ? (
                    floorToDecimals(
                      parseFloat(ethers.formatUnits(tokenBalance, 18)),
                      2
                    )
                  ) : (
                    0.0
                  )}{" "}
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
                {isFetching && (
                  <div
                    role="status"
                    className="w-full mt-4 space-y-4  divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                  </div>
                )}
                {wills !== null && !isFetching && wills?.length ? (
                  wills?.map((item, i) => {
                    if (i < 2) {
                      return (
                        <div className="vault-item" key={i}>
                          <img src={folder} alt="folder" />

                          <div className="name-and-view">
                            <div className="name">
                              <h5>{item.willName}</h5>
                              <p>
                                Total Asset willed:{" "}
                                {"$" +
                                  multiplyByPrice(
                                    Number(
                                      ethers.formatUnits(
                                        item.totalAmount.toString(),
                                        18
                                      )
                                    )
                                  ).toLocaleString()}
                              </p>
                            </div>

                            <Button
                              onClick={() => {
                                setSelectedWill(item);
                                setOpenViewModal(true);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      );
                    } else {
                      return "";
                    }
                  })
                ) : (
                  <Button
                    onClick={() => {
                      if (address) {
                        handleOpenModal();
                      } else {
                        toast.error("Connect wallet to continue");
                      }
                    }}
                    className="radiant-btn"
                  >
                    Create Will
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={`activity-container ${!address && "empty"}`}>
            <p className="topic">Activity</p>

            <div className={`activity-table `}>
              {address ? (
                isFetching ? (
                  <div className="flex justify-start items-center gap-8 flex-wrap ">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        role="status"
                        className=" w-full  rounded shadow animate-pulse md:w-[300px] dark:border-gray-700"
                      >
                        <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                          <svg
                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 20"
                          >
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                          </svg>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="will-list-flex">
                    {wills !== null && wills?.length ? (
                      wills.map((will) => (
                        <div className="will-list-item" key={will.willId}>
                          <img src={trustfund} alt="trustfund" />

                          <p className="name">{will.willName}</p>

                          <div className="d-flex">
                            <p>Value</p>
                            <p>
                              {"$" +
                                multiplyByPrice(
                                  Number(
                                    ethers.formatUnits(
                                      will.totalAmount.toString(),
                                      18
                                    )
                                  )
                                ).toLocaleString()}
                            </p>
                          </div>

                          <div className="d-flex">
                            <p>Beneficiaries</p>
                            <p>{will.beneficiaryCount}</p>
                          </div>

                          <div className="d-flex">
                            <p>Activity Period</p>
                            <p>
                              {formatActivityPeriod(will.activityPeriod)} days
                            </p>
                          </div>

                          <div className="d-flex">
                            <p>Grace Period</p>
                            <p>{formatGracePeriod(will.gracePeriod)} days</p>
                          </div>

                          <div className="btn-flex">
                            <Button
                              onClick={() => {
                                setSelectedWill(will);
                                setOpenAddBeneficiaryModal(true);
                              }}
                              className="radiant-btn"
                            >
                              Add Beneficiary
                            </Button>
                            <IconButton
                              onClick={() => {
                                setSelectedWill(will);
                                setOpenViewModal(true);
                              }}
                              className="icon-btn"
                            >
                              <EyeIcon stroke="#ffffff" />
                            </IconButton>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState text="No wills found" />
                    )}
                  </div>
                )
              ) : (
                <EmptyState text="Connect wallet to view activity" />
              )}
            </div>
          </div>
        </div>
      </Layout>
      <CreateWill
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        setRefetch={setRefetch}
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
