import React, { useState } from 'react';
import OTPVerification from './OTPVerification';
import './RegisterWithOTP.css';

const RegisterWithOTP = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password_hash) {
      newErrors.password_hash = 'Password is required';
    } else if (formData.password_hash.length < 6) {
      newErrors.password_hash = 'Password must be at least 6 characters';
    }

    if (formData.password_hash !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://foodsharremain-backend.onrender.com/api/v1/users/register-with-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password_hash: formData.password_hash,
          role: formData.role,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        })
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredEmail(formData.email);
        setRegistrationSuccess(true);
        setShowOTP(true);
      } else {
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Failed to register. Please try again.' });
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    if (onSuccess) {
      onSuccess({
        email: registeredEmail,
        username: formData.username
      });
    }
  };

  const handleChangeEmail = () => {
    setShowOTP(false);
    setRegistrationSuccess(false);
    setRegisteredEmail('');
  };

  // Show OTP verification screen
  if (showOTP && registrationSuccess) {
    return (
      <OTPVerification
        email={registeredEmail}
        purpose="registration"
        onSuccess={handleOTPSuccess}
        onCancel={handleChangeEmail}
      />
    );
  }

  // Show registration form
  return (
    <div className="register-otp-container">
      <div className="register-otp-card">
        <h2>Create Account</h2>
        <p className="register-subtitle">Join FoodShare and make a difference</p>

        {errors.submit && <div className="error-banner">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                disabled={loading}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password_hash"
                value={formData.password_hash}
                onChange={handleInputChange}
                placeholder="Min 6 characters"
                disabled={loading}
              />
              {errors.password_hash && <span className="error-text">{errors.password_hash}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <label>Select Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">-- Select Role --</option>
                <option value="donor">Donor (Food Provider)</option>
                <option value="beneficiary">Beneficiary (Food Receiver)</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-row">
            <div className="form-group">
              <label>State/Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal code"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register & Send OTP'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterWithOTP;
