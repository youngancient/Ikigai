import { useState } from "react";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";

export const AddTrustFundModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(2);
  const [amount, setAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = () => {
    setStep(2);
  };

  return (
    <div>
      <Modal onClose={onClose} isOpen={isOpen}>
        <div className="w-[600px] max-w-[95%] p-[1px] bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl">
          <div className="bg-[#141414] w-full rounded-inherit shadow-lg  ">
            {step === 1 && (
              <div className="w-full">
                {/* Header */}
                <div className="flex justify-between items-center  px-4 py-3">
                  <h2 className="text-xl font-semibold text-white">
                    {"Create Trust Fund"}
                  </h2>
                  <button
                    className="text-white hover:text-black"
                    onClick={onClose}
                  >
                    <IoCloseSharp size={24} />
                  </button>
                </div>

                {/* Body */}

                <div className="w-full"></div>

                <div className="w-full p-5">
                  <div className="mt-5 w-full">
                    <p className="text-lg text-white">
                      Target amount(Amount in Eth)
                    </p>

                    <input
                      type="text"
                      className="mt-3 w-full p-4 outline-none border border-1 border-[#F9FAFB] placeholder:text-[#E4E7EC] text-white rounded-xl bg-transparent"
                      placeholder="Enter Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="mt-5 w-full">
                    <p className="text-lg text-white">Target Date</p>

                    <input
                      type="date"
                      className="mt-3 w-full p-4 outline-none border border-1 border-[#F9FAFB] placeholder:text-[#E4E7EC] text-white rounded-xl bg-transparent "
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 w-full">
                    <p className="text-lg text-white">Category Selection</p>

                    <input
                      type="text"
                      className="mt-3 w-full p-4 outline-none border border-1 border-[#F9FAFB] placeholder:text-[#E4E7EC] text-white rounded-xl bg-transparent "
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>

                {/* footer */}

                <div className="w-full p-5">
                  <button
                    onClick={handleCreate}
                    className=" text-white font-bold bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] via-[#FF56A999] to-[#FFAA6C] w-full p-3 rounded-xl"
                  >
                    Create Trust Fund
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="w-full">
                <div className="flex justify-between items-center  px-4 py-3">
                  <h2 className="text-xl font-semibold text-white">
                    {"Notification"}
                  </h2>
                  <button
                    className="text-white hover:text-black"
                    onClick={onClose}
                  >
                    <IoCloseSharp size={24} />
                  </button>
                </div>

                <div className="w-full p-5 flex items-center">
                  <div className="w-[50px] h-[50px]  bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-full p-[2px] ">
                    <div className="w-full h-full bg-[#141414] rounded-inherit flex items-center justify-center">
                      <h3 className="font-bold text-xl text-white">TF</h3>
                    </div>

                    
                  </div>
                  <h3 className="text-white text-xl ml-4">Trust Fund</h3>
                </div>

                <div>
                    <h3 className="text-white text-xl">Summary</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
