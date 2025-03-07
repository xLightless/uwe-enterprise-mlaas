import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import close_icon from '../../assets/close.svg'

function AuthForms({ toggleAuthForms }: { toggleAuthForms: () => void }) {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <div className="fixed inset-0 flex items-center justify-center overlay/20 backdrop-blur-sm z-50">
      <div className="relative flex flex-col justify-center gap-5 p-5 mx-5 w-full md:max-w-[500px] rounded-lg shadow-lg border container-primary">
        <div className="h-14 w-14 rounded-lg self-center bg-slate-300"></div>

        <button onClick={toggleAuthForms} className="absolute top-4 right-4 text-xl font-bold cursor-pointer"><img src={close_icon} className="w-6 h-6" /></button>
        
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-md">{isRegister ? 'Have an account?' : 'Need an account?'}</p>

          <button onClick={() => setIsRegister(!isRegister)} className="text-md text-blue-500 cursor-pointer">{isRegister ? 'Log in.' : 'Sign Up.'}</button>
        </div>

        {isRegister ? <Register /> : <Login />}
      </div>
    </div>
  )
}

export default AuthForms