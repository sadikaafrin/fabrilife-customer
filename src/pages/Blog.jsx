import Header from '../components/Header';
import Footer from '../components/Footer';
import useBlogs from '../data/useBlogs';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

function Blog() {
  const { blogs, loading, error } = useBlogs();

  if (loading) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#000' }} role="status"></div>
            <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>Loading blogs...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa'
        }}>
          <div style={{
            padding: '40px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #f5c6cb',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <i className="ri-error-warning-line" style={{ fontSize: '48px', color: '#dc3545' }}></i>
            <h3 style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600', color: '#721c24' }}>
              Error Loading Blogs
            </h3>
            <p style={{ marginTop: '8px', color: '#666' }}>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section style={{ padding: '30px 0', background: '#fafafa', minHeight: '70vh' }}>
        <div className="container">
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 30px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #000 0%, #333 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}>
              <i className="ri-article-line" style={{ fontSize: '30px', color: '#fff' }}></i>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '12px'
            }}>
              Our Latest Blogs
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              Stay updated with insights, guides, and tips from our experts
            </p>
          </div>

          {/* Blog Grid */}
          {blogs && blogs.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {blogs.map((blog) => (
                <div 
                  key={blog.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Blog Image */}
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={blog.img} 
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    {/* Author Icon */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-28px',
                      left: '20px',
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '4px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 2
                    }}>
                      <User size={24} strokeWidth={2} color="#fff" />
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div style={{
                    padding: '40px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      minHeight: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {blog.title}
                    </h3>
                    
                    <div 
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        minHeight: '42px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        flex: 1
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: blog.description?.length > 100
                          ? blog.description.substring(0, 100) + '...'
                          : blog.description 
                      }} 
                    />

                    <Link 
                      to={`/blog-details/${blog.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#000',
                        color: '#fff',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        alignSelf: 'flex-start',
                        marginTop: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#333';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      Read More
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>

                  {/* Blog Footer */}
                  <div style={{
                    padding: '16px 24px',
                    background: '#fafafa',
                    borderTop: '1px solid #f0f0f0',
                    fontSize: '13px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ri-admin-line"></i>
                      Admin
                    </span>
                    <span style={{ color: '#e0e0e0' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ri-calendar-line"></i>
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span style={{ color: '#e0e0e0' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ri-chat-3-line"></i>
                      No Comments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              maxWidth: '600px',
              margin: '60px auto',
              textAlign: 'center',
              padding: '60px 40px',
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: '#f5f5f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '48px',
                color: '#999'
              }}>
                <i className="ri-article-line"></i>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                No Blogs Yet
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#666',
                lineHeight: '1.6'
              }}>
                Check back soon for our latest insights and articles
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Blog;