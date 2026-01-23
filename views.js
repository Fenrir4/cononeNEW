const { useState, useEffect } = React;

// --- 1. ІНФОРМАЦІЙНІ СТОРІНКИ ---
// --- 1. ІНФОРМАЦІЙНІ СТОРІНКИ (З ПОВНИМ, КРАСИВИМ ТЕКСТОМ) ---
window.InfoPage = ({ page, goBack }) => {
    const Icons = window.Icons || {}; 
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
                        {Icons.Truck && <Icons.Truck size={32} className="text-violet-500 flex-shrink-0" />}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Доставка Новою Поштою</h3>
                            <p>Відправляємо щодня. Якщо замовиш до 18:00 — поїде сьогодні! 🚀</p>
                            <p className="mt-2 text-sm text-gray-400">Вартість доставки — за тарифами перевізника. При замовленні від 2000 грн — <strong>доставка безкоштовна!</strong></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-800 rounded-xl">
                        {Icons.ShieldCheck && <Icons.ShieldCheck size={32} className="text-green-500 flex-shrink-0" />}
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
                <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white mb-8 gap-2">
                    {Icons.ArrowLeft && <Icons.ArrowLeft size={20}/>} Назад
                </button>
                <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-white/10 pb-6">{data.title}</h1>
                    <div className="prose prose-invert max-w-none">{data.content}</div>
                </div>
            </div>
        </div>
    );
};

// --- 2. СТОРІНКА ТОВАРУ ---
window.ProductPage = ({ product, goBack, addToCart, wishlist, toggleWishlist, viewedItems, products, navigateToProduct }) => {
    const [currentImg, setCurrentImg] = React.useState(0);
    const Icons = window.Icons || {};

    if (!product) return null;
    const images = product.images || [];
    const isLiked = wishlist.includes(product.id);

    return (
        <div className="min-h-screen bg-slate-900 pb-20 pt-10 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white mb-8 gap-2">
                    {Icons.ArrowLeft && <Icons.ArrowLeft size={20}/>} Назад
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 select-none">
                        <div className={`aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl relative group ${product.inStock === false ? 'grayscale-card' : ''}`}>
                            {images.length > 0 ? (
                                <div key={currentImg} className="w-full h-full animate-fade-fast bg-black flex items-center justify-center">
                                    {window.isVideo(images[currentImg]) ? <video src={images[currentImg]} controls autoPlay className="w-full h-full object-contain" /> : <img src={images[currentImg]} className="w-full h-full object-cover" />}
                                </div>
                            ) : (<div className="w-full h-full flex items-center justify-center text-gray-600">{Icons.Image && <Icons.Image size={64}/>}</div>)}
                            
                            <button onClick={() => toggleWishlist(product.id)} className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition z-20 ${isLiked ? 'bg-pink-600 text-white shadow-lg' : 'bg-black/30 text-white hover:bg-pink-600'}`}>
                                {Icons.Heart && <Icons.Heart size={24} fill={isLiked ? "currentColor" : "none"} />}
                            </button>
                            
                            {images.length > 1 && (
                                <>
                                    <button onClick={(e)=>{e.stopPropagation(); setCurrentImg(curr => curr === 0 ? images.length - 1 : curr - 1)}} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-violet-600 transition z-10">
                                        {Icons.ChevronLeft && <Icons.ChevronLeft size={24}/>}
                                    </button>
                                    <button onClick={(e)=>{e.stopPropagation(); setCurrentImg(curr => curr === images.length - 1 ? 0 : curr + 1)}} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-violet-600 transition z-10">
                                        {Icons.ChevronRight && <Icons.ChevronRight size={24}/>}
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">{images.map((img, idx) => (<button key={idx} onClick={() => setCurrentImg(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImg === idx ? 'border-violet-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>{window.isVideo(img) ? <div className="w-full h-full bg-black flex items-center justify-center">{Icons.Video && <Icons.Video size={24} className="text-white"/>}</div> : <img src={img} className="w-full h-full object-cover"/>}</button>))}</div>)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-violet-900/50 text-violet-300 text-sm font-bold">{product.category}</span>
                            {product.isHit && <span className="bg-fuchsia-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">{Icons.Flame && <Icons.Flame size={10}/>} HIT</span>}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{product.name}</h1>
                        <div className="flex items-end gap-4 mb-8"><span className="text-4xl font-bold text-white">{product.price} ₴</span>{product.oldPrice > 0 && <span className="text-xl text-gray-500 line-through mb-1">{product.oldPrice} ₴</span>}</div>
                        <p className="text-lg text-gray-300 leading-relaxed mb-10">{product.description}</p>
                        {product.specs && product.specs.length > 0 && (<div className="bg-slate-800/50 rounded-2xl p-6 mb-10 border border-white/5"><h3 className="font-bold text-white mb-4">Характеристики</h3><ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">{product.specs.map((spec, idx) => (<li key={idx} className="flex items-center text-gray-400 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-3"></span>{spec}</li>))}</ul></div>)}
                        
                        <div className="flex gap-4">
                            {window.AddToCartBtn && <window.AddToCartBtn product={product} addToCart={addToCart} variant="full" />}
                        </div>
                    </div>
                </div>
                {window.RecentlyViewed && <window.RecentlyViewed viewedItems={viewedItems} products={products} navigateToProduct={navigateToProduct} />}
            </div>
        </div>
    );
};

// --- 3. СПИСОК БАЖАНЬ ---
window.WishlistView = ({ wishlist, products, navigateToProduct, addToCart, toggleWishlist }) => {
    const Icons = window.Icons || {};
    const wishProducts = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    {Icons.Heart && <Icons.Heart className="text-pink-500" fill="currentColor"/>} Мої бажання
                </h1>
                {wishProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Ви ще нічого не додали до бажаного 💔</div>
                ) : (
                    // ЗМІНЕНО: 2 колонки на мобільному
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {wishProducts.map(p => window.ProductCard && <window.ProductCard key={p.id} product={p} navigateToProduct={navigateToProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 4. КОШИК (CartView) ---
window.CartView = ({ cart, updateQty, removeFromCart, changeRoute, cartTotal, promocodes, applyPromo, appliedPromo, cancelPromo }) => {
    const { useState } = React;
    const Icons = window.Icons || {}; 
    const [promoInput, setPromoInput] = useState("");
    const [inputQty, setInputQty] = useState({}); 

    // Розрахунки
    const FREE_DELIVERY_LIMIT = 2000;
    let discountAmount = 0;
    if (appliedPromo) { 
        discountAmount = appliedPromo.type === 'percent' ? Math.round(cartTotal * (appliedPromo.value / 100)) : appliedPromo.value; 
    }
    const finalTotal = Math.max(0, cartTotal - discountAmount);
    const neededForFreeDelivery = Math.max(0, FREE_DELIVERY_LIMIT - finalTotal);
    const progressPercent = Math.min(100, (finalTotal / FREE_DELIVERY_LIMIT) * 100);

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => changeRoute('home')} className="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-white transition">
                        {Icons.ArrowLeft && <Icons.ArrowLeft size={24} />}
                    </button>
                    <h1 className="text-3xl font-bold text-white">Кошик</h1>
                </div>
                
                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-white/10">
                        {Icons.ShoppingBag && <Icons.ShoppingBag size={64} className="mx-auto text-gray-600 mb-4"/>}
                        <p className="text-gray-400 text-lg mb-6">Ваш кошик порожній 😔</p>
                        <button onClick={() => changeRoute('home')} className="text-violet-400 font-bold hover:text-violet-300 transition">До покупок</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Доставка */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
                            {neededForFreeDelivery > 0 ? (
                                <p className="text-sm text-white mb-2 font-bold">Додайте товарів ще на <span className="text-violet-400">{neededForFreeDelivery} ₴</span> для безкоштовної доставки!</p>
                            ) : <p className="text-sm text-green-400 mb-2 font-bold flex items-center gap-2">{Icons.Flame && <Icons.Flame size={16}/>} Ура! У вас безкоштовна доставка!</p>}
                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div></div>
                        </div>

                        {/* Товари */}
                        <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 border-b border-white/5 items-center">
                                    <img src={item.images?.[0]} className="w-16 h-16 rounded object-cover"/>
                                    <div className="flex-1 text-white"><h3 className="font-bold">{item.name}</h3><p className="text-sm text-gray-400">{item.price} ₴</p></div>
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-white/5">
                                        <button onClick={()=>updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Minus size={16}/></button>
                                        <input 
                                            type="number" 
                                            min="1"
                                            value={inputQty[item.id] !== undefined ? inputQty[item.id] : item.qty} 
                                            onChange={(e) => setInputQty({ ...inputQty, [item.id]: e.target.value })}
                                            onBlur={(e) => {
                                                const val = parseInt(e.target.value);
                                                const newQty = (isNaN(val) || val < 1) ? 1 : val;
                                                if (newQty !== item.qty) updateQty(item.id, newQty - item.qty);
                                                const newState = { ...inputQty };
                                                delete newState[item.id];
                                                setInputQty(newState);
                                            }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                            className="w-12 bg-transparent text-center text-white font-bold outline-none text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none -moz-appearance:textfield" 
                                        />
                                        <button onClick={()=>updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition"><window.Icons.Plus size={16}/></button>
                                    </div>
                                    <button onClick={()=>removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2">{Icons.Trash2 && <Icons.Trash2 size={18}/>}</button>
                                </div>
                            ))}
                        </div>

                        {/* Промокод */}
                        <div className="bg-slate-800 rounded-xl p-4 border border-white/10 flex items-center gap-2">
                            {Icons.Ticket && <Icons.Ticket className="text-violet-500" />}
                            {appliedPromo ? (
                                <div className="flex-1 flex justify-between items-center text-white"><span className="text-green-400 font-bold">Код {appliedPromo.code} застосовано!</span><button onClick={cancelPromo} className="text-xs text-gray-400 hover:text-white underline">Скасувати</button></div>
                            ) : (
                                <><input value={promoInput} onChange={e=>setPromoInput(e.target.value)} placeholder="Маєте промокод?" className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"/><button onClick={()=> {const p = promocodes.find(c=>c.code===promoInput.toUpperCase()); if(p && p.usedCount < p.maxUses) applyPromo(promoInput); else alert("Невірний код"); setPromoInput("")}} className="text-sm font-bold text-violet-400 hover:text-white transition">ОК</button></>
                            )}
                        </div>

                        {/* Підсумок */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center text-gray-400"><span>Сума:</span><span>{cartTotal} ₴</span></div>
                            {discountAmount > 0 && <div className="flex justify-between items-center text-green-400"><span>Знижка:</span><span>-{discountAmount} ₴</span></div>}
                            <div className="flex justify-between items-center text-2xl font-bold text-white"><span>Разом:</span><span className="text-violet-400">{finalTotal} ₴</span></div>
                            <button onClick={() => changeRoute('checkout')} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95">
                                ОФОРМИТИ ЗАМОВЛЕННЯ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 5. CHECKOUT (НОВА СТОРІНКА ОФОРМЛЕННЯ + TELEGRAM) ---
window.CheckoutView = ({ cart, cartTotal, discountAmount, appliedPromo, goBack, clearCart, changeRoute }) => {
    const { useState } = React;
    const Icons = window.Icons || {};
    
    // ВЕЛИКИЙ СПИСОК МІСТ
    const POPULAR_CITIES = [
        "Київ", "Харків", "Одеса", "Дніпро", "Львів", "Запоріжжя", "Кривий Ріг", "Миколаїв", "Вінниця", "Херсон", "Полтава", "Чернігів", "Черкаси", "Житомир", "Суми", "Хмельницький", "Чернівці", "Рівне", "Кам'янське", "Кропивницький", "Івано-Франківськ", "Кременчук", "Тернопіль", "Луцьк", "Біла Церква", "Ужгород", "Нікополь", "Бровари", "Павлоград", "Сєвєродонецьк", "Умань", "Мукачево", "Олександрія", "Шостка", "Бердичів", "Дрогобич", "Костянтинівка", "Ніжин", "Ізмаїл", "Новомосковськ", "Ковель", "Сміла", "Червоноград", "Калуш", "Первомайськ", "Коростень", "Покровськ", "Коломия", "Бориспіль", "Рубіжне", "Чорноморськ", "Стрий", "Дружківка", "Прилуки", "Лозова", "Новоград-Волинський", "Енергодар", "Нововолинськ", "Горішні Плавні", "Ізюм", "Білгород-Дністровський", "Мирноград", "Охтирка", "Марганець", "Фастів", "Сніжне", "Нова Каховка", "Лубни", "Ромни", "Жовті Води", "Світловодськ", "Ірпінь", "Буча", "Шепетівка", "Покров", "Вараш", "Миргород", "Подільськ", "Южноукраїнськ", "Володимир", "Дубно", "Вишневе", "Каховка", "Васильків", "Нетішин", "Вознесенськ", "Славута", "Боярка", "Жмеринка", "Старокостянтинів", "Авдіївка", "Самбір", "Борислав", "Глухів", "Обухів", "Токмак", "Чугуїв", "Могилів-Подільський", "Південне", "Костопіль", "Синельникове", "Первомайський", "Добропілля", "Новояворівськ", "Бучач", "Чортків", "Балаклія", "Трускавець", "Куп'янськ", "Першотравенськ", "Новий Розділ", "Тернівка", "Сарни", "Хуст", "Золотоноша", "Малин", "Хмільник", "Лиман", "Переяслав", "Гайсин", "Виноградів", "Козятин", "Здолбунів", "Коростишів", "Олешки", "Дебальцеве", "Канів", "Золочів", "Селидове", "Берегове", "Гадяч", "Броди", "Красноград", "Вільногірськ", "Оріхів", "Знам'янка", "Яготин", "Надвірна", "Долина", "Волноваха", "Кременець", "П'ятихатки", "Полонне", "Славутич", "Волочиськ", "Дніпрорудне", "Мерефа", "Кролевець", "Молочанськ", "Сокаль", "Вугледар", "Люботин", "Стебник", "Долинська", "Кілія", "Яворів", "Городок", "Винники", "Жовква", "Кам'янка-Бузька", "Дубляни", "Жидачів", "Ходорів", "Соснівка", "Великі Мости", "Радехів", "Сколе", "Буськ", "Турка", "Рава-Руська", "Перемишляни", "Судова Вишня", "Моршин", "Глиняни", "Бібрка", "Белз", "Угнів", "Бережани", "Скадовськ", "Сватове", "Звенигородка", "Шпола", "Свалява", "Богуслав", "Верхньодніпровськ", "Сквира", "Березань", "Апостолове", "Тальне", "Українка", "Овруч", "Путивль", "Рахів", "Новий Буг", "Тульчин", "Вільнянськ", "Городок", "Дергачі", "Дунаївці", "Балта", "Ладижин", "Збараж", "Болград", "Калинівка", "Красилів", "П'ятихатки", "Рени", "Вовчанськ", "Зміїв", "Богодухів", "Скалат", "Бар", "Берестечко", "Бобровиця", "Борщів", "Буринь", "Василівка", "Ватутіне", "Вашківці", "Великі Мости", "Верхівцеве", "Вижниця", "Вилкове", "Вишгород", "Генічеськ", "Глобине", "Гнівань", "Гола Пристань", "Городенка", "Городок", "Горохів", "Гребінка", "Гуляйполе", "Деражня", "Дніпрорудне", "Долина", "Долинська", "Дрогобич", "Дубляни", "Дунаївці", "Жашків", "Жидачів", "Жовква", "Заліщики", "Заставна", "Зборів", "Звенигородка", "Здолбунів", "Зіньків", "Зміїв", "Знам'янка", "Золоте", "Золотоноша", "Золочів", "Ізяслав", "Іллінці", "Іршава", "Ічня", "Кагарлик", "Калинівка", "Камінь-Каширський", "Кам'янка", "Кам'янка-Дніпровська", "Карлівка", "Ківерці", "Кіцмань", "Кобеляки", "Кодима", "Корець", "Корсунь-Шевченківський", "Корюківка", "Косів", "Костопіль", "Красилів", "Кременець", "Кролевець", "Ланівці", "Лебедин", "Липовець", "Лозова", "Лохвиця", "Лубни", "Любомль", "Люботин", "Мала Виска", "Малин", "Мена", "Мерефа", "Миргород", "Миронівка", "Монастириська", "Монастирище", "Мостиська", "Мукачево", "Надвірна", "Немирів", "Нетішин", "Нова Одеса", "Новий Буг", "Новомиргород", "Новоселиця", "Новоукраїнка", "Носівка", "Обухів", "Овруч", "Олевськ", "Олександрія", "Оріхів", "Острог", "Охтирка", "Очаків", "Перемишляни", "Перечин", "Переяслав-Хмельницький", "Першотравенськ", "Пирятин", "Погребище", "Підгайці", "Підгородне", "Помічна", "Почаїв", "Приморськ", "Пустомити", "Путивль", "П'ятихатки", "Рава-Руська", "Радехів", "Радивилів", "Радомишль", "Рахів", "Ржищів", "Рогатин", "Рожище", "Ромни", "Рудки", "Свалява", "Сватове", "Світловодськ", "Семенівка", "Середина-Буда", "Синельникове", "Скадовськ", "Скалат", "Сквира", "Сколе", "Славута", "Славутич", "Снігурівка", "Снятин", "Сокаль", "Сокиряни", "Соледар", "Старобільськ", "Старокостянтинів", "Старий Самбір", "Стебник", "Сторожинець", "Стрий", "Судова Вишня", "Тальне", "Тараща", "Теребовля", "Тетіїв", "Тлумач", "Токмак", "Тростянець", "Трускавець", "Тульчин", "Тячів", "Угнів", "Узин", "Українка", "Умань", "Устилуг", "Фастів", "Хирів", "Хмільник", "Христинівка", "Хуст", "Ходорів", "Хорол", "Хотин", "Червоноград", "Чигирин", "Чоп", "Чорноморськ", "Чортків", "Чугуїв", "Чуднів", "Шаргород", "Шепетівка", "Шостка", "Шпола", "Шумськ", "Щастя", "Яворів", "Яготин", "Ямпіль", "Яремче"
    ];

    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        phone: '', 
        city: '', 
        department: '', 
        payment: 'card', 
        comment: '', 
        dontCall: false 
    });
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- TELEGRAM CONFIG ---
    const TG_BOT_TOKEN = "8258624447:AAHUu4-t9cPJuHirrNUe1i6fV5M-D42yi6w"; 
    const TG_CHAT_ID = "7085928669"; 

    const finalTotal = Math.max(0, cartTotal - discountAmount);
    const isFreeDelivery = finalTotal >= 2000;

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
            client: {
                name: `${formData.firstName} ${formData.lastName}`, 
                phone: formData.phone,
                city: formData.city,
                department: formData.department,
                comment: formData.comment,
                dontCall: formData.dontCall
            },
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty
            }))
        };

        // ВІДПРАВКА В TELEGRAM
        const itemsList = orderData.items.map(i => `▫️ ${i.name} (x${i.qty}) - ${i.price} ₴`).join('\n');
        const tgText = `
🔥 <b>НОВЕ ЗАМОВЛЕННЯ!</b> (${finalTotal} ₴)

👤 <b>Клієнт:</b> ${orderData.client.name}
📞 <b>Тел:</b> <a href="tel:${orderData.client.phone}">${orderData.client.phone}</a>
📍 <b>Місто:</b> ${orderData.client.city}
📦 <b>Відділення:</b> ${orderData.client.department}
💳 <b>Оплата:</b> ${orderData.paymentMethod === 'card' ? 'На карту 💳' : 'Післяплата 💵'}
💬 <b>Коментар:</b> ${orderData.client.comment || 'Немає'}
${orderData.client.dontCall ? '🚫 <b>НЕ ДЗВОНИТИ!</b>' : '✅ Можна дзвонити'}

🛒 <b>Товари:</b>
${itemsList}
${appliedPromo ? `\n🏷 <b>Знижка:</b> ${appliedPromo.code} (-${discountAmount} ₴)` : ''}
🚚 <b>Доставка:</b> ${isFreeDelivery ? 'Безкоштовно' : 'За тарифами НП'}
`;

        try {
            // 1. Send to Telegram
            await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TG_CHAT_ID,
                    text: tgText,
                    parse_mode: 'HTML'
                })
            });

            // 2. Save to Firebase
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
            if (typeof clearCart === 'function') clearCart(true);
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
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-bounce">
                    {Icons.Check && <Icons.Check size={48} className="text-white" />}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Дякуємо за замовлення! 🎉</h2>
                <p className="text-gray-400 mb-8 max-w-md">Ми вже отримали ваше замовлення і скоро зв'яжемося для підтвердження.</p>
                <button onClick={() => window.location.reload()} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">
                    На головну
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white mb-8 gap-2">
                    {Icons.ArrowLeft && <Icons.ArrowLeft size={20}/>} Назад до кошика
                </button>
                
                <h1 className="text-3xl font-bold text-white mb-8">Оформлення замовлення</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* ЛІВА ЧАСТИНА - ФОРМА */}
                    <div className="md:col-span-2 space-y-6">
                        <form onSubmit={handleOrderSubmit} className="space-y-6">
                            {/* Контакти */}
                            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    {Icons.User && <Icons.User className="text-violet-400"/>} Контакти
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="Ім'я" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                        <input required placeholder="Прізвище" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                    </div>
                                    <input required type="tel" placeholder="Телефон" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.dontCall} 
                                            onChange={e => setFormData({...formData, dontCall: e.target.checked})}
                                            className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-300 select-none">Не дзвонити мені для підтвердження</span>
                                    </label>
                                </div>
                            </div>

                            {/* Доставка */}
                            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    {Icons.Truck && <Icons.Truck className="text-violet-400"/>} Доставка
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <input required list="cities" placeholder="Місто (почніть вводити...)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                        value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                    <datalist id="cities">
                                        {POPULAR_CITIES.map(city => <option key={city} value={city} />)}
                                    </datalist>

                                    <input required placeholder="Відділення НП (напр. №1)" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition" 
                                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                                </div>
                            </div>

                            {/* Оплата */}
                            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    {Icons.CreditCard && <Icons.CreditCard className="text-violet-400"/>} Оплата
                                </h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${formData.payment === 'card' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900 hover:bg-slate-800'}`}>
                                        <input type="radio" name="payment" checked={formData.payment === 'card'} onChange={() => setFormData({...formData, payment: 'card'})} className="hidden"/>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment === 'card' ? 'border-violet-500' : 'border-gray-400'}`}>
                                            {formData.payment === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-white block">Оплата на карту</span>
                                            <span className="text-xs text-gray-400">Без комісії, швидка відправка</span>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${formData.payment === 'cod' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900 hover:bg-slate-800'}`}>
                                        <input type="radio" name="payment" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} className="hidden"/>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment === 'cod' ? 'border-violet-500' : 'border-gray-400'}`}>
                                            {formData.payment === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-white block">Післяплата (Накладений платіж)</span>
                                            <span className="text-xs text-gray-400">Оплата при отриманні на пошті</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">Коментар <span className="text-sm text-gray-500 font-normal">(необов'язково)</span></h3>
                                <textarea placeholder="Додаткові побажання..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition h-24 resize-none" 
                                    value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
                            </div>

                            {/* Кнопка (для мобільних вона буде внизу, але тут теж дублюємо) */}
                            <button disabled={isSending || !formData.firstName || !formData.lastName || !formData.phone || !formData.city} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSending ? 'Обробка...' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                            </button>
                        </form>
                    </div>

                    {/* ПРАВА ЧАСТИНА - СУМА */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6">Разом</h3>
                            <div className="space-y-3 text-sm border-b border-white/10 pb-4 mb-4">
                                <div className="flex justify-between text-gray-400">
                                    <span>Товари ({cart.reduce((a,b)=>a+b.qty,0)} шт)</span>
                                    <span>{cartTotal} ₴</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Знижка</span>
                                        <span>-{discountAmount} ₴</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span>Доставка</span>
                                    <span className={isFreeDelivery ? "text-green-400" : ""}>{isFreeDelivery ? "Безкоштовно" : "За тарифами НП"}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-bold text-white mb-6">
                                <span>До сплати:</span>
                                <span className="text-violet-400">{finalTotal} ₴</span>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                Натискаючи кнопку, ви погоджуєтесь з умовами договору оферти
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. ІСТОРІЯ ПЕРЕГЛЯДІВ ---
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

// --- 7. HEADER (ШАПКА) ---
window.Header = ({ goHome, changeRoute, cart, isMobileMenuOpen, setIsMobileMenuOpen, isAdminMode, setIsAdminMode, products, navigateToProduct, navigateToInfo }) => {
    const { useState, useEffect } = React;
    const Icons = window.Icons || {};
    const [searchQuery, setSearchQuery] = useState(""); const [searchResults, setSearchResults] = useState([]);
    useEffect(() => { if (searchQuery.trim() === "") { setSearchResults([]); return; } const results = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.isVisible !== false); setSearchResults(results); }, [searchQuery, products]);
    return (<nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-20 gap-4"><div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={goHome}><window.BrandLogo /><div className="flex flex-col hidden sm:flex"><span className="text-xl font-black text-white tracking-wide leading-none">NIGHT</span><span className="text-sm font-bold text-violet-400 tracking-[0.2em] leading-none">SECRET</span></div></div><div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-300"><button onClick={goHome} className="hover:text-violet-400 transition">Головна</button><button onClick={() => navigateToInfo('about')} className="hover:text-violet-400 transition">Про нас</button><button onClick={() => changeRoute('wishlist')} className="hover:text-pink-500 transition">Бажане ❤️</button><button onClick={() => { changeRoute('home'); setTimeout(() => document.getElementById('products-grid')?.scrollIntoView({behavior:'smooth'}), 100)}} className="hover:text-violet-400 transition">Каталог</button></div><div className="flex-1 max-w-md relative"><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{Icons.Search && <Icons.Search size={18} />}</div><input type="text" className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-slate-800 text-gray-300 focus:outline-none focus:bg-slate-700 focus:border-violet-500 transition" placeholder="Пошук..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>{searchQuery && <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{Icons.X && <Icons.X size={16} />}</button>}</div>{searchResults.length > 0 && (<div className="absolute mt-1 w-full bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 search-dropdown">{searchResults.map(p => (<div key={p.id} className="px-4 py-3 hover:bg-slate-700 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0" onClick={() => { navigateToProduct(p.id); setSearchQuery(""); }}>{p.images?.[0] ? <img src={p.images[0]} className="w-10 h-10 object-cover rounded-md flex-shrink-0" /> : <div className="w-10 h-10 bg-slate-600 rounded-md flex-shrink-0"/>}<div><div className="text-sm font-bold text-white">{p.name}</div><div className="text-xs text-gray-400">{p.price} ₴</div></div></div>))}</div>)}</div><div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">{isAdminMode && <button onClick={() => setIsAdminMode(false)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-600 text-white text-xs font-bold uppercase">{Icons.LogOut && <Icons.LogOut size={16} />} <span className="hidden sm:inline">Вихід</span></button>}<button onClick={() => { changeRoute('cart'); setIsMobileMenuOpen(false); }} className="relative p-2 text-gray-400 hover:text-white transition-colors">{Icons.ShoppingBag && <Icons.ShoppingBag size={24} />}{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-fuchsia-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.reduce((a,b) => a + b.qty, 0)}</span>}</button><button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? (Icons.X && <Icons.X size={24} />) : (Icons.Menu && <Icons.Menu size={24} />)}</button></div></div></div>{isMobileMenuOpen && (<div className="md:hidden bg-slate-900 border-b border-white/10 animate-fade-in p-4 space-y-2"><button onClick={goHome} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Головна</button><button onClick={() => changeRoute('wishlist')} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Бажане ❤️</button><button onClick={() => { changeRoute('cart'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-white hover:bg-white/5 rounded-lg">Кошик</button></div>)}</nav>);
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
