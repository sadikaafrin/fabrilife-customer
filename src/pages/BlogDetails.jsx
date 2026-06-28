import Header from '../components/Header';
import Footer from '../components/Footer';
import useBlogs from '../data/useBlogs';
import { Link, useParams } from "react-router-dom";
import { User } from 'lucide-react';

function BlogDetails() {
    const { slug } = useParams();
    const { blogs, loading, error } = useBlogs();
    const blog = blogs.find(b => b.id === slug);

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
                        <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>Loading blog...</p>
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
                            Error Loading Blog
                        </h3>
                        <p style={{ marginTop: '8px', color: '#666' }}>{error}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!blog) {
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
                        padding: '60px 40px',
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e0e0e0',
                        maxWidth: '500px',
                        textAlign: 'center'
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
                            <i className="ri-file-search-line"></i>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                            Blog Not Found
                        </h3>
                        <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>
                            The blog you're looking for doesn't exist or has been removed
                        </p>
                        <Link 
                            to="/blog"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#000',
                                color: '#fff',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            <i className="ri-arrow-left-line"></i>
                            Back to Blogs
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return ( 
        <>
            <Header />

            <section style={{ padding: '60px 0', background: '#fafafa', minHeight: '70vh' }}>
                <div className="container">
                    {/* Blog Content */}
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {/* Back Button */}
                        <Link 
                            to="/blog"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#fff',
                                color: '#000',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                marginBottom: '32px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.color = '#000';
                            }}
                        >
                            <i className="ri-arrow-left-line"></i>
                            Back to Blogs
                        </Link>

                        {/* Main Blog Card */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                            marginBottom: '60px'
                        }}>
                            {/* Featured Image */}
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src={blog.img} 
                                    alt={blog.title}
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Author Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-32px',
                                    left: '40px',
                                    width: '64px',
                                    height: '64px',
                                    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '5px solid #fff',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                    zIndex: 2
                                }}>
                                    <User size={28} strokeWidth={2} color="#fff" />
                                </div>
                            </div>

                            {/* Blog Content */}
                            <div style={{ padding: '56px 40px 40px' }}>
                                {/* Meta Info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '24px',
                                    fontSize: '14px',
                                    color: '#666',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                        <i className="ri-admin-line"></i>
                                        Admin
                                    </span>
                                    <span style={{ color: '#e0e0e0' }}>•</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="ri-calendar-line"></i>
                                        {new Date(blog.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span style={{ color: '#e0e0e0' }}>•</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="ri-chat-3-line"></i>
                                        No Comments
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    marginBottom: '32px',
                                    lineHeight: '1.3'
                                }}>
                                    {blog.title}
                                </h1>

                                {/* Description */}
                                <div 
                                    style={{
                                        fontSize: '17px',
                                        lineHeight: '1.8',
                                        color: '#333'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: blog.description }} 
                                />
                            </div>

                            {/* Share Section */}
                            <div style={{
                                padding: '24px 40px',
                                background: '#fafafa',
                                borderTop: '1px solid #f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
                                    Share this article
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['facebook-fill', 'twitter-fill', 'linkedin-fill', 'mail-line'].map((icon) => (
                                        <button
                                            key={icon}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#fff',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontSize: '18px',
                                                color: '#666'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#000';
                                                e.currentTarget.style.color = '#fff';
                                                e.currentTarget.style.borderColor = '#000';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.color = '#666';
                                                e.currentTarget.style.borderColor = '#e0e0e0';
                                            }}
                                        >
                                            <i className={`ri-${icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Related Posts */}
                        {blogs.filter((b) => b.id !== slug).length > 0 && (
                            <div>
                                <div style={{
                                    marginBottom: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <h2 style={{
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#1a1a1a',
                                        margin: 0
                                    }}>
                                        Related Posts
                                    </h2>
                                    <div style={{
                                        flex: 1,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #e0e0e0, transparent)'
                                    }}></div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '24px'
                                }}>
                                    {blogs
                                        .filter((b) => b.id !== slug)
                                        .slice(0, 3)
                                        .map((relatedBlog) => (
                                            <div 
                                                key={relatedBlog.id}
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
                                                <div style={{ position: 'relative' }}>
                                                    <img 
                                                        src={relatedBlog.img} 
                                                        alt={relatedBlog.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '180px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '-24px',
                                                        left: '20px',
                                                        width: '48px',
                                                        height: '48px',
                                                        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '4px solid #fff',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        zIndex: 2
                                                    }}>
                                                        <User size={20} strokeWidth={2} color="#fff" />
                                                    </div>
                                                </div>

                                                <div style={{
                                                    padding: '36px 20px 20px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}>
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        color: '#1a1a1a',
                                                        marginBottom: '10px',
                                                        lineHeight: '1.4',
                                                        minHeight: '44px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}>
                                                        {relatedBlog.title}
                                                    </h3>
                                                    
                                                    <div 
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#666',
                                                            lineHeight: '1.6',
                                                            marginBottom: '16px',
                                                            minHeight: '42px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            flex: 1
                                                        }}
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: relatedBlog.description?.length > 80
                                                                ? relatedBlog.description.substring(0, 80) + '...'
                                                                : relatedBlog.description 
                                                        }} 
                                                    />

                                                    <Link 
                                                        to={`/blog-details/${relatedBlog.id}`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '10px 20px',
                                                            background: '#000',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
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

                                                <div style={{
                                                    padding: '14px 20px',
                                                    background: '#fafafa',
                                                    borderTop: '1px solid #f0f0f0',
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="ri-calendar-line"></i>
                                                        {new Date(relatedBlog.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                    <span style={{ color: '#e0e0e0' }}>•</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="ri-chat-3-line"></i>
                                                        0 Comments
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default BlogDetails;