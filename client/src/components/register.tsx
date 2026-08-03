import { useNavigate } from "react-router-dom"
import React, {useState} from 'react'
import { MoveLeft, Eye, EyeOff } from "lucide-react"

function Register(){
    const navigate = useNavigate()
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showEncryptionKey, setShowEncryptionKey] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        encryption_key: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    encryption_key: formData.encryption_key
                })
            })

            const data = await response.json()
            if (response.ok){
                navigate('/login', {replace: true})
            } else if (data.errors){
                const fieldErrors: Record<string, string> = {}
                data.errors.forEach((err: { field: string; message: string }) => {
                    fieldErrors[err.field] = err.message
                })
                setErrors(fieldErrors)
            } else{
                setErrors({ general: data.message})
                
            }

        }catch(error){
            console.error(error)
            setErrors({ general: 'Network error, please try again' })
        }
    }

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <div
                onClick={() => navigate('/', {replace: true})}
                className='back-button'
            >
                <MoveLeft/>
                <span className='hidden md:inline'>Back</span>
            </div>
            <form onSubmit={handleRegister} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-2'>
                <h2 className='font-bold text-xl text-center'>Register</h2>
                { errors.general && (
                    <span className='error-handling text-center'>{errors.general}</span>
                )} 
                <div className={`flex flex-col ${errors.email ? 'mb-0' : ''}`}>
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${errors.email ? 'border-red-500 focus:outline-none' : ''}`}
                    />
                    { errors.email && (
                        <span className='error-handling'>{errors.email}</span>
                    )} 
                    
                </div>
                <div className={`flex flex-col ${errors.password ? 'mb-0' : ''}`}>
                    <label>Password</label>
                    <div className='relative'>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`w-full border-2 rounded p-1 focus:outline-none ${errors.password ? 'border-red-500 focus:outline-none' : ''}`}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !(prev))}
                            className='absolute inset-y-2 right-0 flex items-center pr-3 text-white md:cursor-pointer'
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                        </button>
                    </div>
                    { errors.password && (
                        <span className='error-handling'>{errors.password}</span>
                    )} 
                </div>
                <div className={`flex flex-col ${errors.first_name ? 'mb-0' : ''}`}>
                    <label>First Name</label>
                    <input 
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${errors.first_name ? 'border-red-500 focus:outline-none' : ''}`}
                    />
                    { errors.first_name && (
                        <span className='error-handling'>{errors.first_name}</span>
                    )} 
                </div>
                <div className={`flex flex-col ${errors.last_name ? 'mb-0' : ''}`}>
                    <label>Last Name</label>
                    <input 
                        type='text'
                        name='last_name'
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${errors.last_name ? 'border-red-500 focus:outline-none' : ''}`}
                    />
                    { errors.last_name && (
                        <span className='error-handling'>{errors.last_name}</span>
                    )} 
                </div>
                <div className="flex flex-col">
                    <label>Encryption Key</label>
                    <div className='relative'>
                        <input 
                            type={showEncryptionKey ? 'text' : 'password'}
                            name="encryption_key"
                            value={formData.encryption_key}
                            onChange={handleChange}
                            required
                            className={`w-full border-2 rounded p-1 focus:outline-none ${errors.encryption_key ? 'border-red-500 focus:outline-none' : ''}`}
                        />
                        <button
                            type='button'
                            onClick={() => setShowEncryptionKey((prev) => !(prev))}
                            className='absolute inset-y-2 right-0 flex items-center pr-3 text-white md:cursor-pointer'
                            aria-label={showEncryptionKey ? 'Hide encryption key' : 'Show encryption key'}
                        >
                            {showEncryptionKey ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    { errors.encryption_key && (
                        <span className='error-handling'>{errors.encryption_key}</span>
                    )} 
                </div>
                <button type='submit' className='main-buttons'>Register</button>
            </form>
        </div>
    )
}

export default Register