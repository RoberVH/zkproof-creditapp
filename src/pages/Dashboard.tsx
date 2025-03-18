
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

// Mock data for the dashboard
const mockEmployees = [
  { id: 1, name: "John Doe", rfp: "123456789" },
  { id: 2, name: "Jane Smith", rfp: "987654321" },
];

const mockProofs = [
  { id: 1, name: "Wage Proof 2023-Q1", employeeId: 1, date: "2023-03-15" },
  { id: 2, name: "Wage Proof 2023-Q2", employeeId: 1, date: "2023-06-15" },
  { id: 3, name: "Wage Proof 2023-Q3", employeeId: 2, date: "2023-09-15" },
];

const mockCreditRequests = [
  { id: 1, companyRfp: "123456789", solicitantRfp: "111222333", date: "2023-10-01", proofId: 1 },
  { id: 2, companyRfp: "987654321", solicitantRfp: "444555666", date: "2023-10-15", proofId: 3 },
];

const mockProofDetails = {
  1: { hash: "0x1234...5678", employeeRfp: "123456789" },
  3: { hash: "0x8765...4321", employeeRfp: "987654321" },
};

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, walletConnected, connectWallet } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedProof, setSelectedProof] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRfp, setNewEmployeeRfp] = useState("");
  const [wageAmount, setWageAmount] = useState("");
  const [salt, setSalt] = useState("");
  
  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleCreateEmployee = () => {
    // Implement employee creation logic
    toast.success("Employee created successfully");
    setNewEmployeeName("");
    setNewEmployeeRfp("");
  };
  
  const handleCreateProof = () => {
    // Implement proof creation logic
    toast.success("ZK Proof created successfully");
    setWageAmount("");
    setSalt("");
  };
  
  const handleRequestCredit = () => {
    if (!walletConnected) {
      connectWallet().then((success) => {
        if (success) {
          toast.success("Credit requested successfully");
        } else {
          toast.error("Failed to connect wallet");
        }
      });
    } else {
      // Implement credit request logic
      toast.success("Credit requested successfully");
    }
  };
  
  const handleCheckRequest = () => {
    // Implement verification logic
    setTimeout(() => {
      toast.success("Verification passed successfully");
    }, 1000);
  };
  
  const handleApproveLoan = () => {
    // Implement loan approval logic
    toast.success("Loan approved successfully");
  };
  
  const renderSolicitantCompanyDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("company.selectEmployee")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select 
              value={selectedEmployee} 
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("company.selectEmployee")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">{t("company.newEmployee")}</SelectItem>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedEmployee === "new" ? (
              <div className="space-y-4 mt-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="employeeName">{t("company.employeeName")}</Label>
                  <Input 
                    id="employeeName"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeRfp">{t("company.employeeRFP")}</Label>
                  <Input 
                    id="employeeRfp"
                    value={newEmployeeRfp}
                    onChange={(e) => setNewEmployeeRfp(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wageProof">{t("company.wageProof")}</Label>
                  <Input 
                    id="wageProof" 
                    value="ZK Wage Proof"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={handleCreateEmployee}
                    disabled={!newEmployeeName || !newEmployeeRfp}
                    className="flex-1"
                  >
                    {t("company.createEmployee")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setNewEmployeeName("");
                      setNewEmployeeRfp("");
                    }}
                    className="flex-1"
                  >
                    {t("common.clearForm")}
                  </Button>
                </div>
              </div>
            ) : selectedEmployee ? (
              <div className="space-y-4 mt-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="wage">{t("company.wageAmount")}</Label>
                  <Input 
                    id="wage"
                    type="number"
                    value={wageAmount}
                    onChange={(e) => setWageAmount(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salt">{t("company.randomSalt")}</Label>
                  <Input 
                    id="salt"
                    placeholder="12345"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={handleCreateProof}
                    disabled={!wageAmount || !salt}
                    className="flex-1"
                  >
                    {t("company.createProof")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setWageAmount("");
                      setSalt("");
                    }}
                    className="flex-1"
                  >
                    {t("common.clearForm")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
      
      {selectedEmployee && selectedEmployee !== "new" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("company.proofsList")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("company.proofName")}</TableHead>
                  <TableHead>{t("company.proofId")}</TableHead>
                  <TableHead>{t("company.issuedDate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProofs
                  .filter((proof) => proof.employeeId === parseInt(selectedEmployee))
                  .map((proof) => (
                    <TableRow key={proof.id}>
                      <TableCell>{proof.name}</TableCell>
                      <TableCell>#{proof.id}</TableCell>
                      <TableCell>{proof.date}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
  
  const renderSolicitantDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("solicitant.proofsList")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("company.proofName")}</TableHead>
                <TableHead>{t("company.issuedDate")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProofs.map((proof) => (
                <TableRow 
                  key={proof.id} 
                  className={selectedProof === proof.id ? "bg-blue-50" : ""}
                  onClick={() => setSelectedProof(proof.id)}
                >
                  <TableCell>{proof.name}</TableCell>
                  <TableCell>{proof.date}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProof(proof.id)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedProof && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Request Credit</CardTitle>
            <CardDescription>
              {t("solicitant.requestDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center mb-2">
                  <Badge className="mr-2">Proof</Badge>
                  <span className="font-medium">
                    {mockProofs.find(p => p.id === selectedProof)?.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>ID:</strong> #{selectedProof}</p>
                  <p><strong>Date:</strong> {mockProofs.find(p => p.id === selectedProof)?.date}</p>
                  <p><strong>Employee:</strong> {mockEmployees.find(e => e.id === mockProofs.find(p => p.id === selectedProof)?.employeeId)?.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleRequestCredit}>
              {t("solicitant.requestCredit")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
  
  const renderCreditorDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("creditor.requestsList")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("creditor.companyRFP")}</TableHead>
                <TableHead>{t("creditor.solicitantRFP")}</TableHead>
                <TableHead>{t("creditor.dateRequested")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreditRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  className={selectedRequest === request.id ? "bg-blue-50" : ""}
                  onClick={() => setSelectedRequest(request.id)}
                >
                  <TableCell>{request.companyRfp}</TableCell>
                  <TableCell>{request.solicitantRfp}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("creditor.proofDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center mb-2">
                  <Badge className="mr-2">Proof</Badge>
                  <span className="font-medium">
                    {mockProofs.find(p => p.id === mockCreditRequests.find(r => r.id === selectedRequest)?.proofId)?.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>{t("creditor.hash")}:</strong> {mockProofDetails[mockCreditRequests.find(r => r.id === selectedRequest)?.proofId || 0]?.hash}</p>
                  <p><strong>{t("creditor.employeeRFP")}:</strong> {mockProofDetails[mockCreditRequests.find(r => r.id === selectedRequest)?.proofId || 0]?.employeeRfp}</p>
                </div>
              </div>
              
              <div className="hidden">
                {/* Hidden fields with proof.json and public.json */}
                <Input value='{"proof": "0x1234...5678"}' readOnly />
                <Input value='{"public": "0x8765...4321"}' readOnly />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCheckRequest}>
              {t("creditor.checkRequest")}
            </Button>
            <Button onClick={handleApproveLoan}>
              {t("creditor.approveLoan")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
  
  const renderDashboardContent = () => {
    if (!user?.role) return null;
    
    switch (user.role) {
      case "solicitant-company":
        return renderSolicitantCompanyDashboard();
      case "solicitant":
        return renderSolicitantDashboard();
      case "creditor":
        return renderCreditorDashboard();
      default:
        return null;
    }
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10 px-4">
        <div className="container-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {user?.role === "solicitant-company" 
                ? t("roles.solicitantCompany.title") 
                : user?.role === "solicitant" 
                  ? t("roles.solicitant.title") 
                  : t("roles.creditor.title")} {t("header.dashboard")}
            </h1>
            <p className="text-gray-600">
              {user?.username}
              {user?.role === "solicitant" && (
                <>
                  {walletConnected ? (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t("auth.walletConnected")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 cursor-pointer" onClick={() => connectWallet()}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t("auth.connectWallet")}
                    </Badge>
                  )}
                </>
              )}
            </p>
          </div>
          
          {renderDashboardContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
