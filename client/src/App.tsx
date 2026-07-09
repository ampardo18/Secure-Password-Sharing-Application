import './styles/globals.css'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen select-none px-4 py-6'>
      <motion.header 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='flex justify-end'
      >
        <button className='cursor-pointer font-bold rounded-lg bg-gray-800 transform transition-transform duration-200 hover:scale-110 h-10 w-20' onClick={() => navigate('/login')}>Log-in</button>
      </motion.header>
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='mt-10 flex flex-col items-center justify-center space-y-4 text-center sm:items-start sm:justify-start sm:text-left md:ml-12 md:mt-10'
      >
        <h1 className='text-3xl font-bold'>Welcome to the Password Sharing Application!</h1>
        <p>An application to help you safely store and share your passwords</p>
      </motion.section>
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='mt-15 md:mt-20'
      >
        <h2 className='font-bold text-2xl'>The Purpose</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8'>
          <div className='purpose-box'>
            <p>Allows users to save their passwords from different websites and display them in a user-friendly table</p>
          </div>
          <div className='purpose-box'>
            <p>Implemented password sharing functionality, allowing users to share credentials with other registered users via email lookup</p>
          </div>
          <div className='purpose-box'>
            <p>Your passwords are encrypted end-to-end. Store them safely, access them instantly, and share them securely with anyone on the platform.</p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default App
