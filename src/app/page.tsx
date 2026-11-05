"use client";

import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const FACTORS: any = { Small: 0.9, Medium: 1, Large: 1.15, XL: 1.3 };

const PACKAGES = [
  { name: 'Mini Valet', base: 65, duration: '1–1.5 hrs', img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'A quick but thorough refresh. Exterior hand wash using premium shampoo, wheels and arches cleaned, full interior vacuum, wipe-down of all surfaces, and streak-free glass cleaning.' },
  { name: 'Full Valet', base: 125, duration: '2.5–3 hrs', tag: 'Most popular', img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'Our signature deep clean. Everything in the Mini Valet plus a wax/sealant application, deep cleaning of interior plastics and leather, door shuts, fuel cap, and boot detail. The ultimate reset.' },
  { name: 'Enhancement Detail', base: 350, duration: '5–6 hrs', from: true, img: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'Designed to make your paint pop. A full valet plus chemical decontamination (iron fallout and tar removal) and a single-stage machine polish to remove light swirl marks and restore gloss.' },
  { name: 'Ceramic Coating', base: 495, duration: '1–2 days', from: true, tag: 'Best protection', img: 'https://images.unsplash.com/photo-1605615685313-af9e02a183bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'The ultimate protection. A full enhancement detail followed by a professional-grade ceramic coating. Repels water, makes cleaning easier, and protects against UV and environmental damage for 2+ years.' }
];

const SERVICE_DATA: any = {
  headlight: { title: 'Headlight Restoration', price: '£75', checkoutName: 'Headlight Restoration', checkoutPrice: 75, desc: 'Over time, UV rays break down the protective clear coat on your headlights, causing them to turn yellow, cloudy, and dull. This doesn\'t just look bad—it reduces your visibility at night and is a common MOT failure point.\n\nWe come to you, carefully wet-sand away the oxidised layer, machine polish the plastic back to optical clarity, and seal it with a professional UV-resistant coating. This restores your lights to a crystal-clear, factory-fresh condition and protects them from yellowing again.' },
  engine: { title: 'Engine Bay Detail', price: '£55', checkoutName: 'Engine Bay Detail', checkoutPrice: 55, desc: 'A clean engine bay isn\'t just about looks—it makes it easier to spot leaks, keeps components cooler, and is the biggest indicator of a genuinely well-cared-for car.\n\nWe use a low-pressure steam clean and carefully controlled degreasers to remove years of grime, oil, and road salt. Every sensitive electrical component is safely covered. Once clean, we apply a non-sticky, factory-style dressing to the plastics and hoses, leaving it looking like it just rolled off the production line.' },
  graffiti: { title: 'Graffiti & Spray Paint Removal', price: 'Quote', checkoutName: 'Graffiti Removal', checkoutPrice: 0, desc: 'Having your car vandalised is stressful. Graffiti and spray paint can bond aggressively to clear coats and glass, but standard thinners or aggressive polishing will ruin your paint.\n\nWe assess the type of paint and the surface it\'s on. Using specialist, controlled solvents and careful agitation, we lift the graffiti layer-by-layer without touching the factory paint underneath. We always ask for photos before quoting.' },
  mould: { title: 'Mould Removal & Sterilisation', price: '£220', checkoutName: 'Mould Removal', checkoutPrice: 220, desc: 'Mould in a car is usually caused by a leak, a spill, or a convertible roof left damp. It\'s a health hazard and it spreads fast.\n\nWe don\'t just wipe the surface—we treat the root cause. We identify the moisture source, safely remove and disinfect affected materials, and deep-clean the entire interior. We finish with an anti-microbial fog and ozone treatment to ensure spores don\'t return.' },
  odour: { title: 'Odour Removal (Ozone)', price: '£60', checkoutName: 'Odour Removal', checkoutPrice: 60, desc: 'Whether it\'s smoke, wet dog, milk spills, or damp, masking the smell doesn\'t work. You have to destroy the source.\n\nWe use a commercial ozone generator. Ozone is a highly reactive gas that actively destroys bacteria, viruses, and odour-causing molecules at a chemical level. Afterwards, the car is left with a completely neutral, factory-fresh smell.' },
  pet: { title: 'Pet Hair Removal', price: '£30', checkoutName: 'Pet Hair Removal', checkoutPrice: 30, desc: 'Pet hair is one of the hardest things to remove from a car. It weaves itself into the weave of the carpets and fabric seats, and a standard vacuum will just glide right over it.\n\nWe use a combination of high-pressure air, specialised rubber pet hair brushes, and pumice stones to agglomerate the hair. Once gathered, we use industrial wet-and-dry vacuums to lift every single strand.' }
};

const LEGAL_DATA: any = {
  privacy: `<h2>Privacy Policy</h2><div class="last-updated">Last Updated: 24-December-2024</div><p>This Privacy Policy describes the policies of <strong>247 Detailing</strong>, Hayes, West London, United Kingdom, email: <strong>hello@247detailing.co.uk</strong>, phone: <strong>+44 7862 254769</strong> on the collection, use, and disclosure of your information that we collect when you use our website.</p><h3>Information We Collect</h3><p>We will collect and process the following personal information about you:</p><ul><li>Name</li><li>Email</li><li>Address</li><li>Phone Number</li><li>Vehicle Make & Model</li><li>Registration Number</li></ul><h3>How We Use Your Information</h3><p>We will use the information that we collect about you for the following purposes:</p><ul><li>Creating user account</li><li>Customer support</li><li>Manage customer orders and bookings</li></ul><h3>Retention Of Your Information</h3><p>We will retain your personal information with us for 90 days to 2 years after users terminate their accounts or for as long as we need it to fulfil the purposes for which it was collected.</p><h3>Your Rights</h3><p>Depending on the law that applies, you may have a right to access and rectify or erase your personal data or receive a copy of your personal data. To exercise these rights, you can write to us at hello@247detailing.co.uk.</p>`,
  terms: `<h2>Terms &amp; Conditions</h2><div class="last-updated">Last Updated: 24-December-2024</div><h3>1. Engagement of Services</h3><p><strong>247 Detailing</strong> uses reasonable efforts to ensure that the valet will be provided in a professional and satisfactory manner. You understand and agree that we do not guarantee that your car detail will meet any specific applicable industry or professional standards.</p><p>If you choose to Request a Valet, you must:</p><ul><li>Ensure that the services are available in your location.</li><li>Leave your vehicle in a public location where we are authorised to enter and perform the valet.</li><li>Ensure that there is at least a 50cm perimeter around all sides of your car.</li><li>Remove any personal and/or bulky items, car seats, and open any compartments in preparation for the valet.</li><li>Understand that traffic and delays from other jobs may cause arrival delays. You must allow a 2-hour window from your booked time for us to arrive.</li></ul><h3>2. Bookings &amp; Pricing</h3><p>Bookings placed via the website, app, or telephone must be paid for ahead of time. Payment is made using Credit/Debit card, or Apple Pay or Google Pay through Stripe. <strong>After-hours bookings (after 7pm) are subject to a 1.5x multiplier, and after 11pm a 2x multiplier.</strong></p><h3>3. Liability &amp; Disclaimers</h3><p>We will perform the services selected by you with all reasonable skill and care. However, the Company shall not be liable for damage to, loss of the vehicle or any part of it, arising from our custody of the vehicle.</p><p>We take no responsibility for damage to vehicles that have satin or matt paint or a satin/matt wrap.</p><p><strong>Engine bay cleaning is performed entirely at the customer's own risk.</strong> We will not be held liable for any mechanical, electrical, or operational issues that may arise following the service.</p><p><strong>Battery Issues:</strong> We are not responsible for any battery-related faults that may occur during or after cleaning.</p><h3>4. Cancellation Policy</h3><p>If you cancel the booking within 24 hours of the scheduled time, we will charge 50% of the booking. Cancellations within 3 hours of the booking time will be charged in full. Cancellations will be refunded minus card processing fees of 3%.</p><h3>5. Technician Allocation</h3><p>We do not guarantee a specific technician for any booking. Customers who wish to have a specific technician guaranteed may request this in advance. <strong>A £25 guaranteed technician fee applies.</strong></p>`
};

const AREAS = [
  { name: 'Mayfair', x: 224, y: 104, zone: 'Mayfair & Prime Central', surcharge: 20 },
  { name: 'Belgravia', x: 214, y: 138, zone: 'Mayfair & Prime Central', surcharge: 20 },
  { name: 'Knightsbridge', x: 200, y: 158, zone: 'Mayfair & Prime Central', surcharge: 20 },
  { name: 'Kensington', x: 172, y: 126, zone: 'Central London', surcharge: 15 },
  { name: 'Chelsea', x: 184, y: 162, zone: 'Central London', surcharge: 15 },
  { name: 'Ealing', x: 104, y: 104, zone: 'West London', surcharge: 0 },
  { name: 'Hayes', x: 44, y: 120, zone: 'West London', surcharge: 0 },
  { name: 'Harrow', x: 112, y: 44, zone: 'North West London', surcharge: 0 },
  { name: 'Wembley', x: 148, y: 68, zone: 'North West London', surcharge: 0 },
  { name: 'Barnet', x: 196, y: 26, zone: 'Outer Ring', surcharge: 10 },
];

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [size, setSize] = useState('Medium');
  const [basket, setBasket] = useState<{ name: string; price: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);
  
  const [selectedDetailer, setSelectedDetailer] = useState('any');
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);

  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [timeSlot, setTimeSlot] = useState('standard');
  const [addons, setAddons] = useState({ wetvac: false, pet: false, soil: false, odour: false, mould: false });
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const washRef = useRef<HTMLDivElement>(null);
  const foamRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [washStage, setWashStage] = useState(0);

  const round5 = (n: number) => Math.round(n / 5) * 5;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const addToBasket = (name: string, price: number) => {
    if (basket.find(item => item.name === name)) {
      triggerToast(`${name} already in basket`);
      return;
    }
    setBasket([...basket, { name, price }]);
    triggerToast(`${name} added to basket`);
  };

  const removeFromBasket = (name: string) => {
    setBasket(basket.filter(item => item.name !== name));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!washRef.current || !foamRef.current || !wipeRef.current || !sceneRef.current) return;
      const rect = washRef.current.getBoundingClientRect();
      const total = washRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      let p = Math.max(0, Math.min(1, -rect.top / total));

      const sm = (a: number, b: number, v: number) => {
        v = Math.max(0, Math.min(1, (v - a) / (b - a)));
        return v * v * (3 - 2 * v);
      };

      const foamIn = sm(0.08, 0.22, p);
      const wipeProgress = sm(0.25, 0.75, p);
      foamRef.current.style.opacity = (foamIn * (1 - wipeProgress)).toFixed(3);
      wipeRef.current.style.opacity = (wipeProgress > 0.01 && wipeProgress < 0.99) ? '1' : '0';
      wipeRef.current.style.left = (wipeProgress * 100) + '%';
      sceneRef.current.style.transform = `scale(${0.95 + wipeProgress * 0.05})`;

      const idx = p < 0.08 ? 0 : p < 0.22 ? 1 : p < 0.50 ? 2 : p < 0.75 ? 3 : p < 0.90 ? 4 : 5;
      setWashStage(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const basketTotal = basket.reduce((sum, item) => sum + item.price, 0);
  const multiplierMap: any = { standard: 1, evening: 1.5, night: 2 };
  const mult = multiplierMap[timeSlot] || 1;
  
  let addonTotal = 0;
  if (addons.wetvac) addonTotal += 25;
  if (addons.pet) addonTotal += 30;
  if (addons.soil) addonTotal += 25;
  if (addons.odour) addonTotal += 45;
  if (addons.mould) addonTotal += 50;

  const subtotal = (basketTotal * mult) + addonTotal + selectedArea.surcharge;
  const promoDiscount = appliedPromo === 'FIRST10' ? subtotal * 0.10 : 0;
  const finalTotal = round5(subtotal - promoDiscount);

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'FIRST10') {
      setAppliedPromo('FIRST10');
      alert('Promo code FIRST10 applied! 10% off.');
    } else {
      setAppliedPromo('');
      alert('Invalid promo code.');
    }
  };

  const handleSendQuote = async (type: 'email' | 'whatsapp') => {
    if (basket.length === 0) {
      alert('Your basket is empty. Please add a service first.');
      return;
    }
    if (type === 'email' && !formData.phone.trim()) {
      alert('Please enter your phone number so we can contact you.');
      return;
    }

    // 1. Save to Supabase Database
    const supabase = createClient();
    const timeLabels: any = { standard: 'Standard (7am–7pm)', evening: 'Evening (7pm–10:30pm)', night: 'Night (after 11pm)' };
    let addonsList = [];
    if (addons.wetvac) addonsList.push('Wet Vac');
    if (addons.pet) addonsList.push('Pet hair');
    if (addons.soil) addonsList.push('Excessive soil');
    if (addons.odour) addonsList.push('Odour treatment');
    if (addons.mould) addonsList.push('Mould treatment');

    const { error } = await supabase.from('bookings').insert({
      customer_name: formData.name || 'No Name',
      customer_phone: formData.phone || 'No Phone',
      items: basket.map(i => i.name).join(', '),
      area: selectedArea.name,
      time_slot: timeLabels[timeSlot],
      addons: addonsList.join(', '),
      total_price: finalTotal
    });

    if (error) {
      console.error('Error saving booking:', error);
      alert('There was an issue saving your booking. Please try again.');
      return;
    }

    // 2. Send Email/WhatsApp
    const basketNames = basket.map(i => i.name).join(', ');
    const text = `
New quote request — 247 Detailing

Name: ${formData.name}
Phone: ${formData.phone}
Items: ${basketNames}
Area: ${selectedArea.name}
Time: ${timeLabels[timeSlot]}
Add-ons: ${addonsList.length ? addonsList.join(', ') : 'None'}
ESTIMATED TOTAL: £${finalTotal}
    `;

    if (type === 'email') {
      window.location.href = `mailto:hello@247detailing.co.uk?subject=Quote request — ${formData.name}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(`https://wa.me/447862254769?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    // 3. Show Success Screen
    setIsSuccess(true);
  };

  return (
    <div className="font-sans">
      <div className="emergency-banner">
        🚨 24/7 Emergency Detailing Available <span>After 7pm: 1.5x rate · After 11pm: 2x rate</span>
      </div>

      <div className="ticker">
        <div className="ticker-track">
          <span>FIRST10 — 10% off your first visit&nbsp;&nbsp;✦&nbsp;&nbsp;Second car 15% off&nbsp;&nbsp;✦&nbsp;&nbsp;Care Club from £58 a month&nbsp;&nbsp;✦&nbsp;&nbsp;Mayfair, Belgravia, Knightsbridge &amp; all London&nbsp;&nbsp;✦&nbsp;&nbsp;Track your detailer live&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
          <span>FIRST10 — 10% off your first visit&nbsp;&nbsp;✦&nbsp;&nbsp;Second car 15% off&nbsp;&nbsp;✦&nbsp;&nbsp;Care Club from £58 a month&nbsp;&nbsp;✦&nbsp;&nbsp;Mayfair, Belgravia, Knightsbridge &amp; all London&nbsp;&nbsp;✦&nbsp;&nbsp;Track your detailer live&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
        </div>
      </div>

      <header className="nav">
        <div className="w nav-in">
          <a className="logo" href="#top">247<b>Detailing</b></a>
          
          <nav className="nav-links">
            <a className="lnk" href="#packages">Packages</a>
            <a className="lnk" href="#specialists">Specialists</a>
            <a className="lnk" href="#detailers">Detailers</a>
            <a className="lnk" href="#checkout">Checkout</a>
            <a className="lnk" href="#areas">Areas</a>
            <a className="lnk" href="#club">Care Club</a>
          </nav>

          <div className="nav-right">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} />
              {basket.length > 0 && <span className="cart-badge">{basket.length}</span>}
            </button>
            <button className="icon-btn md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#packages" onClick={() => setIsMobileMenuOpen(false)}>Packages</a>
          <a href="#specialists" onClick={() => setIsMobileMenuOpen(false)}>Specialists</a>
          <a href="#detailers" onClick={() => setIsMobileMenuOpen(false)}>Detailers</a>
          <a href="#checkout" onClick={() => setIsMobileMenuOpen(false)}>Checkout</a>
          <a href="#areas" onClick={() => setIsMobileMenuOpen(false)}>Areas</a>
          <a href="#club" onClick={() => setIsMobileMenuOpen(false)}>Care Club</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="w">
          <p className="eyebrow">Mobile detailing · Mayfair &amp; all London</p>
          <h1>Your car, <span className="shimmer">flawless.</span><br/>At your door.</h1>
          <p className="lede">Valeting, paint correction, ceramic protection, and specialist care—by a detailer you choose. 24/7 emergency service available.</p>
          <div className="hero-cta">
            <a className="btn" href="#packages">See prices</a>
            <a className="btn ghost" href="#areas">Check my area</a>
          </div>
        </div>
      </section>

      <section id="reviews" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="w">
          <div style={{ textAlign: 'center' }}>
            <p className="eyebrow">Google Reviews</p>
            <h2 style={{ fontSize: '36px' }}>What London is saying</h2>
            <div style={{ color: '#fbbc04', fontSize: '24px', marginTop: '10px' }}>★★★★★ <span style={{ color: 'var(--mut)', fontSize: '16px', fontFamily: 'system-ui' }}>4.9 based on 120+ reviews</span></div>
          </div>
          <div className="reviews-wrap">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">"Absolutely flawless work on my G80. They came out to Mayfair, set up their van, and the ceramic coating looks like glass. The live tracking was class."</div>
              <div className="review-author"><div className="review-avatar" style={{ background: '#4285f4' }}>J</div><div><div className="review-name">James H.</div><div className="review-google">Posted on Google</div></div></div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">"Had a complete disaster with a milk spill in the back. 247 came out at 9pm and did a full biohazard/odour removal. Smells brand new. Lifesavers."</div>
              <div className="review-author"><div className="review-avatar" style={{ background: '#0f9d58' }}>S</div><div><div className="review-name">Sarah M.</div><div className="review-google">Posted on Google</div></div></div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">"The spotless water is no joke. My black Range Rover usually shows every single mark. After their visit, it was completely streak-free. Highly recommend."</div>
              <div className="review-author"><div className="review-avatar" style={{ background: '#db4437' }}>A</div><div><div className="review-name">Ahmed K.</div><div className="review-google">Posted on Google</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="w">
        <div className="strip">
          <div><strong>Spotless Water</strong><small>Ultra-pure, spot-free rinse. No water marks.</small></div>
          <div><strong>Premium Products</strong><small>Koch Chemie, Gtechniq, 3M, Bilt Hamber, Meguiar's.</small></div>
          <div><strong>Live arrival tracking</strong><small>Map, status and arrival time, right on your phone.</small></div>
          <div><strong>24/7 Emergency</strong><small>After-hours rates: 1.5x after 7pm, 2x after 11pm.</small></div>
        </div>
      </div>

      <section id="packages" style={{ paddingTop: '80px' }}>
        <div className="w">
          <p className="eyebrow">Packages</p>
          <h2>Choose your level of care</h2>
          <p className="sub">Fixed prices by vehicle size. Tap your size — the prices change with it.</p>
          
          <div className="chips">
            {Object.keys(FACTORS).map(k => (
              <button key={k} type="button" className={`chip ${k === size ? 'on' : ''}`} onClick={() => setSize(k)}>
                {k}
              </button>
            ))}
          </div>

          <div className="grid">
            {PACKAGES.map((pkg) => {
              const price = round5(pkg.base * FACTORS[size]);
              return (
                <div key={pkg.name} className="card">
                  <img src={pkg.img} className="card-img" alt={pkg.name} />
                  {pkg.tag && <span className="tag">{pkg.tag}</span>}
                  <div className="card-body">
                    <h3>{pkg.name}</h3>
                    <p>{pkg.desc}</p>
                    <div className="meta">{pkg.duration} · {size}</div>
                    <div className="price">
                      {pkg.from && <span className="from">from</span>}
                      £{price}
                    </div>
                    <button className="btn" onClick={() => addToBasket(`${pkg.name} (${size})`, price)}>Add to Basket</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wash" ref={washRef}>
        <div className="wash-pin">
          <div className="wash-hd">
            <p className="eyebrow">The process</p>
            <h2 className="wash-title">From filthy to <span className="shimmer">flawless</span></h2>
          </div>
          <div className="scene-wrap" ref={sceneRef}>
            <img src="/garage.webp" alt="247 Detailing Van" className="scene-img" />
            <div className="foam-layer" ref={foamRef}></div>
            <div className="wipe-line" ref={wipeRef} style={{ left: '-10px', opacity: 0 }}></div>
          </div>
          <div className="wash-caption">
            <span className="wash-num">0{washStage + 1}</span>
            <span className="wash-name">
              {washStage === 0 ? 'Filthy.' : 
               washStage === 1 ? 'Snow foam.' : 
               washStage === 2 ? 'Rinse.' : 
               washStage === 3 ? 'Contact wash.' : 
               washStage === 4 ? 'Dry & gloss.' : 'Flawless.'}
            </span>
          </div>
        </div>
      </section>

      <section id="specialists" className="alt">
        <div className="w">
          <p className="eyebrow">Specialist Services</p>
          <h2>Beyond a standard valet</h2>
          <p className="sub">The tough jobs other detailers turn away. Click "Read More" for the full breakdown, or add directly to your basket.</p>
          
          <div className="spec-category">
            <h3>Restoration &amp; Repair</h3>
            <div className="specialist-grid">
              <div className="spec-card">
                <div><span className="icon">💡</span><h4>Headlight Restoration</h4><p>Cloudy, yellow lenses fail MOTs and look tired. We restore clarity.</p><div className="price-tag">From £75 <small>per pair</small></div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('headlight')}>Read More</button>
                  <button className="btn" onClick={() => addToBasket('Headlight Restoration', 75)}>Add to Basket</button>
                </div>
              </div>
              <div className="spec-card">
                <div><span className="icon">🔧</span><h4>Engine Bay Detail</h4><p>Steam-cleaned and dressed to a factory-fresh finish.</p><div className="price-tag">From £55</div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('engine')}>Read More</button>
                  <button className="btn" onClick={() => addToBasket('Engine Bay Detail', 55)}>Add to Basket</button>
                </div>
              </div>
              <div className="spec-card">
                <div><span className="icon">🎨</span><h4>Graffiti Removal</h4><p>Targeted, controlled removal from paint, glass, and trim.</p><div className="price-tag">Message for a Quote</div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('graffiti')}>Read More</button>
                  <a href="https://wa.me/447862254769?text=Hi%20247%20Detailing,%20I'd%20like%20a%20quote%20for%20Graffiti%20Removal" target="_blank" className="btn whatsapp" style={{ flex: 1, padding: '10px 12px', fontSize: '12px', textAlign: 'center' }}>WhatsApp</a>
                </div>
              </div>
            </div>
          </div>

          <div className="spec-category">
            <h3>Interior Disasters</h3>
            <div className="specialist-grid">
              <div className="spec-card">
                <div><span className="icon">🦠</span><h4>Mould Removal</h4><p>Specialist treatment for fabric roofs, carpets, and interiors.</p><div className="price-tag">From £220</div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('mould')}>Read More</button>
                  <button className="btn" onClick={() => addToBasket('Mould Removal', 220)}>Add to Basket</button>
                </div>
              </div>
              <div className="spec-card">
                <div><span className="icon">💨</span><h4>Odour Removal</h4><p>Ozone treatment for smoke, pets, spills, and damp.</p><div className="price-tag">From £60</div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('odour')}>Read More</button>
                  <button className="btn" onClick={() => addToBasket('Odour Removal', 60)}>Add to Basket</button>
                </div>
              </div>
              <div className="spec-card">
                <div><span className="icon">🐾</span><h4>Pet Hair Removal</h4><p>Pet hair weaves into fabric. We use specialist rubber tools.</p><div className="price-tag">From £30</div></div>
                <div className="spec-actions">
                  <button className="btn ghost" onClick={() => setActiveServiceModal('pet')}>Read More</button>
                  <button className="btn" onClick={() => addToBasket('Pet Hair Removal', 30)}>Add to Basket</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="water">
        <div className="w">
          <p className="eyebrow">The water we use</p>
          <h2>Spotless, every time</h2>
          <p className="sub">We use ultra-pure deionised water from Spotless Water. It contains no minerals, so it dries without leaving a single water spot.</p>
          <div className="water-grid">
            <div className="water-text">
              <ul>
                <li>Zero mineral deposits — no water marks or streaks</li>
                <li>Safe for ceramic coatings and paint protection</li>
                <li>Better results for glass, chrome, and gloss black trim</li>
                <li>No need to dry the car with a towel—it air-dries clean</li>
              </ul>
            </div>
            <div className="water-visual">
              <div className="drop">💧</div>
              <h3>Spotless Water</h3>
              <p>Ultra-pure, deionised water for a truly spot-free finish.</p>
              <div className="badge">Zero water marks · EcoFlow system</div>
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="alt">
        <div className="w" style={{ textAlign: 'center' }}>
          <p className="eyebrow">The best products</p>
          <h2>Only professional-grade chemicals</h2>
          <div className="brand-strip">
            <div className="brand-logo">Koch Chemie<small>GERMANY</small></div>
            <div className="brand-logo">Gtechniq<small>UK</small></div>
            <div className="brand-logo">3M<small>USA</small></div>
            <div className="brand-logo">Bilt Hamber<small>UK</small></div>
            <div className="brand-logo">Meguiar's<small>USA</small></div>
          </div>
        </div>
      </section>

      <section id="detailers">
        <div className="w">
          <p className="eyebrow">Your detailer</p>
          <h2>Choose who looks after your car</h2>
          <p className="sub">Pick a specialist, or let us assign the first available.</p>
          <div className="grid" style={{ marginTop: '40px' }}>
            <div className={`dt ${selectedDetailer === 'A' ? 'sel' : ''}`} onClick={() => setSelectedDetailer('A')}>
              <div className="avatar">A</div>
              <div><h3>Detailer A</h3><p>Lead detailer. Paint correction and ceramic coatings.</p>
                <div className="tags"><span className="tg">Correction</span><span className="tg">Ceramic</span></div></div>
            </div>
            <div className={`dt ${selectedDetailer === 'B' ? 'sel' : ''}`} onClick={() => setSelectedDetailer('B')}>
              <div className="avatar">B</div>
              <div><h3>Detailer B</h3><p>Valeting and interiors specialist, including leather and steam.</p>
                <div className="tags"><span className="tg">Interiors</span><span className="tg">Valets</span></div></div>
            </div>
            <div className={`dt ${selectedDetailer === 'any' ? 'sel' : ''}`} onClick={() => setSelectedDetailer('any')}>
              <div className="avatar">✦</div>
              <div><h3>First available</h3><p>We assign whoever can reach you soonest.</p>
                <div className="tags"><span className="tg">Fastest</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="areas" className="alt">
        <div className="w">
          <p className="eyebrow">Where we work</p>
          <h2>Tap your area</h2>
          <p className="sub">West and North West London are our home turf. Mayfair and prime Central London are a speciality.</p>
          
          <div className="area-grid" style={{ marginTop: '40px' }}>
            <div className="mapbox">
              <svg viewBox="0 0 400 270" style={{ width: '100%', height: 'auto' }}>
                <path d="M0 180 C60 168 92 200 142 178 S222 146 262 168 S342 198 400 176" stroke="#5f7f99" strokeWidth="11" fill="none" opacity=".35"/>
                <text x="292" y="214" fill="var(--mut)" fontSize="11" fontStyle="italic">River Thames</text>
                {AREAS.map(a => (
                  <g key={a.name} onClick={() => setSelectedArea(a)} style={{ cursor: 'pointer' }}>
                    <circle cx={a.x} cy={a.y} r="7" className={`dot ${selectedArea.name === a.name ? 'on' : ''}`} />
                    <text x={a.x + 11} y={a.y + 4} fontSize="10" fill="var(--mut)">{a.name}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div>
              <div className="chips" style={{ marginTop: 0 }}>
                {AREAS.map(a => (
                  <button key={a.name} className={`chip ${selectedArea.name === a.name ? 'on' : ''}`} onClick={() => setSelectedArea(a)}>
                    {a.name}
                  </button>
                ))}
              </div>
              <div className="area-info">
                ✅ We cover <b>{selectedArea.name}</b> ({selectedArea.zone}). 
                {selectedArea.surcharge > 0 ? ` A £${selectedArea.surcharge} area surcharge applies.` : ' No travel surcharge.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="club">
        <div className="w">
          <p className="eyebrow">Care Club</p>
          <h2>Stay spotless all year</h2>
          <p className="sub">Regular visits at a reduced rate. Example plans — cancel any time.</p>
          
          <div className="grid" style={{ marginTop: '40px' }}>
            <div className="card" style={{ padding: '30px' }}>
              <h3>Monthly</h3><p>One Mini Valet every month.</p>
              <div className="meta">Saves 10%</div>
              <div className="price">£58<small> /month</small></div>
            </div>
            <div className="card" style={{ padding: '30px' }}>
              <span className="tag">Best value</span>
              <h3>Fortnightly</h3><p>Two Mini Valets a month.</p>
              <div className="meta">Saves 15%</div>
              <div className="price">£110<small> /month</small></div>
            </div>
            <div className="card" style={{ padding: '30px' }}>
              <h3>Two-car household</h3><p>One Mini Valet for each car, every month.</p>
              <div className="meta">Saves 20%</div>
              <div className="price">£105<small> /month</small></div>
            </div>
          </div>

          <div className="band">
            <div>
              <h2>First visit? Use FIRST10</h2>
              <p>10% off your first booking, and 15% off the second car in the same visit.</p>
            </div>
            <a className="btn" href="#checkout">Book now</a>
          </div>
        </div>
      </section>

      <section id="checkout">
        <div className="w">
          <p className="eyebrow">Instant estimate</p>
          <h2>Build your quote</h2>
          
          {isSuccess ? (
            <div className="checkout-wrap" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ fontSize: '42px', color: 'var(--g)', marginBottom: '16px' }}>Thank you for your service</h2>
              <p style={{ fontSize: '18px', color: 'var(--mut)' }}>A member of the 247 Detailing team will be in touch shortly to confirm your booking.</p>
              <button className="btn" style={{ marginTop: '30px' }} onClick={() => window.location.reload()}>Back to site</button>
            </div>
          ) : (
            <div className="checkout-wrap">
              <div className="checkout-grid">
                
                <div>
                  <div className="co-field">
                    <label>Your Name</label>
                    <input type="text" placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="co-field">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="07..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  
                  <div className="co-field">
                    <label>Your Selected Items (Basket)</label>
                    <div className="checkout-cart-list">
                      {basket.length === 0 ? (
                        <div style={{ fontSize: '13px', color: 'var(--mut)' }}>No items selected. Add a package or specialist service above.</div>
                      ) : (
                        basket.map(item => (
                          <div key={item.name} className="cc-item">
                            <span>{item.name}</span>
                            <span className="cc-item-price">£{item.price}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="co-field">
                    <label>Time slot</label>
                    <div className="radio-group">
                      <label><input type="radio" name="time" value="standard" checked={timeSlot === 'standard'} onChange={() => setTimeSlot('standard')} /><span>Standard (7am–7pm)</span></label>
                      <label><input type="radio" name="time" value="evening" checked={timeSlot === 'evening'} onChange={() => setTimeSlot('evening')} /><span>Evening <span className="multiplier-tag">1.5x</span></span></label>
                      <label><input type="radio" name="time" value="night" checked={timeSlot === 'night'} onChange={() => setTimeSlot('night')} /><span>Night <span className="multiplier-tag">2x</span></span></label>
                    </div>
                  </div>

                  <div className="co-field">
                    <label>Condition &amp; add-ons</label>
                    <ul className="addon-list">
                      <li><input type="checkbox" checked={addons.wetvac} onChange={e => setAddons({...addons, wetvac: e.target.checked})} /><label>Wet Vacuuming <small>+£25</small></label></li>
                      <li><input type="checkbox" checked={addons.pet} onChange={e => setAddons({...addons, pet: e.target.checked})} /><label>Pet hair removal <small>+£30</small></label></li>
                      <li><input type="checkbox" checked={addons.soil} onChange={e => setAddons({...addons, soil: e.target.checked})} /><label>Excessive soil / mud <small>+£25</small></label></li>
                      <li><input type="checkbox" checked={addons.odour} onChange={e => setAddons({...addons, odour: e.target.checked})} /><label>Odour treatment <small>+£45</small></label></li>
                      <li><input type="checkbox" checked={addons.mould} onChange={e => setAddons({...addons, mould: e.target.checked})} /><label>Mould treatment <small>+£50</small></label></li>
                    </ul>
                  </div>

                  <div className="co-field">
                    <label>Promo Code</label>
                    <div className="promo-box">
                      <input type="text" placeholder="e.g. FIRST10" value={promoInput} onChange={e => setPromoInput(e.target.value)} />
                      <button type="button" className="btn" onClick={handleApplyPromo}>Apply</button>
                    </div>
                  </div>
                </div>

                <div className="co-summary">
                  <h4>Your estimate</h4>
                  <div className="co-line"><span>Base service</span><span className="amount">£{basketTotal}</span></div>
                  {selectedArea.surcharge > 0 && <div className="co-line"><span>Area surcharge ({selectedArea.name})</span><span className="amount">+£{selectedArea.surcharge}</span></div>}
                  {mult !== 1 && <div className="co-line"><span>Time multiplier</span><span className="amount">{mult}x</span></div>}
                  {addonTotal > 0 && <div className="co-line"><span>Add-ons</span><span className="amount">+£{addonTotal}</span></div>}
                  {appliedPromo && <div className="co-line" style={{ color: 'var(--g)' }}><span>FIRST10 Discount</span><span className="amount">-£{promoDiscount.toFixed(2)}</span></div>}
                  <div className="co-line total"><span>Estimated total</span><span className="amount">£{finalTotal}</span></div>
                  
                  <button className="btn" onClick={() => handleSendQuote('email')}>Send this quote</button>
                  <button className="btn whatsapp" onClick={() => handleSendQuote('whatsapp')} style={{ marginTop: '10px' }}>WhatsApp instead</button>
                  
                  {/* REPLACE PASTE_YOUR_STRIPE_LINK_HERE WITH YOUR ACTUAL STRIPE LINK */}
                  <a 
                    href="PASTE_YOUR_STRIPE_LINK_HERE" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn ghost" 
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    Pay £20 Deposit to Secure Date
                  </a>

                  <p className="co-note">We'll confirm the final price after seeing the car. No payment is taken now.</p>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="w">
          <div className="f-grid">
            <div>
              <div className="logo" style={{ color: '#f4efe4', fontSize: '29px', marginBottom: '8px' }}>247<b style={{ color: 'var(--g)' }}>Detailing</b></div>
              <p>Mobile detailing for London’s finest cars.</p>
            </div>
            <div>
              <h4>Contact</h4>
              <p><a href="tel:+447862254769">+44 7862 254769</a><br/><a href="mailto:hello@247detailing.co.uk">hello@247detailing.co.uk</a></p>
              <p style={{ marginTop: '10px' }}><a className="pill" href="https://wa.me/447862254769" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
            </div>
            <div>
              <h4>Location &amp; hours</h4>
              <p>Based in Hayes, West London.<br/>Mobile service across London.<br/>24/7 Emergency Available</p>
            </div>
            <div>
              <h4>Legal</h4>
              <a className="pill" href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('privacy'); }}>Privacy Policy</a>
              <a className="pill" href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('terms'); }}>Terms &amp; Conditions</a>
            </div>
          </div>
          <div className="f-bottom">
            <span>© {new Date().getFullYear()} 247 Detailing. All rights reserved.</span>
            <span>Preview build — placeholder details shown.</span>
          </div>
        </div>
      </footer>

      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Basket</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {basket.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--mut)', padding: '40px 0' }}>Your basket is empty.</div>
          ) : (
            basket.map(item => (
              <div key={item.name} className="cart-item">
                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <small>Service</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="cart-item-price">£{item.price}</div>
                  <button className="cart-remove" onClick={() => removeFromBasket(item.name)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Subtotal:</span>
            <span>£{basketTotal}</span>
          </div>
          <button className="btn" style={{ width: '100%' }} onClick={() => { setIsCartOpen(false); document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }); }}>Proceed to Checkout</button>
        </div>
      </div>

      <div className={`toast ${showToast ? 'show' : ''}`}>✓ {toastMsg}</div>

      {activeServiceModal && (
        <div className="service-page-overlay active" style={{ display: 'flex' }}>
          <div className="service-page-content" style={{ margin: 'auto', position: 'relative' }}>
            <button className="cart-close" style={{ position: 'absolute', top: '20px', right: '20px' }} onClick={() => setActiveServiceModal(null)}>✕</button>
            <h1>{SERVICE_DATA[activeServiceModal].title}</h1>
            <div className="price" style={{ marginBottom: '24px' }}>{SERVICE_DATA[activeServiceModal].price === 'Quote' ? 'Message for Quote' : `From £${SERVICE_DATA[activeServiceModal].price}`}</div>
            <p style={{ whiteSpace: 'pre-line' }}>{SERVICE_DATA[activeServiceModal].desc}</p>
            {SERVICE_DATA[activeServiceModal].checkoutPrice > 0 && (
              <button className="btn" style={{ width: '100%', marginTop: '20px' }} onClick={() => { addToBasket(SERVICE_DATA[activeServiceModal].checkoutName, SERVICE_DATA[activeServiceModal].checkoutPrice); setActiveServiceModal(null); }}>
                Add to Basket
              </button>
            )}
          </div>
        </div>
      )}

      {activeLegalModal && (
        <div className="service-page-overlay active" style={{ display: 'flex' }}>
          <div className="service-page-content legal-content" style={{ margin: 'auto', position: 'relative' }}>
            <button className="cart-close" style={{ position: 'absolute', top: '20px', right: '20px' }} onClick={() => setActiveLegalModal(null)}>✕</button>
            <div dangerouslySetInnerHTML={{ __html: LEGAL_DATA[activeLegalModal] }} />
          </div>
        </div>
      )}

    </div>
  );
}