interface InputDataProps {
    wageAmount: string;
    salt: string;
    rfc: string;
  }

type proof = {
    [key: string]: string | string[] | string[][]
    protocol: string
    curve: string
}

type publicSignals = string[]

interface returnValuesZKProof {
    status: boolean;
    msg?: string;
    proof: proof;
    publicSignals: publicSignals;
}

const createZKProof = async (inputData: InputDataProps): Promise<returnValuesZKProof> => {
    const { wageAmount, salt, rfc } = inputData;

    try {
        const response = await fetch('http://localhost:3000/createzkproof', {
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
            throw new Error(errorData.msg || 'Failed to hash RFC');
        }

        const data = await response.json();

        console.log('data.hash', data);
        //toast.success("ZK Proof created successfully");
        //setWageAmount("");
        //setSalt("");
        return {
            status: true,
            proof: data.proof,
            publicSignals: data.publicSignals
        };
    } catch (error: any) {
        console.error('Error fetching hash from server:', error);
        //toast.error('Hash Error: ', error.error.message);
        return {
            status: false,
            msg: error.message,
            proof: {},
            publicSignals: []
        };
    }
};
export { createZKProof };
