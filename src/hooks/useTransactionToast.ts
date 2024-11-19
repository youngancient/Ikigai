import { useCallback } from 'react';
import { toast, ToastOptions, Id } from 'react-toastify';

interface ExplorerConfig {
  baseUrl: string;
  name: string;
}

const EXPLORER_CONFIG: ExplorerConfig = {
  baseUrl: 'https://sepolia-blockscout.lisk.com/api/tx/',
  name: 'Lisk Explorer'
};

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function useTransactionToast() {
  const showTxToast = useCallback((
    type: 'pending' | 'success' | 'error',
    message: string,
    txHash?: string
  ): void => {
    const toastId: Id = txHash || message;
    
    // Create message with optional link
    const toastMessage = txHash 
      ? `${message}\n${EXPLORER_CONFIG.baseUrl}${txHash}`
      : message;

    switch (type) {
      case 'pending':
        toast.loading(toastMessage, {
          ...toastConfig,
          toastId,
        });
        break;

      case 'success':
        if (txHash && toast.isActive(toastId)) {
          toast.update(toastId, {
            render: toastMessage,
            type: 'success',
            isLoading: false,
            ...toastConfig,
          });
        } else {
          toast.success(toastMessage, {
            ...toastConfig,
            toastId,
          });
        }
        break;

      case 'error':
        if (txHash && toast.isActive(toastId)) {
          toast.update(toastId, {
            render: toastMessage,
            type: 'error',
            isLoading: false,
            ...toastConfig,
          });
        } else {
          toast.error(toastMessage, {
            ...toastConfig,
            toastId,
          });
        }
        break;
    }
  }, []);

  return { showTxToast };
}