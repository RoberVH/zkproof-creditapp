import { ethers } from "ethers"
import GROTH16_VERIFIER_ABI from "./Groth16VerifierABI.json"

// Verifier Contract deployed to SEPOLIA
const VERIFIER_CONTRACT_ADDRESS=import.meta.env.VITE_CONTRACT_ADDRESS

 const ChainId= "0xaa36a7"
 const ChainName= "Sepolia"
 const rpcUrl="https://sepolia.infura.io"
 const currency = "ETH"
 const symbol = "ETH"

 // FOR TESTING
// const ChainId= "0xa86a"
// const ChainName= "Avalanche C-Chain"
// const rpcUrl="https://avalanche.drpc.org"
// const currency = "AVAX"
// const symbol = "AVAX"

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

// Detect if MetaMask or another Ethereum wallet is installed
export const isEthereumAvailable = (): boolean => {
  return typeof window !== "undefined" && !!window.ethereum;
};

// Helper function to format wallet address for display
export const formatWalletAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};


// Helper to switch networks
export const switchToSupportedNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Request switch to Sepolia testnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ChainId }], // Sepolia
    });
    return true;
  } catch (error: any) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        // try to add it to wallet
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ChainId,
              chainName: ChainName,
              nativeCurrency: {
                name: currency,
                symbol: symbol,
                decimals: 18,
              },
              rpcUrls: [rpcUrl],
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
    return false
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
    try {
      let isValid: Boolean
      if (typeof window === "undefined" || !window.ethereum) {
        //no wallet, verify through server
        const result = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/verifyproof`, {
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
        // there is a wallet, check all ok
        // installed, check if Seploua  is  current network
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        if (chainId !== ChainId.toLowerCase()) {
            // it's not  Sepolia try switching
            if (! await switchToSupportedNetwork()) {
              return {status: false, msg: 'common.notTestnet'}
            }
          }        
        //alright, proced 
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


