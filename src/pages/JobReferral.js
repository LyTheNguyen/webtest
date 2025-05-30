import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShare, faMapMarkerAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchJobs } from '../services/api';

// Configure axios defaults
const API_URL = 'https://backend-app-wvmb.onrender.com';
const API_TOKEN = '87153f3c93cd3b71e190ea4c0d37c48c8bc643c05b912c25962716a4fb97a72ae3c78061bfd54ad808d740dd88b81889349b29eab341b6db40d4ae11a3f98361c179b2a91ed0c51a905e9e57a18a6ff42f9c17bd27e9c3a82e58e9d42fddb5531ea575197b126b8e35d8a199b8910c5be853ddda88f86f8dbe9ed18fbbdfa93a';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header to every request
    config.headers.Authorization = `Bearer ${API_TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const JobReferral = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    danhtinh: 'Guest',
    tencuaban: '',
    sodienthoaicuaban: '',
    emailcuaban: '',
    tenbanbe: '',
    emailbanbe: '',
    cvbanbe: null,
    consent: false,
    notRobot: false
  });
  const [job, setJob] = useState(null);

  const commonInputStyle = {
    height: '48px',
    borderRadius: '8px',
    border: '1.5px solid #eee',
    padding: '8px 16px',
    fontFamily: 'var(--font-family-base)',
    fontSize: 'var(--font-size-base)',
    color: '#555',
    backgroundColor: '#fff'
  };

  const commonSelectStyle = {
    height: '48px',
    borderRadius: '8px',
    border: '1.5px solid #eee',
    padding: '8px 16px',
    fontFamily: 'var(--font-family-base)',
    fontSize: 'var(--font-size-base)',
    color: '#555',
    backgroundColor: '#fff'
  };

  const commonLabelStyle = {
    fontFamily: 'var(--font-family-base)',
    fontSize: 'var(--font-size-base)',
    fontWeight: '500',
    marginBottom: '8px',
    cursor: 'pointer',
    color: '#555'
  };

  const commonHeadingStyle = {
    fontFamily: 'var(--font-family-base)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: '700',
    color: '#555'
  };

  const commonTextStyle = {
    fontFamily: 'var(--font-family-base)',
    fontSize: 'var(--font-size-base)',
    color: '#555'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        alert('File CV không được vượt quá 5MB');
        e.target.value = '';
        return;
      }

      // Check file type - only allow PDF
      if (file.type !== 'application/pdf') {
        alert('File CV phải là định dạng PDF');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        cvbanbe: file
      }));
    }
  };

  const handleCaptchaChange = (value) => {
    setFormData({
      ...formData,
      captchaValue: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      const requiredFields = {
        'Họ tên': formData.tencuaban,
        'Email': formData.emailcuaban,
        'Họ tên bạn bè': formData.tenbanbe,
        'Email bạn bè': formData.emailbanbe,
        'CV': formData.cvbanbe
      };

      // Check all required fields
      for (const [fieldName, value] of Object.entries(requiredFields)) {
        if (!value) {
          alert(`Vui lòng nhập ${fieldName}`);
          return;
        }
      }

      // Check phone number
      if (!formData.sodienthoaicuaban || formData.sodienthoaicuaban.length < 10) {
        alert('Vui lòng nhập số điện thoại hợp lệ');
        return;
      }

      // Check file size
      if (formData.cvbanbe && formData.cvbanbe.size > 5 * 1024 * 1024) {
        alert('File CV không được vượt quá 5MB');
        return;
      }

      // Check file type - only allow PDF
      if (formData.cvbanbe && formData.cvbanbe.type !== 'application/pdf') {
        alert('File CV phải là định dạng PDF');
        return;
      }

      // Check consent and robot verification
      if (!formData.consent) {
        alert('Vui lòng đồng ý với điều khoản và điều kiện');
        return;
      }

      if (!formData.notRobot) {
        alert('Vui lòng xác nhận bạn không phải là người máy');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailcuaban)) {
        alert('Email của bạn không hợp lệ');
        return;
      }
      if (!emailRegex.test(formData.emailbanbe)) {
        alert('Email bạn bè không hợp lệ');
        return;
      }

      setSubmitting(true);

      const dataObj = {
        data: {
          danhtinh: formData.danhtinh,
          tencuaban: formData.tencuaban,
          sodienthoaicuaban: formData.sodienthoaicuaban,
          emailcuaban: formData.emailcuaban,
          tenbanbe: formData.tenbanbe,
          emailbanbe: formData.emailbanbe
        }
      };

      // If we have a file, upload it first
      if (formData.cvbanbe) {
        const fileFormData = new FormData();
        fileFormData.append('files', formData.cvbanbe);

        console.log('Đang tải lên file CV...');
        
        try {
          const uploadResponse = await axios.post(
            `${API_URL}/api/upload`,
            fileFormData,
            {
              headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          if (!uploadResponse.data || uploadResponse.data.length === 0) {
            alert('Không thể tải lên file CV');
            return;
          }

          const fileId = uploadResponse.data[0].id;
          console.log('File đã được tải lên, ID:', fileId);
          
          // Add file reference to form data
          dataObj.data.cvbanbe = fileId;
        } catch (uploadError) {
          console.error('Lỗi khi tải file:', uploadError);
          alert('Có lỗi khi tải file CV. Vui lòng thử lại.');
          return;
        }
      }

      console.log('Đang gửi dữ liệu form:', dataObj);

      try {
        const response = await axiosInstance.post('/api/gioithieubanbes', dataObj);

        console.log('Phản hồi từ server:', response.data);

        if (!response.data || !response.data.data || !response.data.data.id) {
          alert('Không nhận được phản hồi hợp lệ từ server');
          return;
        }

        // Show success message
        alert('Giới thiệu bạn bè thành công!');

        // Reset form
        setFormData({
          danhtinh: 'Guest',
          tencuaban: '',
          sodienthoaicuaban: '',
          emailcuaban: '',
          tenbanbe: '',
          emailbanbe: '',
          cvbanbe: null,
          consent: false,
          notRobot: false
        });

        // Navigate back
        navigate(`/jobs/${id}`);
      } catch (submitError) {
        console.error('Lỗi khi gửi form:', submitError);
        if (submitError.response?.data?.error?.message) {
          alert(`Lỗi: ${submitError.response.data.error.message}`);
        } else {
          alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
        }
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const allJobsResponse = await fetchJobs();
        const foundJob = allJobsResponse.data.find(j => j.id === parseInt(id));
        setJob(foundJob);
      } catch (error) {
        setJob(null);
      }
    };
    fetchJob();
  }, [id]);

  return (
    <div style={{ background: '#fcfcfd', minHeight: '100vh' }}>
      {/* Red Header đồng bộ với JobApplication và lấy dữ liệu động */}
      <div className="text-white py-4" style={{ background: '#FF0000', marginBottom: 24, padding: '24px 32px' }}>
        <Container>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <Link to={`/jobs/${id}`} className="text-white text-decoration-none" style={{ fontWeight: 500, fontSize: 'var(--font-size-base)' }}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Quay lại
              </Link>
            </div>
            <h4 className="mb-0" style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{job ? job.tenvitri : ''}</h4>
            <div className="mt-2 small">
              <span className="me-3">{job ? job.loaivitri : ''}</span>
              <span style={{ fontWeight: 700, fontSize: 'var(--font-size-base)', margin: '0 8px' }}>•</span>
              <span><FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" /> {job ? job.diachi : ''}</span>
            </div>
            <div className="mt-2">
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" size="sm" id="dropdown-share">
                  <FontAwesomeIcon icon={faShare} className="me-1" />
                  Chia sẻ
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {navigator.clipboard.writeText(window.location.href)}}>
                    <FontAwesomeIcon icon={faCopy} className="me-2" style={{ color: '#FF0000' }} />Sao chép liên kết
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <FaFacebookF className="me-2" />Chia sẻ Facebook
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <FaLinkedinIn className="me-2" />Chia sẻ LinkedIn
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: 40, marginTop: -8 }}>
        <h3 className="mb-4 fw-bold" style={{ fontSize: 'var(--font-size-lg)' }}>Giới thiệu bạn bè</h3>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-lg)' }}>1. Bạn là:</div>
            <div className="d-flex gap-4">
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="guest"
                  name="danhtinh"
                  value="Guest"
                  checked={formData.danhtinh === 'Guest'}
                  onChange={handleInputChange}
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    marginRight: '8px',
                    accentColor: '#FF0000',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="guest" style={{ fontSize: 'var(--font-size-base)', fontWeight: '500', marginBottom: 0, cursor: 'pointer', color: '#555' }}>Khách</label>
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="employee"
                  name="danhtinh"
                  value="Employees"
                  checked={formData.danhtinh === "Employees"}
                  onChange={handleInputChange}
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    marginRight: '8px',
                    accentColor: '#FF0000',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="employee" style={{ fontSize: 'var(--font-size-base)', fontWeight: '500', marginBottom: 0, cursor: 'pointer', color: '#555' }}>Nhân viên</label>
              </div>
            </div>
          </div>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                  Họ tên <span style={{ color: '#FF0000' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tencuaban"
                  value={formData.tencuaban}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ tên của bạn"
                  style={commonInputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                  Số điện thoại <span style={{ color: '#FF0000' }}>*</span>
                </Form.Label>
                <PhoneInput
                  country={'vn'}
                  enableSearch={true}
                  value={formData.sodienthoaicuaban}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      sodienthoaicuaban: value
                    }));
                  }}
                  disableCountryCode={false}
                  disableDropdown={false}
                  countryCodeEditable={false}
                  inputProps={{
                    required: true,
                    style: {
                      width: '100%',
                      height: '48px',
                      fontSize: 'var(--font-size-base)',
                      borderRadius: '8px',
                      border: '1.5px solid #eee',
                      paddingLeft: '88px',
                      color: '#555',
                      backgroundColor: '#fff'
                    }
                  }}
                  containerStyle={{ width: '100%' }}
                  buttonStyle={{
                    borderRadius: '8px 0 0 8px',
                    height: '48px',
                    border: '1.5px solid #eee',
                    borderRight: 'none',
                    backgroundColor: '#fff'
                  }}
                  dropdownStyle={{ width: '300px' }}
                  searchStyle={{ margin: '0', width: '100%', height: '40px' }}
                  searchPlaceholder="Tìm quốc gia..."
                  searchNotFound="Không tìm thấy quốc gia"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                  Email <span style={{ color: '#FF0000' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="emailcuaban"
                  value={formData.emailcuaban}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập email của bạn"
                  style={commonInputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-lg)' }}>2. Bạn của bạn:</div>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                  Họ tên bạn bè <span style={{ color: '#FF0000' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tenbanbe"
                  value={formData.tenbanbe}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ tên bạn bè"
                  style={commonInputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                  Email bạn bè <span style={{ color: '#FF0000' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="emailbanbe"
                  value={formData.emailbanbe}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập email bạn bè"
                  style={commonInputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-lg)' }}>3. CV của bạn bè:</div>
          <div className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium" style={{ color: '#555', marginBottom: '8px' }}>
                Tải lên CV <span style={{ color: '#FF0000' }}>*</span>
              </Form.Label>
              <div className="text-muted small mb-2">(Chỉ chấp nhận file PDF - Tối đa 5 MB)</div>
              <div 
                style={{ 
                  border: '2px dashed #e0e0e0',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => document.getElementById('cv').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.border = '2px dashed #FF0000';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.border = '2px dashed #e0e0e0';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.border = '2px dashed #e0e0e0';
                  
                  const file = e.dataTransfer.files[0];
                  if (!file) return;

                  if (file.type !== 'application/pdf') {
                    alert('File CV phải là định dạng PDF');
                    return;
                  }
                  
                  if (file.size > 5 * 1024 * 1024) {
                    alert('File CV không được vượt quá 5MB');
                    return;
                  }

                  const fileList = new DataTransfer();
                  fileList.items.add(file);
                  const event = {
                    target: {
                      files: fileList.files
                    }
                  };
                  handleFileChange(event);
                }}
              >
                <input
                  type="file"
                  id="cv"
                  name="cvbanbe"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }}
                />
                <div className="text-center">
                  {formData.cvbanbe ? (
                    <div style={{ color: '#555' }}>
                      <FontAwesomeIcon icon={faCopy} className="me-2" style={{ color: '#FF0000' }} />
                      {formData.cvbanbe.name}
                    </div>
                  ) : (
                    <>
                      <div 
                        style={{ 
                          display: 'inline-block',
                          padding: '8px 24px',
                          background: '#FFE5E5',
                          borderRadius: '24px',
                          color: '#FF0000',
                          fontWeight: 500,
                          marginBottom: '8px'
                        }}
                      >
                        <FontAwesomeIcon icon={faCopy} className="me-2" />
                        Chọn tệp
                      </div>
                      <div style={{ color: '#757575' }}>hoặc kéo thả file vào đây</div>
                    </>
                  )}
                </div>
              </div>
            </Form.Group>
          </div>

          {/* Consent and reCAPTCHA */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="consent"
              name="consent"
              label={<span style={{ fontSize: 'var(--font-size-xs)' }}>*Theo Nghị định 15/2022/NĐ-CP về bảo vệ dữ liệu cá nhân, THD sẽ áp dụng 'Thỏa thuận xử lý dữ liệu cá nhân' với tất cả ứng viên để đảm bảo tuân thủ nghị định.</span>}
              checked={formData.consent}
              onChange={handleInputChange}
              required
              style={{ accentColor: '#FF0000' }}
            />
            <Form.Text className="text-muted d-block ms-4 mt-2" style={{ fontSize: 'var(--font-size-xs)' }}>
              Khi gửi đơn này cho THD, bạn đồng ý cho phép THD xử lý thông tin bạn cung cấp theo các điều khoản và điều kiện mà bạn đã đọc, hiểu rõ và đồng ý trong nội dung văn bản tại pháp luật.
            </Form.Text>
          </Form.Group>

          <div className="mb-4">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #ccc',
              borderRadius: '8px',
              padding: '12px 16px',
              background: '#fff',
              maxWidth: 400
            }}>
              <Form.Check
                type="checkbox"
                id="notRobot"
                name="notRobot"
                label="Tôi không phải là người máy"
                checked={formData.notRobot}
                onChange={handleInputChange}
                required
                style={{ marginRight: 12 }}
              />
              <img src="/images/capcha1.png" alt="reCAPTCHA" style={{ height: 48, marginLeft: 16 }} />
            </div>
          </div>

          <div className="text-center mt-4">
            <Button 
              type="submit" 
              style={{ 
                background: '#FF0000', 
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 48px', 
                fontWeight: 600, 
                fontSize: 'var(--font-size-lg)' 
              }} 
              disabled={submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đơn'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default JobReferral; 

<style>
{`
  .custom-radio-input {
    cursor: pointer;
  }
  .custom-radio-input:hover {
    accent-color: #FF0000;
  }
  .form-control::placeholder,
  .form-select {
    color: #757575;
  }
  .form-control:focus,
  .form-select:focus {
    border-color: #FF0000;
    box-shadow: 0 0 0 0.25rem rgba(255, 0, 0, 0.25);
  }
  .phone-input {
    width: 100%;
  }
  .phone-input .form-control {
    height: 48px !important;
    border-radius: 8px !important;
    border: 1.5px solid #eee !important;
    font-size: var(--font-size-base) !important;
    color: #555 !important;
    background-color: #fff !important;
  }
  .phone-input .flag-dropdown {
    border-radius: 8px 0 0 8px !important;
    border: 1.5px solid #eee !important;
    background-color: #fff !important;
  }
  .phone-input .form-control:focus {
    border-color: #FF0000 !important;
    box-shadow: 0 0 0 0.25rem rgba(255, 0, 0, 0.25) !important;
  }
`}
</style> 