import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'
import {useRef, useState, useEffect} from 'react'
import { X, Plus, Check } from 'lucide-react'
import { useEncryptionKey } from '../lib/EncryptionKeyContext'

function Dashboard(){
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)
    const [ user, setUser ] = useState<{firstname: string; lastname: string; email: string} | null>(null)
    const [ isShareOpen, setIsShareOpen ] = useState(false)
    const [ sharedEmail, setIsSharedEmail ] = useState('')
    const [ password, setPassword ] = useState<{id: string; url: string; label: string; password: string; owner: string}[] | string>()
    const profileRef = useRef<HTMLDivElement | null>(null)
    const shareRef = useRef<HTMLDivElement | null>(null)
    const [ copiedID, setCopiedID ] = useState<string | null>(null)
    const { encryptionKey, setEncryptionKey } = useEncryptionKey()

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node
            const clickInsideProfile = profileRef.current?.contains(target)
            const clickInsideShare = shareRef.current?.contains(target)

            if (!clickInsideProfile && !clickInsideShare){
                setIsProfileOpen(false)
                setIsShareOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return(() => {
            document.addEventListener('mousedown', handleOutsideClick)
        })
    }, [])

    useEffect(() => {
        const fetchPasswords = async () => {
            try{
                const response = fetch(`${import.meta.env.VITE_PUBLIC_HOST}/passwords/list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        encryption_key: encryptionKey
                    })
                })
                const data = await (await response).json()
                if ((await response).ok) {
                    setPassword(data.data)
                } else {
                    setPassword(data.message)
                }
            }catch(error){
                console.error('Failed to load passwords:', error)
            }
        }

        if (encryptionKey) {
            fetchPasswords()
        }
        
    }, [encryptionKey])

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/user`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()
                if(response.ok){
                    setUser({
                        firstname: data.user.firstname,
                        lastname: data.user.lastname,
                        email: data.user.email
                    })
                }
            }catch(error){
                console.error('Failed to load user:', error)
            }
        }

        fetchUser()
    }, [])

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        setEncryptionKey(null)
        navigate('/login', {replace: true})
    }

    const handleCopy = async (id: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value)
            setCopiedID(id)
            setTimeout(() => setCopiedID(null), 1500)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    const handleSharePassword = async (passwordID: string) => {
        try{
            await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/passwords/share-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    password_id: passwordID,
                    encryption_key: encryptionKey,
                    email: sharedEmail
                })
            })
        }catch(error){
            console.error('Failed to share password to user:', error)
        }
    }

    return(
        <div className='min-h-screen select-none'>
            <header className='bg-gray-700 h-20'>
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-bold text-xl text-center p-4 text-white'>Welcome, {user?.firstname}!</h1>
                    <div className='ml-auto flex items-center gap-10'>
                        <button
                            type='button'
                            onClick={() => setNavOpen((prev) => !prev)}
                            className='md:hidden rounded-lg border border-gray-300 bg-gray-800 p-3 text-white transition-transform duration-200 hover:scale-110'
                            aria-expanded={navOpen}
                            aria-label='Toggle navigation'
                        >
                            <div className='flex flex-col gap-1'>
                                <span className='block h-0.5 w-6 bg-white'></span>
                                <span className='block h-0.5 w-6 bg-white'></span>
                                <span className='block h-0.5 w-6 bg-white'></span>
                            </div>
                        </button>
                        <button onClick={() => navigate('/new-password', {replace: true})} className='cursor-pointer border-3 border-black hidden md:flex items-center justify-center rounded-full p-2 text-white transition-transform duration-200 hover:scale-115 bg-gray-400'>
                            <Plus size={20} />
                        </button>
                        <div className='relative hidden md:block' ref={profileRef}>
                        <button className='profile-button' onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <img src={profileIcon} alt='profile' />
                        </button>
                        {isProfileOpen && (
                            <div className='user-menu'>
                                <div className='flex flex-col items-center space-y-1'>
                                    <p className='text-sm font-semibold text-white mt-2'>{user?.email}</p>
                                    <img src={profileIcon} className='w-10 h-10 border-3 rounded-full' alt='profile' />
                                    <p className='text-sm'>Signed as in: </p>
                                    <p className='text-sm'>{user?.firstname} {user?.lastname}</p>
                                    <button onClick={handleLogout} className='main-buttons mb-2'>Logout</button>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </header>

            {navOpen && (
                <>
                    <div className='fixed inset-0 z-40 bg-black/40 md:hidden' onClick={() => setNavOpen(false)} />
                    <div className='fixed right-0 top-0 z-50 h-full w-72 bg-gray-800 p-5 text-white shadow-xl md:hidden'>
                        <div className='flex items-center justify-between'>
                            <button onClick={() => setNavOpen(false)} className='rounded p-1 hover:bg-gray-700'>
                                <X size={20}/>
                            </button>
                        </div>

                        <div className='mt-6 flex flex-col items-center space-y-3 border-b border-gray-600 pb-6'>
                            <img src={profileIcon} alt='profile' className='h-16 w-16 rounded-full border-2 border-white' />
                            <p className='text-sm font-semibold'>{user?.firstname} {user?.lastname}</p>
                            <p className='text-sm text-gray-300'>Signed in as:</p>
                            <p className='text-sm text-gray-300'>{user?.email}</p>
                        </div>

                        <div className='mt-6 flex flex-col space-y-3'>
                            <button onClick={handleLogout} className='bg-gray-600 font-bold cursor-pointer h-10 rounded-2xl transform transition-transform duration-200 hover:scale-105 mx-auto w-full'>Logout</button>
                        </div>
                    </div>
                </>
            )}
            <div className='px-4 py-6 flex justify-center md:justify-center lg:justify-center'>
                <div className='w-full max-w-3xl overflow-hidden rounded-xl border border-gray-300 bg-gray-300 shadow-md mt-10 p-4'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-sm border-separate border-spacing-y-3'>
                            <thead className='bg-gray-300'>
                                <tr>
                                    <th className='px-4 py-3 font-bold text-black whitespace-nowrap'>URL</th>
                                    <th className='px-4 py-3 font-bold text-black whitespace-nowrap'>Label</th>
                                    <th className='px-4 py-3 font-bold text-black whitespace-nowrap'>Owner</th>
                                    <th className='px-4 py-3 font-bold text-black whitespace-nowrap'>Copy</th>
                                    <th className='px-4 py-3 font-bold text-black whitespace-nowrap'>Share</th>
                                </tr>
                            </thead>
                            <tbody className='bg-gray-300 text-black font-bold text-center'>
                                {Array.isArray(password) && password.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.url}</td>
                                        <td>{item.label}</td>
                                        <td>{item.owner}</td>
                                        <td>
                                            <button
                                                onClick={() => handleCopy(item.id, item.password)}
                                                className={`relative overflow-hidden font-bold text-white cursor-pointer h-10 w-20 rounded-2xl transition-colors duration-300 p-2 ${
                                                    copiedID === item.id ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
                                                }`}
                                                >
                                                <span
                                                    className={`flex items-center justify-center gap-1 transition-all duration-300 ${
                                                        copiedID === item.id ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                                                    }`}
                                                >
                                                    Copy
                                                </span>
                                                <span
                                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                                                        copiedID === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                                    }`}
                                                >
                                                    <Check size={20} />
                                                </span>
                                            </button>
                                        </td>
                                        <td>
                                            <button className='bg-gray-600 font-bold text-white cursor-pointer h-10 w-20 rounded-2xl transform transition-transform duration-200 hover:bg-gray-500 p-2' onClick={() => setIsShareOpen(!isShareOpen)}>
                                                Share
                                            </button>
                                            {isShareOpen && (
                                                <div className='fixed inset-0 flex items-center justify-center bg-black/50'>
                                                    <div className='bg-gray-600 p-6 rounded-lg shadow-lg w-80 flex gap-2' ref={shareRef}>
                                                        <input
                                                            type='text'
                                                            placeholder='Enter username' 
                                                            onChange={e => setIsSharedEmail(e.target.value)}    
                                                            className='w-full border-2 border-white rounded p-2 text-white'                                                   
                                                        />
                                                        <button className='main-buttons text-white' onClick={() => handleSharePassword(item.id)}>
                                                            Share
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {!navOpen && (
                <button 
                    className='flex md:hidden fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-gray-400 p-3 transform transition-transform hover:scale-115'
                    onClick={() => navigate('/new-password', {replace: true})}
                >
                    <Plus size={20}/>
                </button>
            )}
        </div>
    )
}

export default Dashboard