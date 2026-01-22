const { useState, useEffect } = React;

// Цей компонент відповідає ТІЛЬКИ за відображення замовлень
window.AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Підключаємося до бази
    let db = null;
    try {
        if (window.firebase && firebase.apps.length) {
            db = firebase.firestore();
        }
    } catch (e) { console.error(e); }

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        // Слухаємо замовлення в реальному часі
        const unsubscribe = db.collection('orders')
            .orderBy('date', 'desc') // Спочатку найновіші
            .limit(50) // Беремо останні 50
            .onSnapshot(snapshot => {
                const loadedOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(loadedOrders);
                setLoading(false);
            }, error => {
                console.error("Помилка завантаження замовлень:", error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-400 animate-pulse">Завантаження замовлень...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-2xl">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-400">Замовлень поки немає</p>
                <p className="text-sm text-gray-600 mt-2">Тут з'являться нові покупки ваших клієнтів</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {orders.map(order => (
                <div key={order.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg hover:border-violet-500/50 transition-all">
                    {/* Верхня частина картки: Дата, ID, Сума */}
                    <div className="flex flex-col md:flex-row justify-between md:items-start border-b border-white/5 pb-4 mb-4 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-mono bg-slate-900 text-gray-400 px-2 py-1 rounded border border-white/5">
                                    #{order.id.slice(0, 6)}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(order.date).toLocaleString('uk-UA')}
                                </span>
                                {order.isFreeShipping && (
                                    <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                        Free Ship
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-white">
                                {order.client?.name || 'Анонім'}
                            </h3>
                            <div className="text-violet-400 text-sm font-medium">
                                {order.client?.phone}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                {order.total} <span className="text-sm text-gray-400 font-normal">₴</span>
                            </div>
                            <div className="text-xs uppercase font-bold tracking-wider mt-1">
                                {order.paymentMethod === 'card' ? (
                                    <span className="text-blue-400 flex items-center justify-end gap-1"><window.Icons.CreditCard size={12}/> На карту</span>
                                ) : (
                                    <span className="text-yellow-400 flex items-center justify-end gap-1"><window.Icons.Box size={12}/> Післяплата</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Список товарів */}
                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-2 mb-4">
                        {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                                    <span>{item.name}</span>
                                </div>
                                <div className="text-gray-400 font-mono whitespace-nowrap">
                                    {item.qty} x {item.price} ₴
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Деталі доставки та знижки */}
                    <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-400 bg-slate-900 p-3 rounded-lg">
                        <div>
                            <span className="block text-gray-600 uppercase font-bold mb-1">Доставка:</span>
                            {order.client?.city}, {order.client?.department}
                        </div>
                        <div>
                            <span className="block text-gray-600 uppercase font-bold mb-1">Telegram:</span>
                            {order.client?.telegram ? (
                                <span className="text-blue-400">@{order.client.telegram.replace('@', '')}</span>
                            ) : '-'}
                        </div>
                        {order.client?.comment && (
                            <div className="md:col-span-2 border-t border-white/5 pt-2 mt-1">
                                <span className="text-yellow-500 font-bold">⚠️ Коментар:</span> <span className="text-gray-300 italic">"{order.client.comment}"</span>
                            </div>
                        )}
                        {order.discount > 0 && (
                            <div className="md:col-span-2 text-green-400 border-t border-white/5 pt-2 mt-1">
                                <window.Icons.Tag size={10} className="inline mr-1"/>
                                Використано промокод: <strong>{order.promoCode}</strong> (Знижка {order.discount} ₴)
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};