window.AdminOrders = ({ orders, products }) => {
    const { useState, useEffect } = React;
    const Icons = window.Icons;
    const db = window.firebase ? firebase.firestore() : null;

    // СТАНИ
    const [filterStatus, setFilterStatus] = useState('all'); // all, new, processing, shipped, completed
    const [editingOrder, setEditingOrder] = useState(null); // Об'єкт замовлення, яке редагуємо
    const [newItemId, setNewItemId] = useState(""); // Для додавання товару в редакторі

    // КОНСТАНТИ СТАТУСІВ
    const STATUSES = {
        new: { label: 'Нове', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', icon: Icons.Star },
        processing: { label: 'Опрацьовано', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', icon: Icons.Settings },
        shipped: { label: 'Відправлено', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50', icon: Icons.Truck },
        completed: { label: 'Завершено', color: 'bg-green-500/20 text-green-400 border-green-500/50', icon: Icons.Check },
    };

    // --- ФУНКЦІЇ КЕРУВАННЯ ---

    // 1. Зміна статусу
    const updateStatus = async (orderId, newStatus) => {
        if (!db) return;
        try {
            await db.collection('orders').doc(orderId).update({ status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Помилка оновлення статусу");
        }
    };

    // 2. Збереження ТТН
    const updateTTN = async (orderId, ttn) => {
        if (!db) return;
        try {
            await db.collection('orders').doc(orderId).update({ ttn: ttn });
        } catch (error) {
            console.error("Error updating TTN:", error);
        }
    };

    // 3. Видалення замовлення
    const deleteOrder = async (orderId) => {
        if (!window.confirm("Ви точно хочете видалити це замовлення назавжди?")) return;
        if (!db) return;
        try {
            await db.collection('orders').doc(orderId).delete();
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Помилка видалення");
        }
    };

    // 4. Збереження змін після редагування
    const saveEditedOrder = async () => {
        if (!db || !editingOrder) return;
        
        // Перерахунок сум
        const newSubtotal = editingOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        // Якщо була знижка, перевіряємо, щоб вона не перевищувала суму
        const safeDiscount = Math.min(editingOrder.discount || 0, newSubtotal);
        const newTotal = Math.max(0, newSubtotal - safeDiscount);

        try {
            await db.collection('orders').doc(editingOrder.id).update({
                items: editingOrder.items,
                client: editingOrder.client,
                subtotal: newSubtotal,
                total: newTotal,
                discount: safeDiscount
            });
            setEditingOrder(null);
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Помилка збереження");
        }
    };

    // --- ЛОГІКА РЕДАКТОРА ---
    const updateItemQty = (index, delta) => {
        const newItems = [...editingOrder.items];
        newItems[index].qty = Math.max(1, newItems[index].qty + delta);
        setEditingOrder({ ...editingOrder, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = editingOrder.items.filter((_, i) => i !== index);
        setEditingOrder({ ...editingOrder, items: newItems });
    };

    const addItemToOrder = () => {
        if (!newItemId) return;
        const product = products.find(p => p.id === newItemId);
        if (product) {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                qty: 1,
                category: product.category || 'Товар'
            };
            const existingIndex = editingOrder.items.findIndex(i => i.id === newItem.id);
            if (existingIndex >= 0) {
                updateItemQty(existingIndex, 1);
            } else {
                setEditingOrder({ ...editingOrder, items: [...editingOrder.items, newItem] });
            }
            setNewItemId("");
        }
    };

    // СОРТУВАННЯ ТА ФІЛЬТРАЦІЯ
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const filteredOrders = filterStatus === 'all' 
        ? sortedOrders 
        : sortedOrders.filter(o => (o.status || 'new') === filterStatus);

    // --- РЕНДЕР ---
    return (
        <div className="space-y-6">
            {/* ФІЛЬТРИ */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-800 rounded-2xl border border-white/10">
                <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filterStatus === 'all' ? 'bg-white text-black' : 'bg-slate-700 text-gray-400 hover:text-white'}`}>Всі</button>
                {Object.entries(STATUSES).map(([key, config]) => (
                    <button key={key} onClick={() => setFilterStatus(key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition border ${filterStatus === key ? config.color : 'border-transparent bg-slate-700 text-gray-400 hover:text-white'}`}>
                        <config.icon size={14}/> {config.label}
                    </button>
                ))}
            </div>

            {/* СПИСОК ЗАМОВЛЕНЬ */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Замовлень немає 🤷‍♂️</div>
                ) : (
                    filteredOrders.map(order => {
                        const statusConfig = STATUSES[order.status || 'new'] || STATUSES.new;
                        return (
                            <div key={order.id} className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden hover:border-violet-500/30 transition">
                                {/* HEADER ЗАМОВЛЕННЯ */}
                                <div className="p-4 bg-slate-900/50 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-bold text-lg">№ {order.id.slice(0, 6).toUpperCase()}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                                        </div>
                                        <div className="text-sm text-gray-300 flex items-center gap-2">
                                            <Icons.User size={14} className="text-violet-400"/> {order.client?.name}
                                            <span className="text-gray-600">|</span>
                                            <a href={`tel:${order.client?.phone}`} className="hover:text-white transition">{order.client?.phone}</a>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* STATUS DROPDOWN */}
                                        <div className="relative group">
                                            <select 
                                                value={order.status || 'new'} 
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`appearance-none pl-8 pr-8 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-transparent border cursor-pointer focus:outline-none ${statusConfig.color}`}
                                            >
                                                {Object.entries(STATUSES).map(([key, conf]) => (
                                                    <option key={key} value={key} className="bg-slate-800 text-gray-300">{conf.label}</option>
                                                ))}
                                            </select>
                                            <statusConfig.icon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                            <Icons.ArrowDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
                                        </div>

                                        <button onClick={() => setEditingOrder(order)} className="p-2 bg-slate-700 hover:bg-violet-600 text-white rounded-lg transition" title="Редагувати">
                                            <Icons.Edit2 size={18}/>
                                        </button>
                                        <button onClick={() => deleteOrder(order.id)} className="p-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition" title="Видалити">
                                            <Icons.Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>

                                {/* ТТН (Якщо відправлено) */}
                                {order.status === 'shipped' && (
                                    <div className="px-4 py-3 bg-purple-900/20 border-b border-white/5 flex items-center gap-2">
                                        <span className="text-xs font-bold text-purple-300">ТТН Нової Пошти:</span>
                                        <input 
                                            type="text" 
                                            placeholder="Введіть номер..." 
                                            className="bg-transparent border-b border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 w-full max-w-xs"
                                            defaultValue={order.ttn || ''}
                                            onBlur={(e) => updateTTN(order.id, e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* ДЕТАЛІ */}
                                <div className="p-4 grid md:grid-cols-2 gap-6">
                                    {/* Інфо про доставку */}
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <p><span className="text-gray-500 font-bold">Місто:</span> {order.client?.city}</p>
                                        <p><span className="text-gray-500 font-bold">Відділення:</span> {order.client?.department}</p>
                                        <p><span className="text-gray-500 font-bold">Оплата:</span> {order.paymentMethod === 'card' ? 'На карту' : 'Післяплата'}</p>
                                        {order.client?.comment && (
                                            <div className="mt-2 p-2 bg-slate-900/50 rounded-lg border border-white/5 italic text-gray-300">
                                                "{order.client.comment}"
                                            </div>
                                        )}
                                        {order.client?.dontCall && (
                                            <div className="inline-flex items-center gap-1 text-red-400 text-xs font-bold mt-1 border border-red-500/30 px-2 py-1 rounded">
                                                <Icons.Phone size={12}/> НЕ ДЗВОНИТИ
                                            </div>
                                        )}
                                    </div>

                                    {/* Товари */}
                                    <div>
                                        <div className="space-y-2">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                                                    <span className="text-white font-mono">{item.price * item.qty} ₴</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-end">
                                            <div className="text-xs text-gray-500">
                                                {order.discount > 0 && <div>Знижка: -{order.discount} ₴</div>}
                                                {order.isFreeShipping && <div className="text-green-500">Безкоштовна доставка</div>}
                                            </div>
                                            <div className="text-xl font-bold text-white">{order.total} ₴</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* МОДАЛКА РЕДАГУВАННЯ */}
            {editingOrder && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingOrder(null)}>
                    <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
                            <h3 className="text-xl font-bold text-white">Редагування замовлення</h3>
                            <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-white"><Icons.X size={24}/></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Ім'я</label>
                                    <input className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" 
                                        value={editingOrder.client?.name || ''} 
                                        onChange={e => setEditingOrder({...editingOrder, client: {...editingOrder.client, name: e.target.value}})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Телефон</label>
                                    <input className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" 
                                        value={editingOrder.client?.phone || ''} 
                                        onChange={e => setEditingOrder({...editingOrder, client: {...editingOrder.client, phone: e.target.value}})} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white">Товари:</h4>
                                {editingOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-white/5">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white text-sm truncate">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.price} ₴</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateItemQty(idx, -1)} className="p-1 text-gray-400 hover:text-white bg-slate-800 rounded"><Icons.Minus size={14}/></button>
                                            <span className="text-white font-bold w-6 text-center">{item.qty}</span>
                                            <button onClick={() => updateItemQty(idx, 1)} className="p-1 text-gray-400 hover:text-white bg-slate-800 rounded"><Icons.Plus size={14}/></button>
                                        </div>
                                        <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Icons.Trash2 size={18}/></button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <select 
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                                    value={newItemId}
                                    onChange={e => setNewItemId(e.target.value)}
                                >
                                    <option value="">+ Додати товар до замовлення</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - {p.price} ₴</option>
                                    ))}
                                </select>
                                <button onClick={addItemToOrder} disabled={!newItemId} className="bg-violet-600 hover:bg-violet-700 text-white px-4 rounded-xl font-bold disabled:opacity-50">OK</button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-end gap-3">
                            <button onClick={() => setEditingOrder(null)} className="px-6 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5">Скасувати</button>
                            <button onClick={saveEditedOrder} className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg">Зберегти зміни</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
