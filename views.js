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

window.CartView = ({ cart, updateQty, removeFromCart, changeRoute, cartTotal, promocodes, applyPromo, appliedPromo, cancelPromo }) => {
    const { useState } = React;
    const [formData, setFormData] = useState({ name: '', phone: '', city: '', department: '', payment: 'card', comment: '', telegram: '' });
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [promoInput, setPromoInput] = useState("");

    const FREE_DELIVERY_LIMIT = 2000;
    let discountAmount = 0;
    if (appliedPromo) {
        discountAmount = appliedPromo.type === 'percent' 
            ? Math.round((cartTotal * appliedPromo.value) / 100) 
            : appliedPromo.value;
    }
    const finalTotal = Math.max(0, cartTotal - discountAmount);
    const neededForFreeDelivery = Math.max(0, FREE_DELIVERY_LIMIT - finalTotal);
    const progressPercent = Math.min(100, (finalTotal / FREE_DELIVERY_LIMIT) * 100);
    const isFreeDelivery = finalTotal >= FREE_DELIVERY_LIMIT;

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);

        const orderData = {
            date: new Date().toISOString(),
            status: 'new',
            total: finalTotal,
            subtotal: cartTotal,
            discount: discountAmount,
            promoCode: appliedPromo ? appliedPromo.code : null,
            paymentMethod: formData.payment,
            isFreeShipping: isFreeDelivery,
            client: formData,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                category: item.category || 'Товар'
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка при оформленні.");
        } finally {
            setIsSending(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-bounce">
                    <window.Icons.Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Замовлення прийнято! 🎉</h2>
                <button onClick={() => { setIsSuccess(false); changeRoute('home'); }} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-bold transition flex items-center gap-2">
                    На головну <window.Icons.ChevronRight size={18} />
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <div className="bg-slate-800 rounded-2xl border border-white/10 p-10 max-w-md mx-auto">
                    <window.Icons.ShoppingBag size={64} className="mx-auto text-gray-600 mb-6"/>
                    <h2 className="text-2xl font-bold text-white mb-2">Кошик порожній</h2>
                    <button onClick={() => changeRoute('home')} className="mt-4 text-violet-400 font-bold hover:text-white transition">В каталог →</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-8 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => changeRoute('home')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition group">
                    <window.Icons.ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Продовжити покупки
                </button>

                <h1 className="text-3xl font-bold text-white mb-8">Кошик <span className="text-lg font-normal text-gray-500 bg-slate-800 px-3 py-1 rounded-full ml-2">{cart.reduce((a,b)=>a+b.qty,0)}</span></h1>

                <div className="bg-slate-800 rounded-xl p-4 border border-white/10 mb-6 shadow-lg">
                    {neededForFreeDelivery > 0 ? (
                        <p className="text-sm text-white mb-2 font-bold">До безкоштовної доставки ще <span className="text-violet-400">{neededForFreeDelivery} ₴</span></p>
                    ) : <p className="text-sm text-green-400 mb-2 font-bold flex items-center gap-2"><window.Icons.Flame size={16}/> Безкоштовна доставка!</p>}
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 border-b border-white/5 items-center last:border-0">
                                    <div className="w-20 h-20 bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                                        {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><window.Icons.Image size={24} className="text-gray-500"/></div>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-sm md:text-base line-clamp-2">{item.name}</h3>
                                        <p className="text-violet-400 font-bold mt-1">{item.price} ₴</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-white/5">
                                        <button onClick={()=>updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Minus size={16}/></button>
                                        <span className="w-4 text-center font-bold text-white text-sm">{item.qty}</span>
                                        <button onClick={()=>updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Plus size={16}/></button>
                                    </div>
                                    <button onClick={()=>removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2 transition"><window.Icons.Trash2 size={20}/></button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10 flex items-center gap-3">
                            <window.Icons.Ticket className="text-violet-500 flex-shrink-0" />
                            {appliedPromo ? (
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-green-400 font-bold text-sm">Код {appliedPromo.code} активний!</span>
                                    <button onClick={cancelPromo} className="text-xs text-gray-400 hover:text-white underline">Скасувати</button>
                                </div>
                            ) : (
                                <div className="flex-1 flex gap-2">
                                    <input value={promoInput} onChange={e=>setPromoInput(e.target.value.toUpperCase())} placeholder="ПРОМОКОД" className="flex-1 bg-transparent text-white outline-none placeholder-gray-600 text-sm uppercase font-bold"/>
                                    <button onClick={()=> {const p = promocodes.find(c=>c.code===promoInput); if(p && p.usedCount < p.maxUses) applyPromo(promoInput); else alert("Невірний код"); setPromoInput("")}} className="text-sm font-bold text-violet-400 hover:text-white transition">ЗАСТОСУВАТИ</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <form onSubmit={handleOrderSubmit} className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-24 shadow-2xl">
                            <h3 className="font-bold text-xl mb-6 text-white flex items-center gap-2"><window.Icons.ShoppingBag className="text-violet-500" size={20}/> Оформлення</h3>
                            <div className="space-y-3 mb-6">
                                <input required placeholder="Ім'я" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
                                <input required placeholder="Телефон" type="tel" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} />
                                <input placeholder="Telegram (нік)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" value={formData.telegram} onChange={e=>setFormData({...formData, telegram:e.target.value})} />
                                <input required placeholder="Місто" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" value={formData.city} onChange={e=>setFormData({...formData, city:e.target.value})} />
                                <input required placeholder="Відділення НП" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" value={formData.department} onChange={e=>setFormData({...formData, department:e.target.value})} />
                                <textarea placeholder="Коментар..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition h-20 resize-none" value={formData.comment} onChange={e=>setFormData({...formData, comment:e.target.value})}></textarea>
                            </div>
                            <div className="space-y-2 mb-6">
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${formData.payment === 'card' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900'}`}>
                                    <input type="radio" name="payment" className="hidden" checked={formData.payment === 'card'} onChange={() => setFormData({...formData, payment: 'card'})} />
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">{formData.payment === 'card' && <div className="w-2 h-2 rounded-full bg-violet-500"></div>}</div>
                                    <span className="text-sm font-bold text-white">Оплата на карту</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${formData.payment === 'cod' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900'}`}>
                                    <input type="radio" name="payment" className="hidden" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} />
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">{formData.payment === 'cod' && <div className="w-2 h-2 rounded-full bg-violet-500"></div>}</div>
                                    <span className="text-sm font-bold text-white">Післяплата</span>
                                </label>
                            </div>
                            <div className="border-t border-white/10 pt-4 space-y-2 mb-6 text-sm text-gray-400">
                                <div className="flex justify-between"><span>Сума:</span><span>{cartTotal} ₴</span></div>
                                {discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Знижка:</span><span>-{discountAmount} ₴</span></div>}
                                <div className="flex justify-between text-white font-bold text-xl mt-2"><span>Разом:</span><span>{finalTotal} ₴</span></div>
                            </div>
                            <button disabled={isSending} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSending ? <window.Icons.Loader className="animate-spin" size={20}/> : "Підтвердити замовлення"}
                            </button>
                        </form>
                    </div>
                </div>
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
