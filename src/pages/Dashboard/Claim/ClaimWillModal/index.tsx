import { useState } from "react";

import { Button, IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";
import refresh from "../../../../assets/icons/refresh.svg";
import check_circle from "../../../../assets/icons/check-circle.svg";

import Modal from "../../../../components/Modal/modal";

import "./style.scss";

export interface ISelectedItem {
  type: string;
  name: string;
  address: string;
  amount: string;
  sender_address: string;
}

type propType = {
  openModal: boolean;
  closeModal: () => void;
  selectedItem: ISelectedItem | null;
};

const ClaimWillModal = ({ closeModal, openModal, selectedItem }: propType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setIsSubmitted(false);
  };

  return (
    <Modal
      closeModal={closeModal}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="claim-will-modal">
        <div className="modal-contents">
          <div className="title">
            <h4>{isLoading || isSubmitted ? "" : "Signature Request"}</h4>

            <IconButton onClick={closeModal}>
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

              <a href="">Confirm on Ethereum</a>
            </div>
          )}

          {!isLoading && !isSubmitted && (
            <div className="form-step-four">
              <p className="desc">
                Output is estimated.If the price changes by more than 0.5% your
                transaction will revert.
              </p>

              <div className="summary">
                <h6>Summary;</h6>

                <div className="form-preview">
                  <div className="d-flex">
                    <p>Name of Will</p>
                    <p>{selectedItem?.name}</p>
                  </div>

                  <div className="d-flex">
                    <p>Wallet Address</p>
                    <p className=" truncate ">{selectedItem?.address}</p>
                  </div>

                  <div className="d-flex">
                    <p>Claimable Will</p>
                    <p>{selectedItem?.amount}</p>
                  </div>

                  <div className="d-flex">
                    <p>Willers Address</p>
                    <p className=" truncate ">{selectedItem?.sender_address}</p>
                  </div>
                </div>
              </div>

              <div className="btn-flex">
                <Button onClick={closeModal} className="cancel">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  className="submit-button"
                >
                  Sign
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClaimWillModal;
