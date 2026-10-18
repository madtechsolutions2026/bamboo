import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, CircleCheck, CreditCard, Package, ShoppingBag, Sprout, Truck } from 'lucide-react';
import { type Product, money, productPhoto } from './catalogue';
import './checkout-page.css';

export type CheckoutPageProps = {
  products: Product[];
  cart: Record<number, number>;
  total: number;
  shipping: number;
  onBack: () => void;
  onShop: () => void;
  onPlaceOrder: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutPage({ products, cart, total, shipping, onBack, onShop, onPlaceOrder }: CheckoutPageProps) {
  const items = products.filter(product => cart[product.id] > 0);
  const packCount = items.reduce((count, product) => count + cart[product.id], 0);

  return <div className="bambu-checkout">
    <header className="cp-header">
      <div className="cp-container cp-header-inner">
        <button className="cp-logo" type="button" onClick={onShop} aria-label="Bambu shop"><Sprout size={29} strokeWidth={1.7}/><span>bambu<span>.</span></span></button>
        <span className="cp-header-label"><ShoppingBag size={16}/> CHECKOUT</span>
        <button className="cp-back" type="button" onClick={onBack}><ArrowLeft size={16}/><span>Back to bag</span></button>
      </div>
    </header>

    {items.length === 0 ? <main className="cp-container cp-empty">
      <span className="cp-empty-icon"><ShoppingBag size={35} strokeWidth={1.4}/></span>
      <h1 id="checkout-page-title" tabIndex={-1}>Your next gathering starts here.</h1>
      <p>Your bag is empty. Find a few essentials before checking out.</p>
      <button className="cp-primary" type="button" onClick={onShop}>Explore the collection <ArrowRight size={17}/></button>
    </main> : <main className="cp-container cp-main">
      <nav className="cp-progress" aria-label="Checkout progress">
        <button type="button" onClick={onBack}><span className="cp-step-done"><Check size={13}/></span>Bag</button>
        <i aria-hidden="true"/>
        <span aria-current="step"><b>2</b>Delivery & review</span>
        <i aria-hidden="true"/>
        <span className="cp-step-future"><b>3</b>Confirmation</span>
      </nav>
      <div className="cp-page-heading"><span className="cp-eyebrow">A FEW DETAILS. THEN IT’S ALL SET.</span><h1 id="checkout-page-title" tabIndex={-1}>Checkout</h1><p>Your table essentials are almost ready. Add your delivery details below.</p></div>
      <form className="cp-layout" onSubmit={onPlaceOrder}>
        <div className="cp-details">
          <section className="cp-panel" aria-labelledby="cp-delivery-heading">
            <div className="cp-panel-heading"><span className="cp-section-icon"><Truck size={19}/></span><div><h2 id="cp-delivery-heading">Delivery details</h2><p>Where should your good things go?</p></div><span className="cp-country">India</span></div>
            <div className="cp-field-grid">
              <label htmlFor="cp-name">Full name <span aria-hidden="true">*</span><input id="cp-name" name="name" autoComplete="name" placeholder="e.g. Priya Sharma" required maxLength={80}/></label>
              <label htmlFor="cp-email">Email address <span aria-hidden="true">*</span><input id="cp-email" name="email" type="email" autoComplete="email" placeholder="priya@example.com" required maxLength={100}/></label>
              <label className="cp-field-full" htmlFor="cp-address">Delivery address <span aria-hidden="true">*</span><input id="cp-address" name="address" autoComplete="street-address" placeholder="House number, street, area" required maxLength={200}/></label>
              <label htmlFor="cp-city">City <span aria-hidden="true">*</span><input id="cp-city" name="city" autoComplete="address-level2" placeholder="Hyderabad" required maxLength={80}/></label>
              <label htmlFor="cp-pincode">PIN code <span aria-hidden="true">*</span><input id="cp-pincode" name="pincode" autoComplete="postal-code" inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} title="Enter a six-digit Indian PIN code" placeholder="500001" required/></label>
            </div>
            <p className="cp-field-note">All fields are required. For this demo, please use sample details.</p>
          </section>

          <section className="cp-panel cp-payment" aria-labelledby="cp-payment-heading">
            <div className="cp-panel-heading"><span className="cp-section-icon"><CreditCard size={19}/></span><div><h2 id="cp-payment-heading">Payment</h2><p>Experience the order flow.</p></div><span className="cp-demo-tag">Demo</span></div>
            <div className="cp-payment-choice"><CircleCheck size={22}/><div><h3>Simulated payment</h3><p>No payment details are needed, and no money will be collected.</p></div></div>
            <p className="cp-payment-note">Placing a demo order updates stock and adds the order to the demo admin in this browser. No real shipment is created.</p>
          </section>
          <button className="cp-continue-shopping" type="button" onClick={onShop}><ArrowLeft size={16}/> Continue shopping</button>
        </div>

        <aside className="cp-summary" aria-labelledby="cp-summary-heading">
          <div className="cp-summary-heading"><h2 id="cp-summary-heading">Your order</h2><span>{packCount} {packCount === 1 ? 'pack' : 'packs'}</span></div>
          <div className="cp-order-items">{items.map(product => <article className="cp-order-item" key={product.id}>
            <img src={productPhoto(product)} alt={product.name}/>
            <div><h3>{product.name}</h3><p>{product.pack} {product.type === 'cutlery' ? 'sets' : 'pieces'} / pack</p><span>Qty: {cart[product.id]} {cart[product.id] === 1 ? 'pack' : 'packs'} <i>·</i> {money(product.price)} each</span></div>
            <strong>{money(product.price * cart[product.id])}</strong>
          </article>)}</div>
          <button className="cp-edit-bag" type="button" onClick={onBack}>Edit your bag <ArrowRight size={14}/></button>
          <div className="cp-totals"><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>Delivery</span><b className={shipping === 0 ? 'cp-free' : ''}>{shipping ? money(shipping) : 'Free'}</b></div></div>
          <p className="cp-delivery-note"><Truck size={16}/>{shipping === 0 ? 'Complimentary delivery on your order.' : 'Free delivery on orders of ₹999 and above.'}</p>
          <div className="cp-grand-total"><div><b>Total</b><span>Amount to simulate</span></div><strong>{money(total + shipping)}</strong></div>
          <button className="cp-primary cp-place-order" type="submit">Place demo order <ArrowRight size={19}/></button>
          <span className="cp-no-payment"><Check size={14}/> No real payment. No real shipment.</span>
          <div className="cp-summary-footer"><Package size={18}/><span>Thoughtful essentials.<br/><b>A little closer to your table.</b></span></div>
        </aside>
      </form>
    </main>}
    <footer className="cp-footer"><span>© {new Date().getFullYear()} BAMBU</span><span>A shopping concept by Madtech Solutions.</span></footer>
  </div>;
}
