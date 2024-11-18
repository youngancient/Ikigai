import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Button, IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";
import refresh from "../../../../assets/icons/refresh.svg";
import check_circle from "../../../../assets/icons/check-circle.svg";

import Modal from "../../../../components/Modal/modal";
import InputField from "../../../../components/form/InputField";

import axios from "axios";

import { ethers } from "ethers";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  selectedWill: any;
};

const AddBeneficiaryToWill = ({
  closeModal,
  openModal,
  selectedWill,
}: propType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    wallet_address: "",
  });

  // fetch tokens

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ethers.isAddress(formData.wallet_address)) {
      setAddressErrorMsg("");
      setIsLoading(true);
    } else {
      setAddressErrorMsg("Enter a valid wallet address");
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      wallet_address: "",
    });
  };

  const closeModalFunc = () => {
    closeModal();
    clearForm();
    setIsLoading(false);
    setIsSubmitted(false);
  };

  return (
    <Modal
      closeModal={closeModalFunc}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="create-will-modal">
        <div className="modal-contents">
          <div className="title">
            <h4>Add Beneficiary</h4>

            <IconButton onClick={closeModalFunc}>
              <CancelIcon />
            </IconButton>
          </div>

          {isLoading && (
            <div className="loading-state">
              <img src={refresh} alt="refresh" className="animate-spin" />

              <h5>Loading process</h5>
            </div>
          )}

          {isSubmitted && (
            <div className="submitted-state">
              <img src={check_circle} alt="check" />

              <h5>Action Completed!</h5>

              <a href="http://localhost:5176/vault">Beneficiary added </a>
            </div>
          )}

          {!isLoading && !isSubmitted && (
            <form onSubmit={handleSubmit}>
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
                  name="wallet_address"
                  label="Beneficiary Wallet address"
                  required={true}
                  value={formData.wallet_address}
                  type={"text"}
                  onChange={handleChange}
                  errMsg={
                    formData.wallet_address && addressErrorMsg
                      ? addressErrorMsg
                      : ""
                  }
                />
                <Button className="submit-button" type="submit">
                  Next
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddBeneficiaryToWill;
