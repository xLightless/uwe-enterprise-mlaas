import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="h-auto w-screen bg-gray-100">
            <div className="flex flex-row items-start justify-center gap-20 py-5 border-y-2 border-slate-200">
                <div className="flex flex-col items-start justify-center gap-5 p-5">
                    <Link to="/home" className="text-md">Home</Link>
                    <Link to="/" className="text-md">FAQ</Link>
                    <Link to="/contact" className="text-md">Contact</Link>
                    <Link to="/" className="text-md">About</Link>
                </div>

                <div className="flex flex-col items-start justify-center gap-5 p-5">
                    <Link to="/" className="text-md">Accessibility</Link>
                    <Link to="/" className="text-md">Cookie Policy</Link>
                    <Link to="/" className="text-md">Data Rights Request</Link>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-sm bg-white">
                <div className="flex flex-row gap-3 pb-2">
                    <p>© MLAAS Project</p>
                    <Link to="/">Terms & Conditions</Link>
                    <Link to="/">Privacy Policy</Link>
                </div>

                <div className="pt-2 max-w-[1024px] border-t-2 border-gray-600">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer