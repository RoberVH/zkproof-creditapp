
import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AuthContext, UserRole } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { LogIn, User, Briefcase, CreditCard } from "lucide-react";

interface StoredUser {
  username: string;
  role: string;
}

const SignInButton: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  
  useEffect(() => {
    // Load users from localStorage when dialog opens
    if (isOpen) {
      const users = localStorage.getItem("users");
      if (users) {
        setStoredUsers(JSON.parse(users));
      } else {
        setStoredUsers([]);
      }
    }
  }, [isOpen]);

  // Reset selections when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRole(null);
      setSelectedUsername("");
    }
  }, [isOpen]);

  const handleSignIn = () => {
    if (selectedRole && selectedUsername) {
      login(selectedUsername, selectedRole);
      setIsOpen(false);
    }
  };

  const filteredUsers = storedUsers.filter(
    (user) => user.role === selectedRole
  );

  const roleOptions = [
    {
      value: "solicitant-company",
      label: t("roles.solicitantCompany.title"),
      icon: <Briefcase className="h-4 w-4 mr-2" />,
    },
    {
      value: "solicitant",
      label: t("roles.solicitant.title"),
      icon: <User className="h-4 w-4 mr-2" />,
    }
  ];

  return (
    <>
      <Button 
        variant="outline" 
        className="rounded-md"
        onClick={() => setIsOpen(true)}
      >
        {t("common.signIn")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.signIn")}</DialogTitle>
            <DialogDescription>
              {t("common.account")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                {t("common.selectRole")}
              </h3>
              <RadioGroup 
                onValueChange={(value) => {
                  setSelectedRole(value as UserRole);
                  setSelectedUsername("");
                }}
                value={selectedRole || ""}
                className="flex flex-col space-y-2"
              >
                {roleOptions.map((role) => (
                  <div key={role.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={role.value} id={`role-${role.value}`} />
                    <Label 
                      htmlFor={`role-${role.value}`} 
                      className="flex items-center cursor-pointer"
                    >
                      {role.icon} {role.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Username Selection */}
            {selectedRole && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("common.selectUsername")}</h3>
                <div className="border rounded-md p-4">
                    {filteredUsers.length > 0 ? (
                      <div className="space-y-2">
                        <select
                          className="w-full p-2 border rounded-md cursor-pointer"
                          value={selectedUsername}
                          onChange={(e) => setSelectedUsername(e.target.value)}
                        >
                          <option value="" disabled>
                            Select a user
                          </option>
                          {filteredUsers.map((user) => (
                            <option key={user.username} value={user.username}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {t("common.noUsersWithRole")}
                      </p>
                    )}
                  </div>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="button"
              className="w-full"
              disabled={!selectedRole || !selectedUsername}
              onClick={handleSignIn}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t("common.signIn")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignInButton;
