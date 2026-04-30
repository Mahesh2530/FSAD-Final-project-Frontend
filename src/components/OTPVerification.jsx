import React, { useState, useEffect } from 'react';
import './OTPVerification.css';

const OTPVerification = ({ email, purpose = 'registration', onSuccess, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Handle resend timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && email) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, email]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://foodsharremain-backend.onrender.com/api/v1/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otpCode: otpCode,
          purpose: purpose
        })
      });

      const data = await response.json();

      if (data.success) {
        setError('');
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://foodsharremain-backend.onrender.com/api/v1/otp/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          purpose: purpose
        })
      });

      const data = await response.json();

      if (data.success) {
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setCanResend(false);
        setError('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-card">
        <h2>Email Verification</h2>
        <p className="otp-email">We sent a code to <strong>{email}</strong></p>
        
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              disabled={loading}
            />
          ))}
        </div>

        {error && <div className="otp-error">{error}</div>}

        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.some(d => !d)}
          className="otp-verify-btn"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="otp-footer">
          <p>Didn't receive the code?</p>
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="otp-resend-btn"
            >
              Resend OTP
            </button>
          ) : (
            <span className="otp-timer">
              Resend in {resendTimer}s
            </span>
          )}
        </div>

        {onCancel && (
          <button onClick={onCancel} className="otp-cancel-btn">
            Change Email
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
