interface InputDataProps {
    wageAmount: string
    salt: string
    rfc: string
  }


type proofData = string[]

// type publicSignals = string[]

interface returnValuesZKProof {
    status: boolean;
    msg?: string;
    proofData?: proofData;
    //publicSignals?: publicSignals;
}

const createZKProof = async (inputData: InputDataProps): Promise<returnValuesZKProof> => {
    const { wageAmount, salt, rfc } = inputData;
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/createzkproof`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputData: { 
               wageAmount, rfc, salt  
            }
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to create ZK Proof');
        }
    
        const data = await response.json();
        // all good
        return {
            status: true,
            proofData: data.proof,
        }
        
        } catch (error) {
          console.error('Error fetching hash from server:', error);
          return {status: false, msg: error.message}
        }

}


export  { createZKProof }