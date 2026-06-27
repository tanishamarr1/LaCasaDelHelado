import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '18296343930';
const CART_KEY = 'lch_cart_v1';

const MENU_DATA = {
  tostadas: {
    title: 'Tostadas',
    items: [
      { name: 'Tostada Normal', price: 50, desc: 'Tostada clasica, crujiente y dorada al punto perfecto.', img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80' },
      { name: 'Tostada con Huevo', price: 65, desc: 'Tostada con huevo frito o revuelto, ideal para empezar el dia.', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80' },
      { name: 'Tostada con Tocineta', price: 75, desc: 'Tostada crujiente con tocineta dorada y sabrosa.', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&q=80' },
      { name: 'Tostada con Huevo y Tocineta', price: 100, desc: 'La combinacion perfecta: huevo y tocineta juntos en una misma tostada.', img: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80' }
    ]
  },
  batidas: {
    title: 'Batidas con Carnation',
    items: [
      { name: 'Batida de Lechosa con Carnation', price: 60, desc: 'Cremosa batida de lechosa natural con leche Carnation.', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80' },
      { name: 'Batida de Zapote con Carnation', price: 60, desc: 'El sabor unico del zapote dominicano en una batida fria y densa.', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80' },
      { name: 'Batida de Guineo con Carnation', price: 60, desc: 'Batida de guineo maduro con Carnation, suave y deliciosa.', img: 'https://images.unsplash.com/photo-1602595908921-4f5f63aaeaf7?w=600&q=80' },
      { name: 'Batida de Fresa con Carnation', price: 75, desc: 'Fresas frescas con Carnation para un sabor inigualable.', img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80' }
    ]
  },
  jugos: {
    title: 'Jugos Naturales',
    items: [
      { name: 'Jugo Natural de Chinola', price: 40, desc: 'Natural de chinola, refrescante y lleno de vitamina C.', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80' },
      { name: 'Jugo Natural de Limon', price: 40, desc: 'Limon fresco exprimido, ideal para el calor dominicano.', img: 'https://images.unsplash.com/photo-1587015990127-424b954571a6?w=600&q=80' },
      { name: 'Jugo Natural de Cereza', price: 40, desc: 'Jugo natural de cereza, dulce y de un color precioso.', img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80' }
    ]
  },
  cremitas: {
    title: 'Cremitas Artesanales',
    items: [
      { name: 'Cremita de Fresa', price: 15, desc: 'Cremita artesanal con intenso sabor a fresa fresca.', img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80' },
      { name: 'Cremita de Coco', price: 15, desc: 'Suave y tropical, con todo el sabor del coco dominicano.', img: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80' },
      { name: 'Cremita de Chicle', price: 15, desc: 'Divertida y colorida, el sabor clasico que encanta a todos.', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80' },
      { name: 'Cremita de Pina', price: 15, desc: 'Frescura tropical con el dulce sabor de la pina.', img: 'https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=600&q=80', label: 'Cremita de Piña' }
    ]
  },
  paletas: {
    title: 'Paletas',
    items: [
      { name: 'Paleta de Fresa', price: 15, desc: 'Paleta fria con intenso sabor a fresa natural.', img: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80' },
      { name: 'Paleta de Chocolate', price: 30, desc: 'Paleta cubierta en chocolate, un clasico que nunca falla.', img: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80' },
      { name: 'Paleta Revertida', price: 35, desc: 'Nuestra paleta especial de capas revertidas, una experiencia unica.', img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80' }
    ]
  }
};

const TOPPINGS = [
  'Topping: Fresita',
  'Topping: Oreo',
  'Topping: Gomitas',
  'Topping: Chispas de Chocolate',
  'Topping: Chispas de Colores',
  'Topping: Mini Malvaviscos',
  'Topping: Mani',
  'Topping: Pirulin',
  'Topping: Mermeladas',
  'Topping: Sirope de Chocolate',
  'Topping: Dulce de Leche'
];

function App() {
  // --- STATE ---
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const [currentCategory, setCurrentCategory] = useState('all');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- LOCAL STORAGE EFFECT ---
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // --- HERO TIMER EFFECT ---
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // --- INTERSECTION OBSERVER FOR FADE-IN ON SCROLL ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.fade');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [currentCategory]);

  // --- ACTIONS ---
  const addItem = (name, price) => {
    setCart(prev => {
      const existing = prev[name];
      return {
        ...prev,
        [name]: {
          price: Number(price) || 0,
          qty: existing ? existing.qty + 1 : 1
        }
      };
    });
  };

  const removeOne = (name) => {
    setCart(prev => {
      const existing = prev[name];
      if (!existing) return prev;
      const newQty = existing.qty - 1;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return {
        ...prev,
        [name]: { ...existing, qty: newQty }
      };
    });
  };

  const removeAll = (name) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const clearCart = () => {
    if (confirm('¿Vaciar todo el carrito?')) {
      setCart({});
    }
  };

  const toggleTopping = (name) => {
    if (cart[name]) {
      removeAll(name);
    } else {
      addItem(name, 0);
    }
  };

  const scrollIntoSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    setCurrentCategory(cat);
    scrollIntoSection('menu');
  };

  // --- CALC VALUES ---
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleSendWhatsAppOrder = () => {
    const entries = Object.entries(cart);
    if (entries.length === 0) return;

    const lines = ['Hola, quiero hacer este pedido en La Casa del Helado:', ''];

    entries.forEach(([name, item]) => {
      if (item.price > 0) {
        lines.push(`- ${item.qty}x ${name} (RD$${item.price} c/u) = RD$${item.qty * item.price}`);
      } else {
        lines.push(`- ${item.qty}x ${name}`);
      }
    });

    lines.push('');
    lines.push(`Total: RD$${cartTotal}`);

    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* ANNOUNCEMENT */}
      <div className="ann">
        Pedidos rapidos por WhatsApp al <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">+1 (829) 634-3930</a> — Barrio La Esperanza, Santo Domingo Oeste
      </div>

      {/* NAV */}
      <nav id="mainNav">
        <div className="nav-i">
          <a href="#inicio" className="logo" onClick={(e) => { e.preventDefault(); scrollIntoSection('inicio'); }}>
            <span className="logo-mark">
              <svg viewBox="0 0 48 48" fill="none" xmlns="https://ibb.co/MrB2yKN">
                <circle cx="24" cy="24" r="23" fill="#fdf5f2" stroke="#d76fcf" strokeWidth="2"/>
                <path d="M24 12c4.4 0 8 3.4 8 7.7 0 .5-.3.9-.7 1-3.5.9-6 4-6.3 7.6h-2c-.3-3.6-2.8-6.7-6.3-7.6-.4-.1-.7-.5-.7-1 0-4.3 3.6-7.7 8-7.7z" fill="#d76fcf"/>
                <path d="M22.4 28h3.2l-1 8.6c-.1.9-.8 1.4-1.6.9-.4-.2-.6-.6-.6-1z" fill="#a5408a"/>
                <circle cx="19" cy="17.5" r="1.4" fill="#fff"/>
                <circle cx="27.5" cy="16" r="1.1" fill="#fff"/>
              </svg>
            </span>
            La Casa <em>del Helado</em>
          </a>

          <ul className="nav-links">
            <li>
              <a href="#menu" onClick={(e) => { e.preventDefault(); scrollIntoSection('menu'); }}>
                Menu
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
              <div className="drop">
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('cremitas'); }}>
                  <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80" alt="Cremitas" className="drop-img"/>
                  <span className="drop-lbl">Cremitas Artesanales</span>
                </a>
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('batidas'); }}>
                  <img src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" alt="Batidas" className="drop-img"/>
                  <span className="drop-lbl">Batidas con Carnation</span>
                </a>
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('tostadas'); }}>
                  <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80" alt="Tostadas" className="drop-img"/>
                  <span className="drop-lbl">Tostadas</span>
                </a>
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('paletas'); }}>
                  <img src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&q=80" alt="Paletas" className="drop-img"/>
                  <span className="drop-lbl">Paletas</span>
                </a>
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('jugos'); }}>
                  <img src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80" alt="Jugos" className="drop-img"/>
                  <span className="drop-lbl">Jugos Naturales</span>
                </a>
                <a href="#menu" className="drop-item" onClick={(e) => { e.preventDefault(); handleCategoryClick('toppings'); }}>
                  <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" alt="Toppings" className="drop-img"/>
                  <span className="drop-lbl">Toppings</span>
                </a>
              </div>
            </li>
            <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollIntoSection('nosotros'); }}>Nosotros</a></li>
            <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollIntoSection('contacto'); }}>Contacto</a></li>
          </ul>

          <div className="nav-r">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="nbtn nbtn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a4.48 4.48 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L0 24l6.302-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0"/></svg>
              WhatsApp
            </a>
            <a href="#menu" className="nbtn nbtn-solid" onClick={(e) => { e.preventDefault(); scrollIntoSection('menu'); }}>Ver el menu</a>
            <button className="nbtn nbtn-cart" onClick={() => setIsCartOpen(true)} aria-label="Ver carrito">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span className="cart-badge" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>{cartCount}</span>
            </button>
          </div>

          <button 
            className={`ham ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div 
        className={`mob-overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <nav className={`mob ${isMenuOpen ? 'open' : ''}`}>
        <a href="#inicio" className="mob-link" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollIntoSection('inicio'); }}>Inicio</a>
        <a href="#menu" className="mob-link" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollIntoSection('menu'); }}>Menu</a>
        <a href="#nosotros" className="mob-link" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollIntoSection('nosotros'); }}>Nosotros</a>
        <a href="#contacto" className="mob-link" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollIntoSection('contacto'); }}>Contacto</a>
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20La%20Casa%20del%20Helado`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mob-cta"
          onClick={() => setIsMenuOpen(false)}
        >
          Pedir por WhatsApp
        </a>
      </nav>

      {/* HERO SLIDER */}
      <section className="hero" id="inicio">
        {/* Slide 0 */}
        <div className={`h-slide ${heroIndex === 0 ? 'on' : ''}`}>
          <div className="h-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488900128323-21503983a07e?w=1920&q=85')" }}></div>
          <div className="h-ov"></div>
          <div className="h-cnt">
            <p className="h-eye">Barrio La Esperanza, Santo Domingo</p>
            <h1 className="h-t1">Dulce frescura<br/><em>que enamora</em></h1>
            <p className="h-t2">Cremitas artesanales, paletas y batidas tropicales desde RD$15</p>
            <div className="h-acts">
              <a href="#menu" className="btn-p" onClick={(e) => { e.preventDefault(); scrollIntoSection('menu'); }}>Ver el menu</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20La%20Casa%20del%20Helado`} target="_blank" rel="noopener noreferrer" className="btn-o">Pedir por WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Slide 1 */}
        <div className={`h-slide ${heroIndex === 1 ? 'on' : ''}`}>
          <div className="h-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=1920&q=85')" }}></div>
          <div className="h-ov"></div>
          <div className="h-cnt">
            <p className="h-eye">Paletas artesanales</p>
            <h1 className="h-t1">Sabores que<br/><em>recuerdan el verano</em></h1>
            <p className="h-t2">Fresa, chocolate y nuestra paleta revertida especial</p>
            <div className="h-acts">
              <a href="#menu" className="btn-p" onClick={(e) => { e.preventDefault(); handleCategoryClick('paletas'); }}>Ver paletas</a>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className={`h-slide ${heroIndex === 2 ? 'on' : ''}`}>
          <div className="h-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1920&q=85')" }}></div>
          <div className="h-ov"></div>
          <div className="h-cnt">
            <p className="h-eye">Batidas con Carnation</p>
            <h1 className="h-t1">El sabor<br/><em>de lo nuestro</em></h1>
            <p className="h-t2">Lechosa, zapote, guineo y fresa con Carnation</p>
            <div className="h-acts">
              <a href="#menu" className="btn-p" onClick={(e) => { e.preventDefault(); handleCategoryClick('batidas'); }}>Ver batidas</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20una%20batida%20de%20La%20Casa%20del%20Helado`} target="_blank" rel="noopener noreferrer" className="btn-o">Pedir ahora</a>
            </div>
          </div>
        </div>

        <div className="h-dots">
          <button className={`h-dot ${heroIndex === 0 ? 'on' : ''}`} onClick={() => setHeroIndex(0)}></button>
          <button className={`h-dot ${heroIndex === 1 ? 'on' : ''}`} onClick={() => setHeroIndex(1)}></button>
          <button className={`h-dot ${heroIndex === 2 ? 'on' : ''}`} onClick={() => setHeroIndex(2)}></button>
        </div>
      </section>

      {/* FEATURE BAND */}
      <div className="feat-band">
        <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1000&q=85" alt="Cremitas artesanales" className="feat-img"/>
        <div className="feat-body">
          <p className="feat-tag">Lo mas pedido</p>
          <h2 className="feat-h2">Cremitas desde<br/><em>RD$15</em></h2>
          <p className="feat-p">Fresa, coco, chicle, pina y mas sabores. Preparadas a mano con ingredientes frescos, cada cremita lleva el sabor autentico del barrio.</p>
          <a href="#menu" className="feat-link" onClick={(e) => { e.preventDefault(); handleCategoryClick('cremitas'); }}>Ver cremitas</a>
        </div>
      </div>

      {/* CATEGORY MOSAIC */}
      <section className="sec sec-pb0" id="categorias">
        <div className="si">
          <div className="sec-head fade sec-head-mb">
            <p className="s-lbl">Todo lo que tenemos</p>
            <h2 className="s-h2">Una heladeria familiar<br/><em>con sabor dominicano</em></h2>
          </div>
        </div>
      </section>

      <div className="mosaic-wrap">
        <div className="mosaic fade">
          <div className="mos-tile tall" onClick={() => handleCategoryClick('cremitas')}>
            <img src="https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&q=85" alt="Cremitas artesanales"/>
            <div className="mos-ov">
              <p className="mos-label">Cremitas<br/>Artesanales</p>
              <span className="mos-cta">Desde RD$15 →</span>
            </div>
          </div>
          <div className="mos-tile" onClick={() => handleCategoryClick('batidas')}>
            <img src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=700&q=85" alt="Batidas"/>
            <div className="mos-ov">
              <p className="mos-label">Batidas con Carnation</p>
              <span className="mos-cta">Desde RD$60 →</span>
            </div>
          </div>
          <div className="mos-tile" onClick={() => handleCategoryClick('tostadas')}>
            <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700&q=85" alt="Tostadas"/>
            <div className="mos-ov">
              <p className="mos-label">Tostadas</p>
              <span className="mos-cta">Desde RD$50 →</span>
            </div>
          </div>
          <div className="mos-tile" onClick={() => handleCategoryClick('paletas')}>
            <img src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=700&q=85" alt="Paletas"/>
            <div className="mos-ov">
              <p className="mos-label">Paletas</p>
              <span className="mos-cta">Desde RD$15 →</span>
            </div>
          </div>
          <div className="mos-tile" onClick={() => handleCategoryClick('jugos')}>
            <img src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&q=85" alt="Jugos naturales"/>
            <div className="mos-ov">
              <p className="mos-label">Jugos Naturales</p>
              <span className="mos-cta">Desde RD$40 →</span>
            </div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <section className="sec menu-bg" id="menu">
        <div className="si">
          <div className="sec-head fade sec-head-mb">
            <p className="s-lbl">Menu completo</p>
            <h2 className="s-h2">Cada producto,<br/><em>hecho con cuidado</em></h2>
            <p className="s-sub">Agrega los productos que quieras al carrito y envia todo tu pedido por WhatsApp de una sola vez.</p>
          </div>

          <div className="tabs" id="tabsBar">
            <button className={`tab ${currentCategory === 'all' ? 'on' : ''}`} onClick={() => setCurrentCategory('all')}>Todo</button>
            <button className={`tab ${currentCategory === 'tostadas' ? 'on' : ''}`} onClick={() => setCurrentCategory('tostadas')}>Tostadas</button>
            <button className={`tab ${currentCategory === 'batidas' ? 'on' : ''}`} onClick={() => setCurrentCategory('batidas')}>Batidas</button>
            <button className={`tab ${currentCategory === 'jugos' ? 'on' : ''}`} onClick={() => setCurrentCategory('jugos')}>Jugos</button>
            <button className={`tab ${currentCategory === 'cremitas' ? 'on' : ''}`} onClick={() => setCurrentCategory('cremitas')}>Cremitas</button>
            <button className={`tab ${currentCategory === 'paletas' ? 'on' : ''}`} onClick={() => setCurrentCategory('paletas')}>Paletas</button>
            <button className={`tab ${currentCategory === 'toppings' ? 'on' : ''}`} onClick={() => setCurrentCategory('toppings')}>Toppings</button>
          </div>

          {/* MENU CATEGORIES */}
          {Object.entries(MENU_DATA).map(([catKey, catVal]) => {
            const isVisible = currentCategory === 'all' || currentCategory === catKey;
            return (
              <div 
                key={catKey} 
                className={`m-sec ${isVisible ? 'vis' : ''}`} 
                id={`cat-${catKey}`}
                style={{ display: isVisible ? 'block' : 'none' }}
              >
                <h3 className="m-sec-title">{catVal.title}</h3>
                <div className="mgrid">
                  {catVal.items.map((item) => {
                    const itemQty = cart[item.name]?.qty || 0;
                    return (
                      <div key={item.name} className="mcard fade">
                        <img src={item.img} alt={item.name} className="mcard-img"/>
                        <div className="mcard-body">
                          <div className="mcard-row">
                            <span className="mcard-name">{item.label || item.name}</span>
                            <span className="mcard-price">RD${item.price}</span>
                          </div>
                          <p className="mcard-desc">{item.desc}</p>
                          <div className="mcard-ctrl">
                            {itemQty > 0 ? (
                              <div className="mcard-stepper">
                                <button type="button" className="mc-minus" onClick={() => removeOne(item.name)} aria-label="Quitar uno">−</button>
                                <span className="mcard-qty">{itemQty} en el pedido</span>
                                <button type="button" className="mc-plus" onClick={() => addItem(item.name, item.price)} aria-label="Agregar uno">+</button>
                              </div>
                            ) : (
                              <button type="button" className="mcard-add" onClick={() => addItem(item.name, item.price)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                 Agregar al pedido
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* TOPPINGS */}
          <div 
            className={`m-sec ${(currentCategory === 'all' || currentCategory === 'toppings') ? 'vis' : ''}`} 
            id="cat-toppings"
            style={{ display: (currentCategory === 'all' || currentCategory === 'toppings') ? 'block' : 'none' }}
          >
            <h3 className="m-sec-title">Toppings y Siropes</h3>
            <p className="t-note">Elige tus toppings y agregalos al carrito junto con tu pedido (sin costo adicional).</p>
            
            <div className="t-tags" id="toppingTags">
              {TOPPINGS.map((toppingName) => {
                const isActive = !!cart[toppingName];
                const cleanName = toppingName.replace('Topping: ', '');
                return (
                  <button 
                    key={toppingName} 
                    type="button" 
                    className="t-tag"
                    onClick={() => toggleTopping(toppingName)}
                    style={{
                      background: isActive ? 'var(--coral)' : '',
                      color: isActive ? '#fff' : '',
                      borderColor: isActive ? 'var(--coral)' : ''
                    }}
                  >
                    {cleanName}
                  </button>
                );
              })}
            </div>
            
            <p className="topping-hint">Toca un topping para agregarlo al carrito. Vuelve a tocarlo para quitarlo.</p>
          </div>

        </div>
      </section>

      {/* THREE COL INFO */}
      <section className="sec sec-no-pt">
        <div className="si">
          <div className="info-grid fade">
            <div className="info-col">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Pedir por WhatsApp" className="info-img"/>
              <div className="info-body">
                <p className="info-tag">Pedidos</p>
                <h3 className="info-h3">Pide en segundos por WhatsApp</h3>
                <p className="info-p">Escribenos, escoge tu producto y lo preparamos con amor. Rapido, directo y sin complicaciones.</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20La%20Casa%20del%20Helado`} target="_blank" rel="noopener noreferrer" className="info-a">Escribir ahora →</a>
              </div>
            </div>
            <div className="info-col">
              <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80" alt="Menu completo" className="info-img"/>
              <div className="info-body">
                <p className="info-tag">Menu</p>
                <h3 className="info-h3">Desde RD$15 — tostadas, batidas y mas</h3>
                <p className="info-p">Cremitas artesanales, paletas, jugos naturales y tostadas con los mejores ingredientes.</p>
                <a href="#menu" className="info-a" onClick={(e) => { e.preventDefault(); scrollIntoSection('menu'); }}>Ver menu completo →</a>
              </div>
            </div>
            <div className="info-col">
              <img src="https://images.unsplash.com/photo-1519690069926-8a5eb14a62fb?w=800&q=80" alt="Ubicacion" className="info-img"/>
              <div className="info-body">
                <p className="info-tag">Visitanos</p>
                <h3 className="info-h3">En el corazon del Barrio La Esperanza</h3>
                <p className="info-p">C/p #3, Hato Nuevo de Manoguayabo, Santo Domingo Oeste. Te esperamos.</p>
                <a href="#contacto" className="info-a" onClick={(e) => { e.preventDefault(); scrollIntoSection('contacto'); }}>Como llegar →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SPLIT */}
      <div className="about-band" id="nosotros">
        <div className="about-img-w">
          <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=85" alt="La Casa del Helado — nuestra historia"/>
        </div>
        <div className="about-txt fade">
          <p className="s-lbl">Nuestra historia</p>
          <h2 className="s-h2">Hecho con amor<br/><em>dominicano</em></h2>
          <p className="s-sub">Somos una heladeria familiar del Barrio La Esperanza. Cada cremita, cada batida y cada tostada se prepara con ingredientes frescos y el sabor autentico de nuestra tierra.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20conocer%20mas%20sobre%20La%20Casa%20del%20Helado`} target="_blank" rel="noopener noreferrer" className="btn-p">Escribenos</a>
        </div>
      </div>

      {/* CONTACT */}
      <section className="sec contact-bg" id="contacto">
        <div className="si">
          <div className="sec-head fade">
            <p className="s-lbl">Encontranos</p>
            <h2 className="s-h2">Visitanos o <em>escribenos</em></h2>
            <p className="s-sub">Estamos en Hato Nuevo de Manoguayabo. Un mensaje y tu pedido esta en camino.</p>
          </div>
          <div className="cgrid">
            <div className="ccard fade">
              <p className="ccard-lbl">Direccion</p>
              <h3 className="ccard-h3">Barrio La Esperanza</h3>
              <p className="ccard-p">C/p #3, Barrio La Esperanza<br/>Hato Nuevo de Manoguayabo<br/>Santo Domingo Oeste, CP 10307<br/>Republica Dominicana</p>
              <a href="https://maps.google.com/?q=Hato+Nuevo+de+Manoguayabo+Santo+Domingo" target="_blank" rel="noopener noreferrer" className="ccard-a">Ver en Google Maps →</a>
            </div>
            <div className="ccard fade d1">
              <p className="ccard-lbl">Contacto directo</p>
              <h3 className="ccard-h3">WhatsApp y Redes</h3>
              <p className="ccard-p">+1 (829) 634-3930<br/>Pedidos disponibles por WhatsApp.<br/>Escribenos el producto y te atendemos de inmediato.</p>
              <div className="soc-row">
                <a href="https://www.tiktok.com/@lacasadelhelado" target="_blank" rel="noopener noreferrer" className="soc" aria-label="TikTok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.18 8.18 0 004.78 1.52V6.81a4.85 4.85 0 01-1.01-.12z"/></svg>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="soc" aria-label="WhatsApp">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a4.48 4.48 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L0 24l6.302-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0"/></svg>
                </a>
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20La%20Casa%20del%20Helado`} target="_blank" rel="noopener noreferrer" className="ccard-a">Pedir por WhatsApp →</a>
            </div>
            <div className="ccard ccard-map fade">
              <div className="map-w">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30267.5!2d-70.002!3d18.498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea5613c6aa9a4b5%3A0x0!2zSGF0byBOdWV2byBkZSBNYW5vZ3VheWFibw!5e0!3m2!1ses!2sdo!4v1234567890" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicacion La Casa del Helado"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-i">
          <div className="foot-top">
            <div>
              <p className="foot-logo">La Casa <em>del Helado</em></p>
              <p className="foot-tag">Dulce frescura que enamora — Barrio La Esperanza, SDO</p>
            </div>
            <ul className="foot-links">
              <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollIntoSection('menu'); }}>Menu</a></li>
              <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollIntoSection('nosotros'); }}>Nosotros</a></li>
              <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollIntoSection('contacto'); }}>Ubicacion</a></li>
              <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="https://www.tiktok.com/@lacasadelhelado" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>
          <div className="foot-btm">
            © 2026 La Casa del Helado — Hato Nuevo de Manoguayabo, Republica Dominicana
          </div>
        </div>
      </footer>

      {/* CART OVERLAY + DRAWER */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} aria-label="Carrito de pedido">
        <div className="cart-head">
          <h3>Tu pedido</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)} aria-label="Cerrar carrito">×</button>
        </div>
        <div className="cart-items" id="cartItemsWrap">
          {Object.entries(cart).length === 0 ? (
            <div className="cart-empty" id="cartEmptyMsg">
              Tu carrito esta vacio.<br/>
              Ve al <a href="#menu" onClick={(e) => { e.preventDefault(); setIsCartOpen(false); scrollIntoSection('menu'); }}>menu</a> y agrega lo que quieras pedir.
            </div>
          ) : (
            Object.entries(cart).map(([name, item]) => {
              const isTopping = name.startsWith('Topping: ');
              const displayItemName = isTopping ? name.replace('Topping: ', '') : name;
              const priceLabel = item.price > 0 ? `RD$${item.price} c/u` : 'Sin costo';

              return (
                <div key={name} className="cart-row" data-name={name}>
                  <div className="cart-row-info">
                    <div className="cart-row-name">{displayItemName}</div>
                    <div className="cart-row-price">{priceLabel}</div>
                  </div>
                  
                  {isTopping ? (
                    <div className="cart-row-ctrl">
                      <span className="cart-row-qty">Topping</span>
                    </div>
                  ) : (
                    <div className="cart-row-ctrl">
                      <button type="button" className="cr-minus" onClick={() => removeOne(name)} aria-label="Quitar uno">−</button>
                      <span className="cart-row-qty">{item.qty}</span>
                      <button type="button" className="cr-plus" onClick={() => addItem(name, item.price)} aria-label="Agregar uno">+</button>
                    </div>
                  )}
                  
                  <button type="button" className="cart-row-remove" onClick={() => removeAll(name)}>Quitar</button>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-foot">
          <div className="cart-total-row"><span>Total</span><span>RD${cartTotal}</span></div>
          <button 
            className="cart-send" 
            onClick={handleSendWhatsAppOrder} 
            disabled={Object.keys(cart).length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a4.48 4.48 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L0 24l6.302-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0"/></svg>
            Enviar pedido por WhatsApp
          </button>
          <button className="cart-clear" onClick={clearCart}>Vaciar carrito</button>
        </div>
      </aside>

      {/* CART FAB */}
      <button className="cart-fab" onClick={() => setIsCartOpen(true)} aria-label="Ver carrito">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <span className="wa-t">Mi pedido</span>
        <span className={`cart-fab-badge ${cartCount === 0 ? 'zero' : ''}`}>{cartCount}</span>
      </button>
    </>
  );
}

export default App;
