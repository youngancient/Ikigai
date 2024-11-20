import { IconButton } from "@mui/material";

import { CancelIcon } from "../../../../assets/icons/CancelIcon";

import Modal from "../../../../components/Modal/modal";

type propType = {
  openModal: boolean;
  closeModal: () => void;
  selectedWill: any;
};

const ViewWill = ({ closeModal, openModal, selectedWill }: propType) => {
  return (
    <Modal
      closeModal={closeModal}
      openModal={openModal}
      closeOnOverlayClick={false}
    >
      <div className="create-will-modal">
        <div className="modal-contents">
          <div className="title">
            <h4>View Will</h4>

            <IconButton onClick={closeModal}>
              <CancelIcon />
            </IconButton>
          </div>

          <form>
            <div className="form-step-four">
              <div className="summary">
                <h6>Summary;</h6>

                <div className="form-preview">
                  <div className="d-flex">
                    <p>Activity Period</p>
                    <p>{selectedWill?.activity_period}</p>
                  </div>
                  <div className="d-flex">
                    <p>Grace Period</p>
                    <p>{selectedWill?.grace_period}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ViewWill;
