import { useEffect, useId, useState } from 'react';
import { ArrowRight, ChevronDown, Leaf, Minus, Package, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import { type Product, money, productPhoto } from './catalogue';
import './product-detail.css';

type ProductDetailProps = {
  product: Product;
  inCart: number;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
};

export function ProductDetail({ product, inCart, onClose, onAdd, onBuyNow }: ProductDetailProps) {
  const titleId = useId();
  const [quantity, setQuantity] = useState(1);
  const available = Math.max(0, Math.floor(product.stock) - Math.max(0, Math.floor(inCart)));
  const selectedQuantity = available ? Math.min(Math.max(1, quantity), available) : 0;
  const unitLabel = product.type === 'cutlery' ? 'set' : 'piece';
  const contentsLabel = product.type === 'cutlery' ? 'spoon and fork sets' : product.type === 'spoon' ? 'spoons' : product.category.toLowerCase();
  const unitPrice = (product.price / Math.max(1, product.pack)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const lineTotal = product.price * selectedQuantity;

  useEffect(() => setQuantity(1), [product.id]);

  return (
    <div className="pd-overlay" onClick={onClose}>
      <section className="pd-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={event => event.stopPropagation()}>
        <button className="pd-close" type="button" aria-label="Close product details" onClick={onClose} autoFocus>
          <X size={21} strokeWidth={1.8} />
        </button>

        <div className="pd-layout">
          <div className="pd-visual">
            <img className="pd-photo" src={productPhoto(product)} alt={product.name} decoding="async" />
            <span className="pd-photo-label"><Leaf size={14} /> THE BAMBOO COLLECTION</span>
            <div className="pd-photo-caption"><span>Bring a little nature</span><strong>to the table.</strong></div>
          </div>

          <div className="pd-information">
            <div className="pd-copy">
              <p className="pd-breadcrumb">Bambu essentials <span>/</span> {product.category}</p>
              <div className="pd-title-line">
                <h2 id={titleId}>{product.name}</h2>
                <p className="pd-subtitle">Bamboo tableware · Pack of {product.pack}</p>
              </div>

              <div className="pd-price-block">
                <div className="pd-price"><strong>{money(product.price)}</strong><span> / pack</span></div>
                <p>₹{unitPrice} per {unitLabel} <span>·</span> {product.pack} {unitLabel}s in each pack</p>
              </div>

              <p className="pd-description">{product.description}</p>

              <div className={`pd-stock${!available ? ' pd-stock-empty' : ''}`}>
                <span className="pd-stock-dot" aria-hidden="true" />
                {available ? <span><strong>In stock</strong> · {available} {available === 1 ? 'pack' : 'packs'} available to add</span>
                  : <span><strong>{product.stock > 0 ? 'Already in your bag' : 'Currently sold out'}</strong></span>}
              </div>
              {inCart > 0 && <p className="pd-cart-note">You already have {inCart} {inCart === 1 ? 'pack' : 'packs'} in your bag.</p>}

              <div className="pd-delivery-card">
                <div className="pd-delivery-icon"><Truck size={21} strokeWidth={1.6} /></div>
                <div><strong>A little closer to your doorstep.</strong><p>Delivery ₹59. Free on orders of ₹999 or more.</p></div>
              </div>

              <div className="pd-details">
                <details>
                  <summary><span><Package size={17} /> What's in the pack</span><ChevronDown size={17} /></summary>
                  <p>One pack of {product.pack} {contentsLabel}. Choose the number of packs below to suit your gathering.</p>
                </details>
                <details>
                  <summary><span><Leaf size={17} /> Product & material notes</span><ChevronDown size={17} /></summary>
                  <p>Natural materials can vary in colour and grain. Check the final product's food-use, care and disposal instructions before use.</p>
                </details>
              </div>

              <p className="pd-reference-note">Demo catalogue with sample prices and specifications. Reference photography may show a different finish or product format.</p>
            </div>

            <div className="pd-purchase">
              <div className="pd-quantity-line">
                <label htmlFor={`${titleId}-quantity`}>Quantity <span>(packs)</span></label>
                <div className="pd-stepper">
                  <button type="button" aria-label="Decrease number of packs" onClick={() => setQuantity(Math.max(1, selectedQuantity - 1))} disabled={selectedQuantity <= 1}><Minus size={16} /></button>
                  <input id={`${titleId}-quantity`} type="number" min={available ? 1 : 0} max={available} step={1} inputMode="numeric" value={selectedQuantity} disabled={!available} onChange={event => {
                    const next = Number(event.currentTarget.value);
                    if (Number.isFinite(next)) setQuantity(Math.max(1, Math.min(available, Math.floor(next))));
                  }} aria-label="Number of packs" />
                  <button type="button" aria-label="Increase number of packs" onClick={() => setQuantity(Math.min(available, selectedQuantity + 1))} disabled={!available || selectedQuantity >= available}><Plus size={16} /></button>
                </div>
                <span className="pd-piece-count">{selectedQuantity * product.pack} {unitLabel}s</span>
              </div>
              <div className="pd-purchase-buttons">
                <button className="pd-add" type="button" disabled={!available} onClick={() => onAdd(product, selectedQuantity)}><ShoppingBag size={18} /><span>Add to bag</span></button>
                <button className="pd-buy" type="button" disabled={!available} onClick={() => onBuyNow(product, selectedQuantity)}><span>Buy now{available ? ` · ${money(lineTotal)}` : ''}</span><ArrowRight size={18} /></button>
              </div>
              <p className="pd-checkout-note">Try the complete checkout. No payment collected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
