
import React, { useContext,  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, PowerOff } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import {  userByRole } from "@/lib/existingEntityonStorage";

import { createZKProof } from "@/components/zkproofs/createZKproof";
import { storeProof } from "@/lib/writeProofStorage";
import { convertUnixDate, copyClipboard, getEmployeeProofs } from "@/lib/utils";
import { StoredProofRecord, ZKProofToStore } from "@/lib/app-types";
import { verifyProof } from "@/utils/ethereum";


const Dashboard: React.FC = () => {
  const { user, isAuthenticated, walletConnected, connectWallet } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [availableEmployees, setAvailableEmployees] = useState<string[]>([]);
  const [availableProofs, setAvailableProofs] = useState<StoredProofRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedProof, setSelectedProof] = useState<number | null>(null);
  const [rfc, setRFC] = useState<string>("");
  const [wageAmount, setWageAmount] = useState("");
  const [salt, setSalt] = useState("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  

  

  // Get all storage users - Applicants available at load time
  React.useEffect(() => {
    const availableUsers= userByRole('solicitant')
    if (availableUsers)  setAvailableEmployees(availableUsers)
  },[])

  // Get all proofs for current Employee
  React.useEffect(() => {
    let employeeProofs: any
      if (user){
      if (user.role === 'solicitant-company') 
            employeeProofs= getEmployeeProofs(selectedEmployee)
      else
            employeeProofs= getEmployeeProofs(user.username)
      setAvailableProofs(employeeProofs)
  }
  },[selectedEmployee])

  
  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const copyProofData = (text: string) => {
    copyClipboard(text)
    toast.info(t("common.proofCopied"))
  }

  const handleCreateProof = async () => {
    // Implement proof creation logic
    try {
      setIsWaiting(true)
      const result = await createZKProof({ wageAmount, salt, rfc})
      if (!result.status) throw new Error(result.msg)
      // store it on browser
      const resultStore= storeProof(selectedEmployee, result.proofData)

      if (!result.status) toast.error(resultStore.msg)
       toast.success(t("solicitant.ProofCreatedSuccessfully"))
      // refresh availableProofs
      setAvailableProofs(getEmployeeProofs(selectedEmployee))
    } catch (error) {
      console.error('Error creating zkpProof from server:', error);
      toast.error(error.message);
    } finally {
        setIsWaiting(false)
      }
    
  };

  
  const handleVerify = async () => {
    setIsWaiting(true)
    const result = await verifyProof(availableProofs[selectedProof-1].proof)
    setIsWaiting(false)
    if (result.status ) toast.success(t(result.msg))
        else toast.error(t(result.msg))
  };
  

  const handleChangeEmployee = (e: React.SetStateAction<string>) => {
    setSelectedEmployee(e)
  }

  const handleChangeProof = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newProofValue = e.target.value as unknown as ZKProofToStore;
  
    setAvailableProofs((prevProofs) => {
      const updatedProofs = [...prevProofs]; // Clonar el array para no mutar el estado directamente
      if (selectedProof && selectedProof > 0 && selectedProof <= prevProofs.length) {
        // Actualizar solo el campo 'proof' del elemento seleccionado
        updatedProofs[selectedProof - 1] = {
          ...updatedProofs[selectedProof - 1],
          proof: newProofValue,
        };
      }
      return updatedProofs;
    });
  };

  
  const renderSolicitantCompanyDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("company.selectEmployee")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          { Boolean(availableEmployees.length) ? (
              <Select 
                value={selectedEmployee} 
                onValueChange={handleChangeEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("company.selectEmployee")} />
                </SelectTrigger>

                <SelectContent>
                  {availableEmployees.map((employee) => (
                    <SelectItem key={employee} value={employee}>
                      {employee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>) : <p className="text-red-500" >{t("common.noEmployees")}</p> }
            
            { selectedEmployee ? (
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
                  <Label htmlFor="wage">{t("company.RFC")}</Label>
                  <Input 
                    id="rfc"
                    type="text"
                    value={rfc}
                    onChange={(e) => setRFC(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>                
                <div className="space-y-2">
                  <Label htmlFor="salt">{t("company.randomSalt")}</Label>
                  <Input 
                    id="salt"
                    placeholder="12345"
                    type="number"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    className="input-focus-ring"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={handleCreateProof}
                    disabled={!rfc || !wageAmount || !salt}
                    className="flex-1"
                  >
                  {  isWaiting ? t("common.waitingServerAnswer") : t("company.createProof")
                  }                  
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRFC("");
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
                  <TableHead>{t("company.issuedDate")}</TableHead>
                  <TableHead>{t("company.proofData")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableProofs
                  .map((proof) => (
                    <TableRow key={proof.id}>
                      <TableCell>{convertUnixDate(proof.createdAt)}</TableCell>
                      <TableCell  className="truncate">{proof.proof}</TableCell>
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
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{t("company.issuedDate")}</TableHead>
                <TableHead >{t("company.proofName")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableProofs.map((proof) => (
                <TableRow 
                  key={proof.id} 
                  className={selectedProof === proof.id ? "bg-blue-50" : ""}
                  onClick={() => setSelectedProof(proof.id)}
                >
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProof(proof.id)}
                    >
                      Select
                    </Button>
                  </TableCell>
                  <TableCell>{convertUnixDate(proof.createdAt)}</TableCell>
                  <TableCell className="truncate">{proof.proof}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedProof && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("solicitant.requestCredit")}</CardTitle>
            <CardDescription>
              {t("solicitant.requestDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center mb-2">
                  <Badge className="mr-2">Proof</Badge>

                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>ID:</strong> #{availableProofs[selectedProof-1].id}</p>
                  <p><strong>Date:</strong> {convertUnixDate(availableProofs[selectedProof-1].createdAt)}</p>
                  <p className="truncate"><strong>Proof Data:</strong> </p>
                  <textarea 
                    name='dataproof' 
                    key={selectedProof}
                    onChange={handleChangeProof}
                    className="p-1 cursor-pointer" 
                    onClick={()=> copyProofData(JSON.stringify(availableProofs[selectedProof-1].proof))} 
                    title={'Proof Data'}  
                    rows={8} 
                    cols={70} 
                    defaultValue={availableProofs[selectedProof-1].proof}>
                  </textarea>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleVerify}>
            {  isWaiting ? t("common.waitingServerAnswer") : t("solicitant.requestCredit")
            }   
              
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
                  : t("roles.creditor.title")
               }
               {t("header.dashboard")}
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
