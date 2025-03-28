import { getEmployeeStorageKey, getUnixDate } from './utils'
import { ZKProofToStore, StoredProofRecord  } from './app-types'

  
interface returnWriteProof {
    status: boolean,
    msg?: string
}
  
  // Type definition for the user object
  interface User {
    username: string
    role: string
  }
  
  // Function to store the proof in localStorage under the current user's name
  function storeProof(employee:string, proof: ZKProofToStore): returnWriteProof {
    // Retrieve current user from localStorage
    
    const storageKey = getEmployeeStorageKey(employee)
    let  storedProofs:StoredProofRecord[]


    const existingData = localStorage.getItem(storageKey)
    storedProofs = existingData ? JSON.parse(existingData) : []
      
    // Create new proof record
    const newRecord: StoredProofRecord = {
      id: storedProofs.length + 1,      // proof 0 will have id 1 and so on
      createdAt: getUnixDate(),
      proof,
    }
    console.log('storedProofs',storedProofs)
  
    // Save updated records to localStorage
    storedProofs.push(newRecord)
    localStorage.setItem(storageKey, JSON.stringify(storedProofs))
    return {status:true}
  }
  
  export { storeProof }