
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
    const supportedChains = ["0x1", "0x5", "0x539"]; // Mainnet, Goerli, Localhost
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
      params: [{ chainId: "0x5" }], // Goerli
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
              chainId: "0x5",
              chainName: "Goerli Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://goerli.infura.io/v3/"],
              blockExplorerUrls: ["https://goerli.etherscan.io"],
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
