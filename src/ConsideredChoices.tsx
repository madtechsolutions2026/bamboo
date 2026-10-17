import {useState} from 'react';
import {ArrowUpRight,Leaf,Plus,Check,Sprout,Utensils,Package,Recycle} from 'lucide-react';
import './choices.css';

export function MaterialCare(){
 const [open,setOpen]=useState(0);
 const notes=[
  {title:'Know what touches your food.',tag:'MATERIAL',icon:Leaf,body:'Look for clear information about the material, coatings, and finishes. A natural appearance alone doesn’t tell you whether a product is suitable for food contact.'},
  {title:'The right piece for the meal.',tag:'USE',icon:Utensils,body:'Choose tableware suited to what you’re serving. Follow the product’s instructions for hot or cold food, liquids, contact time, and any heating restrictions.'},
  {title:'A little care before serving.',tag:'CARE',icon:Package,body:'Keep unused pieces clean, dry, and protected until mealtime. Follow the stated care and single-use instructions for each product.'}
 ];
 return <section className="material-care section" id="material-care"><div className="care-visual"><div className="care-photo"><img src="/photos/sunday.webp" alt="Bamboo plates styled with a linen napkin and dining cutlery on a wooden table" loading="lazy"/><span className="care-photo-caption">FOR THE FOOD. FOR THE PEOPLE. FOR THE MOMENT.</span></div><div className="care-seal"><Sprout size={27} strokeWidth={1.1}/><span>A LITTLE MORE<br/>CONSIDERED</span></div><div className="care-annotation"><span>01 — 03</span><i/><span>MATERIAL · USE · CARE</span></div></div><div className="care-content"><span className="eyebrow">THOUGHTFUL AT EVERY MEALTIME</span><h2>Good food deserves<br/><em>a little care.</em></h2><p>A mindful meal starts with knowing what touches your food. Three small things to consider before you set the table.</p><div className="care-notes">{notes.map((note,i)=><div key={note.tag} className={open===i?'care-note active':'care-note'}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i} aria-controls={'care-note-'+i}><span className="care-note-icon"><note.icon size={18} strokeWidth={1.3}/></span><span><small>{note.tag}</small><strong>{note.title}</strong></span><Plus size={16}/></button><div id={'care-note-'+i} hidden={open!==i}><p>{note.body}</p></div></div>)}</div><div className="care-footnote"><Check size={14}/><span>Food-contact suitability comes from verified product specifications and testing.</span></div><a className="text-button" href="#collection">Find your everyday essential <ArrowUpRight size={16}/></a></div></section>
}

export function EcoChoices(){
 return <section className="eco-choices" id="eco-choices"><div className="eco-background"><img src="/photos/bamboo-forest.jpg" alt="" loading="lazy"/></div><div className="eco-heading"><span className="eyebrow">A MORE CONSIDERED GATHERING</span><div><h2>A little less excess.<br/><em>A little more intention.</em></h2><p>From your guest list to the last plate cleared,<br/>{' '}thoughtful choices have a place at the table.</p></div></div><div className="eco-ribbon">{[
  {icon:Sprout,n:'01',title:'Start with the material.',text:'Look for clear sourcing information. The material, coatings, and packaging all matter when choosing tableware.'},
  {icon:Package,n:'02',title:'Plan just what you need.',text:'Match your packs to your guest list. Store unused pieces properly so they’re ready for another occasion.'},
  {icon:Recycle,n:'03',title:'Think beyond the meal.',text:'Check the product label and local collection rules. Composting or recycling depends on the exact item and facilities that accept it.'}
 ].map(({icon:Icon,n,title,text})=><article key={n}><div className="eco-ribbon-top"><Icon size={27} strokeWidth={1}/><span>{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div><div className="eco-bottom"><a href="#gather">Plan a little lighter <ArrowUpRight size={18}/></a><span>Environmental claims and disposal guidance will follow the client’s verified product catalogue.</span><Leaf className="eco-bottom-leaf" size={37} strokeWidth={.8}/></div></section>
}
