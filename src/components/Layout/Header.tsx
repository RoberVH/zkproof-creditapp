
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, User, LogOut, ChevronDown, Globe } from "lucide-react";
// @ts-ignore
import MyLogo   from '@/assets/creditapplogo1.svg?react'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/AuthContext";
import { LanguageContext } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { formatWalletAddress } from "@/utils/ethereum";
import SignInButton from "@/components/Auth/SignInButton";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, walletConnected, walletAddress, connectWallet, disconnectWallet } = useContext(AuthContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { path: "/", label: t("header.home") },
    { path: "/dashboard", label: t("header.dashboard") },
    { path: "/certificates", label: t("header.certificates") },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <div className="container-content mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* <Shield className="h-8 w-8 text-primary" /> */}
              <MyLogo className="h-8 w-8 text-blue-700"  />
              <span className="font-semibold text-xl hidden sm:inline-block">ZKProof Credit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Selector and Profile */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  <span className={`${language === "en" ? "font-bold" : ""}`}>
                    {t("common.english")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")}>
                  <span className={`${language === "es" ? "font-bold" : ""}`}>
                    {t("common.spanish")}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Connect/Disconnect */}
            {(isAuthenticated && user?.role === "solicitant") && (
              <div>
                {walletConnected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <span className="mr-2">{formatWalletAddress(walletAddress)}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={disconnectWallet}>
                        {t("auth.disconnectWallet")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" onClick={() => connectWallet()}>
                    {t("auth.connectWallet")}
                  </Button>
                )}
              </div>
            )}

            {/* Profile or Sign In */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user?.username} ({user?.role === "solicitant-company" 
                      ? t("roles.solicitantCompany.title") 
                      : user?.role === "solicitant" 
                        ? t("roles.solicitant.title") 
                        : t("roles.creditor.title")})
                  </DropdownMenuItem>
                  <DropdownMenuItem>{t("common.account")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("common.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton />
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden border rounded-md p-2"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 px-4 bg-white space-y-1 border-t">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
