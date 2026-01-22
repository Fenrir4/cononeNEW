const { useState, useEffect } = React;

// --- UTILS ---
window.isVideo = (url) => url && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.startsWith('data:video'));
window.resizeImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width; let height = img.height; const MAX = 800;
                if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } } else { if (height > MAX) { width *= MAX / height; height = MAX; } }
                canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height); resolve(canvas.toDataURL('image/jpeg', 0.6));
            }; img.src = e.target.result;
        }; reader.readAsDataURL(file);
    });
};

// --- ICONS ---
const IconBase = ({ children, size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>);
window.Icons = {
    ShoppingBag: (p) => <IconBase {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></IconBase>,
    Heart: (p) => <IconBase {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></IconBase>,
    X: (p) => <IconBase {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>,
    Star: (p) => <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>,
    Lock: (p) => <IconBase {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>,
    Trash2: (p) => <IconBase {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>,
    Plus: (p) => <IconBase {...p}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>,
    Minus: (p) => <IconBase {...p}><path d="M5 12h14"/></IconBase>,
    Edit2: (p) => <IconBase {...p}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></IconBase>,
    Menu: (p) => <IconBase {...p}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></IconBase>,
    ArrowLeft: (p) => <IconBase {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>,
    ArrowUp: (p) => <IconBase {...p}><path d="m18 15-6-6-6 6"/></IconBase>,
    ArrowDown: (p) => <IconBase {...p}><path d="m6 9 6 6 6-6"/></IconBase>,
    Settings: (p) => <IconBase {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></IconBase>,
    ChevronRight: (p) => <IconBase {...p}><path d="m9 18 6-6-6-6"/></IconBase>,
    ChevronLeft: (p) => <IconBase {...p}><path d="m15 18-6-6 6-6"/></IconBase>,
    Truck: (p) => <IconBase {...p}><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></IconBase>,
    ShieldCheck: (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></IconBase>,
    Flame: (p) => <IconBase {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.7.3 1.9.9 2.9 1.8Z"/></IconBase>,
    LogOut: (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></IconBase>,
    Image: (p) => <IconBase {...p}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconBase>,
    Upload: (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconBase>,
    Check: (p) => <IconBase {...p}><polyline points="20 6 9 17 4 12"/></IconBase>,
    Video: (p) => <IconBase {...p}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></IconBase>,
    Link: (p) => <IconBase {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>,
    Phone: (p) => <IconBase {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></IconBase>,
    Instagram: (p) => <IconBase {...p}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></IconBase>,
    Send: (p) => <IconBase {...p}><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></IconBase>,
    CreditCard: (p) => <IconBase {...p}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></IconBase>,
    Eye: (p) => <IconBase {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></IconBase>,
    EyeOff: (p) => <IconBase {...p}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></IconBase>,
    Copy: (p) => <IconBase {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>,
    PackageX: (p) => <IconBase {...p}><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><path d="m17 13 5 5m-5 0 5-5"/></IconBase>,
    PackageCheck: (p) => <IconBase {...p}><path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><path d="m17 13 5 5m-5 0 5-5"/></IconBase>,
    RefreshCw: (p) => <IconBase {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></IconBase>,
    Tag: (p) => <IconBase {...p}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="3"/></IconBase>,
    Filter: (p) => <IconBase {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></IconBase>,
    ArrowUpDown: (p) => <IconBase {...p}><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></IconBase>,
    Search: (p) => <IconBase {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconBase>,
    TagsOff: (p) => <IconBase {...p}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><line x1="2" x2="22" y1="2" y2="22"/></IconBase>,
    Ticket: (p) => <IconBase {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></IconBase>,
    Play: (p) => <IconBase {...p}><polygon points="5 3 19 12 5 21 5 3"></polygon></IconBase>,
    Home: (p) => <IconBase {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></IconBase>,
    Grid: (p) => <IconBase {...p}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></IconBase>
};

window.BrandLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-white drop-shadow-lg filter">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear)" />
        <path d="M26 12C26 12 22 14 22 20C22 26 26 28 26 28C22.5 30 18 29 15 26C12 23 12 17 15 14C18 11 22.5 10 26 12Z" fill="white"/>
        <path d="M29 16L30.5 19L33.5 19.5L31.5 21.5L32 24.5L29 23L26 24.5L26.5 21.5L24.5 19.5L27.5 19L29 16Z" fill="#FDE047"/>
        <defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#DB2777"/></linearGradient></defs>
    </svg>
);

// --- REUSABLE COMPONENTS ---

window.AddToCartBtn = ({ product, addToCart, variant = 'icon' }) => {
    const [added, setAdded] = useState(false);
    const handleClick = (e) => { e.stopPropagation(); addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };
    if (product.inStock === false) {
        if (variant === 'icon') return <button disabled className="p-3 rounded-xl bg-slate-700 text-gray-500 cursor-not-allowed"><window.Icons.ShoppingBag size={20}/></button>;
        return <button disabled className="flex-1 font-bold py-5 px-8 rounded-2xl bg-slate-700 text-gray-500 cursor-not-allowed flex items-center justify-center gap-3">Немає в наявності</button>;
    }
    if (variant === 'icon') return (<button onClick={handleClick} className={`p-3 rounded-xl transition-all duration-300 z-20 ${added ? 'bg-green-500 text-white shadow-green-500/50 shadow-lg' : 'bg-white/10 hover:bg-violet-600 text-white'}`} title={added ? "Додано" : "В кошик"}>{added ? <window.Icons.Check size={20}/> : <window.Icons.ShoppingBag size={20}/>}</button>);
    return (<button onClick={handleClick} className={`flex-1 font-bold py-5 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${added ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}>{added ? <window.Icons.Check size={24}/> : <window.Icons.ShoppingBag size={24}/>}{added ? 'Додано!' : 'Додати в кошик'}</button>);
};

// ЗМІНЕНО: ІНТЕРВАЛ 10 СЕКУНД (10000)
window.HeroSlider = () => {
    const slides = [
        { id: 1, title: "Відкрий свої таємні бажання", sub: "Найкращі іграшки та аксесуари для твого задоволення", bg: "from-violet-900 to-fuchsia-900" },
        { id: 2, title: "Спекотна зима з Night Secret", sub: "Зігрівайся разом з нашими новинками", bg: "from-red-900 to-orange-900" },
        { id: 3, title: "Безкоштовна доставка", sub: "При замовленні від 2000 грн", bg: "from-blue-900 to-indigo-900" }
    ];
    const [current, setCurrent] = useState(0);
    useEffect(() => { const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 10000); return () => clearInterval(timer); }, []); 
    return (
        <div className="relative overflow-hidden h-[400px] md:h-[500px]">
            {slides.map((slide, index) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center text-center px-4 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'} bg-gradient-to-br ${slide.bg}`}>
                    <div className="max-w-3xl animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">{slide.title}</h1>
                        <p className="text-lg md:text-2xl text-gray-200 mb-8 drop-shadow-md">{slide.sub}</p>
                        <button onClick={() => document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 mx-auto">
                            <window.Icons.ShoppingBag size={20} /> Перейти до каталогу
                        </button>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, idx) => (<button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'}`} />))}
            </div>
        </div>
    );
};

window.ProductCard = ({ product, navigateToProduct, addToCart, wishlist, toggleWishlist }) => {
    const isLiked = wishlist.includes(product.id);
    const hasVideo = product.images && product.images.length > 0 && window.isVideo(product.images[0]);
    return (
        <div className={`group bg-slate-800 rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col h-full relative ${product.inStock === false ? 'grayscale-card' : ''}`} onClick={() => navigateToProduct(product.id)}>
            <div className="relative aspect-[4/5] bg-slate-700 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    hasVideo ? (
                        <div className="relative w-full h-full">
                            <video src={product.images[0]} muted loop autoPlay playsInline className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition"><div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-lg group-hover:scale-110 transition"><window.Icons.Play size={20} fill="currentColor" /></div></div>
                        </div>
                    ) : <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                ) : <div className="w-full h-full flex items-center justify-center bg-slate-800 text-gray-500"><window.Icons.Image size={40}/></div>}
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition z-20 ${isLiked ? 'bg-pink-600 text-white shadow-lg scale-110' : 'bg-black/30 text-white hover:bg-pink-600'}`}><window.Icons.Heart size={18} fill={isLiked ? "currentColor" : "none"} /></button>
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.isHit && <div className="bg-fuchsia-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1"><window.Icons.Flame size={10}/> HIT</div>}
                    {product.isSale && <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1"><window.Icons.Tag size={10}/> АКЦІЯ</div>}
                </div>
                {product.inStock === false && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"><span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded">НЕМАЄ В НАЯВНОСТІ</span></div>}
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">{product.category}</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-300 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.shortDesc}</p>
                <div className="mt-auto flex items-center justify-between">
                    <div><span className="text-2xl font-bold text-white">{product.price} ₴</span>{product.oldPrice > 0 && <span className="text-sm text-gray-500 line-through ml-2">{product.oldPrice} ₴</span>}</div>
                    <window.AddToCartBtn product={product} addToCart={addToCart} />
                </div>
            </div>
        </div>
    );
};

window.RecentlyViewed = ({ viewedItems, products, navigateToProduct }) => {
    if (viewedItems.length === 0) return null;
    const viewedProducts = viewedItems.map(id => products.find(p => p.id === id)).filter(Boolean);
    if (viewedProducts.length === 0) return null;
    return (
        <div className="mt-16 border-t border-white/10 pt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Ви нещодавно переглядали</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {viewedProducts.map(p => (
                    <div key={p.id} onClick={() => navigateToProduct(p.id)} className="min-w-[160px] w-[160px] cursor-pointer group">
                        <div className="aspect-[4/5] rounded-xl bg-slate-800 overflow-hidden mb-2 relative"><img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /></div>
                        <div className="text-sm font-bold text-white truncate">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.price} ₴</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

window.Header = ({ goHome, changeRoute, cart, isMobileMenuOpen, setIsMobileMenuOpen, isAdminMode, setIsAdminMode, products, navigateToProduct, navigateToInfo }) => {
    const [searchQuery, setSearchQuery] = useState(""); const [searchResults, setSearchResults] = useState([]);
    useEffect(() => { if (searchQuery.trim() === "") { setSearchResults([]); return; } const results = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.isVisible !== false); setSearchResults(results); }, [searchQuery, products]);
    return (<nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-20 gap-4"><div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={goHome}><window.BrandLogo /><div className="flex flex-col hidden sm:flex"><span className="text-xl font-black text-white tracking-wide leading-none">NIGHT</span><span className="text-sm font-bold text-violet-400 tracking-[0.2em] leading-none">SECRET</span></div></div><div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-300"><button onClick={goHome} className="hover:text-violet-400 transition">Головна</button><button onClick={() => navigateToInfo('about')} className="hover:text-violet-400 transition">Про нас</button><button onClick={() => changeRoute('wishlist')} className="hover:text-pink-500 transition">Бажане ❤️</button><button onClick={() => { changeRoute('home'); setTimeout(() => document.getElementById('products-grid')?.scrollIntoView({behavior:'smooth'}), 100)}} className="hover:text-violet-400 transition">Каталог</button></div><div className="flex-1 max-w-md relative"><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><window.Icons.Search size={18} /></div><input type="text" className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-slate-800 text-gray-300 focus:outline-none focus:bg-slate-700 focus:border-violet-500 transition" placeholder="Пошук..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>{searchQuery && <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"><window.Icons.X size={16} /></button>}</div>{searchResults.length > 0 && (<div className="absolute mt-1 w-full bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 search-dropdown">{searchResults.map(p => (<div key={p.id} className="px-4 py-3 hover:bg-slate-700 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0" onClick={() => { navigateToProduct(p.id); setSearchQuery(""); }}>{p.images?.[0] ? <img src={p.images[0]} className="w-10 h-10 object-cover rounded-md flex-shrink-0" /> : <div className="w-10 h-10 bg-slate-600 rounded-md flex-shrink-0"/>}<div><div className="text-sm font-bold text-white">{p.name}</div><div className="text-xs text-gray-400">{p.price} ₴</div></div></div>))}</div>)}</div><div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">{isAdminMode && <button onClick={() => setIsAdminMode(false)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-600 text-white text-xs font-bold uppercase"><window.Icons.LogOut size={16} /> <span className="hidden sm:inline">Вихід</span></button>}<button onClick={() => { changeRoute('cart'); setIsMobileMenuOpen(false); }} className="relative p-2 text-gray-400 hover:text-white transition-colors"><window.Icons.ShoppingBag size={24} />{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-fuchsia-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.reduce((a,b) => a + b.qty, 0)}</span>}</button><button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <window.Icons.X size={24} /> : <window.Icons.Menu size={24} />}</button></div></div></div>{isMobileMenuOpen && (<div className="md:hidden bg-slate-900 border-b border-white/10 animate-fade-in p-4 space-y-2"><button onClick={goHome} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Головна</button><button onClick={() => changeRoute('wishlist')} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Бажане ❤️</button><button onClick={() => { changeRoute('cart'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Кошик</button></div>)}</nav>);
};

// --- NEW COMPONENT: MOBILE BOTTOM NAV ---
window.MobileBottomNav = ({ activeView, changeRoute, cartCount }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                <button onClick={() => changeRoute('home')} className={`flex flex-col items-center gap-1 p-2 transition ${activeView === 'home' ? 'text-violet-500' : 'text-gray-400 hover:text-white'}`}>
                    <window.Icons.Home size={22} fill={activeView === 'home' ? "currentColor" : "none"} />
                    <span className="text-[10px] font-medium">Головна</span>
                </button>
                
                <button className={`flex flex-col items-center gap-1 p-2 transition ${activeView === 'home' && !activeView.category ? 'text-gray-400' : 'text-gray-400 hover:text-white'}`} onClick={() => { changeRoute('home', {category: null}); setTimeout(() => document.getElementById('categories')?.scrollIntoView({behavior:'smooth'}), 100)}}>
                    <window.Icons.Grid size={22} />
                    <span className="text-[10px] font-medium">Каталог</span>
                </button>

                <button onClick={() => changeRoute('wishlist')} className={`flex flex-col items-center gap-1 p-2 transition ${activeView === 'wishlist' ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}>
                    <window.Icons.Heart size={22} fill={activeView === 'wishlist' ? "currentColor" : "none"} />
                    <span className="text-[10px] font-medium">Бажане</span>
                </button>

                <button onClick={() => changeRoute('cart')} className={`flex flex-col items-center gap-1 p-2 relative transition ${activeView === 'cart' || activeView === 'checkout' ? 'text-violet-500' : 'text-gray-400 hover:text-white'}`}>
                    <div className="relative">
                        <window.Icons.ShoppingBag size={22} fill={activeView === 'cart' ? "currentColor" : "none"} />
                        {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-fuchsia-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartCount}</span>}
                    </div>
                    <span className="text-[10px] font-medium">Кошик</span>
                </button>
            </div>
        </div>
    );
};