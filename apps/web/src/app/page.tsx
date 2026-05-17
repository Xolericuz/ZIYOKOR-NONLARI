'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, products, bakeries, drivers, type Product, type Order } from '@/lib/store';

const BREAD_IMG = 'https://i.ibb.co/ksDcZym7/file-000000003cfc720aa9e546e0e03b390d.png';

export default function HomePage() {
  const {
    user, setUser, cart, addToCart, removeFromCart, updateQuantity, clearCart,
    orders, placeOrder, liveOrders, updateLiveOrder, userLocation, setLocation,
    nextOrderId,
  } = useStore();

  const [role, setRole] = useState<'customer' | 'seller' | 'driver' | 'admin'>('customer');
  const [name, setName] = useState('Xoleric');
  const [phone, setPhone] = useState('+998993921157');
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState('Namangan shahar');
  const [toast, setToast] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 40.996, lng: 71.67 }),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocation({ lat: 40.996, lng: 71.67 });
    }
  }, [setLocation]);

  // Simulated real-time order flow
  useEffect(() => {
    if (liveOrders.length === 0) return;
    const latest = liveOrders[0];
    if (latest.status !== 'pending') return;
    const t1 = setTimeout(() => {
      updateLiveOrder(latest.id, 'accepted');
      showToast(`🔵 #${latest.id} buyurtma qabul qilindi!`);
    }, 3000);
    const t2 = setTimeout(() => updateLiveOrder(latest.id, 'baking'), 8000);
    const t3 = setTimeout(() => updateLiveOrder(latest.id, 'ready'), 15000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [liveOrders, updateLiveOrder, showToast]);

  const handleLogin = () => {
    setUser({ id: `${role}_${Date.now()}`, name, phone, role });
  };

  const handleLogout = () => {
    setUser(null);
    clearCart();
  };

  if (!user) {
    return <LoginScreen role={role} setRole={setRole} name={name} setName={setName} phone={phone} setPhone={setPhone} onLogin={handleLogin} />;
  }

  const tabs = user.role === 'customer' ? ['🍞 Nonlar', '📍 Nonvoyxona', '📦 Buyurtmalar', '⚙️ Sozlamalar'] :
    user.role === 'seller' ? ['📊 Dashboard', '🍞 Nonlarim', '📋 Tarix', '⚙️ Sozlamalar'] :
    user.role === 'driver' ? ['🚚 Yetkazish', '📋 Tarix', '⚙️ Sozlamalar'] :
    ['📊 Monitor', '👥 Foydalanuvchilar', '⚙️ Sozlamalar'];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Background orbs */}
      <div style={{ position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0 }}>
        <div style={{ position:'absolute',width:700,height:700,borderRadius:'50%',background:'rgba(212,165,116,0.04)',top:-200,right:-200,filter:'blur(120px)',animation:'orb1 25s ease-in-out infinite' }} />
        <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'rgba(232,106,58,0.03)',bottom:-150,left:-150,filter:'blur(120px)',animation:'orb2 30s ease-in-out infinite' }} />
      </div>

      {/* Nav */}
      <nav style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 20px',background:'rgba(10,8,6,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.08)',position:'sticky',top:0,zIndex:100 }}>
        <div style={{fontSize:'1rem',fontWeight:700,color:'#fff'}}>ZIYOKOR <span style={{color:'var(--gold)'}}>NONLARI</span></div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:'0.65rem',padding:'3px 10px',borderRadius:100,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--gold)'}}>
            {user.role === 'customer' ? '🛒 Xaridor' : user.role === 'seller' ? '🏪 Nonvoy' : user.role === 'driver' ? '🚚 Haydovchi' : '⚙️ Admin'}
          </span>
          <span style={{fontSize:'0.8rem',color:'var(--text-dim)'}}>{user.name}</span>
          <button onClick={handleLogout} style={{padding:'5px 12px',borderRadius:100,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-dim)',fontSize:'0.7rem',cursor:'pointer',fontFamily:'inherit'}}>Chiqish</button>
        </div>
      </nav>

      {/* Tab bar */}
      <div style={{display:'flex',background:'rgba(255,255,255,0.02)',borderBottom:'1px solid rgba(255,255,255,0.08)',overflowX:'auto',position:'sticky',top:48,zIndex:99}}>
        {tabs.map((t,i) => (
          <button key={i} onClick={() => setTab(i)} style={{padding:'10px 18px',fontSize:'0.72rem',fontWeight:500,color:tab===i?'var(--gold)':'var(--text-dim)',background:'none',border:'none',borderBottom:`2px solid ${tab===i?'var(--gold)':'transparent'}',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'inherit'}}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{padding:16,maxWidth:1200,margin:'0 auto',width:'100%'}}>
        {user.role === 'customer' && (
          <>
            {tab === 0 && <CustomerProducts search={search} setSearch={setSearch} filterCat={filterCat} setFilterCat={setFilterCat} products={products} cart={cart} addToCart={addToCart} favorites={favorites} setFavorites={setFavorites} showToast={showToast} />}
            {tab === 1 && <CustomerBakeries userLocation={userLocation} />}
            {tab === 2 && <CustomerOrders orders={orders} />}
            {tab === 3 && <Settings user={user} showToast={showToast} />}
          </>
        )}
        {user.role === 'seller' && (
          <>
            {tab === 0 && <SellerDashboard liveOrders={liveOrders} updateLiveOrder={updateLiveOrder} drivers={drivers} showToast={showToast} />}
            {tab === 1 && <SellerProducts />}
            {tab === 2 && <SellerHistory liveOrders={liveOrders} />}
            {tab === 3 && <Settings user={user} showToast={showToast} />}
          </>
        )}
        {user.role === 'driver' && (
          <>
            {tab === 0 && <DriverDeliveries liveOrders={liveOrders} updateLiveOrder={updateLiveOrder} user={user} drivers={drivers} showToast={showToast} />}
            {tab === 1 && <DriverHistory liveOrders={liveOrders} user={user} />}
            {tab === 2 && <Settings user={user} showToast={showToast} />}
          </>
        )}
        {user.role === 'admin' && (
          <>
            {tab === 0 && <AdminMonitor liveOrders={liveOrders} />}
            {tab === 1 && <AdminUsers />}
            {tab === 2 && <Settings user={user} showToast={showToast} />}
          </>
        )}
      </div>

      {/* Cart FAB (customer only) */}
      {user.role === 'customer' && (
        <button onClick={() => setShowCart(true)} style={{position:'fixed',bottom:80,right:16,zIndex:50,width:54,height:54,borderRadius:'50%',background:'linear-gradient(135deg,#b8854a,var(--gold))',color:'#fff',border:'none',fontSize:'1.2rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px var(--gold-dim)'}}>
          🛒
          {cart.reduce((s,c) => s + c.quantity, 0) > 0 && (
            <span style={{position:'absolute',top:-4,right:-4,background:'var(--accent)',color:'#fff',width:20,height:20,borderRadius:'50%',fontSize:'0.6rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{cart.reduce((s,c) => s + c.quantity, 0)}</span>
          )}
        </button>
      )}

      {/* Cart Drawer */}
      {showCart && <CartDrawer cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); setShowOrderModal(true); }} />}

      {/* Order Modal */}
      {showOrderModal && <OrderModal cart={cart} total={cart.reduce((s,c) => s + c.price * c.quantity, 0)} address={address} setAddress={setAddress} onPlace={() => { if (!cart.length) return; placeOrder(address); setShowOrderModal(false); showToast('🎉 Buyurtma qabul qilindi!'); }} onClose={() => setShowOrderModal(false)} />}

      {/* Toast */}
      {toast && <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:'rgba(16,12,8,0.95)',border:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(20px)',color:'#fff',borderRadius:100,padding:'10px 22px',fontSize:'0.8rem',zIndex:500,boxShadow:'0 8px 30px rgba(0,0,0,0.4)',whiteSpace:'nowrap',animation:'fadeIn 0.3s ease'}}>{toast}</div>}

      <style>{`
        @keyframes orb1{0%,100%{transform:translate(0,0)}40%{transform:translate(-80px,100px)}70%{transform:translate(60px,-40px)}}
        @keyframes orb2{0%,100%{transform:translate(0,0)}35%{transform:translate(100px,-80px)}65%{transform:translate(-40px,60px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ====== LOGIN SCREEN ======
function LoginScreen({ role, setRole, name, setName, phone, setPhone, onLogin }: any) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0806'}}>
      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,padding:'40px 36px',maxWidth:380,width:'90vw',textAlign:'center'}}>
        <h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:4}}>ZIYOKOR <span style={{color:'var(--gold)'}}>NONLARI</span></h1>
        <p style={{color:'var(--text-dim)',fontSize:'0.85rem',marginBottom:24}}>Non marketplace platformasi</p>
        <select value={role} onChange={e => setRole(e.target.value)} style={{width:'100%',padding:'12px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#fff',fontSize:'0.9rem',outline:'none',marginBottom:12,fontFamily:'inherit'}}>
          <option value="customer" style={{background:'#0a0806'}}>🛒 Xaridor</option>
          <option value="seller" style={{background:'#0a0806'}}>🏪 Nonvoy</option>
          <option value="driver" style={{background:'#0a0806'}}>🚚 Yetkazib beruvchi</option>
          <option value="admin" style={{background:'#0a0806'}}>⚙️ Administrator</option>
        </select>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ismingiz" style={{width:'100%',padding:'12px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#fff',fontSize:'0.9rem',outline:'none',marginBottom:12,fontFamily:'inherit'}} />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon" style={{width:'100%',padding:'12px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#fff',fontSize:'0.9rem',outline:'none',marginBottom:20,fontFamily:'inherit'}} />
        <button onClick={onLogin} style={{width:'100%',padding:14,background:'linear-gradient(135deg,#b8854a,var(--gold))',border:'none',borderRadius:12,color:'#fff',fontSize:'0.95rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Kirish →</button>
      </div>
    </div>
  );
}

// ====== CUSTOMER: PRODUCTS ======
function CustomerProducts({ search, setSearch, filterCat, setFilterCat, products, cart, addToCart, favorites, setFavorites, showToast }: any) {
  const filtered = products.filter((p: Product) => {
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>🍞 Nonlar</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>30 xil turdagi mazali nonlar</div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Non qidirish..." style={{flex:1,padding:'10px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:100,color:'#fff',fontSize:'0.82rem',outline:'none',fontFamily:'inherit'}} />
      </div>
      <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
        {[{k:'all',v:'🏠 Barchasi'},{k:'tandir',v:'🔥 Tandir'},{k:'premium',v:'⭐ Premium'},{k:'qandol',v:'🍞 Qandol'},{k:'sog-lom',v:'🌿 Sog\'lom'},{k:'maxsus',v:'✨ Maxsus'}].map(f => (
          <button key={f.k} onClick={() => setFilterCat(f.k)} style={{padding:'6px 16px',borderRadius:100,border:'1px solid rgba(255,255,255,0.08)',background:filterCat===f.k?'rgba(212,165,116,0.15)':'rgba(255,255,255,0.05)',color:filterCat===f.k?'var(--gold)':'var(--text-dim)',fontSize:'0.7rem',cursor:'pointer',fontFamily:'inherit',fontWeight:500}}>{f.v}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
        {filtered.map((p: Product) => {
          const inCart = cart.find((c: any) => c.id === p.id);
          const badgeColor = p.badge.includes('Premium')?'rgba(212,165,116,0.9)':p.badge.includes('Best')?'rgba(232,106,58,0.9)':p.badge.includes('Organik')?'rgba(100,200,100,0.9)':p.badge.includes('Yangi')?'rgba(100,180,255,0.9)':'rgba(255,200,50,0.9)';
          return (
            <div key={p.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'all 0.3s'}}
                 onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                 onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{position:'relative',width:'100%',aspectRatio:1,overflow:'hidden',background:'#100a04'}}>
                {p.badge && <span style={{position:'absolute',top:8,left:8,padding:'3px 10px',borderRadius:100,fontSize:'0.6rem',fontWeight:600,color:'#fff',background:badgeColor}}>{p.badge}</span>}
                <img src={BREAD_IMG} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{padding:'10px 12px 12px'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#fff',marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:'0.63rem',color:'var(--text-dim)',marginBottom:8,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.desc}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'0.9rem',fontWeight:700,color:'var(--gold)'}}>{p.price.toLocaleString()} <sub style={{fontSize:'0.55rem',color:'var(--text-dim)',fontWeight:400}}>so'm</sub></span>
                  <button onClick={() => { addToCart(p); showToast(`✅ ${p.name} savatga qo'shildi`); }} style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,var(--gold),#b8854a)',border:'none',color:'#fff',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{inCart ? '✓' : '+'}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ====== CUSTOMER: BAKERIES ======
function CustomerBakeries({ userLocation }: any) {
  const dist = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; const dLat = (lat2-lat1)*Math.PI/180; const dLng = (lng2-lng1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  };

  const sorted = !userLocation ? bakeries : [...bakeries].map(b => ({...b, d: parseFloat(dist(userLocation.lat, userLocation.lng, b.lat, b.lng))})).sort((a,b) => a.d - b.d);

  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📍 Yaqin nonvoyxonalar</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>{userLocation ? 'GPS orqali eng yaqin nonvoylarni toping' : '📍 GPS aniqlanmoqda...'}</div>
      {sorted.map((b: any) => (
        <div key={b.id} style={{display:'flex',alignItems:'center',gap:14,marginBottom:8,padding:'14px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,cursor:'pointer'}}>
          <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#1a1006,#2a1a0a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>🏪</div>
          <div style={{flex:1}}>
            <div style={{fontSize:'0.85rem',fontWeight:600,color:'#fff'}}>{b.name}</div>
            <div style={{fontSize:'0.7rem',color:'var(--text-dim)',marginTop:2}}>{b.address} · ⭐ {b.rating} · {b.orders} ta</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'0.7rem',color:'var(--gold)',fontWeight:600}}>{b.d || '—'} km</div>
            <div style={{fontSize:'0.6rem',padding:'3px 8px',borderRadius:100,fontWeight:600,background:b.status==='open'?'rgba(76,175,80,0.15)':'rgba(255,107,107,0.15)',color:b.status==='open'?'#4caf50':'#ff6b6b',marginTop:2}}>{b.status==='open'?'🔓 Ish vaqti':'🔒 Yopiq'}</div>
          </div>
        </div>
      ))}
      {/* Mini map */}
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,height:200,display:'flex',alignItems:'center',justifyContent:'center',marginTop:16}}>
        <div style={{textAlign:'center',color:'var(--text-dim)'}}><span style={{fontSize:'3rem',display:'block',marginBottom:8,opacity:0.4}}>🗺️</span>GPS xarita integratsiyasi (Leaflet + OpenStreetMap)</div>
      </div>
    </>
  );
}

// ====== CUSTOMER: ORDERS ======
function CustomerOrders({ orders }: any) {
  const statusInfo: Record<string, string> = { pending:'🟡 Kutilyapti', accepted:'🔵 Qabul qilindi', baking:'🟠 Tayyorlanmoqda', ready:'✅ Tayyor', delivering:'🟢 Yetkazilmoqda', delivered:'✅ Yetkazildi', rejected:'🔴 Bekor qilindi' };
  if (!orders.length) return <div style={{textAlign:'center',padding:60,color:'var(--text-dim)'}}>📦 Hali buyurtma yo'q</div>;
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📦 Buyurtmalarim</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Barcha buyurtmalaringiz</div>
      {[...orders].reverse().map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
            <span style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>#{o.id} · {o.bakery}</span>
            <span style={{fontSize:'0.63rem',padding:'3px 10px',borderRadius:100,fontWeight:600,
              background: o.status==='pending'?'rgba(255,193,7,0.15)':o.status==='accepted'?'rgba(66,165,245,0.15)':o.status==='baking'?'rgba(212,165,116,0.15)':o.status==='delivering'?'rgba(76,175,80,0.15)':o.status==='delivered'?'rgba(76,175,80,0.25)':'rgba(255,107,107,0.15)',
              color: o.status==='pending'?'#ffc107':o.status==='accepted'?'#42a5f5':o.status==='baking'?'var(--gold)':o.status==='delivering'?'#4caf50':o.status==='delivered'?'#66bb6a':'#ff6b6b'
            }}>{statusInfo[o.status]||o.status}</span>
          </div>
          <div style={{fontSize:'0.82rem',color:'#fff',marginBottom:4}}>{o.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--gold)',marginBottom:4}}>{o.total.toLocaleString()} so'm</div>
          <div style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>📍 {o.address} · {new Date(o.time).toLocaleString('uz-UZ')}</div>
          {o.driver && (
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8,padding:'8px 10px',background:'rgba(255,255,255,0.05)',borderRadius:8}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'var(--gold-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem'}}>🚚</div>
              <div><div style={{fontSize:'0.72rem',color:'#fff'}}>{o.driver.name}</div><div style={{fontSize:'0.62rem',color:'var(--text-dim)'}}>{o.driver.phone}</div></div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ====== SELLER: DASHBOARD ======
function SellerDashboard({ liveOrders, updateLiveOrder, drivers, showToast }: any) {
  const activeOrders = liveOrders.filter((o: Order) => o.status !== 'delivered' && o.status !== 'rejected');
  const totalRevenue = activeOrders.reduce((s: number, o: Order) => s + o.total, 0);

  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📊 Nonvoyxonam</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Real-time buyurtmalar va statistika</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:10,marginBottom:16}}>
        {[
          {num:activeOrders.length, lbl:'Jonli buyurtma'},
          {num:totalRevenue.toLocaleString(), lbl:'Kunlik daromad'},
          {num:bakeries.length, lbl:'Nonvoyxona'},
          {num:drivers.filter((d:any) => d.status==='free').length, lbl:'Bo\'sh haydovchi'},
        ].map((s,i) => (
          <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:14,textAlign:'center'}}>
            <div style={{fontSize:'1.3rem',fontWeight:700,color:'var(--gold)'}}>{s.num}</div>
            <div style={{fontSize:'0.63rem',color:'var(--text-dim)',marginTop:2}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h3 style={{fontSize:'0.85rem',color:'#fff'}}>🟢 Jonli buyurtmalar</h3>
        <span style={{fontSize:'0.68rem',color:'var(--gold)'}}>{activeOrders.length} ta</span>
      </div>
      {!activeOrders.length ? (
        <div style={{textAlign:'center',padding:40,color:'var(--text-dim)'}}>⏳ Yangi buyurtmalar kelishini kuting...</div>
      ) : activeOrders.map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid ' + (o.status==='pending'?'var(--gold)':'rgba(255,255,255,0.08)'),borderRadius:16,padding:'14px 16px',marginBottom:10,animation:'fadeIn 0.3s ease'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>#{o.id} · {o.userName}</span>
            <span style={{fontSize:'0.63rem',color:'var(--text-dim)'}}>{new Date(o.time).toLocaleTimeString('uz-UZ')}</span>
          </div>
          <div style={{fontSize:'0.8rem',color:'#fff',marginBottom:4}}>{o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--gold)',marginBottom:4}}>{o.total.toLocaleString()} so'm</div>
          <div style={{fontSize:'0.68rem',color:'var(--text-dim)',marginBottom:10}}>📍 {o.address} · 📞 {o.userPhone}</div>
          <div style={{display:'flex',gap:8}}>
            {o.status === 'pending' && <>
              <button onClick={() => { updateLiveOrder(o.id, 'accepted'); showToast(`✅ #${o.id} qabul qilindi`); }} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'#4caf50',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✅ Qabul qilish</button>
              <button onClick={() => { updateLiveOrder(o.id, 'rejected'); showToast(`❌ #${o.id} rad etildi`); }} style={{padding:'8px 16px',borderRadius:100,border:'1px solid rgba(255,107,107,0.3)',background:'transparent',color:'#ff6b6b',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>❌ Rad etish</button>
            </>}
            {o.status === 'accepted' && <button onClick={() => updateLiveOrder(o.id, 'baking')} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'var(--gold)',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>🔥 Tayyorlanmoqda</button>}
            {o.status === 'baking' && <button onClick={() => updateLiveOrder(o.id, 'ready')} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'var(--gold)',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✅ Tayyor</button>}
            {o.status === 'ready' && <button onClick={() => { const free = drivers.find((d:any) => d.status === 'free'); if (!free) { showToast('⚠️ Bo\'sh haydovchi yo\'q'); return; } updateLiveOrder(o.id, 'delivering', { name: free.name, phone: free.phone }); showToast(`🚚 ${free.name} tayinlandi`); }} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'#42a5f5',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>🚚 Haydovchi tayinlash</button>}
            {o.status === 'delivering' && <span style={{fontSize:'0.72rem',color:'#4caf50'}}>🟢 Haydovchi yo'lda</span>}
          </div>
        </div>
      ))}
    </>
  );
}

// ====== SELLER: PRODUCTS ======
function SellerProducts() {
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>🍞 Mening nonlarim</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>30 xil non mahsulotlari</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
        {products.map((p: Product) => (
          <div key={p.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden'}}>
            <div style={{width:'100%',aspectRatio:1,overflow:'hidden',background:'#100a04'}}>
              <img src={BREAD_IMG} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{padding:'10px 12px 12px'}}>
              <div style={{fontSize:'0.78rem',fontWeight:600,color:'#fff',marginBottom:2}}>{p.name}</div>
              <div style={{fontSize:'0.9rem',fontWeight:700,color:'var(--gold)'}}>{p.price.toLocaleString()} <sub style={{fontSize:'0.55rem',color:'var(--text-dim)',fontWeight:400}}>so'm</sub></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ====== SELLER: HISTORY ======
function SellerHistory({ liveOrders }: any) {
  const history = liveOrders.filter((o: Order) => o.status === 'delivered' || o.status === 'rejected');
  if (!history.length) return <div style={{textAlign:'center',padding:60,color:'var(--text-dim)'}}>📋 Tarix bo'sh</div>;
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📋 Buyurtmalar tarixi</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Barcha bajarilgan buyurtmalar</div>
      {history.reverse().map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>#{o.id}</span>
            <span style={{fontSize:'0.63rem',padding:'3px 10px',borderRadius:100,fontWeight:600,background:o.status==='delivered'?'rgba(76,175,80,0.15)':'rgba(255,107,107,0.15)',color:o.status==='delivered'?'#4caf50':'#ff6b6b'}}>{o.status==='delivered'?'✅ Yetkazildi':'❌ Bekor qilindi'}</span>
          </div>
          <div style={{fontSize:'0.8rem',color:'#fff',margin:'6px 0'}}>{o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--gold)'}}>{o.total.toLocaleString()} so'm</div>
          <div style={{fontSize:'0.65rem',color:'var(--text-dim)',marginTop:4}}>{new Date(o.time).toLocaleString('uz-UZ')}</div>
        </div>
      ))}
    </>
  );
}

// ====== DRIVER: DELIVERIES ======
function DriverDeliveries({ liveOrders, updateLiveOrder, user, drivers, showToast }: any) {
  const available = liveOrders.filter((o: Order) => o.status === 'ready' && !o.driver);
  const myTasks = liveOrders.filter((o: Order) => o.driver && o.driver.name === user.name && o.status === 'delivering');

  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>🚚 Yetkazib berish</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Yangi topshiriqlar va yo'nalishlar</div>

      <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:10}}>🆕 Mavjud topshiriqlar</h3>
      {!available.length ? <div style={{color:'var(--text-dim)',fontSize:'0.78rem',marginBottom:16}}>⏳ Yangi topshiriq kelishini kuting...</div> :
       available.map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid var(--gold)',borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{fontSize:'0.8rem',color:'#fff',marginBottom:4}}>#{o.id}: {o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.7rem',color:'var(--text-dim)',marginBottom:4}}>📍 {o.address}</div>
          <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--gold)',marginBottom:8}}>{o.total.toLocaleString()} so'm</div>
          <button onClick={() => { updateLiveOrder(o.id, 'delivering', { name: user.name, phone: user.phone }); showToast('🚚 Yuk olindi'); }} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'#4caf50',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>🚚 Olish</button>
        </div>
      ))}

      <h3 style={{fontSize:'0.82rem',color:'#fff',margin:'16px 0 10px'}}>🟢 Mening yetkazishlarim</h3>
      {!myTasks.length ? <div style={{color:'var(--text-dim)',fontSize:'0.78rem'}}>Yo'q</div> :
       myTasks.map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{fontSize:'0.8rem',color:'#fff',marginBottom:4}}>#{o.id}: {o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.7rem',color:'var(--text-dim)',marginBottom:4}}>📍 {o.address}</div>
          <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--gold)',marginBottom:8}}>{o.total.toLocaleString()} so'm</div>
          <button onClick={() => { updateLiveOrder(o.id, 'delivered'); showToast('✅ Yetkazildi'); }} style={{padding:'8px 16px',borderRadius:100,border:'none',background:'var(--gold)',color:'#fff',fontSize:'0.7rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✅ Yetkazildi</button>
        </div>
      ))}

      {/* Map */}
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,height:200,display:'flex',alignItems:'center',justifyContent:'center',marginTop:16}}>
        <div style={{textAlign:'center',color:'var(--text-dim)'}}><span style={{fontSize:'3rem',display:'block',marginBottom:8,opacity:0.4}}>🗺️</span>GPS xarita · Yo'nalish ko'rsatish<br/><span style={{fontSize:'0.65rem'}}>(Leaflet + OpenStreetMap)</span></div>
      </div>
    </>
  );
}

// ====== DRIVER: HISTORY ======
function DriverHistory({ liveOrders, user }: any) {
  const history = liveOrders.filter((o: Order) => o.driver && o.driver.name === user.name && o.status === 'delivered');
  if (!history.length) return <div style={{textAlign:'center',padding:60,color:'var(--text-dim)'}}>📋 Tarix bo'sh</div>;
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📋 Yetkazish tarixi</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Barcha yetkazilgan buyurtmalar</div>
      {history.reverse().map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>#{o.id}</span>
            <span style={{fontSize:'0.63rem',padding:'3px 10px',borderRadius:100,fontWeight:600,background:'rgba(76,175,80,0.15)',color:'#4caf50'}}>✅ Yetkazildi</span>
          </div>
          <div style={{fontSize:'0.8rem',color:'#fff',margin:'6px 0'}}>{o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')}</div>
          <div style={{fontSize:'0.7rem',color:'var(--text-dim)'}}>📍 {o.address}</div>
          <div style={{fontSize:'0.65rem',color:'var(--text-dim)',marginTop:4}}>{new Date(o.time).toLocaleString('uz-UZ')}</div>
        </div>
      ))}
    </>
  );
}

// ====== ADMIN: MONITOR ======
function AdminMonitor({ liveOrders }: any) {
  const active = liveOrders.filter((o: Order) => o.status !== 'delivered' && o.status !== 'rejected');
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>📊 Admin monitor</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Platformani boshqarish</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:20}}>
        {[
          {icon:'👥',val:bakeries.length+drivers.length+5,lbl:'Foydalanuvchilar'},
          {icon:'🏪',val:bakeries.length,lbl:'Nonvoyxonalar'},
          {icon:'🚚',val:drivers.length,lbl:'Haydovchilar'},
          {icon:'📦',val:active.length,lbl:'Faol buyurtma'},
          {icon:'💰',val:active.reduce((s:number,o:Order) => s+o.total,0).toLocaleString(),lbl:'Jonli daromad'},
          {icon:'⚡',val:'100+',lbl:'Zakaz/soniya'},
        ].map((s,i) => (
          <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:20,textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>{s.val}</div>
            <div style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:12}}>🟢 Barcha jonli buyurtmalar</h3>
      {!active.length ? <div style={{color:'var(--text-dim)',fontSize:'0.8rem'}}>Faol buyurtma yo'q</div> :
       active.map((o: Order) => (
        <div key={o.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:12,marginBottom:8,fontSize:'0.75rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{color:'#fff'}}>#{o.id} · {o.userName} → {o.bakery}</span>
            <span style={{fontSize:'0.6rem',padding:'2px 8px',borderRadius:100,fontWeight:600,background:'rgba(212,165,116,0.15)',color:'var(--gold)'}}>{o.status}</span>
          </div>
          <div style={{color:'var(--text-dim)'}}>{o.items.map((i:any) => `${i.name} x${i.quantity}`).join(', ')} · {o.total.toLocaleString()} so'm</div>
        </div>
      ))}
    </>
  );
}

// ====== ADMIN: USERS ======
function AdminUsers() {
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>👥 Foydalanuvchilar</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Barcha xaridorlar, sotuvchilar va haydovchilar</div>

      <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:10}}>🏪 Nonvoyxonalar</h3>
      {bakeries.map((b: any) => (
        <div key={b.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:4}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>🏪 {b.name}</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{b.address} · ⭐{b.rating} · {b.orders} ta</div></div>
          <span style={{fontSize:'0.6rem',padding:'3px 8px',borderRadius:100,fontWeight:600,background:b.status==='open'?'rgba(76,175,80,0.15)':'rgba(255,107,107,0.15)',color:b.status==='open'?'#4caf50':'#ff6b6b'}}>{b.status==='open'?'🔓 Ish vaqti':'🔒 Yopiq'}</span>
        </div>
      ))}

      <h3 style={{fontSize:'0.82rem',color:'#fff',margin:'16px 0 10px'}}>🚚 Haydovchilar</h3>
      {drivers.map((d: any) => (
        <div key={d.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:4}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>🚚 {d.name}</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{d.phone} · ⭐{d.rating} · {d.deliveries} ta</div></div>
          <span style={{fontSize:'0.6rem',padding:'3px 8px',borderRadius:100,fontWeight:600,background:d.status==='free'?'rgba(76,175,80,0.15)':'rgba(255,152,0,0.15)',color:d.status==='free'?'#4caf50':'#ff9800'}}>{d.status==='free'?'🟢 Bo\'sh':'🔴 Band'}</span>
        </div>
      ))}

      <h3 style={{fontSize:'0.82rem',color:'#fff',margin:'16px 0 10px'}}>👥 Xaridorlar</h3>
      <div style={{padding:'14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,textAlign:'center',color:'var(--text-dim)',fontSize:'0.8rem'}}>Xaridorlar buyurtma bergandan keyin ro'yxatda ko'rinadi</div>
    </>
  );
}

// ====== SETTINGS ======
function Settings({ user, showToast }: any) {
  return (
    <>
      <div style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:4}}>⚙️ Sozlamalar</div>
      <div style={{color:'var(--text-dim)',fontSize:'0.8rem',marginBottom:16}}>Profil va platforma sozlamalari</div>

      <div style={{marginBottom:20}}>
        <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:10}}>Shaxsiy ma'lumotlar</h3>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:4}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>Ism</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{user.name}</div></div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:4}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>Telefon</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{user.phone}</div></div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>Rol</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{user.role}</div></div>
        </div>
      </div>

      <div style={{marginBottom:20}}>
        <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:10}}>Bildirishnomalar</h3>
        {[{l:'Push bildirishnoma',d:'','on':true},{l:'Buyurtma holati',d:'','on':true}].map((s,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:4}}>
            <div><div style={{fontSize:'0.78rem',color:'#fff'}}>{s.l}</div></div>
            <div onClick={e => e.currentTarget.classList.toggle('on')} style={{width:44,height:24,borderRadius:12,background:s.on?'var(--gold)':'rgba(255,255,255,0.1)',position:'relative',cursor:'pointer',transition:'all 0.3s'}}>
              <div style={{position:'absolute',top:2,left:s.on?22:2,width:20,height:20,borderRadius:'50%',background:'#fff',transition:'all 0.3s'}} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{fontSize:'0.82rem',color:'#fff',marginBottom:10}}>Ma'lumot</h3>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10}}>
          <div><div style={{fontSize:'0.78rem',color:'#fff'}}>Versiya</div><div style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>2.0.0 — Real-time platform</div></div>
        </div>
      </div>
    </>
  );
}

// ====== CART DRAWER ======
function CartDrawer({ cart, removeFromCart, updateQuantity, onClose, onCheckout }: any) {
  return (
    <div style={{position:'fixed',right:0,top:0,bottom:0,width:380,zIndex:300,background:'rgba(12,10,8,0.98)',backdropFilter:'blur(24px)',borderLeft:'1px solid rgba(255,255,255,0.08)',boxShadow:'-12px 0 60px rgba(0,0,0,0.5)',display:'flex',flexDirection:'column',maxWidth:'100vw'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <h3 style={{fontSize:'1rem',color:'#fff'}}>🛒 Savat</h3>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-dim)',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'0.85rem'}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:12}}>
        {!cart.length ? <div style={{textAlign:'center',padding:50,color:'var(--text-dim)'}}>🛒 Savat bo'sh</div> :
         cart.map((item: any) => (
          <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:8,overflow:'hidden',flexShrink:0}}><img src={BREAD_IMG} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.78rem',color:'#fff',fontWeight:500}}>{item.name}</div>
              <div style={{fontSize:'0.7rem',color:'var(--gold)'}}>{(item.price * item.quantity).toLocaleString()} so'm</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <button onClick={() => updateQuantity(item.id, -1)} style={{width:24,height:24,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff',fontSize:'0.72rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
              <span style={{fontSize:'0.78rem',color:'var(--gold)',minWidth:14,textAlign:'center'}}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} style={{width:24,height:24,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff',fontSize:'0.72rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'14px 18px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem',fontWeight:600,color:'#fff',marginBottom:10}}>
          <span>Jami:</span>
          <span style={{color:'var(--gold)'}}>{cart.reduce((s: number, c: any) => s + c.price * c.quantity, 0).toLocaleString()} so'm</span>
        </div>
        <button onClick={onCheckout} disabled={!cart.length} style={{width:'100%',padding:13,background:!cart.length?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#b8854a,var(--gold))',border:'none',borderRadius:100,color:'#fff',fontSize:'0.82rem',fontWeight:600,cursor:!cart.length?'not-allowed':'pointer',fontFamily:'inherit',opacity:!cart.length?0.5:1}}>📦 Buyurtma berish</button>
      </div>
    </div>
  );
}

// ====== ORDER MODAL ======
function OrderModal({ cart, total, address, setAddress, onPlace, onClose }: any) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{background:'rgba(16,12,8,0.97)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,maxWidth:430,width:'90vw',padding:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h2 style={{fontSize:'1.1rem',color:'#fff'}}>📦 Buyurtmani tasdiqlash</h2>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-dim)',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'0.8rem'}}>✕</button>
        </div>
        {cart.map((item: any) => (
          <div key={item.id} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'0.82rem',color:'#fff'}}>
            <span>{item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
          </div>
        ))}
        <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',fontSize:'0.9rem',fontWeight:600,color:'var(--gold)',borderTop:'1px solid rgba(255,255,255,0.08)',marginTop:4}}>
          <span>Jami</span><span>{total.toLocaleString()} so'm</span>
        </div>
        <div style={{margin:'12px 0'}}>
          <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Manzil" rows={3} style={{width:'100%',padding:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#fff',fontSize:'0.78rem',outline:'none',resize:'none',fontFamily:'inherit',minHeight:60}} />
        </div>
        <button onClick={onPlace} style={{width:'100%',padding:14,background:'linear-gradient(135deg,#b8854a,var(--gold))',border:'none',borderRadius:12,color:'#fff',fontSize:'0.85rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✅ Buyurtma berish</button>
      </div>
    </div>
  );
}
