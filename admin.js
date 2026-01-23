const { useState, useEffect } = React;

// --- ХЕЛПЕР ДЛЯ ХЕШУВАННЯ (ДЛЯ HARD RESET) ---
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

window.AdminPanel = ({ products, setProducts, setEditId, promocodes, setPromocodes }) => {
    // --- СТАНИ ---
    const [tab, setTab] = useState('orders'); // За замовчуванням відкриваємо замовлення
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [localEditId, setLocalEditId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [urlInput, setUrlInput] = useState("");
    
    // Промокоди
    const [promoForm, setPromoForm] = useState({ code: '', type: 'fixed', value: 0, maxUses: 100 });
    
    // Hard Reset
    const [showReset, setShowReset] = useState(false);
    const [resetPass, setResetPass] = useState("");

    // Підключення до бази
    let db = null;
    try {
        if (window.firebase && firebase.apps.length) {
            db = firebase.firestore();
        }
    } catch (e) { console.error("Firebase error:", e); }

    // --- 1. ЗАВАНТАЖЕННЯ ЗАМОВЛЕНЬ ---
    useEffect(() => {
        if (tab === 'orders' && db) {
            setLoadingOrders(true);
            const unsubscribe = db.collection('orders')
                .orderBy('date', 'desc')
                .limit(50)
                .onSnapshot(snapshot => {
                    setOrders(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
                    setLoadingOrders(false);
                }, err => {
                    console.error("Orders error:", err);
                    setLoadingOrders(false);
                });
            return () => unsubscribe();
        }
    }, [tab, db]);

    // --- 2. ФУНКЦІЇ ТОВАРІВ ---
    
    // Переміщення фото (ліво/право)
    const moveImage = (index, direction) => {
        if (!formData || !formData.images) return;
        const newImages = [...formData.images];
        if (direction === 'left' && index > 0) {
            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        } else if (direction === 'right' && index < newImages.length - 1) {
            [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
        }
        setFormData({ ...formData, images: newImages });
    };

    const handleEditClick = (product) => {
        setLocalEditId(product.id);
        setFormData({ ...product });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async () => {
        if (!formData) return;
        const updatedProducts = products.map(p => p.id === formData.id ? formData : p);
        setProducts(updatedProducts);
        
        if (db) {
            try {
                await db.collection('products').doc(formData.id).set(formData);
                alert("✅ Товар успішно збережено!");
            } catch (e) {
                alert("❌ Помилка: " + e.message);
            }
        }
        setLocalEditId(null);
        setFormData(null);
    };

    const handleAddNew = () => {
        const newId = prompt("Введіть ID нового товару (англійською, без пробілів):");
        if (!newId) return;
        if (products.find(p => p.id === newId)) { alert("❌ Такий ID вже існує!"); return; }
        
        const newProd = {
            id: newId,
            name: "Новий товар",
            price: 0,
            oldPrice: 0,
            category: "Вібратори",
            description: "",
            images: [],
            inStock: true,
            isVisible: true,
            orderIndex: 0
        };
        
        setProducts([newProd, ...products]);
        if (db) db.collection('products').doc(newId).set(newProd);
        
        setLocalEditId(newId);
        setFormData(newProd);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm("Ви впевнені? Це неможливо скасувати.")) return;
        setProducts(products.filter(p => p.id !== id));
        if (db) await db.collection('products').doc(id).delete();
    };

    // --- 3. ФУНКЦІЇ ПРОМОКОДІВ ---
    const handleAddPromo = async () => {
        if (!promoForm.code) return alert("Введіть код!");
        const newPromo = { ...promoForm, usedCount: 0, code: promoForm.code.toUpperCase() };
        
        setPromocodes([...promocodes, newPromo]);
        if (db) await db.collection('promocodes').doc(newPromo.code).set(newPromo);
        
        setPromoForm({ code: '', type: 'fixed', value: 0, maxUses: 100 });
        alert("🎟 Промокод створено!");
    };

    const handleDeletePromo = async (code) => {
        if (!confirm("Видалити цей промокод?")) return;
        setPromocodes(promocodes.filter(p => p.code !== code));
        if (db) await db.collection('promocodes').doc(code).delete();
    };

    const addPromoUses = async (promo) => {
        const added = prompt("Скільки додати використань?", "10");
        if (!added) return;
        const newMax = promo.maxUses + parseInt(added);
        if (db) await db.collection('promocodes').doc(promo.code).update({ maxUses: newMax });
    };

    // --- 4. DATA TOOLS (ЕКСПОРТ І HARD RESET) ---
    const handleExportData = async () => {
        if (!db) return alert("Потрібен Firebase!");
        if (!confirm("Скопіювати всі товари в буфер обміну (JSON)?")) return;
        
        const snapshot = await db.collection('products').get();
        const data = snapshot.docs.map(doc => {
            const d = doc.data();
            delete d.createdAt; 
            return { id: doc.id, ...d };
        });
        
        navigator.clipboard.writeText(JSON.stringify(data, null, 4));
        alert("📋 Дані скопійовано! Можна вставляти в data.js");
    };

    const handleHardReset = async () => {
        // Хеш пароля "167349" (SHA-256)
        const TARGET_HASH = "e6c3da5b206d28f80479e831640e94857d4221770d18d0981e7c53243286d933";
        const inputHash = await sha256(resetPass);

        if (inputHash === TARGET_HASH) {
            if (confirm("⚠️ УВАГА! ЦЕ ВИДАЛИТЬ ВСІ ТОВАРИ З БАЗИ І ЗАВАНТАЖИТЬ ТЕСТОВІ. ПРОДОВЖИТИ?")) {
                alert("⏳ Починаю скидання...");
                // Тут логіка скидання (закоментована для безпеки, але місце для неї є)
                // window.seedDatabase(); 
                alert("Функція скидання готова, розкоментуйте в коді для активації.");
                setShowReset(false);
                setResetPass("");
            }
        } else {
            alert("⛔️ Невірний пароль доступу!");
        }
    };

    // --- РЕНДЕР ---
    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20 font-sans">
            {/* ВЕРХНЄ МЕНЮ */}
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur-md z-40 border-b border-white/10 p-4 flex gap-4 overflow-x-auto items-center justify-between shadow-lg">
                <div className="flex gap-2 md:gap-4">
                    <button onClick={() => setTab('orders')} className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${tab === 'orders' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'}`}>
                        <window.Icons.ShoppingBag size={20}/> <span className="hidden md:inline">Замовлення</span>
                    </button>
                    <button onClick={() => setTab('products')} className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${tab === 'products' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'}`}>
                        <window.Icons.Grid size={20}/> <span className="hidden md:inline">Товари</span>
                    </button>
                    <button onClick={() => setTab('promos')} className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${tab === 'promos' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'}`}>
                        <window.Icons.Ticket size={20}/> <span className="hidden md:inline">Промокоди</span>
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportData} className="p-2.5 bg-slate-700 rounded-xl hover:bg-slate-600 text-gray-300" title="Експорт JSON"><window.Icons.Copy size={20}/></button>
                    <button onClick={() => setShowReset(!showReset)} className="p-2.5 bg-red-900/30 text-red-400 rounded-xl hover:bg-red-900/50" title="HARD RESET"><window.Icons.Trash2 size={20}/></button>
                </div>
            </div>

            {/* ВІКНО HARD RESET */}
            {showReset && (
                <div className="bg-red-900/10 border-b border-red-500/30 p-4 animate-fade-in">
                    <div className="max-w-md mx-auto flex gap-2">
                        <input type="password" placeholder="Пароль для скидання" className="flex-1 bg-slate-900 border border-red-500/30 rounded-lg px-4 py-2 text-white" value={resetPass} onChange={e => setResetPass(e.target.value)} />
                        <button onClick={handleHardReset} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-500">Скинути</button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-4 md:p-6">
                
                {/* --- ВКЛАДКА: ЗАМОВЛЕННЯ --- */}
                {tab === 'orders' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Замовлення</h2>
                            {loadingOrders && <span className="text-violet-400 animate-pulse">Оновлення...</span>}
                        </div>
                        
                        {orders.length === 0 && !loadingOrders && (
                            <div className="text-center py-24 bg-slate-800/50 rounded-3xl border border-dashed border-gray-700">
                                <div className="text-6xl mb-4 opacity-50">📭</div>
                                <p className="text-gray-400 text-lg">Замовлень поки немає</p>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-xl hover:border-violet-500/30 transition group">
                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 border-b border-white/5 pb-5 mb-5">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded text-violet-400 border border-violet-500/20">#{order.id.slice(0, 8)}</span>
                                                <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                                                {order.isFreeShipping && <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded uppercase">Free Ship</span>}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">{order.client?.name || 'Клієнт'}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1"><window.Icons.Phone size={14}/> {order.client?.phone}</span>
                                                {order.client?.telegram && <span className="flex items-center gap-1 text-blue-400"><window.Icons.Send size={14}/> {order.client.telegram}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">{order.total} <span className="text-lg text-gray-500 font-normal">₴</span></div>
                                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-bold uppercase tracking-wider">
                                                {order.paymentMethod === 'card' ? <><window.Icons.CreditCard size={14} className="text-blue-400"/> Карта</> : <><window.Icons.PackageX size={14} className="text-yellow-400"/> Післяплата</>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 rounded-xl p-4 mb-4 space-y-3">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                                                    <span className="text-gray-300 font-medium">{item.name}</span>
                                                </div>
                                                <div className="text-gray-400 font-mono">
                                                    {item.qty} шт х {item.price} ₴
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm bg-slate-900 p-4 rounded-xl text-gray-400">
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-600 mb-1">Доставка</span>
                                            {order.client?.city}, {order.client?.department}
                                        </div>
                                        {order.client?.comment && (
                                            <div>
                                                <span className="block text-xs uppercase font-bold text-yellow-600 mb-1">Коментар</span>
                                                <span className="text-yellow-100/80 italic">"{order.client.comment}"</span>
                                            </div>
                                        )}
                                        {order.discount > 0 && (
                                            <div className="md:col-span-2 border-t border-white/5 pt-2 mt-1 text-green-400 flex items-center gap-2">
                                                <window.Icons.Ticket size={14}/> Використано промокод: <strong>{order.promoCode}</strong> (-{order.discount} ₴)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- ВКЛАДКА: ТОВАРИ --- */}
                {tab === 'products' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Товари</h2>
                            <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center gap-2">
                                <window.Icons.Plus size={20}/> Додати
                            </button>
                        </div>

                        {localEditId && formData ? (
                            <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-24 z-30">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Редагування</h3>
                                        <p className="text-gray-400 text-sm">ID: <span className="font-mono text-violet-400">{formData.id}</span></p>
                                    </div>
                                    <button onClick={() => setLocalEditId(null)} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 text-white transition"><window.Icons.X size={24}/></button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Назва товару</label>
                                            <input className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition" 
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Ціна (₴)</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono"
                                                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Стара ціна</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-gray-400 font-mono"
                                                    value={formData.oldPrice || ''} onChange={e => setFormData({...formData, oldPrice: e.target.value ? Number(e.target.value) : null})} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Категорія</label>
                                            <div className="relative">
                                                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white appearance-none cursor-pointer"
                                                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                    {window.CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.isVisible ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900 border-slate-700'}`}>
                                                <input type="checkbox" className="w-5 h-5 accent-green-500" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} />
                                                <span className={formData.isVisible ? "text-green-400 font-bold" : "text-gray-400"}>На сайті</span>
                                            </label>
                                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.inStock ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-900 border-slate-700'}`}>
                                                <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} />
                                                <span className={formData.inStock ? "text-blue-400 font-bold" : "text-gray-400"}>В наявності</span>
                                            </label>
                                        </div>
                                        
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Сортування (Індекс)</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                                                value={formData.orderIndex || 0} onChange={e => setFormData({...formData, orderIndex: Number(e.target.value)})} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Зображення</label>
                                            <div className="flex gap-2 mb-4">
                                                <input className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" 
                                                    placeholder="https://..." value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                                                <button onClick={() => { if(urlInput) { setFormData({...formData, images: [...(formData.images || []), urlInput]}); setUrlInput(""); }}} className="bg-violet-600 hover:bg-violet-500 text-white px-5 rounded-xl transition"><window.Icons.Plus size={20}/></button>
                                            </div>
                                            
                                            <div className="grid grid-cols-4 gap-3">
                                                {(formData.images || []).map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square group bg-slate-900 rounded-lg overflow-hidden border border-white/10">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                                            <div className="flex gap-2">
                                                                {idx > 0 && <button onClick={()=>moveImage(idx, 'left')} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white">←</button>}
                                                                {idx < formData.images.length - 1 && <button onClick={()=>moveImage(idx, 'right')} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white">→</button>}
                                                            </div>
                                                            <button onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-300"><window.Icons.Trash2 size={16}/></button>
                                                        </div>
                                                        {idx === 0 && <div className="absolute top-1 left-1 bg-violet-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Main</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Опис</label>
                                            <textarea className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700"
                                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                                    <button onClick={() => setLocalEditId(null)} className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 transition">Скасувати</button>
                                    <button onClick={handleSave} className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 shadow-lg shadow-green-500/20 transition flex items-center gap-2">
                                        <window.Icons.Check size={20}/> Зберегти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {products.map(p => (
                                    <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 hover:border-violet-500/30 transition group">
                                        <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 relative">
                                            {p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-600"><window.Icons.Image size={24}/></div>}
                                            {!p.isVisible && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><window.Icons.EyeOff size={16} className="text-gray-400"/></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white truncate">{p.name}</h3>
                                                <span className="text-xs text-gray-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded">{p.id}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                <span className="text-white font-bold">{p.price} ₴</span>
                                                <span>{p.category}</span>
                                                <span className={p.inStock ? "text-blue-400" : "text-red-400"}>{p.inStock ? "Є в наявності" : "Закінчився"}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="p-2.5 bg-slate-700 text-white rounded-lg hover:bg-violet-600 transition"><window.Icons.Edit2 size={18}/></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-slate-700 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"><window.Icons.Trash2 size={18}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- ВКЛАДКА: ПРОМОКОДИ --- */}
                {tab === 'promos' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Промокоди</h2>
                        </div>

                        <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border border-white/10 shadow-lg">
                            <h3 className="font-bold mb-6 text-violet-400 flex items-center gap-2"><window.Icons.Plus size={20}/> Створити новий</h3>
                            <div className="grid md:grid-cols-4 gap-6 items-end">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Код</label>
                                    <input placeholder="SALE2026" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white uppercase font-bold tracking-widest outline-none focus:border-violet-500 transition"
                                        value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Тип знижки</label>
                                    <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none cursor-pointer"
                                        value={promoForm.type} onChange={e => setPromoForm({...promoForm, type: e.target.value})}>
                                        <option value="fixed">Фіксована (₴)</option>
                                        <option value="percent">Відсоток (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Значення</label>
                                    <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono"
                                        value={promoForm.value} onChange={e => setPromoForm({...promoForm, value: Number(e.target.value)})} />
                                </div>
                                <button onClick={handleAddPromo} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                                    Створити
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {promocodes.map(promo => {
                                const percentUsed = Math.min(100, (promo.usedCount / promo.maxUses) * 100);
                                const isExhausted = promo.usedCount >= promo.maxUses;
                                return (
                                    <div key={promo.code} className="bg-slate-800 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group relative overflow-hidden hover:border-violet-500/30 transition">
                                        <div className="absolute top-4 right-4 z-20">
                                            <button onClick={() => handleDeletePromo(promo.code)} className="text-gray-600 hover:text-red-500 transition"><window.Icons.Trash2 size={18}/></button>
                                        </div>
                                        
                                        <div className="mb-6 relative z-10">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-2xl font-black text-white tracking-widest bg-slate-900 px-4 py-2 rounded-lg border border-dashed border-gray-600 font-mono select-all">{promo.code}</span>
                                            </div>
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className={`text-4xl font-bold ${promo.type === 'percent' ? 'text-fuchsia-400' : 'text-green-400'}`}>-{promo.value}</span>
                                                <span className="text-gray-400 font-bold">{promo.type === 'percent' ? '%' : '₴'}</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-400 uppercase font-bold">
                                                    <span>Використано</span>
                                                    <span>{promo.usedCount} / {promo.maxUses}</span>
                                                </div>
                                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-500 ${isExhausted ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${percentUsed}%`}}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={()=>addPromoUses(promo)} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                                            <window.Icons.Plus size={16}/> Додати ліміт
                                        </button>
                                        
                                        {isExhausted && <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center z-0 pointer-events-none"><span className="text-red-500 font-black border-4 border-red-500 px-6 py-2 rounded-xl transform -rotate-12 text-xl">EXPIRED</span></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
