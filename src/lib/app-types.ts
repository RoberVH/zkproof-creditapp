  // Type definition for each stored record
  
  export type ZKProofToStore = string[]
  
  export interface StoredProofRecord {
    id: number
    createdAt: number
    proof: ZKProofToStore
  }