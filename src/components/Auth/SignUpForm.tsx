
import React, { useState, useContext } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext, UserRole } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { addNewUser } from "@/lib/existingEntityonStorage";


interface SignUpFormProps {
  role: UserRole;
  onSuccess?: (result: {status:boolean, msg:string}) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ role, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { hasWallet, login, connectWallet } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const result:{status:boolean, msg:string} = addNewUser(username,role)
    if (result.status)  login(username, role);
      // For solicitant, connect wallet automatically
      if (role === "solicitant" && result.status) {
        await connectWallet();
      }
      setLoading(false);
      if (onSuccess) {
        onSuccess(result)
      }
  };
  
  const getRoleTitle = () => {
    switch (role) {
      case "solicitant-company":
        return t("roles.solicitantCompany.title");
      case "solicitant":
        return t("roles.solicitant.title");
      case "creditor":
        return t("roles.creditor.title");
      default:
        return "";
    }
  };
  
  const getRoleDescription = () => {
    switch (role) {
      case "solicitant-company":
        return t("roles.solicitantCompany.description");
      case "solicitant":
        return t("roles.solicitant.description");
      case "creditor":
        return t("roles.creditor.description");
      default:
        return "";
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-fade-in">
      <CardHeader>
        <CardTitle>{getRoleTitle()}</CardTitle>
        <CardDescription>{getRoleDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-focus-ring"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="mt-6 w-full" 
            disabled={loading || !username.trim()}
          >
            {loading ? "Processing..." : t("common.signUp")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
