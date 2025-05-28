import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchJobs } from '../services/api';

const JobList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromUrl = searchParams.get('search') || '';
  
  const [filters, setFilters] = useState({
    keyword: searchFromUrl,
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State to control showing all jobs
  const INITIAL_JOB_COUNT = 6;

  // Fetch jobs data
  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const result = await fetchJobs();
        console.log('Dữ liệu công việc:', result);
        if (result && result.data) {
          setJobs(result.data);
        } else {
          setError('Dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không thể tải dữ liệu công việc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    getJobs();
  }, []);

  // Set initial filter from URL on mount
  useEffect(() => {
    if (searchFromUrl) {
      setFilters(prev => ({ ...prev, keyword: searchFromUrl }));
    }
  }, [searchFromUrl]);

  // Filter jobs based on search keyword if provided
  const filteredJobs = filters.keyword 
    ? jobs.filter(job => 
        job.tenvitri.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.loaivitri.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.diachi.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        (job.motacongviec && job.motacongviec.toLowerCase().includes(filters.keyword.toLowerCase()))
      )
    : jobs;
    
  // Handle showing only initial items or all items
  const displayedJobs = showAll || filteredJobs.length <= INITIAL_JOB_COUNT 
    ? filteredJobs 
    : filteredJobs.slice(0, INITIAL_JOB_COUNT);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to showing only initial items when search changes
    setShowAll(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search parameter without navigating
    const url = new URL(window.location);
    url.searchParams.set('search', filters.keyword);
    window.history.pushState({}, '', url);
    // Reset to showing only initial items when search is submitted
    setShowAll(false);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <>
      {/* Red Header Bar */}
      <div className="text-white py-4" style={{ background: '#FF0000' }}>
        <Container>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <Link to="/" className="text-white text-decoration-none">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Quay lại trang chủ
              </Link>
            </div>
            <h3 className="mb-0" style={{ fontSize: 'var(--font-size-lg)' }}>Tìm công việc tại THD</h3>
          </div>
        </Container>
      </div>
            {/* Breadcrumb */}
            <nav className="bg-light">
              <Container className="py-2">
                <div className="d-flex align-items-center">
                  <Link to="/" className="text-decoration-none text-dark">Cơ hội việc làm</Link>
                  <span className="mx-2">&gt;</span>
                  <Link to="/jobs" className="text-decoration-none text-dark">Tìm công việc</Link>
                </div>
              </Container>
            </nav>

      <div className="py-4">
        <Container>
          {/* Introduction Text */}
          <div className="text-center mb-4">
            <p>Không chỉ đi làm - hãy cùng THD kiến tạo thế giới số và phát triển sự nghiệp đỉnh cao trong lĩnh vực an ninh mạng!</p>
          </div>

          {/* Search Bar */}
          <div className="mb-5">
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Tìm công việc"
                      name="keyword"
                      value={filters.keyword}
                      onChange={handleFilterChange}
                      className="py-2"
                    />
                    <Button 
                      type="submit"
                      style={{
                        backgroundColor: '#FF0000',
                        border: 'none',
                        color: '#fff'
                      }}
                    >
                      Tìm công việc
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          </div>

          {/* Position Heading */}
          <h4 className="mb-4 text-center" style={{ fontSize: 'var(--font-size-lg)' }}>Vị trí đang tuyển</h4>

          {/* Job Grid */}
          <Row className="g-4">
            {loading ? (
              <div className="text-center py-5 w-100">
                <div className="spinner-border" role="status" style={{ color: '#FF0000' }}>
                  <span className="visually-hidden">Đang tải dữ liệu...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-5 w-100" style={{ color: '#FF0000' }}>
                <p>{error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-5 w-100">
                <p>Không tìm thấy vị trí phù hợp với từ khóa "{filters.keyword}"</p>
              </div>
            ) : (
              displayedJobs.map((job) => (
                <Col key={job.id} md={6} lg={6} className="mb-2">
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body className="p-4">
                      <div className="d-flex flex-column h-100">
                        <div className="mb-2 small">
                          <span className="me-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" style={{ color: '#FF0000' }} />
                            {job.diachi}
                          </span>
                          <span className="text-muted">|</span>
                          <span className="ms-2">
                            <FontAwesomeIcon icon={faClock} className="me-1" style={{ color: '#FF0000' }} />
                            {job.thoigianlamviec}
                          </span>
                        </div>
                        <h5 className="mb-3" style={{ fontSize: 'var(--font-size-base)' }}>{job.tenvitri}</h5>
                        <div className="mt-auto">
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none">
                            <Button 
                              size="sm" 
                              className="w-100"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #FF0000',
                                color: '#FF0000'
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* View More Button - Only show if there are more jobs to display */}
          {!loading && !error && filteredJobs.length > INITIAL_JOB_COUNT && !showAll && (
            <div className="text-center mt-5">
              <Button 
                size="lg" 
                className="px-4 rounded-pill"
                onClick={handleShowMore}
                style={{
                  backgroundColor: '#FF0000',
                  border: 'none',
                  color: '#fff'
                }}
              >
                Xem thêm
              </Button>
            </div>
          )}
        </Container>
      </div>

      {/* Company Info Section */}
      <div className="text-white py-5 mt-5" style={{ 
        background: 'linear-gradient(180deg, #FF0000 0%, #000000 100%)',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Container fluid="lg">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="mb-4 fw-bold" style={{ fontSize: 'var(--font-size-lg)' }}>Vì sao nên chọn THD?</h2>
              <p className="mb-4" style={{ fontSize: 'var(--font-size-base)', opacity: 0.9 }}>
                Khi gia nhập THD, bạn sẽ được trải nghiệm môi trường làm việc năng động, sáng tạo cùng những phúc lợi hấp dẫn:
              </p>
              <ul className="list-unstyled benefits-list" style={{ fontSize: 'var(--font-size-base)' }}>
                <li className="mb-3 d-flex align-items-center">
                  <div className="benefit-icon me-3" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#fff' }} />
                  </div>
                  <span>Được đào tạo nâng cao kỹ năng, nghiệp vụ</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <div className="benefit-icon me-3" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#fff' }} />
                  </div>
                  <span>Mức lương, thưởng và phúc lợi hấp dẫn</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <div className="benefit-icon me-3" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#fff' }} />
                  </div>
                  <span>Nhiều chương trình đào tạo, phát triển bản thân và kỹ thuật thăng tiến rõ ràng</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <div className="benefit-icon me-3" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#fff' }} />
                  </div>
                  <span>Hỗ trợ thi chứng chỉ (nếu có)</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <div className="benefit-icon me-3" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#fff' }} />
                  </div>
                  <span>Tham gia các dự án lớn về Chính phủ, Y tế 4.0, SmartCity, Doanh nghiệp, Ngân hàng...</span>
                </li>
              </ul>
            </Col>
            <Col md={4} className="text-center d-flex align-items-center justify-content-center">
              <div className="position-relative" style={{
                width: '350px',
                height: '350px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src="/images/congnghe.jpg" 
                  alt="THD Logo"
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Recruitment Process */}
      <section className="recruitment-process py-5">
        <Container>
          <h2 className="text-center mb-5" style={{ fontSize: 'var(--font-size-lg)' }}>Quy trình tuyển dụng</h2>
          <Row className="g-4">
            <Col md={3}>
              <div className="process-step text-center">
                <img
                  src="/images/b1.jpg"
                  alt="Bước 1"
                  className="img-fluid rounded mb-3"
                />
                <h5 style={{ fontSize: 'var(--font-size-base)' }}>Bước 1: Ứng tuyển</h5>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step text-center">
                <img
                  src="/images/b2.jpg"
                  alt="Bước 2"
                  className="img-fluid rounded mb-3"
                />
                <h5 style={{ fontSize: 'var(--font-size-base)' }}>Bước 2: Đánh giá năng lực</h5>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step text-center">
                <img
                  src="/images/b3.jpg"
                  alt="Bước 3"
                  className="img-fluid rounded mb-3"
                />
                <h5 style={{ fontSize: 'var(--font-size-base)' }}>Bước 3: Phỏng vấn trực tiếp</h5>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step text-center">
                <img
                  src="/images/b4.jpg"
                  alt="Bước 4"
                  className="img-fluid rounded mb-3"
                />
                <h5 style={{ fontSize: 'var(--font-size-base)' }}>Bước 4: Chờ thư mời nhận việc</h5>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default JobList; 