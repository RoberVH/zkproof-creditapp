import { ethers } from "ethers"
import GROTH16_VERIFIER_ABI from "./Groth16VerifierABI.json"

// Verifier Contract deployed to SEPOLIA
const VERIFIER_CONTRACT_ADDRESS='0xAd0fB84F188DF7Bb7A889FFC734739f34bBA2a14'

// Detect if MetaMask or another Ethereum wallet is installed
export const isEthereumAvailable = (): boolean => {
  return typeof window !== "undefined" && !!window.ethereum;
};

// Helper function to format wallet address for display
export const formatWalletAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Helper function to check if a connected network is supported
export const checkSupportedNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    // Add your supported chain IDs here
    const supportedChains = ["0xaa36a7"]; // Sepolia
    return supportedChains.includes(chainId);
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
};

// Helper to switch networks
export const switchToSupportedNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Request switch to Goerli testnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia
    });
    return true;
  } catch (error: any) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.infura.io"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Error adding network:", addError);
        return false;
      }
    }
    console.error("Error switching network:", error);
    return false;
  }
};

// Call verifyProof on Verifier Contract
export const verifyProof = async (proof:string[]): Promise<{status: boolean, msg: string}> => {
  const callData: any[] = JSON.parse(`[${proof}]`);
  const _pA: [string, string] = [callData[0][0], callData[0][1]];
  const _pB: [[string, string], [string, string]] = [
    [callData[1][0][0], callData[1][0][1]],
    [callData[1][1][0], callData[1][1][1]]
  ];
  const _pC: [string, string] = [callData[2][0], callData[2][1]];
  const _pubSignals: [string, string, string] = [
    callData[3][0],
    callData[3][1],
    callData[3][2]
  ]
  //_pC[1]='0x06fafffdd070f264d66d2ec354b82565d070f2ec354b8d070f264d2565d070f2ec35'
    try {
      let isValid: Boolean
      if (typeof window === "undefined" || !window.ethereum) {
        const result = await fetch("http://localhost:3000/verifyproof", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            _pA,
            _pB,
            _pC,
            _pubSignals
          })
        })
        if (result.ok) {
          const responseData = await result.json()
          isValid = responseData.isValid

      }
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum)
        // No need for a signer, get a provider for read only from contract
        const verifierContract =  new ethers.Contract(VERIFIER_CONTRACT_ADDRESS, GROTH16_VERIFIER_ABI, provider)
        const result = await verifierContract.verifyProof(_pA, _pB, _pC, _pubSignals)
        isValid = result
      }
      if (isValid)
          return {status: true, msg: 'common.ZKProof_ok'}
      else 
          return {status: false, msg: 'common.ZKProof_error'}
  } catch (error) {
    console.error("Error al verificar la prueba:", error)
    return {status: false, msg: 'common.ZKProof_error'}
  }
}

// Types for Ethereum window
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (eventName: string) => void;
    };
  }
}
