
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";

const SignInButton: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Button variant="outline" className="rounded-md">
      {t("common.signIn")}
    </Button>
  );
};

export default SignInButton;
