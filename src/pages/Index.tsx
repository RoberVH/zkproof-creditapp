
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, Briefcase, User, CreditCard } from "lucide-react";
import { AuthContext, UserRole } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import SignUpForm from "@/components/Auth/SignUpForm";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const Index: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleSignUpClick = (role: UserRole) => {
    setSelectedRole(role);
    setSignUpOpen(true);
  };

  const handleSignUpSuccess = () => {
    setSignUpOpen(false);
    navigate("/dashboard");
  };

  const roleCards = [
    {
      title: t("roles.solicitantCompany.title"),
      description: t("roles.solicitantCompany.description"),
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      role: "solicitant-company" as UserRole,
    },
    {
      title: t("roles.solicitant.title"),
      description: t("roles.solicitant.description"),
      icon: <User className="h-10 w-10 text-primary" />,
      role: "solicitant" as UserRole,
    },
    {
      title: t("roles.creditor.title"),
      description: t("roles.creditor.description"),
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      role: "creditor" as UserRole,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 px-4">
          <div className="container-content">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge className="mb-4 py-1 px-3 bg-blue-100 text-blue-800 border-blue-200">
                Demo
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("home.title")}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {t("home.subtitle")}
              </p>
              <p className="text-gray-700">
                {t("home.description")}
              </p>
            </div>

            {!isAuthenticated && (
              <div className="pt-6 pb-8">
                <h2 className="text-2xl font-semibold text-center mb-10">
                  {t("common.newToSystem")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {roleCards.map((card) => (
                    <Card key={card.role} className="card-transition glass-card">
                      <CardHeader>
                        <div className="flex justify-center mb-4">
                          {card.icon}
                        </div>
                        <CardTitle className="text-center">{card.title}</CardTitle>
                        <CardDescription className="text-center">
                          {card.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-center pt-2 pb-6">
                        <Button 
                          onClick={() => handleSignUpClick(card.role)}
                          className="w-full"
                        >
                          {t("common.signUp")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="text-center animate-fade-in">
                <div className="glass-card p-8 max-w-md mx-auto">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">
                    {t("common.welcome")}, {user?.username}!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {user?.role === "solicitant-company" 
                      ? t("roles.solicitantCompany.title") 
                      : user?.role === "solicitant" 
                        ? t("roles.solicitant.title") 
                        : t("roles.creditor.title")}
                  </p>
                  <Button onClick={() => navigate("/dashboard")}>
                    {t("header.dashboard")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      
      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRole === "solicitant-company"
                ? t("roles.solicitantCompany.title")
                : selectedRole === "solicitant"
                ? t("roles.solicitant.title")
                : t("roles.creditor.title")}
            </DialogTitle>
            <DialogDescription>
              {selectedRole === "solicitant-company"
                ? t("roles.solicitantCompany.description")
                : selectedRole === "solicitant"
                ? t("roles.solicitant.description")
                : t("roles.creditor.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <SignUpForm role={selectedRole} onSuccess={handleSignUpSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
