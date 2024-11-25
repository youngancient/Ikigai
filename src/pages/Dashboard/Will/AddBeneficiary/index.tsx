import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, CircularProgress, IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";

import Modal from "../../../../components/Modal/modal";
import InputField from "../../../../components/form/InputField";

import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import axios from "axios";

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
  selectedWill: any;
};

const AddBeneficiary = ({ closeModal, openModal, selectedWill }: propType) => {
  // const { address, isConnected } = useAppKitAccount();
  const [tokenList, setTokenList] = useState([]);
  const { address, isConnected } = useAppKitAccount();

  const [amountLeft, setAmountLeft] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState<IBeneficiary[]>([
    {
      name: "",
      email: "",
      beneficiary_address: "",
      percentage: "",
      beneficiary_amount: "",
    },
  ]);

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
          Number(amountLeft || 0)
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

  const isFormValid = (): boolean => {
    let totalPercentage = 0;

    for (const beneficiary of beneficiaries) {
      if (
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let filteredList: any[] = tokenList.filter(
      (item: any) => item?.token?.address
    );

    const payload = {
      willId: selectedWill.willId,
      beneficiaries: beneficiaries?.map((item) => item.beneficiary_address),
      amounts: beneficiaries?.map(
        (item) =>
          `${
            Number(item.beneficiary_amount) *
            10 ** Number(filteredList[0]?.token?.decimals || 18)
          }`
      ),
    };

    console.log(payload, "payload");

    if (isFormValid()) {
      // registerWill(tokenAllocations);
    }
  };

  const clearForm = () => {
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
    clearForm();
  };

  useEffect(() => {
    if (selectedWill) {
      setAmountLeft(300);
    }
  }, [selectedWill]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokens(address);
    } else {
      setTokenList([]);
    }
  }, [address, isConnected]);

  return (
    <Modal
      closeModal={closeModalFunc}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="create-will-modal">
        <div className="modal-contents">
          <div className="title">
            <h4>Add More Beneficiaries</h4>

            <IconButton onClick={closeModalFunc}>
              <CancelIcon />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit}>
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
                    type="txt"
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
                    />
                  </div>
                </div>
              ))}

              <div className="btn-flex">
                <Button onClick={addBeneficiary} className="cancel">
                  Add More
                </Button>
                <Button className="submit-button" type="submit">
                  {false ? (
                    <CircularProgress size="2rem" sx={{ color: "#ffffff" }} />
                  ) : (
                    "Save Beneficiaries"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddBeneficiary;
