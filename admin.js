const { useState, useEffect } = React;

window.AdminPanel = ({ products, setProducts, setEditId, promocodes, setPromocodes }) => {
    // Додали вкладку 'orders'
    const [tab, setTab] = useState('orders'); 
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Стандартні стани для товарів і промокодів
    const [localEditId, setLocalEditId] = useState(null); 
    const [formData, setFormData] = useState(null); 
    const [urlInput, setUrlInput] = useState("");
    const [promoForm, setPromoForm] = useState({ code: '', type: 'fixed', value: 0, maxUses: 100 });

    let db = null;
    try { 
        if (window.firebase && firebase.apps.length) {
            db = firebase.firestore(); 
        }
    } catch (e) { console.error(e); }

    // --- ЗАВАНТАЖЕННЯ ЗАМОВЛЕНЬ ---
    useEffect(() => {
        if (tab === 'orders' && db) {
            setLoadingOrders(true);
            const unsubscribe = db.collection('orders')
                .orderBy('date', 'desc') // Сортуємо: нові зверху
                .limit(50) // Беремо останні 50
                .onSnapshot(snapshot => {
                    const loadedOrders = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setOrders(loadedOrders);
                    setLoadingOrders(false);
                }, err => {
                    console.error("Помилка завантаження замовлень:", err);
                    setLoadingOrders(false);
                });
            return () => unsubscribe();
        }
    }, [tab]);

    // --- ФУНКЦІЇ ДЛЯ ТОВАРІВ (Без змін) ---
    const handleEditClick = (product) => {
        setLocalEditId(product.id);
        setFormData({ ...product });
    };

    const handleSave = async () => {
        if (!formData) return;
        const updatedProducts = products.map(p => p.id === formData.id ? formData : p);
        setProducts(updatedProducts);
        
        if (db) {
            try {
                await db.collection('products').doc(formData.id).set(formData);
                alert("Товар оновлено!");
            } catch (e) { alert("Помилка збереження: " + e.message); }
        }
        setLocalEditId(null);
        setFormData(null);
    };

    const handleAddNew = () => {
        const newId = prompt("Введіть ID нового товару (латиницею, без пробілів):");
        if (!newId) return;
        if (products.find(p => p.id === newId)) { alert("Такий ID вже існує!"); return; }
        
        const newProd = {
            id: newId,
            name: "Новий товар",
            price: 0,
            category: "Вібратори",
            description: "",
            images: [],
            inStock: true,
            isVisible: true
        };
        setProducts([newProd, ...products]);
        if (db) db.collection('products').doc(newId).set(newProd);
        
        setLocalEditId(newId);
        setFormData(newProd);
    };

    const handleDelete = async (id) => {
        if (!confirm("Видалити цей товар?")) return;
        setProducts(products.filter(p => p.id !== id));
        if (db) await db.collection('products').doc(id).delete();
    };

    // --- ФУНКЦІЇ ДЛЯ ПРОМОКОДІВ (Без змін) ---
    const handleAddPromo = async () => {
        if (!promoForm.code) return alert("Введіть код!");
        const newPromo = { ...promoForm, usedCount: 0, code: promoForm.code.toUpperCase() };
        
        setPromocodes([...promocodes, newPromo]);
        if (db) await db.collection('promocodes').doc(newPromo.code).set(newPromo);
        
        setPromoForm({ code: '', type: 'fixed', value: 0, maxUses: 100 });
        alert("Промокод додано!");
    };

    const handleDeletePromo = async (code) => {
        if (!confirm("Видалити промокод?")) return;
        setPromocodes(promocodes.filter(p => p.code !== code));
        if (db) await db.collection('promocodes').doc(code).delete();
    };

    // --- РЕНДЕР ---
    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Меню вкладок */}
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur-md z-40 border-b border-white/10 p-4 flex gap-4 overflow-x-auto">
                <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap ${tab === 'orders' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white'}`}>
                    📦 Замовлення
                </button>
                <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap ${tab === 'products' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white'}`}>
                    ✏️ Товари
                </button>
                <button onClick={() => setTab('promocodes')} className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap ${tab === 'promocodes' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-700 text-gray-400 hover:text-white'}`}>
                    🎟 Промокоди
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-6">
                
                {/* --- Вкладка: ЗАМОВЛЕННЯ --- */}
                {tab === 'orders' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4">Список замовлень</h2>
                        {loadingOrders && <div className="text-center py-10 animate-pulse text-gray-400">Завантаження...</div>}
                        
                        {!loadingOrders && orders.length === 0 && (
                            <div className="text-center py-20 bg-slate-800 rounded-2xl border border-dashed border-gray-700">
                                <p className="text-gray-400 text-lg">Замовлень поки немає 🤷‍♂️</p>
                                <p className="text-sm text-gray-500 mt-2">Як тільки хтось оформить замовлення, воно з'явиться тут.</p>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md hover:border-violet-500/50 transition">
                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-white/5 pb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded font-mono">#{order.id.slice(0, 6)}</span>
                                                <span className="text-gray-400 text-sm">{new Date(order.date).toLocaleString()}</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-white">{order.client?.name || 'Клієнт'}</h3>
                                            <div className="text-violet-400 font-medium">{order.client?.phone}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-400">{order.total} ₴</div>
                                            <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                                                {order.paymentMethod === 'card' ? '💳 На карту' : '📦 Післяплата'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Товари */}
                                    <div className="space-y-2 mb-4 bg-slate-900/50 p-3 rounded-lg">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-300">• {item.name}</span>
                                                </div>
                                                <div className="text-gray-400 whitespace-nowrap">
                                                    {item.qty} шт x {item.price} ₴
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Деталі доставки */}
                                    <div className="grid md:grid-cols-2 gap-4 text-sm bg-slate-900 p-3 rounded-lg text-gray-300">
                                        <div>
                                            <span className="text-gray-500 block text-xs uppercase mb-1">Доставка:</span>
                                            {order.client?.city}, {order.client?.department}
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs uppercase mb-1">Контакти:</span>
                                            Telegram: <span className="text-white">{order.client?.telegram || '-'}</span>
                                        </div>
                                        {order.client?.comment && (
                                            <div className="md:col-span-2 text-yellow-500 border-t border-white/10 pt-2 mt-1">
                                                ⚠️ Коментар: {order.client.comment}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Вкладка: ТОВАРИ (Старий код, без змін) --- */}
                {tab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Керування товарами</h2>
                            <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition">
                                + Додати товар
                            </button>
                        </div>
                        {localEditId && formData ? (
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in sticky top-20 z-30">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-violet-400">Редагування товару</h3>
                                    <button onClick={() => setLocalEditId(null)} className="text-gray-400 hover:text-white">✕</button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold">Назва</label>
                                            <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none" 
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold">Ціна</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold">Стара ціна</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                                    value={formData.oldPrice || ''} onChange={e => setFormData({...formData, oldPrice: e.target.value ? Number(e.target.value) : null})} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold">Категорія</label>
                                            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                <option value="Вібратори">Вібратори</option>
                                                <option value="Для нього">Для нього</option>
                                                <option value="БДСМ">БДСМ</option>
                                                <option value="Білизна">Білизна</option>
                                                <option value="Лубриканти">Лубриканти</option>
                                                <option value="Презервативи">Презервативи</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-4 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                                                <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} />
                                                <span className={formData.isVisible ? "text-green-400" : "text-gray-500"}>Відображати на сайті</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                                                <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} />
                                                <span className={formData.inStock ? "text-blue-400" : "text-gray-500"}>Є в наявності</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold">Фото (URL)</label>
                                            <div className="flex gap-2 mb-2">
                                                <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" 
                                                    placeholder="Вставте посилання на фото..." value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                                                <button onClick={() => { if(urlInput) { setFormData({...formData, images: [...(formData.images || []), urlInput]}); setUrlInput(""); }}} className="bg-violet-600 text-white px-4 rounded-lg">+</button>
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {(formData.images || []).map((img, idx) => (
                                                    <div key={idx} className="relative w-16 h-16 flex-shrink-0 group">
                                                        <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-600" />
                                                        <button onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold">Опис</label>
                                            <textarea className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm"
                                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                                    <button onClick={() => setLocalEditId(null)} className="px-6 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600">Скасувати</button>
                                    <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 shadow-lg shadow-green-500/20">Зберегти зміни</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {products.map(p => (
                                    <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 hover:border-slate-600 transition group">
                                        <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0">
                                            {p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No img</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-white truncate">{p.name}</div>
                                            <div className="text-xs text-gray-400">{p.price} ₴ | {p.category} | <span className={p.inStock ? "text-green-400" : "text-red-400"}>{p.inStock ? "В наявності" : "Немає"}</span></div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition">✏️</button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">🗑</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- Вкладка: ПРОМОКОДИ (Старий код, без змін) --- */}
                {tab === 'promocodes' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Промокоди</h2>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <h3 className="font-bold mb-4 text-violet-400">Створити новий</h3>
                            <div className="grid md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Код</label>
                                    <input placeholder="SALE2024" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white uppercase"
                                        value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Тип знижки</label>
                                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                        value={promoForm.type} onChange={e => setPromoForm({...promoForm, type: e.target.value})}>
                                        <option value="fixed">Фіксована (₴)</option>
                                        <option value="percent">Відсоток (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Значення</label>
                                    <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                        value={promoForm.value} onChange={e => setPromoForm({...promoForm, value: Number(e.target.value)})} />
                                </div>
                                <button onClick={handleAddPromo} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg shadow-lg">Створити</button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {promocodes.map(promo => (
                                <div key={promo.code} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex justify-between items-center group">
                                    <div>
                                        <div className="font-mono font-bold text-xl text-white tracking-wider">{promo.code}</div>
                                        <div className="text-sm text-gray-400">
                                            Знижка: <span className="text-green-400">{promo.value} {promo.type === 'percent' ? '%' : '₴'}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Використано: {promo.usedCount || 0} разів</div>
                                    </div>
                                    <button onClick={() => handleDeletePromo(promo.code)} className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
