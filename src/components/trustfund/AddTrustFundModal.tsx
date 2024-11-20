import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { useTrustFund } from "../../hooks/useTrustFund";
import useRunners from "../../hooks/useRunners";

interface TrustFundFormData {
  fundName: string;
  purpose: string;
  beneficiary: string;
  amount: string;
  targetDate: string;
  category: string;
}

export const AddTrustFundModal = ({
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}) => {
  const { signer } = useRunners();
  const { createFund, txState } = useTrustFund();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TrustFundFormData>({
    fundName: "",
    purpose: "",
    beneficiary: "",
    amount: "",
    targetDate: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<TrustFundFormData>>({});

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setFormData({
      fundName: "",
      purpose: "",
      beneficiary: "",
      amount: "",
      targetDate: "",
      category: "",
    });
    setFormErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<TrustFundFormData> = {};
    
    if (!formData.fundName) errors.fundName = "Fund name is required";
    if (!formData.purpose) errors.purpose = "Purpose is required";
    if (!formData.beneficiary) errors.beneficiary = "Beneficiary address is required";
    if (!formData.amount || isNaN(Number(formData.amount))) {
      errors.amount = "Valid amount is required";
    }
    if (!formData.targetDate) errors.targetDate = "Target date is required";
    if (!formData.category) errors.category = "Category is required";

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.beneficiary)) {
      errors.beneficiary = "Invalid Ethereum address";
    }

    const targetTimestamp = new Date(formData.targetDate).getTime();
    if (targetTimestamp <= Date.now()) {
      errors.targetDate = "Target date must be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const targetTimestamp = Math.floor(new Date(formData.targetDate).getTime() / 1000);
      
      const fundId = await createFund({
        fundName: formData.fundName,
        purpose: formData.purpose,
        beneficiary: formData.beneficiary,
        targetAmount: formData.amount,
        targetDate: targetTimestamp,
        category: formData.category,
      });

      if (fundId) {
        setStep(0);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create fund:", error);
    }
  };

  useEffect(() => {
    if (txState.success) {
      setStep(0);
    }
  }, [txState.success]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="w-[600px] max-w-[95%] p-1 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl">
        <div className="bg-[#141414] w-full rounded-xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {step === 1 ? "Create Trust Fund" : step === 2 ? "Summary" : ""}
            </h2>
            <button onClick={onClose}>
              <IoCloseSharp size={24} />
            </button>
          </div>

          {step === 1 && (
            <>
              {Object.keys(formData).map((field) => (
                <div key={field} className="mb-4">
                  <p className="text-lg capitalize">
                    {field === "targetDate" ? "Target Date" : field}
                  </p>
                  <input
                    type={field === "targetDate" ? "date" : 
                          field === "amount" ? "number" : 
                          "text"}
                    name={field}
                    className="w-full p-3 mt-2 bg-transparent border rounded-xl"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    value={formData[field as keyof TrustFundFormData]}
                    onChange={handleChange}
                  />
                  {formErrors[field as keyof TrustFundFormData] && (
                    <p className="text-red-500 mt-1 text-sm">
                      {formErrors[field as keyof TrustFundFormData]}
                    </p>
                  )}
                </div>
              ))}
              <button
                onClick={() => validateForm() && setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl"
                disabled={!signer}
              >
                {signer ? "Create Trust Fund" : "Connect Wallet to Continue"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl mb-4">Summary</h3>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between mb-2">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span>{value || "N/A"}</span>
                </div>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] rounded-xl"
                  disabled={txState.loading}
                >
                  {txState.loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </>
          )}

          {step === 0 && (
            <div className="flex flex-col items-center">
              <span className="mb-4">
                {txState.loading ? (
                  <svg width="64" height="64" fill="currentColor">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" />
                  </svg>
                ) : (
                  <svg width="64" height="64" fill="currentColor">
                    <path d="M32 12l20 20-20 20-20-20z" />
                  </svg>
                )}
              </span>
              <h3 className="text-xl">
                {txState.loading
                  ? "Processing transaction..."
                  : txState.success
                  ? "Trust Fund Created Successfully!"
                  : txState.error
                  ? "Transaction Failed"
                  : ""}
              </h3>
              {txState.hash && (
                <a 
                  href={`https://sepolia-blockscout.lisk.com/tx/${txState.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-500 underline"
                >
                  View on Etherscan
                </a>
              )}
              {txState.error && (
                <p className="text-red-500 mt-2">{txState.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};