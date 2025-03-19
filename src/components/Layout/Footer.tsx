
import React from "react";
import { Shield } from "lucide-react";
import MyLogo   from '@/assets/creditapplogo1.svg?react'
import { useTranslation } from "@/hooks/useTranslation";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t bg-white/30 backdrop-blur-sm py-8 mt-auto">
      <div className="container-content">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {/* <Shield className="h-6 w-6 text-primary" /> */}
                <MyLogo className="h-8 w-8 text-blue-700"  />
            <span className="font-semibold">ZKProof Credit</span>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ZKProof Credit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
