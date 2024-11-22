import { useEffect, useState } from "react";
import DropDownWrapper from "../../../components/DropDownWrapper";
import { Layout } from "../../../components/layout/Layout";
import { PrimaryFillIcon } from "../../../assets/icons/PrimaryFillIcon";
import liquidicon from "../../../assets/icons/liquidicon.svg";
import trusticon from "../../../assets/icons/trusticon.svg";
import willicon from "../../../assets/icons/willicon.svg";
import { Button } from "@mui/material";

import "./style.scss";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../../../components/EmptyState";
import { SuccessArrowIcon } from "../../../assets/icons/successArrow";
import { ErrorArrowIcon } from "../../../assets/icons/errorArrow";
import { useWillStat } from "../../../hooks/specific/useAllWills";
import { ethers } from "ethers";
import { multiplyByPrice } from "../../../utils/getPrice";

const userToken = [
  { symbol: "CWT", address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461" },
  { symbol: "WT", address: "0xf373b5fbF1F4075E240Ea2EB76bdE01f54bf75f6" },
  { symbol: "CPGT", address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461" },
];

const SummaryItem = ({
  title,
  text,
}: {
  title: string;
  text: string | number;
}) => {
  return (
    <div className="summary-container">
      <p>{title}</p>
      <h4>{text}</h4>
    </div>
  );
};

const QuickActionItem = ({
  text,
  icon,
  link,
  isComingSoon,
}: {
  text: string;
  icon: string;
  link: string;
  isComingSoon?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(link)} className="quick-action-item">
      <div className="icon-flex">
        <img src={icon} alt="icon" />

        {isComingSoon && <Button>Coming Soon</Button>}
      </div>

      <p>{text}</p>
    </div>
  );
};

export const Dashboard = () => {
  // const [totalAmountWilled, setTotalAmountWilled] = useState(4);
  // const [totalBeneficiary, setTotalBeneficiary] = useState(4);
  // const [totalWill, setTotalWill] = useState(2);
  const [totalTrustFund, setTotalTrustFund] = useState(5);

  const [userSelectedToken, setUserSelectedToken] = useState({
    symbol: "CWT",
    address: "0xaFcA068ECDb7576720f480B6868120a13e7c7461",
  });

  const changeUserToken = (token: { symbol: string; address: string }) => {
    setUserSelectedToken(token);
  };

  const { totalWills, totalBeneficiaries, totalTokensWilled, isLoading } =
    useWillStat();

  // console.log({ totalWills, totalBeneficiaries, totalTokensWilled });
  useEffect(() => {
    setTotalTrustFund(4);
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="dashboard-page">
        <div className="flex justify-end my-4">
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

        <div className="summary-flex">
          {/* assume each token is $100 */}
          <SummaryItem
            title="Total Tokens Willed"
            text={`${"$"}${
              isLoading
                ? "Loading..."
                : totalTokensWilled != null
                ? multiplyByPrice(
                    Number(ethers.formatUnits(totalTokensWilled, 18))
                  ).toLocaleString()
                : "2,000"
            }`}
          />
          <SummaryItem
            title="Total Beneficiary"
            text={`${
              isLoading
                ? "Loading"
                : totalBeneficiaries != null
                ? totalBeneficiaries
                : 0
            }`}
          />
          <SummaryItem
            title="Wills Created"
            text={`${
              isLoading ? "Loading" : totalWills != null ? totalWills : 0
            }`}
          />
          <SummaryItem title="Trust fund Created" text={totalTrustFund} />
        </div>

        <div className="quick-actions">
          <h5 className="title">Do more with LegacyX</h5>

          <div className="quick-flex">
            <QuickActionItem
              text="Create will in 1 mins"
              link="/vault"
              icon={willicon}
            />
            <QuickActionItem
              text="Create Trust Fund"
              link="/trustfund"
              icon={trusticon}
            />
            <QuickActionItem
              text="Add pair to liquidity"
              isComingSoon
              link="/liquidity"
              icon={liquidicon}
            />
          </div>
        </div>

        <div className={`notifications-container  ${true && "empty"}`}>
          <p className="topic">Notifications</p>

          {true ? (
            <div className={`notification-list`}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="notification-item" key={item}>
                  <div className={`icon-box ${true ? "success" : "error"} `}>
                    {true ? <SuccessArrowIcon /> : <ErrorArrowIcon />}
                  </div>

                  <div className="d-flex">
                    <div className="text">
                      <h6>to Home Trust Fund </h6>
                      <p>Deposit</p>
                    </div>

                    <p className="amount">{true ? "+" : "-"} 0.35567 ETH</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="You have no notifications yet" />
          )}
        </div>
      </div>
    </Layout>
  );
};
