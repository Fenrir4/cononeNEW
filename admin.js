const { useState, useEffect } = React;

window.AdminPanel = ({ products, setProducts, setEditId, promocodes, setPromocodes }) => {
    const [tab, setTab] = useState('products'); 
    const [localEditId, setLocalEditId] = useState(null); 
    const [formData, setFormData] = useState(null); 
    const [urlInput, setUrlInput] = useState("");
    
    // Стан для форми промокодів
    const [promoForm, setPromoForm] = useState({ code: '', type: 'fixed', value: 0, maxUses: 100 });
    
    // --- ДОДАТИ ЦЕ ---
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        if (tab === 'orders' && window.firebase) {
            const db = firebase.firestore();
            const unsubscribe = db.collection('orders')
                .orderBy('date', 'desc')
                .limit(50)
                .onSnapshot(snapshot => {
                    setOrders(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
                });
            return () => unsubscribe();
        }
    }, [tab]);
    // -----------------
    
    let db = null;
    try { 
        if (window.firebase && firebase.apps.length) {
            db = firebase.firestore(); 
        }
    } catch (e) {
        console.error(e);
    }
    
    // --- 1. ЛОГІКА ЗАМОВЛЕНЬ ---
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        if (tab === 'orders' && db) {
            const unsubscribe = db.collection('orders')
                .orderBy('date', 'desc')
                .limit(50)
                .onSnapshot(snapshot => {
                    setOrders(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
                });
            return () => unsubscribe();
        }
    }, [tab, db]);

    // --- ФУНКЦІЯ ЕКСПОРТУ (БЕКАП) ---
    const handleExportData = async () => {
        if (!db) {
            alert("Ця функція працює тільки з підключеним Firebase!");
            return;
        }
        
        const confirmExport = confirm("Експортувати поточні дані товарів у буфер обміну (для data.js)?");
        if (!confirmExport) return;

        try {
            console.log("⏳ Завантажую товари...");
            const snapshot = await db.collection('products').get();
            let exportProducts = snapshot.docs.map(doc => {
                const data = doc.data();
                // Видаляємо службові поля
                delete data.createdAt; 
                return { id: doc.id, ...data };
            });

            // Сортуємо
            exportProducts.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            // Формуємо текст
            const result = `// --- ОСТАННЄ ОНОВЛЕННЯ: ${new Date().toLocaleString()} ---\nwindow.INITIAL_PRODUCTS_SEED = ${JSON.stringify(exportProducts, null, 4)};`;

            // Копіюємо
            await navigator.clipboard.writeText(result);
            alert("✅ ГОТОВО!\n\nКод скопійовано в буфер обміну.\nВставте його у файл data.js.");
        } catch (error) {
            console.error(error);
            alert("Помилка експорту. Деталі в консолі.");
        }
    };

    // --- ФУНКЦІЇ УПРАВЛІННЯ ТОВАРАМИ ---

    const handleCreateNew = () => {
        const newProduct = {
            id: Date.now(),
            name: "Новий товар",
            price: 0,
            category: "Іграшки",
            images: [],
            rating: 5.0,
            specs: [],
            isHit: false,
            isSale: false,
            inStock: true,
            isVisible: true,
            shortDesc: "",
            description: "",
            oldPrice: 0,
            orderIndex: products.length > 0 ? Math.max(...products.map(p => p.orderIndex || 0)) + 1 : 1,
            createdAt: new Date()
        };

        if (db) {
             db.collection("products").doc(String(newProduct.id)).set(newProduct).then(() => {
                setLocalEditId(newProduct.id);
                setFormData(newProduct);
             });
        } else {
            setProducts([...products, newProduct]);
            setLocalEditId(newProduct.id);
            setFormData(newProduct);
        }
    };

    const handleReset = async () => {
        // Запитуємо пароль
        const password = prompt("🔴 УВАГА! Це видалить базу даних.\nВведіть пароль для підтвердження:");
        
        if (!password) return; 

        // Хешування пароля для безпеки
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Хеш від "167349"
        const TARGET_HASH = "9853920364d262d0577953255f0505b3303d76e6332da7b7923769932605330e";

        if (hashHex !== TARGET_HASH) {
            alert("⛔️ Невірний пароль!");
            return;
        }

        if (!window.confirm("Ви точно хочете відновити заводські налаштування?")) return;
        
        if (db) {
            const snapshot = await db.collection("products").get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => { batch.delete(doc.ref); });
            await batch.commit();
            
            const batchAdd = db.batch();
            window.INITIAL_PRODUCTS_SEED.forEach((p, index) => {
                const docRef = db.collection("products").doc(String(p.id));
                batchAdd.set(docRef, { ...p, orderIndex: index, inStock: true, isVisible: true, isSale: p.isSale || false });
            });
            await batchAdd.commit();
            alert("✅ Базу відновлено!");
        } else {
            setProducts(window.INITIAL_PRODUCTS_SEED);
            alert("✅ Відновлено (локально)!");
        }
    };

    const handleResetTags = async () => {
        if (!window.confirm("Скинути всі теги 'Хіт' та 'Акція'?")) return;
        
        if (db) {
            const snapshot = await db.collection("products").get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, { isHit: false, isSale: false, rating: 5.0 });
            });
            await batch.commit();
            alert("Теги скинуто!");
        } else {
            setProducts(products.map(p => ({ ...p, isHit: false, isSale: false, rating: 5.0 })));
            alert("Теги скинуто (локально)!");
        }
    };

    const handleDeleteAllPhotos = async () => {
         if (!window.confirm("УВАГА! Видалити фото у ВСІХ товарів?")) return;

         if (db) {
            const snapshot = await db.collection("products").get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, { images: [] });
            });
            await batch.commit();
            alert("Фото видалено!");
         } else {
             setProducts(products.map(p => ({...p, images: []})));
             alert("Фото видалено (локально)!");
         }
    };

    const handleEdit = (product) => {
        setLocalEditId(product.id);
        setFormData({...product});
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData) return;
        
        try {
            if (db) {
                await db.collection("products").doc(String(formData.id)).set(formData);
            } else {
                setProducts(products.map(p => p.id === formData.id ? formData : p));
            }
            setLocalEditId(null);
        } catch (error) {
            console.error("Error saving:", error);
            alert("Помилка збереження!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Видалити товар?")) return;
        
        if (db) {
            await db.collection("products").doc(String(id)).delete();
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleDuplicate = async (product) => {
         const newProduct = {
            ...product,
            id: Date.now(),
            name: product.name + " (Копія)",
            orderIndex: products.length > 0 ? Math.max(...products.map(p => p.orderIndex || 0)) + 1 : 1,
            createdAt: new Date()
        };

        if (db) {
            await db.collection("products").doc(String(newProduct.id)).set(newProduct);
        } else {
            setProducts([...products, newProduct]);
        }
    };

    const handleToggleStock = async (product) => {
        const updated = { ...product, inStock: !product.inStock };
        if(db) await db.collection("products").doc(String(product.id)).update({ inStock: updated.inStock });
        else setProducts(products.map(p => p.id === product.id ? updated : p));
    };

    const handleToggleVisibility = async (product) => {
        const updated = { ...product, isVisible: !product.isVisible };
        if(db) await db.collection("products").doc(String(product.id)).update({ isVisible: updated.isVisible });
        else setProducts(products.map(p => p.id === product.id ? updated : p));
    };

    const handleMove = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === products.length - 1) return;

        const newProducts = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];

        // Міняємо індекси місцями для збереження в базі
        const tempOrder = newProducts[index].orderIndex;
        newProducts[index].orderIndex = newProducts[targetIndex].orderIndex;
        newProducts[targetIndex].orderIndex = tempOrder;

        if (db) {
            await db.collection("products").doc(String(newProducts[index].id)).update({ orderIndex: newProducts[index].orderIndex });
            await db.collection("products").doc(String(newProducts[targetIndex].id)).update({ orderIndex: newProducts[targetIndex].orderIndex });
        } else {
            setProducts(newProducts);
        }
    };

    // --- РОБОТА З ФОТО (РЕДАГУВАННЯ) ---

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const resizedImages = await Promise.all(files.map(file => window.resizeImage(file)));
        setFormData(p => ({...p, images: [...(p.images || []), ...resizedImages]}));
    };

    const handleAddUrl = () => { 
        if(urlInput) { 
            setFormData(p => ({...p, images: [...(p.images || []), urlInput]})); 
            setUrlInput(""); 
        } 
    };
    
    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev, 
            images: prev.images.filter((_, i) => i !== index)
        }));
    };
    
    const removeAllImages = () => {
        if(window.confirm("Видалити всі фото цього товару?")) {
            setFormData(prev => ({...prev, images: []}));
        }
    };

    // --- НОВА ФУНКЦІЯ: ЗМІНА ПОРЯДКУ ФОТО ---
    const moveImage = (index, direction) => {
        const newImages = [...formData.images];
        
        // Перевірки меж
        if (direction === -1 && index === 0) return; 
        if (direction === 1 && index === newImages.length - 1) return; 
        
        // Міняємо місцями
        const temp = newImages[index];
        newImages[index] = newImages[index + direction];
        newImages[index + direction] = temp;
        
        setFormData({ ...formData, images: newImages });
    };

    // --- ХАРАКТЕРИСТИКИ ---

    const addSpec = () => setFormData({...formData, specs: [...(formData.specs || []), ""]});
    
    const updateSpec = (i, val) => { 
        const newSpecs = [...(formData.specs || [])]; 
        newSpecs[i] = val; 
        setFormData({...formData, specs: newSpecs}); 
    };
    
    const removeSpec = (i) => {
        setFormData({...formData, specs: formData.specs.filter((_, idx) => idx !== i)});
    };

    // --- ПРОМОКОДИ ---

    const handleCreatePromo = async (e) => {
        e.preventDefault();
        const newPromo = { 
            ...promoForm, 
            id: Date.now().toString(), 
            usedCount: 0, 
            createdAt: new Date() 
        };
        
        if (db) {
            await db.collection("promocodes").doc(newPromo.id).set(newPromo);
        } else {
            setPromocodes([...promocodes, newPromo]);
        }
        setPromoForm({ code: '', type: 'fixed', value: 0, maxUses: 100 });
        alert("Промокод успішно створено!");
    };

    const handleDeletePromo = async (id) => {
        if (!confirm("Видалити цей промокод?")) return;
        if (db) await db.collection("promocodes").doc(id).delete();
        else setPromocodes(promocodes.filter(p => p.id !== id));
    };

    const addPromoUses = async (promo) => {
        const added = prompt("Скільки додати використань?", "10");
        if (!added) return;
        const newMax = (promo.maxUses || 0) + Number(added);
        if (db) await db.collection("promocodes").doc(promo.id).update({ maxUses: newMax });
        else setPromocodes(promocodes.map(p => p.id === promo.id ? { ...p, maxUses: newMax } : p));
    };
    {/* --- ВСТАВИТИ ЦЕЙ БЛОК --- */}
                {tab === 'orders' && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">Останні замовлення</h2>
                        {orders.length === 0 && <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">Замовлень поки немає 📭</div>}
                        
                        {orders.map(order => (
                            <div key={order.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md hover:border-violet-500/50 transition">
                                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-violet-400">#{order.id.slice(0,6)}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                                        </div>
                                        <div className="font-bold text-white text-lg">{order.client?.name}</div>
                                        <div className="text-sm text-violet-300">{order.client?.phone}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-green-400">{order.total} ₴</div>
                                        <div className="text-xs uppercase font-bold tracking-wider text-gray-400">
                                            {order.paymentMethod === 'card' ? '💳 На карту' : '📦 Післяплата'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 bg-slate-900/50 p-3 rounded-lg mb-3">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm text-gray-300">
                                            <span>• {item.name}</span>
                                            <span className="text-gray-500 whitespace-nowrap">{item.qty} x {item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400">
                                    📍 {order.client?.city}, {order.client?.department} 
                                    {order.client?.comment && <div className="mt-1 text-yellow-500">⚠️ "{order.client.comment}"</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* ------------------------- */}

    // --- РЕНДЕРИНГ: МОДАЛЬНЕ ВІКНО ---
    if (localEditId && formData) {
        return (
            <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Редагування товару</h2>
                        <button onClick={()=>setLocalEditId(null)} className="text-gray-400 hover:text-white transition bg-slate-700 p-2 rounded-full"><window.Icons.X/></button>
                    </div>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Назва</label>
                                <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Ціна (грн)</label>
                                <input type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Категорія</label>
                                <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500">
                                    {window.CATEGORIES.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
                                    <option value="Інше">Інше</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Стара ціна</label>
                                <input type="number" value={formData.oldPrice || ''} onChange={e=>setFormData({...formData, oldPrice:Number(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" placeholder="0" />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 p-4 bg-slate-900 rounded-xl border border-white/10 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={formData.isHit} onChange={e=>setFormData({...formData, isHit:e.target.checked})} className="accent-violet-500 w-5 h-5"/>
                                <span className="text-white font-bold"><window.Icons.Flame size={16} className="inline text-fuchsia-500"/> Хіт</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none ml-4">
                                <input type="checkbox" checked={formData.isSale} onChange={e=>setFormData({...formData, isSale:e.target.checked})} className="accent-red-500 w-5 h-5"/>
                                <span className="text-white font-bold"><window.Icons.Tag size={16} className="inline text-red-500"/> Акція</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none ml-4">
                                <input type="checkbox" checked={formData.inStock} onChange={e=>setFormData({...formData, inStock:e.target.checked})} className="accent-green-500 w-5 h-5"/>
                                <span className="text-white">В наявності</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none ml-4">
                                <input type="checkbox" checked={formData.isVisible} onChange={e=>setFormData({...formData, isVisible:e.target.checked})} className="accent-blue-500 w-5 h-5"/>
                                <span className="text-white">Видимий</span>
                            </label>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-gray-400 text-sm">Рейтинг:</span>
                                <input type="number" step="0.1" min="0" max="5" value={formData.rating || 0} onChange={e=>setFormData({...formData, rating:Number(e.target.value)})} className="w-20 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center font-bold"/>
                            </div>
                        </div>
                        
                        {/* ФОТО З ФУНКЦІЄЮ ПЕРЕМІЩЕННЯ */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-gray-400">Медіа (Фото/Відео)</label>
                                {formData.images?.length > 0 && (
                                    <button type="button" onClick={removeAllImages} className="text-xs text-red-400 hover:text-red-300 underline font-bold">Видалити всі</button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {formData.images?.map((img, i) => (
                                    <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/20 group bg-black shadow-lg">
                                        {/* ПОЗНАЧКА ГОЛОВНОГО ФОТО */}
                                        {i === 0 && <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold z-10 shadow">ГОЛОВНЕ</span>}
                                        
                                        {window.isVideo(img) ? <video src={img} className="w-full h-full object-cover"/> : <img src={img} className="w-full h-full object-cover"/>}
                                        
                                        {/* КНОПКИ УПРАВЛІННЯ ПОРЯДКОМ */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className={`p-1 rounded bg-white/20 hover:bg-white/40 text-white transition ${i===0?'opacity-30':''}`} title="Вліво (зробити головним)">
                                                    <window.Icons.ChevronLeft size={20}/>
                                                </button>
                                                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === formData.images.length-1} className={`p-1 rounded bg-white/20 hover:bg-white/40 text-white transition ${i===formData.images.length-1?'opacity-30':''}`} title="Вправо">
                                                    <window.Icons.ChevronRight size={20}/>
                                                </button>
                                            </div>
                                            <button type="button" onClick={() => removeImage(i)} className="text-red-500 hover:scale-110 transition bg-white/20 p-1.5 rounded-full">
                                                <window.Icons.Trash2 size={20}/>
                                            </button>
                                        </div>
                                        <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">{i+1}</span>
                                    </div>
                                ))}
                                <label className="w-32 h-32 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-violet-500 hover:text-violet-500 transition hover:bg-white/5">
                                    <window.Icons.Upload size={32}/>
                                    <span className="text-xs mt-2 font-bold">Завантажити</span>
                                    <input type="file" multiple className="hidden" onChange={handleImageUpload}/>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Або вставте посилання..." className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-violet-500 text-sm"/>
                                <button type="button" onClick={handleAddUrl} className="bg-slate-700 hover:bg-violet-600 text-white px-6 rounded-xl text-sm font-bold transition">Додати URL</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Опис</label>
                            <textarea rows={6} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 leading-relaxed" />
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-gray-400">Характеристики</label>
                                <button type="button" onClick={addSpec} className="text-xs bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white font-bold transition">+ Додати рядок</button>
                            </div>
                            <div className="space-y-3">
                                {formData.specs?.map((spec, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <div className="w-6 text-center text-gray-500 text-xs">{i+1}.</div>
                                        <input value={spec} onChange={e => updateSpec(i, e.target.value)} className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-violet-500" />
                                        <button type="button" onClick={() => removeSpec(i)} className="text-gray-500 hover:text-red-500 transition p-2"><window.Icons.Trash2 size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all text-lg">💾 Зберегти зміни</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- ГОЛОВНА ТАБЛИЦЯ ---
    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3"><window.Icons.Settings className="text-violet-500" size={32} /> Панель адміністратора</h1>
                    <div className="flex gap-2 bg-slate-800 p-1.5 rounded-xl border border-white/10">
                        <button onClick={()=>setTab('products')} className={`px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 ${tab==='products' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><window.Icons.ShoppingBag size={18}/> Товари</button>
                        <button onClick={()=>setTab('promos')} className={`px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 ${tab==='promos' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><window.Icons.Ticket size={18}/> Промокоди</button>
                        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-2 ${tab === 'orders' ? 'bg-violet-600 text-white shadow-lg' : 'bg-slate-700 text-gray-400 hover:text-white'}`}><window.Icons.ShoppingBag size={18}/> Замовлення </button>
                    </div>
                </div>

                {tab === 'products' ? (
                    <>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-white/10 mb-6 flex flex-wrap justify-between items-center gap-4">
                             <div className="flex gap-3 flex-wrap">
                                <button onClick={handleExportData} className="flex items-center gap-2 bg-fuchsia-600 text-white px-4 py-2.5 rounded-xl hover:bg-fuchsia-700 transition text-sm font-bold shadow-lg shadow-fuchsia-500/20"><window.Icons.Copy size={18}/> Експорт в data.js</button>
                                <button onClick={handleDeleteAllPhotos} className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition text-sm font-bold border border-red-500/20"><window.Icons.Image size={18}/> Видалити ВСІ фото</button>
                                <button onClick={handleResetTags} className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2.5 rounded-xl hover:bg-yellow-500 hover:text-white transition text-sm font-bold border border-yellow-500/20"><window.Icons.TagsOff size={18}/> Скинути теги</button>
                                <button onClick={handleReset} className="flex items-center gap-2 bg-slate-700 text-gray-300 px-4 py-2.5 rounded-xl hover:bg-slate-600 hover:text-white transition text-sm font-bold"><window.Icons.RefreshCw size={18}/> Hard Reset</button>
                             </div>
                             <button onClick={handleCreateNew} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-bold shadow-lg hover:shadow-green-500/20"><window.Icons.Plus size={20}/> Додати товар</button>
                        </div>
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/80 text-gray-400 text-xs uppercase tracking-wider"><tr><th className="p-5 w-16 text-center">#</th><th className="p-5 w-24">Фото</th><th className="p-5">Назва товару</th><th className="p-5 hidden md:table-cell">Категорія</th><th className="p-5">Ціна</th><th className="p-5 text-right">Управління</th></tr></thead>
                                <tbody className="divide-y divide-white/5">
                                    {products.map((p, idx) => (
                                        <tr key={p.id} className={`hover:bg-white/5 transition duration-200 group ${!p.isVisible ? 'opacity-50 grayscale' : ''}`}>
                                            <td className="p-5"><div className="flex flex-col items-center gap-1"><button onClick={() => handleMove(idx, 'up')} className="text-gray-600 hover:text-violet-400 transition disabled:opacity-0" disabled={idx === 0}><window.Icons.ArrowUp size={14}/></button><span className="font-mono font-bold text-gray-500">{idx + 1}</span><button onClick={() => handleMove(idx, 'down')} className="text-gray-600 hover:text-violet-400 transition disabled:opacity-0" disabled={idx === products.length - 1}><window.Icons.ArrowDown size={14}/></button></div></td>
                                            <td className="p-5"><div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-700 border border-white/10 shadow-sm flex items-center justify-center">{p.images && p.images.length > 0 ? (window.isVideo(p.images[0]) ? (<window.Icons.Video size={24} className="text-gray-400"/>) : (<img src={p.images[0]} alt="" className="w-full h-full object-cover"/>)) : (<window.Icons.Image size={20} className="text-gray-600"/>)}</div></td>
                                            <td className="p-5"><div className="font-bold text-white text-lg mb-1">{p.name}</div><div className="flex gap-2">{p.isHit && <span className="text-[10px] font-bold bg-fuchsia-900/50 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-500/30">HIT</span>}{p.isSale && <span className="text-[10px] font-bold bg-red-900/50 text-red-300 px-2 py-0.5 rounded border border-red-500/30">SALE</span>}{!p.inStock && <span className="text-[10px] font-bold bg-gray-700 text-gray-300 px-2 py-0.5 rounded">НЕМАЄ</span>}{!p.isVisible && <span className="text-[10px] font-bold bg-black text-gray-500 px-2 py-0.5 rounded border border-gray-700">ПРИХОВАНО</span>}</div></td>
                                            <td className="p-5 text-gray-400 hidden md:table-cell"><span className="bg-slate-900 px-3 py-1 rounded-full text-sm">{p.category}</span></td>
                                            <td className="p-5 font-mono text-white font-bold text-lg">{p.price} ₴</td>
                                            <td className="p-5 text-right whitespace-nowrap"><div className="flex justify-end gap-2">
                                                <button onClick={()=>handleToggleStock(p)} className={`p-2.5 rounded-xl transition border ${p.inStock === false ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white'}`} title={p.inStock === false ? "Немає в наявності" : "В наявності"}>{p.inStock === false ? <window.Icons.PackageX size={18}/> : <window.Icons.PackageCheck size={18}/>}</button>
                                                <button onClick={()=>handleToggleVisibility(p)} className={`p-2.5 rounded-xl transition border ${p.isVisible === false ? 'bg-slate-800 border-white/10 text-gray-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white'}`} title="Видимість">{p.isVisible === false ? <window.Icons.EyeOff size={18}/> : <window.Icons.Eye size={18}/>}</button>
                                                <button onClick={()=>handleDuplicate(p)} className="p-2.5 rounded-xl bg-slate-700 hover:bg-cyan-600 text-white transition border border-white/10" title="Дублювати"><window.Icons.Copy size={18}/></button>
                                                <button onClick={()=>handleEdit(p)} className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition shadow-lg hover:shadow-violet-500/30" title="Редагувати"><window.Icons.Edit2 size={18}/></button>
                                                <button onClick={()=>handleDelete(p.id)} className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-600 text-gray-400 hover:text-white transition border border-white/10" title="Видалити"><window.Icons.Trash2 size={18}/></button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1"><div className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-24 shadow-xl"><h3 className="font-bold text-xl mb-6 text-white flex items-center gap-2"><window.Icons.Plus className="text-green-500"/> Новий промокод</h3><form onSubmit={handleCreatePromo} className="space-y-5"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Код купона</label><input required className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 uppercase text-white font-mono text-lg focus:border-green-500 outline-none" placeholder="Напр. SALE2024" value={promoForm.code} onChange={e=>setPromoForm({...promoForm, code:e.target.value.toUpperCase()})}/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Тип</label><select className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 text-white outline-none" value={promoForm.type} onChange={e=>setPromoForm({...promoForm, type:e.target.value})}><option value="fixed">Гривні (₴)</option><option value="percent">Відсоток (%)</option></select></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Значення</label><input required type="number" className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 text-white outline-none" placeholder="0" value={promoForm.value} onChange={e=>setPromoForm({...promoForm, value:Number(e.target.value)})}/></div></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Ліміт використань</label><input required type="number" className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 text-white outline-none" placeholder="100" value={promoForm.maxUses} onChange={e=>setPromoForm({...promoForm, maxUses:Number(e.target.value)})}/></div><button className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95">Створити промокод</button></form></div></div>
                        <div className="lg:col-span-2 space-y-4">{promocodes.length === 0 && (<div className="text-center py-20 bg-slate-800 rounded-3xl border border-dashed border-white/10"><window.Icons.Ticket size={48} className="mx-auto text-gray-600 mb-4"/><p className="text-gray-400 text-lg">Створіть свій перший промокод</p></div>)}{promocodes.map(promo => { const percentUsed = Math.min(100, (promo.usedCount / promo.maxUses) * 100); const isExhausted = promo.usedCount >= promo.maxUses; return (<div key={promo.id} className={`bg-slate-800 p-6 rounded-2xl border transition group hover:border-white/20 shadow-lg ${isExhausted ? 'border-red-500/30 opacity-75' : 'border-white/10'}`}><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"><div className="flex-1"><div className="flex items-center gap-4 mb-2"><span className="text-2xl font-black text-white tracking-widest bg-slate-900 px-4 py-2 rounded-lg border border-dashed border-gray-600 font-mono select-all">{promo.code}</span><span className={`font-bold text-lg ${promo.type === 'percent' ? 'text-fuchsia-400' : 'text-green-400'}`}>-{promo.value} {promo.type === 'percent' ? '%' : '₴'}</span>{isExhausted && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Вичерпано</span>}</div><div className="flex items-center gap-3 text-sm text-gray-400"><span>Використано: <strong className="text-white">{promo.usedCount}</strong> з {promo.maxUses}</span><div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden w-32 md:w-48"><div className={`h-full rounded-full ${isExhausted ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${percentUsed}%`}}></div></div></div></div><div className="flex items-center gap-3"><button onClick={()=>addPromoUses(promo)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"><window.Icons.Plus size={16}/> Ліміт</button><button onClick={()=>handleDeletePromo(promo.id)} className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition border border-red-500/20">Видалити</button></div></div></div>)})}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
