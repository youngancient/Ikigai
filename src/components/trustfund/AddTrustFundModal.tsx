import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";

export const AddTrustFundModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = () => {
    setStep(2);
  };

  const handleConfirm = () => {
    setStep(0);
    setIsLoading(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setIsLoading(false);
    setSuccess(false);
    setAmount("");
    setTargetDate("");
    setCategory("");
  };

  useEffect(() => {
    if (isLoading && !success) {
      //simulate request time

      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 1000);
    }
  }, [isLoading]);

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

                <div className="w-full p-5">
                  <h3 className="text-white text-xl">Summary;</h3>
                </div>

                <div className="w-full p-5 mt-3">
                  <div className="w-full bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] p-[2px] rounded-xl">
                    <div className="w-full bg-[#141414] rounded-inherit p-5">
                      <div className="w-full flex items-center justify-between text-[#4d5055]">
                        <h3>Fund name</h3>
                        <h3>School Fees</h3>
                      </div>

                      <div className="w-full flex items-center justify-between text-[#4d5055] mt-3">
                        <h3>Beneficiary Address</h3>
                        <h3>Oxnbhtbgjnkkkbnhnjhbjhb</h3>
                      </div>

                      <div className="w-full flex items-center justify-between text-[#4d5055] mt-3">
                        <h3>Target Amount</h3>
                        <h3>{amount}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between text-[#4d5055] mt-3">
                        <h3>Target Date</h3>
                        <h3>{targetDate}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer */}

                <div className="w-full mt-3 p-5 flex">
                  <button onClick={onClose} className="px-5 py-3 bg-[#141414] text-white border border-[#595858] rounded-2xl">
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    className="px-5 py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] via-[#FF56A999] to-[#FFAA6C]  text-white  rounded-2xl ml-5 flex-grow"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {step === 0 && isLoading && (
              <div className="w-full">
                <div className="flex justify-between items-center  px-4 py-3">
                  <h2 className="text-xl font-semibold text-white">{""}</h2>
                  <button
                    className="text-white hover:text-black"
                    onClick={onClose}
                  >
                    <IoCloseSharp size={24} />
                  </button>
                </div>

                <div className="w-full p-5 flex flex-col items-center justify-center pb-20">
                  <span>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M45.3333 10.6667C45.3333 9.19391 46.5272 8 48 8C49.4728 8 50.6667 9.19391 50.6667 10.6667V19.2C50.6667 20.6728 49.4728 21.8667 48 21.8667H39.7025C38.2298 21.8667 37.0359 20.6728 37.0359 19.2C37.0359 17.7272 38.2298 16.5333 39.7025 16.5333H41.5292C38.6349 14.5084 35.1493 13.3333 31.4066 13.3333C21.4954 13.3333 13.3333 21.6193 13.3333 32C13.3333 33.4728 12.1394 34.6667 10.6667 34.6667C9.19391 34.6667 8 33.4728 8 32C8 18.8166 18.4091 8 31.4066 8C36.6326 8 41.4487 9.75605 45.3333 12.709V10.6667Z"
                        fill="url(#paint0_linear_115_6564)"
                        fill-opacity="0.6"
                      />
                      <path
                        d="M18.6667 53.3333C18.6667 54.8061 17.4728 56 16 56C14.5272 56 13.3333 54.8061 13.3333 53.3333V44.8C13.3333 43.3272 14.5272 42.1333 16 42.1333H24.2975C25.7702 42.1333 26.9641 43.3272 26.9641 44.8C26.9641 46.2728 25.7702 47.4667 24.2975 47.4667H22.4708C25.3651 49.4916 28.8507 50.6667 32.5934 50.6667C42.5046 50.6667 50.6667 42.3807 50.6667 32C50.6667 30.5272 51.8606 29.3333 53.3333 29.3333C54.8061 29.3333 56 30.5272 56 32C56 45.1834 45.5909 56 32.5934 56C27.3674 56 22.5513 54.244 18.6667 51.291V53.3333Z"
                        fill="url(#paint1_linear_115_6564)"
                        fill-opacity="0.6"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_115_6564"
                          x1="8"
                          y1="8"
                          x2="57.0299"
                          y2="9.0761"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8AD4EC" />
                          <stop offset="0.217372" stop-color="#EF96FF" />
                          <stop offset="0.540308" stop-color="#FF56A9" />
                          <stop offset="0.852826" stop-color="#FFAA6C" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_115_6564"
                          x1="8"
                          y1="8"
                          x2="57.0299"
                          y2="9.0761"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8AD4EC" />
                          <stop offset="0.217372" stop-color="#EF96FF" />
                          <stop offset="0.540308" stop-color="#FF56A9" />
                          <stop offset="0.852826" stop-color="#FFAA6C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>

                  <h3 className="mt-3 text-white text-xl">
                    Loading confirmation
                  </h3>
                  <p className="text-center mt-2 text-[#4d4d4e]">
                    Creating a trust fund category here <br />
                    Confirm this action in your dashboard
                  </p>
                </div>
              </div>
            )}

            {step === 0 && success && (
              <div className="w-full">
                <div className="flex justify-between items-center  px-4 py-3">
                  <h2 className="text-xl font-semibold text-white">{""}</h2>
                  <button
                    className="text-white hover:text-black"
                    onClick={onClose}
                  >
                    <IoCloseSharp size={24} />
                  </button>
                </div>

                <div className="w-full p-5 flex flex-col items-center justify-center pb-20">
                  <span>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M41.8017 28.6329C42.8878 27.6382 42.9619 25.9514 41.9672 24.8653C40.9725 23.7792 39.2857 23.7051 38.1996 24.6998L28.354 33.7169L25.8017 31.3794C24.7156 30.3847 23.0288 30.4587 22.0341 31.5448C21.0394 32.6309 21.1135 34.3177 22.1996 35.3124L26.553 39.2995C27.5722 40.2331 29.1358 40.2331 30.1551 39.2995L41.8017 28.6329Z"
                        fill="url(#paint0_linear_115_6699)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M32.0007 5.33301C17.2731 5.33301 5.33398 17.2721 5.33398 31.9997C5.33398 46.7273 17.2731 58.6663 32.0007 58.6663C46.7282 58.6663 58.6673 46.7273 58.6673 31.9997C58.6673 17.2721 46.7282 5.33301 32.0007 5.33301ZM10.6673 31.9997C10.6673 20.2176 20.2186 10.6663 32.0007 10.6663C43.7827 10.6663 53.334 20.2176 53.334 31.9997C53.334 43.7817 43.7827 53.333 32.0007 53.333C20.2186 53.333 10.6673 43.7817 10.6673 31.9997Z"
                        fill="url(#paint1_linear_115_6699)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_115_6699"
                          x1="5.33398"
                          y1="5.33301"
                          x2="59.8116"
                          y2="6.52868"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8AD4EC" />
                          <stop offset="0.217372" stop-color="#EF96FF" />
                          <stop offset="0.540308" stop-color="#FF56A9" />
                          <stop offset="0.852826" stop-color="#FFAA6C" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_115_6699"
                          x1="5.33398"
                          y1="5.33301"
                          x2="59.8116"
                          y2="6.52868"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#8AD4EC" />
                          <stop offset="0.217372" stop-color="#EF96FF" />
                          <stop offset="0.540308" stop-color="#FF56A9" />
                          <stop offset="0.852826" stop-color="#FFAA6C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>

                  <h3 className="mt-3  text-xl text-white">
                    Action Completed!
                  </h3>
                  <a
                    href="https://etherscan.io"
                    className="text-center mt-2 text-blue-500 underline"
                  >
                    Confirm on Ethereum
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
