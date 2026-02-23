import React from 'react'

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[430px]">
        <h1 className="text-3xl font-bold text-center mb-6">Check Your Email</h1>
        <h2 className="text-lg font-medium text-center text-black mb-6">
          If an account exists, you'll get an email with instructions to reset your password.
        </h2>
        <h2 className="text-lg font-medium text-center text-black mb-6">
            Didn't receive the email? Check your spam folder or  <a href="#support" className='text-green-500 underline'>contact support</a> 
        </h2>
        <div className="text-center hover:underline hover:text-green-500 text-lg font-medium">
            <a href="#back">Back to login</a> 
            </div>
        </div>
        </div>
  )
}
