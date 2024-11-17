import { Fade, Slide } from "@mui/material";
import "./style.scss";

type ModalProps = {
  openModal: boolean;
  children: React.ReactNode;
  closeModal: Function;
  className?: string;
  closeOnOverlayClick?: boolean;
  contentClassName?: string;
};

function Modal({
  openModal,
  children,
  closeModal,
  className,
  closeOnOverlayClick = true,
  contentClassName,
}: ModalProps) {
  return (
    <>
      <Fade in={openModal}>
        <div className={`modal-wrap ${className}`}>
          <Slide direction="down" in={openModal} mountOnEnter unmountOnExit>
            <div
              onClick={(e) =>
                e.target === e.currentTarget &&
                closeOnOverlayClick &&
                closeModal()
              }
              className={`modal-content ${contentClassName}`}
            >
              {children}
            </div>
          </Slide>
        </div>
      </Fade>
    </>
  );
}

export default Modal;
