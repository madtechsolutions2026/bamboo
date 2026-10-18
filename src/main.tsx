import React, { useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, Leaf, ShoppingBag, X, Plus, Minus, Check, Truck, Package, Sprout, LayoutDashboard, CreditCard } from 'lucide-react';
import './style.css';
import './experience.css';
import './commerce-ui.css';
import { Storefront } from './Storefront';
import { ProductDetail } from './ProductDetail';
import { CheckoutPage } from './CheckoutPage';
import { GatheringPlanner, CheckoutJourney } from './Experience';
import { type Product, type Order, type Expense, money, loadProducts, loadCart, loadOrders, loadExpenses } from './catalogue';

const productPhotos:Record<string,string>={plate:'plate',bowl:'bowl',cup:'cup',cutlery:'cutlery',spoon:'spoon',sharing:'sharing'};
function ProductArt({type='plate',className=''}:{type?:string;className?:string}) {
  return <img className={'product-art product-photo '+className} src={'/photos/'+(productPhotos[type]||'plate')+'.webp'} alt={'Bamboo '+type+' reference photograph'} loading="lazy" decoding="async"/>;
}

function App() {
  const [products,setProducts]=useState<Product[]>(loadProducts);
  const [cart,setCart]=useState<Record<number,number>>(()=>loadCart(products));
  const [orders,setOrders]=useState<Order[]>(loadOrders);
  const [expenses,setExpenses]=useState<Expense[]>(loadExpenses);
  const [admin,setAdmin]=useState(location.hash==='#admin');
  const [tab,setTab]=useState('Overview');
  const [cartOpen,setCartOpen]=useState(false);
  const [checkout,setCheckout]=useState(location.hash==='#checkout');
  const [selected,setSelected]=useState<number|null>(null);
  const [success,setSuccess]=useState<Order|null>(null);
  const [pendingOrder,setPendingOrder]=useState<Order|null>(null);
  const [toast,setToast]=useState('');
  const [editing,setEditing]=useState<Product|null>(null);
  const [expenseOpen,setExpenseOpen]=useState(false);
  const [plannerOpen,setPlannerOpen]=useState(false);
  const selectedProduct=products.find(p=>p.id===selected);
  const finishOrder=useCallback(()=>{if(pendingOrder){setSuccess(pendingOrder);setPendingOrder(null)}},[pendingOrder]);

  useEffect(()=>{
    try {
      localStorage.setItem('bambu-products',JSON.stringify(products));
      localStorage.setItem('bambu-cart',JSON.stringify(cart));
      localStorage.setItem('bambu-orders',JSON.stringify(orders));
      localStorage.setItem('bambu-expenses',JSON.stringify(expenses));
    } catch {setToast('Browser storage is full. Changes may not persist.')}
  },[products,cart,orders,expenses]);
  useEffect(()=>{const f=()=>{const isCheckout=location.hash==='#checkout';setAdmin(location.hash==='#admin');setCheckout(isCheckout);if(isCheckout){setCartOpen(false);setSelected(null);setPlannerOpen(false)}};window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f)},[]);
  useEffect(()=>{
    if(!checkout)return;
    const frame=requestAnimationFrame(()=>{const root=document.documentElement;const previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(0,0);root.style.scrollBehavior=previous;document.getElementById('checkout-page-title')?.focus({preventScroll:true})});
    return()=>cancelAnimationFrame(frame);
  },[checkout]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t)},[toast]);

  const dialogKey=pendingOrder?'journey':success?'confirmation':selectedProduct?'product-'+selectedProduct.id:cartOpen?'bag':editing?'edit-'+editing.id:expenseOpen?'expense':plannerOpen?'planner':'';
  useEffect(()=>{
    if(!dialogKey)return;
    const previous=document.activeElement as HTMLElement|null;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const page=document.getElementById('bambu-page');
    page?.setAttribute('inert','');page?.setAttribute('aria-hidden','true');
    const dialog=document.querySelector<HTMLElement>('[role="dialog"]');
    const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')||[]).filter(el=>el.getClientRects().length>0);
    focusable()[0]?.focus();
    const keys=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){
        if(pendingOrder){finishOrder();return}
        setCartOpen(false);setSelected(null);setEditing(null);setExpenseOpen(false);setSuccess(null);setPlannerOpen(false);
      }
      if(e.key!=='Tab')return;
      const nodes=focusable(),first=nodes[0],last=nodes[nodes.length-1];
      if(!nodes.length){e.preventDefault();return}
      if(e.shiftKey&&(document.activeElement===first||!dialog?.contains(document.activeElement))){e.preventDefault();last?.focus()}
      else if(!e.shiftKey&&(document.activeElement===last||!dialog?.contains(document.activeElement))){e.preventDefault();first?.focus()}
    };
    document.addEventListener('keydown',keys);
    return()=>{
      document.body.style.overflow=oldOverflow;page?.removeAttribute('inert');page?.removeAttribute('aria-hidden');
      document.removeEventListener('keydown',keys);
      if(previous?.isConnected)previous.focus();
    };
  },[dialogKey,finishOrder]);

  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=products.reduce((sum,p)=>sum+p.price*(cart[p.id]||0),0);
  const shipping=total>=999||total===0?0:59;
  const sales=orders.reduce((s,o)=>s+o.total,0),costs=expenses.reduce((s,e)=>s+e.amount,0);

  function add(product:Product,n=1):boolean {
    const p=products.find(item=>item.id===product.id);
    if(!p||!Number.isSafeInteger(n)||n<1||(cart[p.id]||0)+n>p.stock){setToast('That quantity is not currently available.');return false}
    setCart(c=>({...c,[p.id]:(c[p.id]||0)+n}));
    setToast(`${p.name} added to your bag`);
    return true;
  }
  function change(id:number,n:number) {
    setCart(c=>{const next={...c},stock=products.find(p=>p.id===id)?.stock||0;next[id]=Math.max(0,Math.min(stock,(c[id]||0)+n));if(!next[id])delete next[id];return next});
  }
  function place(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();if(!count||pendingOrder)return;
    const fd=new FormData(e.currentTarget);
    if(products.some(p=>(cart[p.id]||0)>p.stock)){setToast('Stock changed. Please review your bag.');return}
    const order:Order={
      id:'BM-'+Date.now().toString(36).toUpperCase()+'-'+crypto.getRandomValues(new Uint16Array(1))[0].toString(36).toUpperCase(),
      customer:String(fd.get('name')).trim(),email:String(fd.get('email')).trim(),
      address:`${String(fd.get('address')).trim()}, ${String(fd.get('city')).trim()} ${fd.get('pincode')}`,
      total:total+shipping,date:new Date().toISOString(),status:'Processing',
      items:products.filter(p=>cart[p.id]).map(p=>({name:p.name,quantity:cart[p.id]}))
    };
    if(!order.customer||!String(fd.get('address')).trim()||!String(fd.get('city')).trim()){setToast('Please enter your delivery details.');return}
    setOrders(o=>[order,...o]);
    setProducts(ps=>ps.map(p=>({...p,stock:p.stock-(cart[p.id]||0)})));
    setCart({});setCartOpen(false);setCheckout(false);location.replace('#shop');setPendingOrder(order);
  }
  function goShop(){location.hash='shop';setAdmin(false);setCheckout(false);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  function beginCheckout(){setCartOpen(false);setSelected(null);setPlannerOpen(false);setAdmin(false);setCheckout(true);location.hash='checkout'}
  function openProduct(p:Product){setSelected(p.id);setCartOpen(false);setPlannerOpen(false)}
  function openCart(){if(checkout)goShop();setSelected(null);setPlannerOpen(false);setCartOpen(true)}
  function addKit(rows:{product:{id:number};quantity:number}[]) {
    if(rows.length!==3||rows.some(r=>!Number.isSafeInteger(r.quantity)||r.quantity<1||(cart[r.product.id]||0)+r.quantity>(products.find(p=>p.id===r.product.id)?.stock||0))){setToast('Not enough stock for this gathering, including items in your bag.');return}
    setCart(c=>{const next={...c};rows.forEach(r=>{next[r.product.id]=(next[r.product.id]||0)+r.quantity});return next});
    setPlannerOpen(false);setCartOpen(true);setCheckout(false);
  }

  return <div className="bambu-app">
    <div id="bambu-page">
      {checkout?<CheckoutPage products={products} cart={cart} total={total} shipping={shipping} onBack={openCart} onShop={goShop} onPlaceOrder={place}/>:admin?<>
        <header className="commerce-admin-header"><a className="brand" href="#"><Sprout size={29}/>bambu<span>®</span></a><span className="commerce-demo-label">DEMO ADMIN STUDIO</span><button onClick={goShop}><ArrowLeft size={17}/>Back to shopping</button><button aria-label={`Open shopping bag, ${count} packs`} onClick={openCart}><ShoppingBag size={19}/><b>{count}</b></button></header>
<main className="admin-shell"><aside className="admin-sidebar"><span className="eyebrow">BAMBU STUDIO</span><h2>A little overview.</h2>{['Overview','Products','Orders','Expenses'].map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?'active':''}>{t==='Overview'?<LayoutDashboard size={17}/>:t==='Products'?<Package size={17}/>:t==='Orders'?<ShoppingBag size={17}/>:<CreditCard size={17}/>} {t}</button>)}<p><Leaf size={18}/> Small steps.<br/>Thoughtful business.</p></aside><div className="admin-main"><div className="admin-title"><div><span className="eyebrow">YOUR BUSINESS, AT A GLANCE</span><h1>{tab==='Overview'?'Good things are growing.':tab}</h1><p>Sample store · changes are saved in this browser.</p></div><span className="demo-tag">Interactive demo</span></div><div className="stats">{[['Sales collected',money(sales)],['Orders received',orders.length],['Recorded expenses',money(costs)],['Low-stock products',products.filter(p=>p.stock<20).length]].map(([label,value])=><div className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{label==='Sales collected'?'Includes delivery charges':label==='Low-stock products'?'Fewer than 20 packs available':'From this demo session'}</small></div>)}</div>
 {tab==='Overview'&&<><div className="admin-two"><section className="admin-panel"><div className="panel-title"><h3>Sales & expenses</h3><span>Recorded totals</span></div><div className="bar-chart"><div><i style={{height:Math.max(4,sales/Math.max(sales,costs,1)*150)}}/><span>Sales<br/><b>{money(sales)}</b></span></div><div><i style={{height:Math.max(4,costs/Math.max(sales,costs,1)*150)}}/><span>Expenses<br/><b>{money(costs)}</b></span></div></div><p className="fine">Sales less recorded expenses: <b>{money(sales-costs)}</b>. This is not a profit calculation.</p></section><section className="admin-panel"><div className="panel-title"><h3>Needs a little attention</h3><Leaf size={19}/></div>{products.filter(p=>p.stock<20).map(p=><div className="stock-row" key={p.id}><ProductArt type={p.id===5?"sharing":p.type}/><div><b>{p.name}</b><p>{p.stock} packs remaining</p></div><button className="text-button" onClick={()=>setEditing(p)}>Restock <ArrowRight size={15}/></button></div>)}<button className="outline-button" onClick={()=>setTab('Products')}>Manage inventory <ArrowUpRight size={15}/></button></section></div><section className="admin-panel"><div className="panel-title"><h3>Recent orders</h3><button className="text-button" onClick={()=>setTab('Orders')}>View all <ArrowRight size={16}/></button></div>{orders.length?orders.slice(0,3).map(o=><div className="order-row" key={o.id}><b>{o.id}</b><span>{o.customer}</span><span>{money(o.total)}</span><span className="status">{o.status}</span></div>):<div className="empty"><ShoppingBag/><h3>Your first order starts here.</h3><p>Place a demo order in the shop to see it appear here.</p><button className="text-button" onClick={goShop}>Explore the storefront <ArrowRight size={16}/></button></div>}</section></>}
 {tab==='Products'&&<section className="admin-panel"><div className="panel-title"><h3>Product catalogue · {products.length}</h3><button className="primary small" onClick={()=>setEditing({id:Date.now(),name:'',category:'Plates',price:0,pack:25,stock:0,type:'plate',description:''})}><Plus size={16}/> Add product</button></div><div className="inventory">{products.map(p=><div className="inventory-row" key={p.id}><ProductArt type={p.id===5?"sharing":p.type}/><div><b>{p.name}</b><small>{p.category} · {p.pack} {p.type==='cutlery'?'sets':'pieces'} / pack</small></div><strong>{money(p.price)}</strong><span className={p.stock<20?'stock low':'stock'}>{p.stock} packs</span><button className="outline-button small" onClick={()=>setEditing(p)}>Edit</button></div>)}</div></section>}
 {tab==='Orders'&&<section className="admin-panel"><div className="panel-title"><h3>All orders · {orders.length}</h3></div>{!orders.length?<div className="empty"><Package/><h3>No orders just yet.</h3><p>Complete a demo checkout to create your first order.</p><button className="primary small" onClick={goShop}>Go shopping <ArrowRight size={16}/></button></div>:orders.map(o=><div className="order-card" key={o.id}><div><b>{o.id}</b><small>{new Date(o.date).toLocaleDateString('en-IN')}</small></div><div><strong>{o.customer}</strong><p>{o.email}</p><p>{o.address}</p><small>{o.items.map(i=>`${i.quantity} × ${i.name}`).join(', ')}</small></div><strong>{money(o.total)}</strong><label><span className="sr-only">Status for {o.id}</span><select value={o.status} onChange={e=>setOrders(os=>os.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{['Processing','Packed','Shipped','Delivered'].map(s=><option key={s}>{s}</option>)}</select></label></div>)}</section>}
 {tab==='Expenses'&&<section className="admin-panel"><div className="panel-title"><h3>Expense ledger</h3><button className="primary small" onClick={()=>setExpenseOpen(true)}><Plus size={16}/> Record expense</button></div>{expenses.length?expenses.map(e=><div className="order-row" key={e.id}><b>{e.name}</b><span>{e.category}</span><span>{new Date(e.date).toLocaleDateString('en-IN')}</span><strong>{money(e.amount)}</strong></div>):<div className="empty"><CreditCard/><h3>Keep track of the little things.</h3><p>Record stock purchases, packaging, delivery, and other business costs.</p></div>}</section>}
 </div></main>
      </>:<Storefront products={products} cart={cart} onAdd={add} onOpenProduct={openProduct} onOpenCart={openCart} onOpenAdmin={()=>{setTab('Orders');setAdmin(true);location.hash='admin';window.scrollTo(0,0)}} onOpenPlanner={()=>setPlannerOpen(true)}/>}
    </div>
 {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><section className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your shopping bag" onClick={e=>e.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow">A LITTLE SOMETHING GOOD</span><h2>Shopping bag <sup>({count})</sup></h2></div><button autoFocus className="icon-button" aria-label="Close bag" onClick={()=>setCartOpen(false)}><X/></button></div>{count===0?<div className="empty bag-empty"><ShoppingBag size={44}/><h3>Your bag is waiting.</h3><p>Discover plates, cups, bowls and cutlery for your next gathering.</p><button className="primary" onClick={()=>{setCartOpen(false);goShop()}}>Explore the collection <ArrowRight size={17}/></button></div>:<><div className="cart-items">{products.filter(p=>cart[p.id]).map(p=><div className="cart-item" key={p.id}><div className="cart-art"><ProductArt type={p.id===5?"sharing":p.type}/></div><div className="cart-item-info"><b>{p.name}</b><p>Pack of {p.pack}</p><div className="quantity"><button aria-label={`Remove one ${p.name}`} onClick={()=>change(p.id,-1)}><Minus size={13}/></button><span>{cart[p.id]}</span><button aria-label={`Add one ${p.name}`} onClick={()=>change(p.id,1)}><Plus size={13}/></button></div></div><div className="cart-item-price"><strong>{money(p.price*cart[p.id])}</strong><button className="text-button" onClick={()=>setCart(c=>{const n={...c};delete n[p.id];return n})}>Remove</button></div></div>)}</div><div className="cart-summary"><p className="delivery-note"><Truck size={18}/>{total>=999?'Your delivery is on us.':`You’re ${money(999-total)} away from complimentary delivery.`}</p><div className="summary-row"><span>Subtotal</span><b>{money(total)}</b></div><div className="summary-row"><span>Delivery</span><b>{shipping?money(shipping):'Complimentary'}</b></div><div className="total-line"><b>Total</b><strong>{money(total+shipping)}</strong></div><button className="primary full" onClick={beginCheckout}>Continue to demo checkout <ArrowRight size={18}/></button><p className="fine centered">No real payment · Sample prices</p></div></>}</section></div>}
 {selectedProduct&&<ProductDetail product={selectedProduct} inCart={cart[selectedProduct.id]||0} onClose={()=>setSelected(null)} onAdd={(p,n)=>{if(add(p,n))setSelected(null)}} onBuyNow={(p,n)=>{if(add(p,n))beginCheckout()}}/>}
 {pendingOrder&&<CheckoutJourney onDone={finishOrder}/>}
 {success&&<div className="overlay modal-overlay" onClick={()=>setSuccess(null)}><section className="success-modal" role="dialog" aria-modal="true" aria-label="Order confirmed" onClick={e=>e.stopPropagation()}><button autoFocus className="modal-close icon-button" aria-label="Close confirmation" onClick={()=>setSuccess(null)}><X/></button><span className="success-check"><Check size={30}/></span><span className="eyebrow">GOOD THINGS ARE ON THEIR WAY</span><h2>Your order is confirmed.</h2><p>Thank you, {success.customer}. Your demo order is confirmed.</p><div className="confirmation"><span>{success.id}</span><b>{money(success.total)}</b><span>Processing · Simulated payment</span></div><p className="fine">No payment was collected and nothing will be shipped.<br/>You can track this order in the admin studio.</p><button className="primary full" onClick={()=>{setSuccess(null);location.hash='admin';setAdmin(true);setTab('Orders');window.scrollTo(0,0)}}>View in admin studio <ArrowUpRight size={17}/></button></section></div>}
 {editing&&<div className="overlay modal-overlay" onClick={()=>setEditing(null)}><section className="form-modal" role="dialog" aria-modal="true" aria-label="Edit product" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" aria-label="Close editor" onClick={()=>setEditing(null)}><X/></button><h2>{products.some(p=>p.id===editing.id)?'A little refinement.':'A new essential.'}</h2><form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const updated={...editing,name:String(fd.get('name')),category:String(fd.get('category')),type:String(fd.get('type')),price:Number(fd.get('price')),pack:Number(fd.get('pack')),stock:Number(fd.get('stock')),description:String(fd.get('description'))};if(updated.stock<(cart[updated.id]||0)){setToast('Stock cannot be lower than packs currently in your bag.');return}setProducts(ps=>ps.some(p=>p.id===updated.id)?ps.map(p=>p.id===updated.id?updated:p):[...ps,updated]);setEditing(null);setToast('Product saved')}}><label>Product name<input autoFocus name="name" defaultValue={editing.name} required maxLength={90}/></label><div className="form-two"><label>Category<select name="category" defaultValue={editing.category}>{['Plates','Bowls','Cups','Cutlery'].map(c=><option key={c}>{c}</option>)}</select></label><label>Product photo<select name="type" defaultValue={editing.type}>{['plate','bowl','cup','cutlery','spoon'].map(t=><option key={t}>{t}</option>)}</select></label></div><div className="form-three"><label>Price (₹)<input type="number" name="price" defaultValue={editing.price} min="1" step="1" required/></label><label>Pieces / pack<input type="number" name="pack" defaultValue={editing.pack} min="1" step="1" required/></label><label>Stock (packs)<input type="number" name="stock" defaultValue={editing.stock} min="0" step="1" required/></label></div><label>Description<textarea name="description" defaultValue={editing.description} required maxLength={500}/></label><button className="primary full">Save product <Check size={17}/></button></form></section></div>}
 {expenseOpen&&<div className="overlay modal-overlay" onClick={()=>setExpenseOpen(false)}><section className="form-modal" role="dialog" aria-modal="true" aria-label="Record expense" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" aria-label="Close expense form" onClick={()=>setExpenseOpen(false)}><X/></button><h2>Every little expense.</h2><form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.currentTarget);setExpenses(es=>[{id:Date.now(),name:String(fd.get('name')),category:String(fd.get('category')),amount:Number(fd.get('amount')),date:String(fd.get('date'))},...es]);setExpenseOpen(false);setToast('Expense recorded')}}><label>Description<input autoFocus name="name" required placeholder="e.g. Packaging supplies" maxLength={100}/></label><label>Category<select name="category">{['Stock purchase','Packaging','Delivery','Marketing','Other'].map(c=><option key={c}>{c}</option>)}</select></label><div className="form-two"><label>Amount (₹)<input name="amount" type="number" min="1" step="1" required/></label><label>Date<input name="date" type="date" defaultValue={new Date().toLocaleDateString('en-CA')} required/></label></div><button className="primary full">Record expense <Check size={17}/></button></form></section></div>}
    {plannerOpen&&<div className="overlay modal-overlay" onClick={()=>setPlannerOpen(false)}><section className="commerce-planner-modal" role="dialog" aria-modal="true" aria-label="Build a gathering kit" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" aria-label="Close gathering planner" onClick={()=>setPlannerOpen(false)}><X/></button><GatheringPlanner products={products} onAdd={addKit}/></section></div>}
    {toast&&<div className="toast" role="status"><Check size={17}/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App/>);
