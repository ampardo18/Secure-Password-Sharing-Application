import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'
import {useRef, useState, useEffect} from 'react'
import { X, Plus } from 'lucide-react'

function Dashboard(){
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)
    const [ user, setUser ] = useState<{firstname: string; lastname: string; email: string} | null>(null)
    const profileRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node
            const clickInsideProfile = profileRef.current?.contains(target)
            if (!clickInsideProfile){
                setIsProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return(() => {
            document.addEventListener('mousedown', handleOutsideClick)
        })
    }, [])

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
        navigate('/login', {replace: true})
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
                        <button onClick={() => navigate('/new-password', {replace: true})} className='cursor-pointer hidden md:flex items-center justify-center rounded-full p-2 text-white transition-transform duration-200 hover:scale-115 bg-gray-400'>
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
                                <X size={20} className='cursor-pointer' />
                            </button>
                        </div>

                        <div className='mt-6 flex flex-col items-center space-y-3 border-b border-gray-600 pb-6'>
                            <img src={profileIcon} alt='profile' className='h-16 w-16 rounded-full border-2 border-white' />
                            <p className='text-sm font-semibold'>{user?.firstname} {user?.lastname}</p>
                            <p className='text-sm text-gray-300'>{user?.email || 'Signed in'}</p>
                        </div>

                        <div className='mt-6 flex flex-col space-y-3'>
                            <button onClick={handleLogout} className='bg-gray-600 font-bold cursor-pointer h-10 rounded-2xl transform transition-transform duration-200 hover:scale-105 mx-auto w-full'>Logout</button>
                        </div>
                    </div>
                </>
            )}
            <div className='px-4 py-6 flex justify-center md:justify-center lg:justify-center'>
                <div className='w-full max-w-3xl overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md mt-10'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-300 text-sm'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap'>URL</th>
                                    <th className='px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap'>Label</th>
                                    <th className='px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap'>Copy</th>
                                    <th className='px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap'>Share</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 bg-white'>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button 
                className='flex md:hidden fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-gray-400 p-3 transform transition-transform hover:scale-115'
                onClick={() => navigate('/new-password', {replace: true})}
                >
                <Plus size={20}/>
            </button>
        </div>
    )
}

export default Dashboard