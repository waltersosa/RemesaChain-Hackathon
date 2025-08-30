export interface StoredDocument {
  id: string
  type: "voucher" | "transaction_record" | "compliance_doc"
  content: string
  metadata: {
    transactionId: string
    timestamp: string
    hash: string
  }
  ipfsHash?: string
}

export class FilecoinStorage {
  private static instance: FilecoinStorage
  private documents: Map<string, StoredDocument> = new Map()

  static getInstance(): FilecoinStorage {
    if (!FilecoinStorage.instance) {
      FilecoinStorage.instance = new FilecoinStorage()
    }
    return FilecoinStorage.instance
  }

  async storeDocument(document: Omit<StoredDocument, "id">): Promise<string> {
    // Simulate IPFS/Filecoin storage
    const documentId = `fil_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate IPFS hash generation
    const ipfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`

    const storedDoc: StoredDocument = {
      id: documentId,
      ipfsHash,
      ...document,
    }

    this.documents.set(documentId, storedDoc)

    console.log("[v0] Document stored on Filecoin:", {
      documentId,
      ipfsHash,
      type: document.type,
      size: document.content.length,
    })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return documentId
  }

  async retrieveDocument(documentId: string): Promise<StoredDocument | null> {
    const document = this.documents.get(documentId)
    if (!document) return null

    console.log("[v0] Document retrieved from Filecoin:", documentId)
    return document
  }

  async getTransactionHistory(transactionId: string): Promise<StoredDocument[]> {
    const history = Array.from(this.documents.values())
      .filter((doc) => doc.metadata.transactionId === transactionId)
      .sort((a, b) => new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime())

    return history
  }

  getIPFSUrl(ipfsHash: string): string {
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }
}
