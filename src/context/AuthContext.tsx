
import { isEthereumAvailable } from "@/utils/ethereum";
import React, { createContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "solicitant-company" | "solicitant" | "creditor" | null;

interface AuthUser {
  username: string;
  role: UserRole;
  walletAddress?: string;
}

interface AuthContextType {
  hasWallet: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  hasWallet: false,
  isAuthenticated: false,
  walletConnected: false,
  walletAddress: null,
  login: () => {},
  logout: () => {},
  connectWallet: async () => false,
  disconnectWallet: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean> (false);
  

  // Check for saved session on mount
  useEffect(() => {

    setHasWallet(isEthereumAvailable)

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedWalletAddress = localStorage.getItem("walletAddress");
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      setWalletConnected(true);
    }
    
    // Listen for Ethereum account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          setWalletConnected(false);
          setWalletAddress(null);
          localStorage.removeItem("walletAddress");
        } else {
          // User switched accounts
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        }
      });
    }
    
    return () => {
      // Clean up listener
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  const login = (username: string, role: UserRole) => {
    const newUser = { username, role };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      console.error("Ethereum wallet not detected");
      return false;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        localStorage.setItem("walletAddress", accounts[0]);
        
        // Update user with wallet if logged in
        if (user) {
          const updatedUser = { ...user, walletAddress: accounts[0] };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    
    // Update user without wallet if logged in
    if (user) {
      const updatedUser = { ...user };
      delete updatedUser.walletAddress;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        hasWallet,
        user,
        isAuthenticated: !!user,
        walletConnected,
        walletAddress,
        login,
        logout,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
