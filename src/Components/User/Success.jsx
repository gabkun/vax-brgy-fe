import React from 'react';
import { CheckCircle } from 'lucide-react';


const SignupSuccessPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <CheckCircle className="text-blue-500 w-20 h-20 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Signup Successful!</h1>
                <p className="text-gray-600 mb-6">Your account has been created successfully. Please Wait for Approval in the Admin</p>
                <a href="/login" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors py-2 px-4 rounded-xl font-medium text-center block">
                    Go to Login
                </a>
            </div>
        </div>
    );
};

export default SignupSuccessPage;
