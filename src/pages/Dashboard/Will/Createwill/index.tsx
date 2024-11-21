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
import { toast } from "react-toastify";

interface IBeneficiary {
  name: string;
  email: string;
  beneficiary_address: string;
  percentage: string;
  beneficiary_amount: string;
}

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const TOTALSTEP = 4;

const CreateWill = ({ closeModal, openModal }: propType) => {
  const [step, setStep] = useState(1);
  const { address, isConnected } = useAppKitAccount();

  const [beneficiaries, setBeneficiaries] = useState<IBeneficiary[]>([
    {
      name: "",
      email: "",
      beneficiary_address: "",
      percentage: "",
      beneficiary_amount: "",
    },
  ]);
  const [tokenList, setTokenList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  //const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    asset: "",
    assetSymbol: "",
    amount: "",
    activity_period: "",
    grace_period: "",
    assetDecimals: "",
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

  const handleBeneficiaryInputChange = (
    index: number,
    field: keyof IBeneficiary,
    value: string
  ) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;

    // Recalculate `userAmount` if `percentage` is updated
    if (field === "percentage") {
      const percentageValue = parseFloat(value);
      if (!isNaN(percentageValue)) {
        updatedBeneficiaries[index].beneficiary_amount = (
          (percentageValue / 100) *
          Number(formData.amount)
        ).toFixed(2);
      } else {
        updatedBeneficiaries[index].beneficiary_amount = "";
      }
    }

    setBeneficiaries(updatedBeneficiaries);
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        email: "",
        beneficiary_address: "",
        percentage: "",
        beneficiary_amount: "",
      },
    ]);
  };

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
      setBeneficiaries(updatedBeneficiaries);
    }
  };

  const isFormValid = (): boolean => {
    let totalPercentage = 0;

    for (const beneficiary of beneficiaries) {
      if (
        !beneficiary.name ||
        !beneficiary.email ||
        !beneficiary.beneficiary_address ||
        !beneficiary.percentage ||
        !beneficiary.beneficiary_amount
      ) {
        toast.error("Input valid fields");

        return false;
      }

      if (!ethers.isAddress(beneficiary.beneficiary_address)) {
        toast.error(
          `Input valid wallet address: ${beneficiary.beneficiary_address}`
        );

        return false;
      }

      const percentageValue = parseFloat(beneficiary.percentage);
      if (isNaN(percentageValue) || percentageValue < 0) {
        toast.error("Percentage must be a valid positive number.");
        return false;
      }
      totalPercentage += percentageValue;
    }

    if (totalPercentage > 100) {
      toast.error(
        "Total percentage across all beneficiaries cannot exceed 100%."
      );
      return false;
    }
    return true;
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

  const { registerWill, isRegisterLoading, isDone, reset } = useRegisterWill(
    formData.asset
  );
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const Name = formData.name;
    const gracePeriod = parseInt(formData.grace_period);
    const activityThreshold = parseInt(formData.activity_period);

    // const amounts = beneficiaries?.map((item) => 
    //   item.beneficiary_amount + "0".repeat(Number(formData.assetDecimals))
    // );
  

    const tokenAllocations = [
      {
        tokenAddress: formData.asset,
        tokenType: 1,
        tokenIds: [],
        amounts: [formData.amount + "0".repeat(Number(formData.assetDecimals))],
        beneficiaries: beneficiaries?.map((item) => item.beneficiary_address),
      },
    ];

    console.log({ Name: "", gracePeriod, activityThreshold, tokenAllocations });
    if (step === TOTALSTEP) {
      // setIsLoading(true);
      // sign function goes here
      registerWill("", gracePeriod, activityThreshold, tokenAllocations);
      // setIsSubmitted(true);
    } else {
      if (step === 2) {
        if (isFormValid()) {
          setStep(step + 1);
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      asset: "",
      amount: "",
      activity_period: "",
      grace_period: "",
      assetSymbol: "",
      assetDecimals: "",
    });
    setBeneficiaries([
      {
        name: "",
        email: "",
        beneficiary_address: "",
        percentage: "",
        beneficiary_amount: "",
      },
    ]);
  };

  const closeModalFunc = () => {
    closeModal();
    setStep(1);
    clearForm();
    // setIsLoading(false);
    //setIsSubmitted(false);
    reset();
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
      let filtered: {
        token: { address: string; symbol: string; decimals: string };
      }[] = tokenList?.filter(
        (item: {
          token: { address: string; symbol: string; decimals: string };
        }) => item?.token?.address === formData.asset
      );
      setFormData((prev) => ({
        ...prev,
        assetSymbol: filtered[0]?.token?.symbol,
        assetDecimals: filtered[0]?.token?.decimals,
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

              {step === 2 && (
                <div className="form-step-two">
                  {beneficiaries.map((beneficiary, index) => (
                    <div className="beneficiary-item">
                      {beneficiaries.length > 1 && index > 0 && (
                        <IconButton
                          className="remove-icon"
                          onClick={() => removeBeneficiary(index)}
                        >
                          <CancelIcon stroke="red" />
                        </IconButton>
                      )}
                      <InputField
                        name="name"
                        label="Beneficiary Name"
                        required
                        value={beneficiary.name}
                        type="text"
                        onChange={(e) =>
                          handleBeneficiaryInputChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <InputField
                        name="email"
                        label="E-mail address of beneficiary"
                        required
                        value={beneficiary.email}
                        type="email"
                        onChange={(e) =>
                          handleBeneficiaryInputChange(
                            index,
                            "email",
                            e.target.value
                          )
                        }
                      />
                      <InputField
                        name="beneficiary_address"
                        label="Beneficiary Wallet address"
                        required
                        value={beneficiary.beneficiary_address}
                        type="text"
                        onChange={(e) =>
                          handleBeneficiaryInputChange(
                            index,
                            "beneficiary_address",
                            e.target.value
                          )
                        }
                      />
                      <div className="form-group-flex">
                        <InputField
                          name="percentage"
                          label="Enter Percentage"
                          required
                          value={beneficiary.percentage}
                          type="text"
                          onChange={(e) =>
                            handleBeneficiaryInputChange(
                              index,
                              "percentage",
                              e.target.value
                            )
                          }
                        />
                        <InputField
                          name="userAmount"
                          label="Amount"
                          required
                          disabled
                          value={beneficiary.beneficiary_amount}
                          type="text"
                          // onChange={(e) =>
                          //   handleBeneficiaryInputChange(
                          //     index,
                          //     "beneficiary_amount",
                          //     e.target.value
                          //   )
                          // }
                        />
                      </div>
                    </div>
                  ))}

                  <div className="btn-flex">
                    <Button onClick={addBeneficiary} className="cancel">
                      Add Beneficiary
                    </Button>
                    <Button className="submit-button" type="submit">
                      Next
                    </Button>
                  </div>
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
                      {/* <div className="d-flex">
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
                      </div> */}

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
