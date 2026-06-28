import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Registration() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_USER_REGISTER_URL;

      const response = await fetch(
        `${API_URL}`,
        {
          method: "POST",
          body: new URLSearchParams(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
        });
        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          confirm_password: "",
          gender: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/**************************************************/}
      {/* START MAIN AREA */}
      {/**************************************************/}

      <div style={{ 
        minHeight: '70vh', 
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '800px'
        }}>
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(119, 87, 245, 0.3)',
              display: 'none'
            }}>
              <i className="ri-user-add-line" style={{ fontSize: '32px', color: '#fff' }}></i>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '12px'
            }}>
              Create Account
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666'
            }}>
              Join us today and start your journey
            </p>
          </div>

          {/* Registration Form */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <form onSubmit={handleSubmit}>
              {/* Name Fields Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* First Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    First Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-user-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="first_name"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Last Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-user-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="last_name"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-mail-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-phone-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="phone"
                      type="text"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-lock-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="8"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 48px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#999'
                      }}
                    >
                      <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} style={{ fontSize: '20px' }}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="ri-lock-line" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#999'
                    }}></i>
                    <input
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      minLength="8"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 48px 14px 48px',
                        fontSize: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        background: '#fafafa',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#999'
                      }}
                    >
                      <i className={showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} style={{ fontSize: '20px' }}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Gender
                </label>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  {['Male', 'Female', 'Others'].map((gender) => (
                    <label
                      key={gender}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        background: formData.gender === gender ? '#f0f4ff' : '#fafafa',
                        border: `2px solid ${formData.gender === gender ? '#667eea' : '#e0e0e0'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: '1',
                        minWidth: '150px'
                      }}
                      onMouseEnter={(e) => {
                        if (formData.gender !== gender) {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.gender !== gender) {
                          e.currentTarget.style.borderColor = '#e0e0e0';
                          e.currentTarget.style.background = '#fafafa';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: '#667eea'
                        }}
                      />
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        color: formData.gender === gender ? '#667eea' : '#666'
                      }}>
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#999' : 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '24px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="ri-loader-4-line" style={{ 
                      animation: 'spin 1s linear infinite',
                      fontSize: '18px'
                    }}></i>
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </button>

              {/* Login Link */}
              <p style={{
                textAlign: 'center',
                fontSize: '15px',
                color: '#666'
              }}>
                Already have an account?{' '}
                <Link to="/login" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Trust Badges */}
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {[
              { icon: 'ri-shield-check-line', text: 'Secure Registration' },
              { icon: 'ri-lock-line', text: 'Data Protected' },
              { icon: 'ri-customer-service-2-line', text: '24/7 Support' }
            ].map((badge, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#666'
                }}
              >
                <i 
                  className={badge.icon}
                  style={{
                    fontSize: '18px',
                    color: '#667eea'
                  }}
                ></i>
                <span style={{ fontWeight: '500' }}>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
            div[style*="padding: 40px"] {
              padding: 24px !important;
            }
          }
        `}</style>
      </div>

      {/**************************************************/}
      {/* END MAIN AREA */}
      {/**************************************************/}
      
      <Footer />
    </>
  );
}

export default Registration;