import { ChangeEvent, FormEvent, useState } from "react";

import { Button, IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";
import refresh from "../../../../assets/icons/refresh.svg";
import check_circle from "../../../../assets/icons/check-circle.svg";

import Modal from "../../../../components/Modal/modal";
import InputField from "../../../../components/form/InputField";
import SelectField from "../../../../components/form/SelectField";

import "./style.scss";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const TOTALSTEP = 4;
const assetList = [
  { value: "ETH", key: "ETH" },
  { value: "SOL", key: "SOL" },
];

const MIN_GRACE_PERIOD = 24 * 60 * 60; 
const MIN_ACTIVITY_THRESHOLD = 30 * 24 * 60 * 60;

const CreateWill = ({ closeModal, openModal }: propType) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    asset: "ETH",
    amount: "",
    deadline: "",
    grace_period: "",
  });

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const Name = "Jude Will"
    const gracePeriod = MIN_GRACE_PERIOD * 2; 
    const activityThreshold = MIN_ACTIVITY_THRESHOLD * 2; 

    const tokenAllocations = [{
      tokenAddress: "0x669eEe68Ef39E12D1b38d1f274BFc9aC46D771CB",
      tokenType: 1, 
      tokenIds: [],
      amounts: [100000000],
      beneficiaries: ["0xa6B1feB40D1c8eeAD5AFD6f7372E02B637F142FA"]
    }];

    console.log({ Name, gracePeriod, activityThreshold, tokenAllocations });
    if (step === TOTALSTEP) {
      console.log(formData, "formdata");
      setIsLoading(true);
      // sign function goes here
    } else {
      setStep(step + 1);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      asset: "ETH",
      amount: "",
      deadline: "",
      grace_period: "",
    });
  };

  const closeModalFunc = () => {
    closeModal();
    setStep(1);
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
            <h4>
              {isLoading || isSubmitted
                ? ""
                : step === TOTALSTEP
                ? "Signature Request"
                : "Create Will"}
            </h4>

            <IconButton onClick={closeModalFunc}>
              <CancelIcon />
            </IconButton>
          </div>

          {isLoading && (
            <div className="loading-state">
              <img src={refresh} alt="refresh" className="animate-spin" />

              <h5>Loading confirmation</h5>
              <p>
                Creating a trust fund category here Confirm this action in your
                dashboard
              </p>
            </div>
          )}

          {isSubmitted && (
            <div className="submitted-state">
              <img src={check_circle} alt="check" />

              <h5>Action Completed!</h5>

              <a href="http://localhost:5176/vault">Confirm on Ethereum</a>
            </div>
          )}

          {!isLoading && !isSubmitted && (
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
                    name="address"
                    label="Beneficiary Wallet address"
                    required={true}
                    value={formData.address}
                    type={"text"}
                    onChange={handleChange}
                    errMsg={
                      formData.address
                        ? "Please confirm correctly that this is the right address for the beneficiary"
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
                    selectOption={assetList}
                  />

                  <div className="amount-container">
                    <label>Enter Amount</label>

                    <textarea
                      name="amount"
                      required
                      onChange={handleChange}
                    ></textarea>

                    <div className="quick-select-amount">
                      {[1, 2, 3].map((item) => (
                        <IconButton>{`${item} ${formData.asset}`}</IconButton>
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
                  <SelectField
                    label={"Set will duration"}
                    name="deadline"
                    handleCustomChange={handleChange}
                    value={formData.deadline}
                    selectOption={assetList}
                    required
                  />

                  <SelectField
                    label={"Set grace period trigger"}
                    name="grace_period"
                    handleCustomChange={handleChange}
                    value={formData.grace_period}
                    selectOption={assetList}
                    required
                  />

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
                        <p className="  ">{formData.address}</p>
                      </div>
                      <div className="d-flex">
                        <p>Deadline</p>
                        <p>{formData.deadline}</p>
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
