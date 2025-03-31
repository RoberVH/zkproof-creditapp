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
    proof?: proof;
    publicSignals?: publicSignals;
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
            throw new Error(errorData.msg || 'Failed to hash RFC');
        }
        const data = await response.json();
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
        };
    }
};
export { createZKProof };
