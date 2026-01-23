const { useState, useEffect } = React;

window.InfoPage = ({ page, goBack }) => {
    const INFO_PAGES_DATA = {
        about: {
            title: "Про нас",
            content: (
                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p className="text-lg font-medium text-white">Привіт, ми Night Secret! 👋</p>
                    <p>Ми не просто магазин, ми — твій провідник у світ, де задоволення стоїть на першому місці. Ми віримо, що сексуальне здоров'я та щастя — це не табу, а норма життя.</p>
                    <p>Наша місія — зробити твої ночі (і дні 😉) яскравішими, емоційнішими та чуттєвішими. Ми ретельно відбираємо кожен девайс, тестуємо якість і гарантуємо, що ти отримаєш лише найкраще.</p>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-violet-500/20 my-6">
                        <h3 className="text-white font-bold mb-2">Чому ми?</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><strong>Анонімність 80 lvl:</strong> Ніхто, навіть кур'єр, не знає, що всередині.</li>
                            <li><strong>Тільки оригінали:</strong> Ніяких дешевих підробок, тільки сертифіковані бренди.</li>
                            <li><strong>Швидкість ракети:</strong> Відправляємо в день замовлення.</li>
                        </ul>
                    </div>
                    <p>Розслабся, обирай і пам'ятай: твоя таємниця в безпеці з нами. 🤫💜</p>
                </div>
            )
        },
        delivery: {
            title: "Оплата та доставка",
            content: (
                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <div className="flex items-start gap-4 p-4 bg-slate-800 rounded-xl">
                        <Icons.Truck size={32} className="text-violet-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Доставка Новою Поштою</h3>
                            <p>Відправляємо щодня. Якщо замовиш до 18:00 — поїде сьогодні! 🚀</p>
                            <p className="mt-2 text-sm text-gray-400">Вартість доставки — за тарифами перевізника. При замовленні від 2000 грн — <strong>доставка безкоштовна!</strong></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-800 rounded-xl">
                        <Icons.ShieldCheck size={32} className="text-green-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">100% Анонімність</h3>
                            <p>Ми пакуємо замовлення у непрозорі чорні пакети або коробки без будь-яких логотипів чи написів "секс-шоп".</p>
                            <p className="mt-2 text-sm text-gray-400">В описі посилки вказуємо нейтральне: "Косметика" або "Сувеніри". Ніякого незручного моменту на пошті! 😎</p>
                        </div>
                    </div>
                    <h3 className="text-white font-bold text-xl mt-8 mb-4">Способи оплати</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3"><span className="w-2 h-2 bg-violet-500 rounded-full"></span><span><strong>Накладений платіж:</strong> Оплачуй при отриманні, після огляду посилки. (Комісія НП: 20 грн + 2%)</span></li>
                        <li className="flex items-center gap-3"><span className="w-2 h-2 bg-violet-500 rounded-full"></span><span><strong>На карту (Mono/Privat):</strong> Без зайвих комісій. Реквізити надішлемо після підтвердження.</span></li>
                    </ul>
                </div>
            )
        },
        returns: {
            title: "Повернення та обмін",
            content: (
                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center">
                        <h3 className="text-red-400 font-bold text-xl mb-2">🚫 Гігієна — це закон!</h3>
                        <p>І це найкраща новина для тебе!</p>
                    </div>
                    <p>Давай чесно. Ти б хотів купити вібратор, який хтось вже "приміряв", але потім передумав і повернув? 🤢 Точно ні.</p>
                    <p>Саме тому, згідно з <strong>Постановою Кабінету Міністрів України №172</strong>, товари інтимного призначення, натільна білизна, панчішно-шкарпеткові вироби та парфумерно-косметичні засоби <strong>НЕ підлягають поверненню та обміну</strong>.</p>
                    <div className="bg-slate-800 p-6 rounded-2xl border-l-4 border-violet-500 my-6">
                        <h4 className="text-white font-bold mb-2">Що це означає для тебе?</h4>
                        <p className="text-sm">Це твоя 100% гарантія того, що товар, який ти отримуєш, є <strong>абсолютно новим, чистим та стерильним</strong>. Ніхто до тебе його не відкривав і не використовував. Ми дбаємо про твоє здоров'я понад усе.</p>
                    </div>
                    <h3 className="text-white font-bold text-lg">А якщо брак? 🤔</h3>
                    <p>Ми перевіряємо кожен девайс перед відправкою (так-так, вмикаємо і дивимось, чи дзижчить!). Але техніка є техніка.</p>
                    <p>Якщо ти виявив заводський брак <strong>при отриманні на пошті</strong> — склади акт огляду та відмовся від посилки. Ми надішлемо новий товар або повернемо гроші.</p>
                </div>
            )
        },
        privacy: {
            title: "Політика конфіденційності",
            content: (
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                    <p>Ми в Night Secret ставимося до твоїх даних як до швейцарського банківського рахунку — суворо конфіденційно. 🔒</p>
                    <p>1. <strong>Які дані ми збираємо:</strong> Лише те, що потрібно для доставки: ім'я, телефон, місто та відділення пошти.</p>
                    <p>2. <strong>Кому передаємо:</strong> Лише службі доставки (Нова Пошта), щоб вони знали, куди везти твоє щастя.</p>
                    <p>3. <strong>Безпека:</strong> Наш сайт використовує захищене з'єднання. Твої дані не потраплять до рук третіх осіб.</p>
                </div>
            )
        },
        offer: {
            title: "Договір оферти",
            content: (
                <div className="space-y-4 text-gray-400 text-xs leading-relaxed">
                    <p>Цей текст є публічною офертою (пропозицією) інтернет-магазину Night Secret укласти договір купівлі-продажу товарів.</p>
                    <p><strong>1. Загальні положення</strong><br/>1.1. Цей Договір є публічним договором згідно зі ст. 633 Цивільного кодексу України.</p>
                    <p><strong>2. Предмет договору</strong><br/>2.1. Продавець зобов'язується передати товар у власність Покупця.</p>
                    <p className="mt-8">ФОП "Night Secret"<br/>м. Київ, вул. Насолоди, 69</p>
                </div>
            )
        }
    };

    const data = INFO_PAGES_DATA[page];
    if (!data) return null;
    return (
        <div className="min-h-screen bg-slate-900 pb-20 pt-10 animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white mb-8 gap-2"><Icons.ArrowLeft size={20}/> Назад</button>
                <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-white/10 pb-6">{data.title}</h1>
                    <div className="prose prose-invert max-w-none">{data.content}</div>
                </div>
            </div>
        </div>
    );
};

window.ProductPage = ({ product, goBack, addToCart, wishlist, toggleWishlist, viewedItems, products, navigateToProduct }) => {
    const [currentImg, setCurrentImg] = useState(0);
    if (!product) return null;
    const images = product.images || [];
    const isLiked = wishlist.includes(product.id);
    return (
        <div className="min-h-screen bg-slate-900 pb-20 pt-10 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white mb-8 gap-2"><Icons.ArrowLeft size={20}/> Назад</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 select-none">
                        <div className={`aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl relative group ${product.inStock === false ? 'grayscale-card' : ''}`}>
                            {images.length > 0 ? (
                                <div key={currentImg} className="w-full h-full animate-fade-fast bg-black flex items-center justify-center">
                                    {isVideo(images[currentImg]) ? <video src={images[currentImg]} controls autoPlay className="w-full h-full object-contain" /> : <img src={images[currentImg]} className="w-full h-full object-cover" />}
                                </div>
                            ) : (<div className="w-full h-full flex items-center justify-center text-gray-600"><Icons.Image size={64}/></div>)}
                            <button onClick={() => toggleWishlist(product.id)} className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition z-20 ${isLiked ? 'bg-pink-600 text-white shadow-lg' : 'bg-black/30 text-white hover:bg-pink-600'}`}><Icons.Heart size={24} fill={isLiked ? "currentColor" : "none"} /></button>
                            {images.length > 1 && (<><button onClick={(e)=>{e.stopPropagation(); setCurrentImg(curr => curr === 0 ? images.length - 1 : curr - 1)}} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-violet-600 transition z-10"><Icons.ChevronLeft size={24}/></button><button onClick={(e)=>{e.stopPropagation(); setCurrentImg(curr => curr === images.length - 1 ? 0 : curr + 1)}} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-violet-600 transition z-10"><Icons.ChevronRight size={24}/></button></>)}
                        </div>
                        {images.length > 1 && (<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">{images.map((img, idx) => (<button key={idx} onClick={() => setCurrentImg(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImg === idx ? 'border-violet-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>{isVideo(img) ? <div className="w-full h-full bg-black flex items-center justify-center"><Icons.Video size={24} className="text-white"/></div> : <img src={img} className="w-full h-full object-cover"/>}</button>))}</div>)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-violet-900/50 text-violet-300 text-sm font-bold">{product.category}</span>
                            {product.isHit && <span className="bg-fuchsia-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1"><Icons.Flame size={10}/> HIT</span>}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{product.name}</h1>
                        <div className="flex items-end gap-4 mb-8"><span className="text-4xl font-bold text-white">{product.price} ₴</span>{product.oldPrice > 0 && <span className="text-xl text-gray-500 line-through mb-1">{product.oldPrice} ₴</span>}</div>
                        <p className="text-lg text-gray-300 leading-relaxed mb-10">{product.description}</p>
                        {product.specs && product.specs.length > 0 && (<div className="bg-slate-800/50 rounded-2xl p-6 mb-10 border border-white/5"><h3 className="font-bold text-white mb-4">Характеристики</h3><ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">{product.specs.map((spec, idx) => (<li key={idx} className="flex items-center text-gray-400 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-3"></span>{spec}</li>))}</ul></div>)}
                        <div className="flex gap-4"><AddToCartBtn product={product} addToCart={addToCart} variant="full" /></div>
                    </div>
                </div>
                <RecentlyViewed viewedItems={viewedItems} products={products} navigateToProduct={navigateToProduct} />
            </div>
        </div>
    );
};

window.WishlistView = ({ wishlist, products, navigateToProduct, addToCart, toggleWishlist }) => {
    const wishProducts = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><Icons.Heart className="text-pink-500" fill="currentColor"/> Мої бажання</h1>
                {wishProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Ви ще нічого не додали до бажаного 💔</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishProducts.map(p => <ProductCard key={p.id} product={p} navigateToProduct={navigateToProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

window.CartView = ({ cart, updateQty, removeFromCart, changeRoute, cartTotal, promocodes, applyPromo, appliedPromo, cancelPromo, setCart }) => {
    // Використовуємо React.useState, щоб уникнути "фіолетового екрана"
    const [promoInput, setPromoInput] = React.useState("");
    const [formData, setFormData] = React.useState({ name: '', phone: '', city: '', department: '', payment: 'card', comment: '', telegram: '' });
    const [isSending, setIsSending] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const FREE_DELIVERY_LIMIT = 2000;
    let discountAmount = 0;
    if (appliedPromo) { 
        discountAmount = appliedPromo.type === 'percent' ? Math.round(cartTotal * (appliedPromo.value / 100)) : appliedPromo.value; 
    }
    const finalTotal = Math.max(0, cartTotal - discountAmount);
    const neededForFreeDelivery = Math.max(0, FREE_DELIVERY_LIMIT - finalTotal);
    const progressPercent = Math.min(100, (finalTotal / FREE_DELIVERY_LIMIT) * 100);

    // ФУНКЦІЯ ВІДПРАВКИ
    const handleOrderSubmit = async (e) => {
        if (e) e.preventDefault();
        if (isSending) return;
        setIsSending(true);

        const orderData = {
            date: new Date().toISOString(),
            status: 'new',
            total: finalTotal,
            subtotal: cartTotal,
            discount: discountAmount,
            promoCode: appliedPromo ? appliedPromo.code : null,
            paymentMethod: formData.payment,
            client: formData,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty
            }))
        };

        try {
            if (window.firebase) {
                const db = firebase.firestore();
                await db.collection('orders').add(orderData);
                
                if (appliedPromo) {
                    const promoRef = db.collection('promocodes').where('code', '==', appliedPromo.code).limit(1);
                    const snapshot = await promoRef.get();
                    if (!snapshot.empty) {
                        snapshot.docs[0].ref.update({ usedCount: firebase.firestore.FieldValue.increment(1) });
                    }
                }
            }
            setIsSuccess(true);
            if (typeof setCart === 'function') setCart([]); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка замовлення. Спробуйте пізніше.");
        } finally {
            setIsSending(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <window.Icons.Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Замовлення прийнято! 🎉</h2>
                <button onClick={() => changeRoute('home')} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold">На головну</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Кошик</h1>
                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-white/10">
                        <window.Icons.ShoppingBag size={64} className="mx-auto text-gray-600 mb-4"/>
                        <p className="text-gray-400">Кошик порожній</p>
                        <button onClick={() => changeRoute('home')} className="mt-4 text-violet-400 font-bold">До покупок</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ЛІНІЯ ДОСТАВКИ */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
                            {neededForFreeDelivery > 0 ? (
                                <p className="text-sm text-white mb-2 font-bold">Додайте товарів ще на <span className="text-violet-400">{neededForFreeDelivery} ₴</span> для безкоштовної доставки!</p>
                            ) : <p className="text-sm text-green-400 mb-2 font-bold flex items-center gap-2"><window.Icons.Flame size={16}/> Ура! У вас безкоштовна доставка!</p>}
                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* ТОВАРИ */}
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 border-b border-white/5 items-center">
                                    <img src={item.images?.[0]} className="w-16 h-16 rounded object-cover"/>
                                    <div className="flex-1 text-white"><h3 className="font-bold">{item.name}</h3><p className="text-sm text-gray-400">{item.price} ₴</p></div>
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-white/5">
                                        <button onClick={()=>updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Minus size={16}/></button>
                                        <span className="w-8 text-center text-white font-bold">{item.qty}</span>
                                        <button onClick={()=>updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Plus size={16}/></button>
                                    </div>
                                    <button onClick={()=>removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2"><window.Icons.Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>

                        {/* ПРОМОКОД */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10 flex items-center gap-2">
                            <window.Icons.Ticket className="text-violet-500" />
                            {appliedPromo ? (
                                <div className="flex-1 flex justify-between items-center text-white">
                                    <span className="text-green-400 font-bold">Код {appliedPromo.code} застосовано!</span>
                                    <button onClick={cancelPromo} className="text-xs text-gray-400 hover:text-white underline">Скасувати</button>
                                </div>
                            ) : (
                                <><input value={promoInput} onChange={e=>setPromoInput(e.target.value)} placeholder="Маєте промокод?" className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"/>
                                <button onClick={()=> {const p = promocodes.find(c=>c.code===promoInput.toUpperCase()); if(p && p.usedCount < p.maxUses) applyPromo(promoInput); else alert("Невірний код"); setPromoInput("")}} className="text-sm font-bold text-violet-400 hover:text-white">ОК</button></>
                            )}
                        </div>

                        {/* ДАНІ КЛІЄНТА */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><window.Icons.User size={20} className="text-violet-400"/> Дані для доставки</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Ім'я та Прізвище" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input required placeholder="Телефон" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                <input required placeholder="Місто" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" 
                                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                <input required placeholder="Відділення НП" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500" 
                                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                            </div>
                            <div className="flex gap-4 p-2">
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" checked={formData.payment === 'card'} onChange={() => setFormData({...formData, payment: 'card'})} />
                                    <span className="text-sm text-gray-300">На карту</span>
                                </label>
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} />
                                    <span className="text-sm text-gray-300">Післяплата</span>
                                </label>
                            </div>
                        </div>

                        {/* ПІДСУМОК */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xl font-bold text-white"><span>Разом:</span><span className="text-violet-400">{finalTotal} ₴</span></div>
                            <button onClick={handleOrderSubmit} disabled={isSending || !formData.name || !formData.phone} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50">
                                {isSending ? 'Надсилаємо...' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

    // ЕКРАН ПІСЛЯ ЗАМОВЛЕННЯ
    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-bounce">
                    <window.Icons.Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Замовлення прийнято! 🎉</h2>
                <p className="text-gray-400 mb-8 text-lg">Ми вже отримали ваші дані та готуємо відправку.</p>
                <button onClick={() => changeRoute('home')} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">На головну</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Кошик</h1>
                
                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-white/10">
                        <window.Icons.ShoppingBag size={64} className="mx-auto text-gray-600 mb-4"/>
                        <p className="text-gray-400">Кошик порожній</p>
                        <button onClick={() => changeRoute('home')} className="mt-4 text-violet-400 font-bold">До покупок</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ПРОГРЕС-БАР ДОСТАВКИ */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
                            {neededForFreeDelivery > 0 ? (
                                <p className="text-sm text-white mb-2 font-bold">Додайте товарів ще на <span className="text-violet-400">{neededForFreeDelivery} ₴</span> для безкоштовної доставки!</p>
                            ) : <p className="text-sm text-green-400 mb-2 font-bold flex items-center gap-2"><window.Icons.Flame size={16}/> Ура! У вас безкоштовна доставка!</p>}
                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* ТОВАРИ В КОШИКУ */}
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 border-b border-white/5 items-center last:border-0">
                                    <img src={item.images?.[0]} className="w-16 h-16 rounded object-cover flex-shrink-0 bg-slate-700"/>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm md:text-base truncate">{item.name}</h3>
                                        <p className="text-sm text-violet-400 font-bold">{item.price} ₴</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-white/5">
                                        <button onClick={()=>updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Minus size={16}/></button>
                                        <input type="number" readOnly value={item.qty} className="w-10 bg-transparent text-center text-white font-bold outline-none text-sm" />
                                        <button onClick={()=>updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Plus size={16}/></button>
                                    </div>
                                    <button onClick={()=>removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2 transition"><window.Icons.Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>

                        {/* ПРОМОКОД */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10 flex items-center gap-2">
                            <window.Icons.Ticket className="text-violet-500" />
                            {appliedPromo ? (
                                <div className="flex-1 flex justify-between items-center text-sm">
                                    <span className="text-green-400 font-bold">Код {appliedPromo.code} застосовано!</span>
                                    <button onClick={cancelPromo} className="text-xs text-gray-400 hover:text-white underline">Скасувати</button>
                                </div>
                            ) : (
                                <div className="flex-1 flex gap-2">
                                    <input value={promoInput} onChange={e=>setPromoInput(e.target.value)} placeholder="Маєте промокод?" className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"/>
                                    <button onClick={()=> {const p = promocodes.find(c=>c.code===promoInput.toUpperCase()); if(p && p.usedCount < p.maxUses) applyPromo(promoInput); else alert("Невірний код"); setPromoInput("")}} className="text-sm font-bold text-violet-400 hover:text-white">ОК</button>
                                </div>
                            )}
                        </div>

                        {/* ФОРМА ДАНИХ (Тут клієнт вводить ПІБ та Телефон) */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">📫 Дані для доставки</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="ПІБ отримувача" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input required type="tel" placeholder="Номер телефону" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                <input required placeholder="Місто" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                <input required placeholder="Відділення / Поштомат НП" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                            </div>
                            <input placeholder="Нік в Telegram (необов'язково)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} />
                            <textarea placeholder="Коментар або побажання..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition h-20 resize-none text-sm" 
                                value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
                            
                            <div className="flex gap-4 p-1">
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" name="payment" checked={formData.payment === 'card'} onChange={() => setFormData({...formData, payment: 'card'})} className="accent-violet-500"/>
                                    <span className="text-sm text-gray-300">Оплата на карту</span>
                                </label>
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" name="payment" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} className="accent-violet-500"/>
                                    <span className="text-sm text-gray-300">Післяплата</span>
                                </label>
                            </div>
                        </div>

                        {/* ПІДСУМОК ТА КНОПКА */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="space-y-2 text-right">
                                <div className="flex justify-between items-center text-gray-400"><span>Сума:</span><span>{cartTotal} ₴</span></div>
                                {discountAmount > 0 && <div className="flex justify-between items-center text-green-400"><span>Знижка:</span><span>-{discountAmount} ₴</span></div>}
                                <div className="flex justify-between items-center text-2xl font-bold text-white"><span>Разом:</span><span className="text-violet-400">{finalTotal} ₴</span></div>
                            </div>
                            <button 
                                onClick={handleOrderSubmit} 
                                disabled={isSending || !formData.name || !formData.phone}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${isSending ? 'bg-slate-700' : 'bg-violet-600 hover:bg-violet-700 active:scale-[0.98]'}`}
                            >
                                {isSending ? <window.Icons.RefreshCw className="animate-spin" size={20}/> : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

    // ЕКРАН УСПІХУ
    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-bounce">
                    <window.Icons.Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Замовлення прийнято! 🎉</h2>
                <p className="text-gray-400 mb-8">Ми зв'яжемося з вами найближчим часом для підтвердження.</p>
                <button onClick={() => changeRoute('home')} className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold">На головну</button>
            </div>
        );
    }

    // ГОЛОВНИЙ ЕКРАН КОШИКА
    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Кошик</h1>
                
                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-white/10">
                        <window.Icons.ShoppingBag size={64} className="mx-auto text-gray-600 mb-4"/>
                        <p className="text-gray-400">Кошик порожній</p>
                        <button onClick={() => changeRoute('home')} className="mt-4 text-violet-400 font-bold">До покупок</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ЛІНІЯ ДОСТАВКИ */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
                            {neededForFreeDelivery > 0 ? (
                                <p className="text-sm text-white mb-2 font-bold">Додайте товарів ще на <span className="text-violet-400">{neededForFreeDelivery} ₴</span> для безкоштовної доставки!</p>
                            ) : <p className="text-sm text-green-400 mb-2 font-bold flex items-center gap-2"><window.Icons.Flame size={16}/> Ура! У вас безкоштовна доставка!</p>}
                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* СПИСОК ТОВАРІВ */}
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 border-b border-white/5 items-center">
                                    <img src={item.images?.[0]} className="w-16 h-16 rounded object-cover"/>
                                    <div className="flex-1"><h3 className="font-bold text-white">{item.name}</h3><p className="text-sm text-gray-400">{item.price} ₴</p></div>
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-white/5">
                                        <button onClick={()=>updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Minus size={16}/></button>
                                        <input type="number" value={item.qty} readOnly className="w-10 bg-transparent text-center text-white font-bold outline-none text-sm" />
                                        <button onClick={()=>updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Plus size={16}/></button>
                                    </div>
                                    <button onClick={()=>removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2"><window.Icons.Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>

                        {/* ПРОМОКОД */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10 flex items-center gap-2">
                            <window.Icons.Ticket className="text-violet-500" />
                            {appliedPromo ? (
                                <div className="flex-1 flex justify-between items-center"><span className="text-green-400 font-bold">Код {appliedPromo.code} застосовано!</span><button onClick={cancelPromo} className="text-xs text-gray-400 hover:text-white underline">Скасувати</button></div>
                            ) : (
                                <><input value={promoInput} onChange={e=>setPromoInput(e.target.value)} placeholder="Маєте промокод?" className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"/><button onClick={()=> {const p = promocodes.find(c=>c.code===promoInput.toUpperCase()); if(p && p.usedCount < p.maxUses) applyPromo(promoInput); else alert("Невірний код"); setPromoInput("")}} className="text-sm font-bold text-violet-400 hover:text-white transition">ОК</button></>
                            )}
                        </div>

                        {/* ФОРМА ОФОРМЛЕННЯ */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><window.Icons.User size={20} className="text-violet-400"/> Дані для доставки</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Ваше Ім'я та Прізвище" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input required type="tel" placeholder="Номер телефону" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                <input required placeholder="Місто" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                <input required placeholder="Відділення / Поштомат НП" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                            </div>
                            <input placeholder="Telegram нік (необов'язково)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} />
                            <textarea placeholder="Коментар до замовлення..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition h-24 resize-none" 
                                value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>

                            <div className="flex gap-4 p-2">
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" name="payment" checked={formData.payment === 'card'} onChange={() => setFormData({...formData, payment: 'card'})} className="accent-violet-500"/>
                                    <span className="text-sm text-gray-300">На карту</span>
                                </label>
                                <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-white/5 cursor-pointer">
                                    <input type="radio" name="payment" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} className="accent-violet-500"/>
                                    <span className="text-sm text-gray-300">Післяплата</span>
                                </label>
                            </div>
                        </div>

                        {/* ПІДСУМОК ТА КНОПКА */}
                        <div className="space-y-4">
                            <div className="space-y-2 text-right">
                                <div className="flex justify-between items-center text-gray-400"><span>Сума:</span><span>{cartTotal} ₴</span></div>
                                {discountAmount > 0 && <div className="flex justify-between items-center text-green-400"><span>Знижка:</span><span>-{discountAmount} ₴</span></div>}
                                <div className="flex justify-between items-center text-2xl font-bold text-white"><span>Разом:</span><span className="text-violet-400">{finalTotal} ₴</span></div>
                            </div>
                            <button 
                                onClick={handleOrderSubmit} 
                                disabled={isSending || !formData.name || !formData.phone || !formData.city} 
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isSending ? 'bg-slate-700' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-violet-500/25 active:scale-95'}`}
                            >
                                {isSending ? 'Надсилаємо...' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

window.CheckoutView = ({ cart, cartTotal, discountAmount, appliedPromo, goBack, clearCart, changeRoute }) => {
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', branch: '' });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [doNotCall, setDoNotCall] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    const TELEGRAM_BOT_TOKEN = "8490403071:AAFZvriLL_vzQq-ziMVTfiHAu8DmtH84Fjk";
    const TELEGRAM_CHAT_ID = "7085928669";
    
    const finalTotal = Math.max(0, cartTotal - discountAmount);
    const isFreeDelivery = finalTotal >= 2000;

    const submitOrder = async (e) => {
        e.preventDefault();
        setIsSending(true);
        const list = cart.map(i => `${i.name} (${i.qty} шт) - ${i.price * i.qty} грн`).join('\n');
        const payText = paymentMethod === 'card' ? '💳 Карта (Очікує оплати)' : '📦 Накладний платіж';
        
        const msg = `<b>🔥 НОВЕ ЗАМОВЛЕННЯ!</b>\n\n👤 <b>${form.firstName} ${form.lastName}</b>\n📞 ${form.phone}\n${doNotCall ? '⛔️ <b>НЕ ДЗВОНИТИ</b> (Писати в месенджери)' : '📞 Можна дзвонити'}\n\n🏙 ${form.city}\n📦 ${form.branch}\n\n💰 <b>Оплата:</b> ${payText}\n\n🛒 <b>Кошик:</b>\n${list}\n\n----------------\nСума: ${cartTotal} грн\n${discountAmount > 0 ? `🏷 Знижка (${appliedPromo?.code}): -${discountAmount} грн\n` : ''}🚚 Доставка: ${isFreeDelivery ? 'БЕЗКОШТОВНО' : 'За тарифами НП'}\n<b>💵 ДО СПЛАТИ: ${finalTotal} грн</b>`;
        
        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'HTML' }) });
            
            if (CONFIG.GOOGLE_SHEET_URL) {
                const sheetData = {
                    date: new Date().toLocaleString(),
                    name: `${form.firstName} ${form.lastName}`,
                    phone: form.phone,
                    city: form.city,
                    branch: form.branch,
                    products: cart.map(i => `${i.name} x${i.qty}`).join(", "),
                    total: finalTotal,
                    payment: paymentMethod,
                    doNotCall: doNotCall ? "Так" : "Ні"
                };
                fetch(CONFIG.GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(sheetData) }).catch(e => console.log("Sheet Error", e));
            }

            if (paymentMethod === 'card') alert("Замовлення прийнято! Менеджер надішле реквізити для оплати."); else alert("Дякуємо! Замовлення прийнято.");
            clearCart(true); 
            changeRoute('home');
        } catch (e) { alert("Помилка."); } finally { setIsSending(false); }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Оформлення</h1>
                <div className="bg-slate-800 rounded-2xl p-8 border border-white/10">
                    <button onClick={goBack} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"><Icons.ArrowLeft size={16}/> Назад</button>
                    <form onSubmit={submitOrder} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold text-gray-400 mb-2">Ім'я</label><input required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-gray-400 mb-2">Прізвище</label><input required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} /></div>
                        </div>
                        <input required placeholder="Телефон" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-900/50 p-3 rounded-xl border border-white/5 hover:border-violet-500/50 transition">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition ${doNotCall ? 'bg-violet-600 border-violet-600' : 'border-gray-500'}`}>{doNotCall && <Icons.Check size={16} className="text-white"/>}</div>
                            <input type="checkbox" className="hidden" checked={doNotCall} onChange={e => setDoNotCall(e.target.checked)}/>
                            <span className="text-gray-300 text-sm font-medium">⛔️ Не передзвонювати (підтвердити в месенджері)</span>
                        </label>
                        <div className="pt-4 border-t border-white/5"><h3 className="font-bold mb-4 flex gap-2"><Icons.Truck className="text-violet-500"/> Доставка</h3><div className="grid md:grid-cols-2 gap-4"><input required placeholder="Місто" list="cities" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} /><datalist id="cities">{window.POPULAR_CITIES.map(c=><option key={c} value={c}/>)}</datalist><input required placeholder="Відділення №" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500" value={form.branch} onChange={e=>setForm({...form, branch:e.target.value})} /></div></div>
                        <div className="pt-4 border-t border-white/5"><h3 className="font-bold mb-4 flex gap-2"><Icons.CreditCard className="text-violet-500"/> Оплата</h3><div className="flex flex-col gap-3"><label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900 hover:bg-slate-700'}`}><input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /><div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">{paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>}</div><span>Накладений платіж</span></label><label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'card' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900 hover:bg-slate-700'}`}><input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /><div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">{paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>}</div><span>Оплата карткою</span></label></div></div>
                        <div className="bg-slate-900/50 p-4 rounded-xl space-y-2 text-sm"><div className="flex justify-between text-gray-400"><span>Товари:</span><span>{cartTotal} ₴</span></div>{discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Знижка:</span><span>-{discountAmount} ₴</span></div>}<div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/5"><span>Разом:</span><span>{finalTotal} ₴</span></div>{isFreeDelivery && <div className="text-center text-green-500 font-bold text-xs uppercase pt-1">Безкоштовна доставка</div>}</div>
                        <button disabled={isSending} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl mt-6 transition-all shadow-lg flex items-center justify-center gap-2">{isSending ? 'Обробка...' : paymentMethod === 'card' ? `Оплатити ${finalTotal} ₴` : `Підтвердити замовлення`}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
