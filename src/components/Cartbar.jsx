// Cartbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import Swal from "sweetalert2";

function normalizeColorName(c) {
  if (!c) return null;
  if (typeof c === "string") return String(c).trim();
  return String(c.name || c.label || c.color || "").trim();
}

function Cartbar() {
  const navigate = useNavigate();

  const {
    carts,
    totalPrice,
    removeCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  const closeCartBar = () => {
    const cart = document.querySelector(".cart");
    if (cart) cart.style.right = "-100%";
  };

  const handleCheckout = () => {
    navigate("/checkout");
    closeCartBar();
  };

  const handleViewCart = () => {
    navigate("/view-cart");
    closeCartBar();
  };

  const handleClearAll = () => {
    clearCart();
  };

  const getColorDisplay = (item) => {
    const colorName = item.colorObj?.name || item.colorName || item.color;
    if (!colorName) return null;
    return String(colorName).charAt(0).toUpperCase() + String(colorName).slice(1);
  };

  const getColorHex = (item) => {
    return item.colorObj?.hex || item.colorHex || null;
  };

  return (
    <section className="cart" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ffffff'
    }}>
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Shopping Cart</h2>
          <button onClick={closeCartBar} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <i className="ri-close-line" style={{ fontSize: '20px', color: '#666' }}></i>
          </button>
        </div><br />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{carts.length === 0 ? 'No items' : `${carts.length} ${carts.length === 1 ? 'item' : 'items'}`}</p>
          {carts.length > 0 && (
            <button 
              onClick={handleClearAll}
              style={{ 
                fontSize: '13px', 
                color: '#ef4444', 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <i className="ri-delete-bin-line" style={{ fontSize: '14px' }}></i>
              Clear All
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0px' }}>
        {carts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <i className="ri-shopping-bag-3-line" style={{ fontSize: '56px', color: '#adb5bd' }}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px', lineHeight: '1.6' }}>
              Looks like you haven't added any items yet.<br />Start shopping to fill it up!
            </p>
            <button onClick={closeCartBar} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Continue Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {carts.map((item, index) => {
              const displayColor = getColorDisplay(item);
              const colorHex = getColorHex(item);
              const colorKey = item.colorObj?.id ?? item.colorName ?? item.color ?? 'nocolor';
              const uniqueKey = `${item.id}-${item.size || 'nosize'}-${colorKey}-${index}`;

              return (
                <div key={uniqueKey} style={{ display: 'flex', gap: '12px', padding: '16px', background: '#fafafa', borderRadius: '12px', position: 'relative' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '30px' }}>
                    <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0, lineHeight: '1.4' }}>{item.name}</h6>
                    
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>৳ {Number(item.price)}</div>
                    
                    {(item.size || displayColor) && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        {item.size && (
                          <span style={{ fontSize: '11px', color: '#555', background: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', fontWeight: '500', border: '1px solid #e8e8e8' }}>
                            {item.size}
                          </span>
                        )}

                        {displayColor && (
                          <span style={{ fontSize: '11px', color: '#555', background: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500', border: '1px solid #e8e8e8' }}>
                            {colorHex && <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: colorHex, border: '1px solid #ddd', display: 'inline-block' }}></span>}
                            {displayColor}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '4px', borderRadius: '8px', border: '1px solid #e8e8e8', width: 'fit-content', marginTop: 'auto' }}>
                      <button
                        onClick={() => decrementQuantity(item.id, item.size, normalizeColorName(item.colorObj?.name || item.colorName || item.color))}
                        style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#666' }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id, item.size, normalizeColorName(item.colorObj?.name || item.colorName || item.color))}
                        style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#666' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeCart(item.id, item.size, normalizeColorName(item.colorObj?.name || item.colorName || item.color))}
                    style={{ position: 'absolute', top: '12px', right: '12px', width: '26px', height: '26px', border: 'none', background: '#fff', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  >
                    <i className="ri-delete-bin-line" style={{ fontSize: '14px', color: '#ef4444' }}></i>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {carts.length > 0 && (
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>Total</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>৳ {Number(totalPrice)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleCheckout} style={{ padding: '14px', background: 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Proceed to Checkout</button>
            <button onClick={handleViewCart} style={{ padding: '14px', background: '#fff', color: '#1a1a1a', border: '2px solid #e8e8e8', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>View Full Cart</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cartbar;