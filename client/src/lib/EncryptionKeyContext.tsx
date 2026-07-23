import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type EncryptionKeyContextType = {
    encryptionKey: string | null
    setEncryptionKey: (key: string | null) => void
}

const EncryptionKeyContext = createContext<EncryptionKeyContextType | undefined>(undefined)

export function EncryptionKeyProvider({children}: {children: ReactNode}) {
    const [encryptionKey, setEncryptionKey] = useState<string | null>(null)

    return (
        <EncryptionKeyContext.Provider value={{ encryptionKey, setEncryptionKey }}>
            {children}
        </EncryptionKeyContext.Provider>
    )
}

export function useEncryptionKey() {
    const context = useContext(EncryptionKeyContext)
    if (!context) {
        throw new Error('useEncryptionKey must be used within an EncryptionKeyProvider')
    }
    return context
}