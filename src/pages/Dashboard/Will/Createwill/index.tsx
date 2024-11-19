import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Button, IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";
import refresh from "../../../../assets/icons/refresh.svg";
import check_circle from "../../../../assets/icons/check-circle.svg";

import Modal from "../../../../components/Modal/modal";
import InputField from "../../../../components/form/InputField";
import SelectField from "../../../../components/form/SelectField";

import axios from "axios";

import "./style.scss";
import { ethers } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRegisterWill } from "../../../../hooks/specific/useCreateWill";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const TOTALSTEP = 4;

const CreateWill = ({ closeModal, openModal }: propType) => {
  const [step, setStep] = useState(1);
  const { address, isConnected } = useAppKitAccount();

  const [tokenList, setTokenList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  //const [isSubmitted, setIsSubmitted] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    beneficiary_address: "",
    asset: "",
    assetSymbol: "",
    amount: "",
    activity_period: "",
    grace_period: "",
  });

  // fetch tokens

  const fetchTokens = async (address: string) => {
    if (!address) {
      return;
    }
    try {
      const response = await axios.get(
        `https://sepolia-blockscout.lisk.com/api/v2/addresses/${address}/tokens`
      );
      setTokenList(response?.data?.items || []);
    } catch (err) {}
  };

  // Handler for form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update state for the specific field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {registerWill, isRegisterLoading, isDone} = useRegisterWill(formData.asset);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const Name = formData.name;
    const gracePeriod = parseInt(formData.grace_period);
    const activityThreshold = parseInt(formData.activity_period);

    // const amount = ethers.parseUnits(formData.amount,18);

    const tokenAllocations = [
      {
        tokenAddress: formData.asset,
        tokenType: 1,
        tokenIds: [],
        amounts: [formData.amount + "0".repeat(18)],
        beneficiaries: [formData.beneficiary_address],
      },
    ];

    console.log({ Name, gracePeriod, activityThreshold, tokenAllocations });
    if (step === TOTALSTEP) {
      // setIsLoading(true);
      // sign function goes here
      registerWill(Name, gracePeriod, activityThreshold, tokenAllocations);
      // setIsSubmitted(true);
    } else {
      if (step === 1) {
        if (ethers.isAddress(formData.beneficiary_address)) {
          setStep(step + 1);
          setAddressErrorMsg("");
        } else {
          setAddressErrorMsg("Enter a valid wallet address");
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      beneficiary_address: "",
      asset: "",
      amount: "",
      activity_period: "",
      grace_period: "",
      assetSymbol: "",
    });
  };

  const closeModalFunc = () => {
    closeModal();
    setStep(1);
    clearForm();
    // setIsLoading(false);
    //setIsSubmitted(false);
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchTokens(address);
    } else {
      setTokenList([]);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (formData.asset) {
      let filtered: { token: { address: string; symbol: string } }[] =
        tokenList?.filter(
          (item: { token: { address: string; symbol: string } }) =>
            item?.token?.address === formData.asset
        );
      setFormData((prev) => ({
        ...prev,
        assetSymbol: filtered[0]?.token?.symbol,
      }));
    }
  }, [formData.asset]);

  return (
    <Modal
      closeModal={closeModalFunc}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="create-will-modal">
        <div className="modal-contents">
          <div className="title">
            <h4>
              {isRegisterLoading || isDone
                ? ""
                : step === TOTALSTEP
                ? "Signature Request"
                : "Create Will"}
            </h4>

            <IconButton onClick={closeModalFunc}>
              <CancelIcon />
            </IconButton>
          </div>

          {isRegisterLoading && (
            <div className="loading-state">
              <img src={refresh} alt="refresh" className="animate-spin" />

              <h5>Loading confirmation</h5>
              <p>
                Creating a trust fund category here Confirm this action in your
                dashboard
              </p>
            </div>
          )}

          {isDone && (
            <div className="submitted-state">
              <img src={check_circle} alt="check" />

              <h5>Action Completed!</h5>

              <a href="">Confirm on Ethereum</a>
            </div>
          )}

          {!isRegisterLoading && !isDone && (
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-step-one">
                  <InputField
                    name="name"
                    label="Name of Beneficiary"
                    required={true}
                    value={formData.name}
                    type={"text"}
                    onChange={handleChange}
                  />
                  <InputField
                    name="email"
                    label="E-mail address of beneficiary"
                    required={true}
                    value={formData.email}
                    type={"email"}
                    onChange={handleChange}
                  />{" "}
                  <InputField
                    name="phone"
                    label="Phone number of beneficiary"
                    required={true}
                    value={formData.phone}
                    type={"text"}
                    onChange={handleChange}
                  />{" "}
                  <InputField
                    name="beneficiary_address"
                    label="Beneficiary Wallet address"
                    required={true}
                    value={formData.beneficiary_address}
                    type={"text"}
                    onChange={handleChange}
                    errMsg={
                      formData.beneficiary_address && addressErrorMsg
                        ? addressErrorMsg
                        : ""
                    }
                  />
                  <Button className="submit-button" type="submit">
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="form-step-two">
                  <SelectField
                    label={"Asset to transfer"}
                    name="asset"
                    handleCustomChange={handleChange}
                    value={formData.asset}
                    required
                    selectOption={
                      tokenList?.length
                        ? tokenList?.map(
                            (item: {
                              token: { address: string; symbol: string };
                            }) => {
                              return {
                                value: item?.token?.address,
                                key: item?.token?.symbol,
                              };
                            }
                          )
                        : []
                    }
                  />

                  <div className="amount-container">
                    <label>Enter Amount</label>

                    <textarea
                      name="amount"
                      value={formData.amount}
                      required
                      onChange={handleChange}
                    ></textarea>

                    <div className="quick-select-amount">
                      {[1, 2, 3].map((item) => (
                        <IconButton
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              amount: `${item}`,
                            }))
                          }
                        >{`${item} ${formData?.assetSymbol || ""}`}</IconButton>
                      ))}
                    </div>
                  </div>

                  <Button className="submit-button" type="submit">
                    Continue
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="form-step-three">
                  <InputField
                    label={"Set activity Period"}
                    name="activity_period"
                    required={true}
                    value={formData.activity_period}
                    type={"number"}
                    onChange={handleChange}
                    min={30}
                  />{" "}
                  <InputField
                    label={"Set grace Period"}
                    name="grace_period"
                    required={true}
                    value={formData.grace_period}
                    type={"number"}
                    onChange={handleChange}
                    min={1}
                    max={31}
                  />{" "}
                  <Button className="submit-button" type="submit">
                    Continue
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="form-step-four">
                  <p className="desc">
                    Output is estimated.If the price changes by more than 0.5%
                    your transaction will revert.
                  </p>

                  <div className="summary">
                    <h6>Summary;</h6>

                    <div className="form-preview">
                      <div className="d-flex">
                        <p>Beneficiary name</p>
                        <p>{formData.name}</p>
                      </div>

                      <div className="d-flex">
                        <p>Email</p>
                        <p>{formData.email}</p>
                      </div>

                      <div className="d-flex">
                        <p>Phone</p>
                        <p>{formData.phone}</p>
                      </div>
                      <div className="d-flex">
                        <p>Beneficiary address</p>
                        <p className=" truncate ">
                          {formData.beneficiary_address}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p>Activity Period</p>
                        <p>{formData.activity_period}</p>
                      </div>
                      <div className="d-flex">
                        <p>Grace Period</p>
                        <p>{formData.grace_period}</p>
                      </div>
                    </div>
                  </div>

                  <div className="btn-flex">
                    <Button onClick={closeModalFunc} className="cancel">
                      Cancel
                    </Button>
                    <Button type="submit" className="submit-button">
                      Sign
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateWill;
