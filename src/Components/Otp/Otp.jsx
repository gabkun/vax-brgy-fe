import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
    const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      alert("OTP Verified Successfully!"); 
      navigate('/dashboard');
      // TODO: Replace alert with API call to verify OTP
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handleResendOTP = () => {
    alert("OTP Resent! Check your phone or email.");
    // TODO: Implement OTP resend functionality
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">OTP Verification</h2>
        <p className="text-gray-500 text-center mt-2">Enter the 6-digit OTP sent to your phone or email</p>

        <div className="flex justify-center mt-4">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))} // Only allow numbers
            className="w-2/3 px-4 py-2 text-xl text-center border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
          />
        </div>

        <button
          onClick={handleVerifyOTP}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOTP}
            className="text-blue-600 font-semibold hover:underline mt-1"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
