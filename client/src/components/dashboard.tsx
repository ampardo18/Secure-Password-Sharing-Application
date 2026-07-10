import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'
import {useRef, useState, useEffect} from 'react'

function Dashboard(){

    const [isProfileOpen, setIsProfileOpen] = useState(false)
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

    return(
        <div className='min-h-screen select-none'>
            <header className='bg-gray-700 h-20'>
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-bold text-xl text-center p-4'>Welcome, user!</h1>
                    <div className='relative' ref={profileRef}>
                        <button className='profile-button' onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <img src={profileIcon}/>
                        </button>
                        {isProfileOpen && (
                            <div className='user-menu'>
                                <div className='flex flex-col items-center space-y-1'>
                                    <p className='text-sm font-semibold text-white mt-2'>Username</p>
                                    <img src={profileIcon} className='w-10 h-10 border-3 rounded-full' />
                                    <p className='text-sm'>Signed as in: </p>
                                    <p className='text-sm'>first last</p>
                                    <button className='main-buttons mb-2'>Logout</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className='px-4 py-6'>
                <table>
                    <thead>
                        <tr>
                            <th>URL</th>
                            <th>Label</th>
                            <th>Copy</th>
                            <th>Share</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard