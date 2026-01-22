const { useState, useEffect, useMemo } = React;

const App = () => {
    const [activeView, setActiveView] = useState('home'); 
    const [products, setProducts] = useState([]); 
    const [promocodes, setPromocodes] = useState([]); 
    const [appliedPromo, setAppliedPromo] = useState(null);
    
    // Фільтри та сортування
    const [filterBrands, setFilterBrands] = useState([]); 
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedInfoPage, setSelectedInfoPage] = useState(null);
    const [cart, setCart] = useState([]);
    
    // Технічні стани
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassInput, setAdminPassInput] = useState("");
    
    const [filterCategory, setFilterCategory] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    
    const [wishlist, setWishlist] = useState([]);
    const [viewedItems, setViewedItems] = useState([]);

    // Імпорт глобальних компонентів
    const Icons = window.Icons;
    const Header = window.Header;
    const AdminPanel = window.AdminPanel;
    const ProductPage = window.ProductPage;
    const WishlistView = window.WishlistView;
    const CartView = window.CartView;
    const CheckoutView = window.CheckoutView;
    const InfoPage = window.InfoPage;
    const HeroSlider = window.HeroSlider;
    const ProductCard = window.ProductCard;
    const MobileBottomNav = window.MobileBottomNav; // <-- Додали це!

    // DB INIT
    let db = null; try { if (window.firebase && firebase.apps.length) db = firebase.firestore(); } catch (e) {}

    // --- INITIALIZATION ---
    useEffect(() => {
        const verified = localStorage.getItem('ageVerified_v2'); if (verified === 'true') setIsAgeVerified(true);
        const savedWishlist = localStorage.getItem('ns_wishlist'); if(savedWishlist) setWishlist(JSON.parse(savedWishlist));
        const savedHistory = localStorage.getItem('ns_history'); if(savedHistory) setViewedItems(JSON.parse(savedHistory));

        let unsubscribeProducts = () => {}; let unsubscribePromos = () => {};
        if (db) {
             unsubscribeProducts = db.collection("products").onSnapshot((snapshot) => { 
                 if (snapshot.empty && window.INITIAL_PRODUCTS_SEED) { 
                     // Seed logic removed
                 } else { 
                     const loadedProducts = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})); 
                     loadedProducts.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)); 
                     setProducts(loadedProducts); 
                 } 
             });
             unsubscribePromos = db.collection("promocodes").onSnapshot((snapshot) => { setPromocodes(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); });
        } else {
            const saved = localStorage.getItem('products'); 
            if (saved) setProducts(JSON.parse(saved)); 
            else if (window.INITIAL_PRODUCTS_SEED) setProducts(window.INITIAL_PRODUCTS_SEED);
            setPromocodes([{id: 'demo', code: 'LOVE', type: 'percent', value: 10, maxUses: 999, usedCount: 0}]);
        }
        
        window.history.replaceState({ view: 'home' }, '');
        window.addEventListener('popstate', (event) => { const state = event.state; if (state) { setActiveView(state.view); if(state.productId) setSelectedProductId(state.productId); if(state.infoPage) setSelectedInfoPage(state.infoPage); if (state.category !== undefined) setFilterCategory(state.category); setIsMobileMenuOpen(false); setShowAdminLogin(false); } else { setActiveView('home'); } });
        
        if (window.CONFIG?.GA_MEASUREMENT_ID && !window.dataLayer) {
             const script = document.createElement('script'); script.src = `https://www.googletagmanager.com/gtag/js?id=${window.CONFIG.GA_MEASUREMENT_ID}`; script.async = true; document.head.appendChild(script);
             window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', window.CONFIG.GA_MEASUREMENT_ID);
        }

        return () => { unsubscribeProducts(); unsubscribePromos(); };
    }, []);

    useEffect(() => { if (products.length > 0 && !db) try { localStorage.setItem('products', JSON.stringify(products)); } catch (e) {} }, [products]);
    useEffect(() => { localStorage.setItem('ns_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
    useEffect(() => { localStorage.setItem('ns_history', JSON.stringify(viewedItems)); }, [viewedItems]);

    // --- ACTIONS ---
    const changeRoute = (view, params = {}) => { window.history.pushState({ view, ...params }, ''); setActiveView(view); if (params.productId) { setSelectedProductId(params.productId); addToHistory(params.productId); } if (params.infoPage) setSelectedInfoPage(params.infoPage); if (params.category !== undefined) setFilterCategory(params.category); setIsMobileMenuOpen(false); window.scrollTo(0, 0); };
    const goBack = () => window.history.back(); const navigateToProduct = (id) => changeRoute('product', { productId: id }); const navigateToInfo = (page) => changeRoute('info', { infoPage: page }); const goHome = () => changeRoute('home', { category: null }); const goToCategory = (cat) => { changeRoute('home', { category: cat }); setTimeout(() => document.getElementById('products-grid')?.scrollIntoView({behavior:'smooth'}), 100); };
    const confirmAge = () => { localStorage.setItem('ageVerified_v2', 'true'); setIsAgeVerified(true); };
    const addToCart = (product) => { const existing = cart.find(item => item.id === product.id); if (existing) { setCart(cart.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item)); } else { setCart([...cart, {...product, qty: 1}]); } };
    const updateQty = (id, delta) => setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
    const clearCart = (success = false) => { if (success && appliedPromo && db) { db.collection("promocodes").doc(appliedPromo.id).update({ usedCount: firebase.firestore.FieldValue.increment(1) }); } setCart([]); setAppliedPromo(null); };
    const toggleWishlist = (id) => { setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
    const addToHistory = (id) => { setViewedItems(prev => { const filtered = prev.filter(i => i !== id); return [id, ...filtered].slice(0, 10); }); };
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const applyPromo = (code) => { const promo = promocodes.find(p => p.code === code.toUpperCase()); if (!promo) { alert("Невірний код"); return; } if (promo.usedCount >= promo.maxUses) { alert("Ліміт використань вичерпано"); return; } setAppliedPromo(promo); };
    const cancelPromo = () => setAppliedPromo(null);
    let discountAmount = 0; if (appliedPromo) { discountAmount = appliedPromo.type === 'percent' ? Math.round(cartTotal * (appliedPromo.value / 100)) : appliedPromo.value; }
    const toggleBrand = (brand) => { if (brand === 'Всі') { setFilterBrands([]); } else { if (filterBrands.includes(brand)) { setFilterBrands(prev => prev.filter(b => b !== brand)); } else { setFilterBrands(prev => [...prev, brand]); } } };

    const displayedProducts = useMemo(() => {
        let result = products.filter(p => p.isVisible !== false);
        if (filterCategory) result = result.filter(p => p.category === filterCategory);
        if (filterBrands.length > 0) result = result.filter(p => filterBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase())));
        if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
        else result.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        return result;
    }, [products, filterCategory, filterBrands, sortBy]);

    if (!isAgeVerified) return (<div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-4"><div className="bg-slate-800 p-8 rounded-3xl max-w-md w-full text-center border border-purple-500/30 shadow-2xl"><div className="mb-6 inline-block p-4 bg-purple-600/20 rounded-full text-purple-400"><span className="text-4xl">🔞</span></div><h2 className="text-2xl font-bold text-white mb-4">Вам виповнилося 18 років?</h2><div className="flex gap-4"><button onClick={() => window.location.href = 'https://google.com'} className="flex-1 py-3 px-4 rounded-xl border border-gray-600 text-gray-300">Ні</button><button onClick={confirmAge} className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-bold">Так, мені 18+</button></div></div></div>);

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 font-sans selection:bg-violet-600 selection:text-white">
            {showAdminLogin && (<div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdminLogin(false)}><div className="bg-slate-800 p-8 rounded-2xl max-w-sm w-full border border-white/10 relative" onClick={e => e.stopPropagation()}><button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><span className="text-xl">✕</span></button><h3 className="text-xl font-bold text-white mb-6 text-center">Вхід в адмінку</h3><input type="password" autoFocus className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white mb-6 outline-none" placeholder="Пароль" value={adminPassInput} onChange={e => setAdminPassInput(e.target.value)}/><button onClick={(e) => { e.preventDefault(); if (adminPassInput === "lux1412") { setIsAdminMode(true); setShowAdminLogin(false); setAdminPassInput(""); } else alert("Невірний пароль!"); }} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">Увійти</button></div></div>)}
            
            <Header goHome={goHome} changeRoute={changeRoute} cart={cart} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} products={products} navigateToProduct={navigateToProduct} navigateToInfo={navigateToInfo} />
            
            <main>
                {isAdminMode ? <AdminPanel products={products} setProducts={setProducts} setEditId={setSelectedProductId} promocodes={promocodes} setPromocodes={setPromocodes} /> : 
                 activeView === 'product' ? <ProductPage product={products.find(p => p.id === selectedProductId)} goBack={goBack} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} viewedItems={viewedItems} products={products} navigateToProduct={navigateToProduct} /> : 
                 activeView === 'wishlist' ? <WishlistView wishlist={wishlist} products={products} navigateToProduct={navigateToProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} /> :
                 activeView === 'cart' ? <CartView cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} changeRoute={changeRoute} cartTotal={cartTotal} promocodes={promocodes} applyPromo={applyPromo} appliedPromo={appliedPromo} cancelPromo={cancelPromo} /> : 
                 activeView === 'checkout' ? <CheckoutView cart={cart} cartTotal={cartTotal} discountAmount={discountAmount} appliedPromo={appliedPromo} goBack={goBack} clearCart={clearCart} changeRoute={changeRoute} /> :
                 activeView === 'info' ? <InfoPage page={selectedInfoPage} goBack={goBack} /> :
                 (<>
                    <HeroSlider />
                    
                    <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Популярні категорії</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{window.CATEGORIES.map(cat => (<button key={cat.name} onClick={() => goToCategory(cat.name)} className={`p-4 rounded-2xl border border-white/10 bg-slate-800 hover:bg-slate-700 transition flex flex-col items-center gap-2 ${filterCategory === cat.name ? 'ring-2 ring-violet-500 bg-slate-700' : ''}`}><span className="text-3xl">{cat.icon}</span><span className="text-sm font-bold">{cat.name}</span></button>))}</div>
                    </div>

                    <div id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-bold text-white">
                                        {filterCategory ? `Категорія: ${filterCategory}` : 'Всі товари'}
                                    </h2>
                                    {filterCategory && (
                                        <button onClick={() => setFilterCategory(null)} className="flex items-center gap-1 text-sm text-violet-400 hover:text-white transition-colors bg-slate-800 px-3 py-1 rounded-full border border-white/10">
                                            ← Всі товари
                                        </button>
                                    )}
                                </div>
                                <div className="relative group min-w-[200px]">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none bg-slate-800 text-white py-3 pl-4 pr-10 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 cursor-pointer text-sm font-bold">
                                        <option value="default">За популярністю</option>
                                        <option value="price-asc">Від дешевих</option>
                                        <option value="price-desc">Від дорогих</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">⬇️</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Фільтр по брендах:</p>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => toggleBrand('Всі')} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filterBrands.length === 0 ? 'bg-white text-black border-white' : 'bg-slate-800 text-gray-400 border-white/10 hover:border-white/30'}`}>Всі</button>
                                    {window.BRANDS.filter(b => b !== 'Всі').map(brand => {
                                        const isActive = filterBrands.includes(brand);
                                        return (<button key={brand} onClick={() => toggleBrand(brand)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${isActive ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20' : 'bg-slate-800 text-gray-300 border-white/10 hover:border-white/30 hover:bg-slate-700'}`}>{brand} {isActive && '✓'}</button>);
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map(product => <ProductCard key={product.id} product={product} navigateToProduct={navigateToProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <div className="text-6xl mb-4">🕵️‍♂️</div>
                                    <h3 className="text-xl font-bold text-white">Товарів не знайдено</h3>
                                    <p className="text-gray-400 mt-2">Спробуйте змінити фільтри</p>
                                    <button onClick={() => {setFilterBrands([]); setFilterCategory(null);}} className="mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition">Скинути фільтри</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>)}
            </main>
            
            {/* FOOTER */}
            <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <window.BrandLogo />
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-white tracking-wide leading-none">NIGHT</span>
                                    <span className="text-xs font-bold text-violet-400 tracking-[0.2em] leading-none">SECRET</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">Ласкаво просимо до Night Secret. Ми дбаємо про вашу конфіденційність та комфорт.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Контакти</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="bg-white/5 p-2 rounded-lg text-white"><Icons.Phone size={18}/></span>
                                    <span>+380 93 123 45 67</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="bg-white/5 p-2 rounded-lg text-blue-400"><Icons.Send size={18}/></span>
                                    <a href="#" className="hover:text-white transition">@night_secret_manager</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="bg-white/5 p-2 rounded-lg text-pink-500"><Icons.Instagram size={18}/></span>
                                    <a href="#" className="hover:text-white transition">@night_secret_shop</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Клієнтам</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><button onClick={() => navigateToInfo('about')} className="hover:text-violet-400 transition text-left">Про нас</button></li>
                                <li><button onClick={() => navigateToInfo('delivery')} className="hover:text-violet-400 transition text-left">Оплата та доставка</button></li>
                                <li><button onClick={() => navigateToInfo('returns')} className="hover:text-violet-400 transition text-left">Повернення та обмін</button></li>
                                <li><button onClick={() => navigateToInfo('privacy')} className="hover:text-violet-400 transition text-left">Політика конфіденційності</button></li>
                                <li><button onClick={() => navigateToInfo('offer')} className="hover:text-violet-400 transition text-left">Договір оферти</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>© 2024 Night Secret. Всі права захищено.</span>
                        <div className="flex items-center gap-2">
                            <span>18+ Тільки для дорослих</span>
                            <button onClick={() => setShowAdminLogin(true)} className="opacity-20 hover:opacity-100 transition p-2"><Icons.Lock size={12} /></button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* MOBILE BOTTOM NAV (Показується тільки на мобільних) */}
            <MobileBottomNav activeView={activeView} changeRoute={changeRoute} cartCount={cart.reduce((a,b)=>a+b.qty,0)} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);