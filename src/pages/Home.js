import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Nav, Accordion, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchAllJobs } from '../utils/api';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy dữ liệu công việc từ API
  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const result = await fetchAllJobs();
        console.log("API response:", result);
        
        if (result && result.data) {
          setJobs(result.data);
          console.log("Danh sách công việc:", result.data);
          console.log("Các loại vị trí:", [...new Set(result.data.map(job => job.loaivitri))]);
        } else {
          console.error("Dữ liệu không đúng định dạng:", result);
          setError("Dữ liệu từ API không đúng định dạng");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể kết nối tới API. Vui lòng đảm bảo Strapi đang chạy.");
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);
  
  // Filter jobs based on active tab and search term
  let filteredJobs = [];
  
  if (activeTab === 'all') {
    // For "Mới nhất" tab, sort by sttvitri and get top 6
    filteredJobs = [...jobs]
      .sort((a, b) => b.sttvitri - a.sttvitri)
      .slice(0, 6);
  } else {
    // For other tabs, filter by category (case insensitive)
    filteredJobs = jobs.filter(job => 
      job.loaivitri && 
      job.loaivitri.toLowerCase() === activeTab.toLowerCase()
    );
  }
  
  console.log("Tab đang chọn:", activeTab);
  console.log("Số công việc tìm thấy:", filteredJobs.length);
  
  // Apply search term filter if provided
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.tenvitri.toLowerCase().includes(term) ||
      job.diachi.toLowerCase().includes(term) ||
      job.loaivitri.toLowerCase().includes(term) ||
      (job.motacongviec && job.motacongviec.toLowerCase().includes(term))
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchTerm}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p className="mt-2">Đang kết nối tới API...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <p>{error}</p>
        <p>Vui lòng đảm bảo server Strapi đang chạy tại http://localhost:1337</p>
      </div>
    );
  }

  return (
    <div className="home" style={{ overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Hero Section */}
      <section
        className="hero py-5"
        style={{
          position: 'relative',
          backgroundImage: 'url("/images/logodo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          maxHeight: '600px',
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}
      >
        {/* Gradient overlay chỉ bên trái */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60%', // chỉ phủ bên trái
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 100%)',
            zIndex: 1
          }}
        />
        <Container fluid="lg" style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-center mx-0" style={{ minHeight: '400px', maxHeight: '500px', paddingTop: '20px' }}>
            {/* Text Column - căn giữa dọc + text trái */}
            <Col md={7} className="d-flex flex-column justify-content-center">
              <div style={{ maxWidth: 700 }}>
                <h1
                  className="display-4 mb-3 text-md-start text-center text-white"
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    textShadow: '0 1.5px 4px #000'
                  }}
                >
                  THD - Nơi bạn tạo nên giá trị khác biệt
                </h1>
                <p
                  className="lead mb-3 text-md-start text-center text-white"
                  style={{
                    fontSize: 'var(--font-size-base)',
                    textShadow: '0 1.5px 4px #000'
                  }}
                >
                  Chào mừng bạn đến với THD, đơn vị tiên phong trong lĩnh vực an ninh mạng tại Việt Nam. 
                  <br /><br />
                  Với sứ mệnh bảo vệ thế giới số, THD cung cấp các giải pháp bảo mật toàn diện cho doanh nghiệp và tổ chức, là đối tác tin cậy của nhiều đơn vị trong các lĩnh vực: Chính phủ, Y tế, Giáo dục, Tài chính và Doanh nghiệp.
                  <br /><br />
                  Tại THD, bạn được làm việc cùng đội ngũ chuyên gia hàng đầu, phát triển bản thân trong môi trường sáng tạo, đổi mới và đầy cơ hội bứt phá. Chúng tôi tin rằng mỗi thành viên đều là nhân tố tạo nên sự khác biệt.
                </p>
              </div>
            </Col>

            {/* Image Column - căn giữa + tăng kích thước ảnh */}
            <Col md={5} className="text-center">
              <img
                src="/images/thdngang.jpg"
                alt="logoheader"
                className="img-fluid"
                style={{ 
                  width: '100%', 
                  maxWidth: '400px',
                  height: 'auto',
                  border: '4px solid #fff',
                  borderRadius: '20px',
                  marginTop: 0,
                  objectFit: 'contain'
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      <div className="mb-5" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm công việc"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2"
                />
                <Button 
                  type="submit"
                  onClick={handleSearch}
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

      {/* Job Categories */}
      <section className="job-categories py-5 bg-white" style={{ 
        margin: '0 auto', 
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Container fluid="lg">
          <div style={{ background: '#FF0000', borderRadius: '8px 8px 0 0', padding: '12px 0', textAlign: 'center', marginBottom: 0 }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--font-size-lg)', margin: 0 }}>Việc làm tại THD</h2>
            <div style={{ color: 'white', fontSize: 'var(--font-size-base)', marginTop: '2px' }}>
              Một số vị trí thích hợp dành cho bạn có thể ở đây ngay tại đây. Khám phá nhé!
            </div>
          </div>
          <div className="job-filter mb-4 mt-3">
            <Nav variant="pills" className="job-filter-tabs justify-content-center" style={{ gap: '12px' }}>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                  style={{
                    borderRadius: '12px',
                    border: activeTab === 'all' ? '1px solid #FF0000' : '1px solid #222',
                    background: activeTab === 'all' ? '#FF0000' : '#fff',
                    color: activeTab === 'all' ? '#fff' : '#222',
                    fontWeight: 600,
                    minWidth: '120px',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Mới nhất
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'Khối kỹ thuật'}
                  onClick={() => setActiveTab('Khối kỹ thuật')}
                  style={{
                    borderRadius: '12px',
                    border: activeTab === 'Khối kỹ thuật' ? '1px solid #FF0000' : '1px solid #222',
                    background: activeTab === 'Khối kỹ thuật' ? '#FF0000' : '#fff',
                    color: activeTab === 'Khối kỹ thuật' ? '#fff' : '#222',
                    fontWeight: 600,
                    minWidth: '120px',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Khối kỹ thuật
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'Khối Kinh Doanh'}
                  onClick={() => setActiveTab('Khối Kinh Doanh')}
                  style={{
                    borderRadius: '12px',
                    border: activeTab === 'Khối Kinh Doanh' ? '1px solid #FF0000' : '1px solid #222',
                    background: activeTab === 'Khối Kinh Doanh' ? '#FF0000' : '#fff',
                    color: activeTab === 'Khối Kinh Doanh' ? '#fff' : '#222',
                    fontWeight: 600,
                    minWidth: '120px',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Khối kinh doanh
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'Kiểm Soát Nội Bộ'}
                  onClick={() => setActiveTab('Kiểm Soát Nội Bộ')}
                  style={{
                    borderRadius: '12px',
                    border: activeTab === 'Kiểm Soát Nội Bộ' ? '1px solid #FF0000' : '1px solid #222',
                    background: activeTab === 'Kiểm Soát Nội Bộ' ? '#FF0000' : '#fff',
                    color: activeTab === 'Kiểm Soát Nội Bộ' ? '#fff' : '#222',
                    fontWeight: 600,
                    minWidth: '120px',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Kiểm soát Nội Bộ
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === ' Khối Backoffice'}
                  onClick={() => setActiveTab(' Khối Backoffice')}
                  style={{
                    borderRadius: '12px',
                    border: activeTab === ' Khối Backoffice' ? '1px solid #FF0000' : '1px solid #222',
                    background: activeTab === ' Khối Backoffice' ? '#FF0000' : '#fff',
                    color: activeTab === ' Khối Backoffice' ? '#fff' : '#222',
                    fontWeight: 600,
                    minWidth: '120px',
                    fontSize: 'var(--font-size-base)'
                  }}
                >
                  Khối Backoffice
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Row className="g-4">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <Col md={4} key={job.id}>
                <Link to={`/jobs/${job.id}`} className="text-decoration-none">
                  <div
                    className="job-item p-3 bg-white rounded shadow-sm"
                    style={{
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '20px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      marginBottom: '20px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <img 
                        src="/images/thdvuong.jpg"
                        alt="THD Logo"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          marginRight: '12px',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <h5 className="mb-1" style={{ 
                          color: '#333',
                          fontSize: '16px',
                          fontWeight: '600',
                          lineHeight: '1.3',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {job.tenvitri}
                        </h5>
                        <div style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
                          THD CYBER SECURITY
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#888' }} />
                        {job.diachi}
                      </div>
                      {job.thoigianlamviec && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#888' }} />
                          {job.thoigianlamviec}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </Col>
            )) : (
              <Col>
                <div className="alert alert-info">
                  Không có công việc nào trong danh mục này. Vui lòng kiểm tra lại sau.
                </div>
              </Col>
            )}
          </Row>

          <div className="text-center mt-4">
            <Button 
              className="px-4 py-2 fw-medium rounded-pill" 
              size="lg"
              style={{ 
                minWidth: '180px', 
                fontWeight: 600, 
                fontSize: 'var(--font-size-base)', 
                borderRadius: '24px',
                backgroundColor: '#FF0000',
                border: 'none',
                color: '#fff'
              }}
              onClick={() => navigate('/jobs')}
            >
              Xem thêm
              <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

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
                  <span>Hỗ trợ thí chứng chỉ (nếu có)</span>
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
      <section className="recruitment-process py-5" style={{ 
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Container fluid="lg">
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

      {/* FAQ Section */}
      <section className="faq py-5 bg-light" style={{ 
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Container fluid="lg">
          <Row>
            <Col md={3} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100%' }}>
              <h4 className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', minWidth: '120px', marginTop: '32px', marginBottom: '32px' }}>FAQ</h4>
            </Col>
            <Col md={9}>
              <Accordion className="shadow-none border-0" defaultActiveKey="-1">
                <Accordion.Item eventKey="0" className="border-0">
                  <Accordion.Header style={{ borderBottom: '1px solid #eee', fontWeight: 500 }}>
                    Nếu tôi chưa có nhiều kinh nghiệm trong ngành, tôi có cơ hội được tuyển không?
                  </Accordion.Header>
                  <Accordion.Body>
                  Tại THD, chúng tôi đánh giá cao tinh thần học hỏi, tư duy chủ động và khát khao phát triển. Dù bạn chưa có nhiều kinh nghiệm, chỉ cần bạn sẵn sàng tiếp thu và không ngừng cố gắng, THD luôn chào đón bạn – vì chúng tôi tin rằng tiềm năng và thái độ đúng là nền tảng của sự bứt phá.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="border-0">
                  <Accordion.Header style={{ borderBottom: '1px solid #eee', fontWeight: 500 }}>
                    Tôi cần chuẩn bị gì cho buổi phỏng vấn tại THD?
                  </Accordion.Header>
                  <Accordion.Body>
                  Để có buổi phỏng vấn hiệu quả, bạn nên:<br></br>
                  <br></br>
                  Tìm hiểu kỹ về THD, các sản phẩm, dịch vụ và định hướng phát triển của công ty.
                  Xem lại yêu cầu công việc và chuẩn bị các ví dụ cụ thể về kinh nghiệm của bạn.
                  Chuẩn bị câu trả lời cho các câu hỏi tình huống hoặc kỹ thuật có thể gặp.
                  Đặt sẵn một vài câu hỏi cho nhà tuyển dụng – điều này thể hiện sự quan tâm của bạn.
                  Ăn mặc lịch sự, tự tin và thoải mái khi bước vào buổi phỏng vấn.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="border-0">
                  <Accordion.Header style={{ borderBottom: '1px solid #eee', fontWeight: 500 }}>
                    Thời gian thông báo kết quả phỏng vấn là bao lâu?
                  </Accordion.Header>
                  <Accordion.Body>
                  Kết quả phỏng vấn sẽ được THD thông báo trong vòng <b>3–4 ngày làm việc</b> kể từ ngày ứng viên hoàn thành buổi phỏng vấn. Trong một số trường hợp đặc biệt, thời gian này có thể thay đổi và bộ phận tuyển dụng sẽ chủ động liên hệ để cập nhật thông tin.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="border-0">
                  <Accordion.Header style={{ borderBottom: '1px solid #eee', fontWeight: 500 }}>
                    Nếu trượt vòng phỏng vấn, tôi có thể ứng tuyển lại không?
                  </Accordion.Header>
                  <Accordion.Body>
                  Có. THD luôn chào đón những ứng viên có khát vọng phát triển và mong muốn đồng hành cùng công ty. Bạn có thể ứng tuyển lại sau <b>2 tháng</b> kể từ lần phỏng vấn gần nhất hoặc khi có vị trí phù hợp với năng lực và định hướng của bạn.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4" className="border-0">
                  <Accordion.Header style={{ borderBottom: '1px solid #eee', fontWeight: 500 }}>
                    Phỏng vấn tại THD sẽ diễn ra trực tiếp hay trực tuyến?
                  </Accordion.Header>
                  <Accordion.Body>
                  Tùy vào từng vị trí và tình hình thực tế, THD tổ chức phỏng vấn <b>trực tiếp tại văn phòng</b> hoặc <b>trực tuyến qua các nền tảng như Google Meet, Zoom...</b> Mọi thông tin chi tiết sẽ được thông báo cụ thể trong thư mời phỏng vấn.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 