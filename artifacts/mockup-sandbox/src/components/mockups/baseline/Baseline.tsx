import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./_group.css";

const images = {
  hero: "https://images.unsplash.com/photo-1709403552725-97e0ba206cb8?fm=jpg&q=80&w=2200&auto=format&fit=crop",
  one: "https://images.pexels.com/photos/38377267/pexels-photo-38377267/free-photo-of-male-tennis-player-serving-on-outdoor-court.jpeg?auto=compress&cs=tinysrgb&w=1600",
  two: "https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695_1280.jpg",
  three: "https://images.pexels.com/photos/32980152/pexels-photo-32980152/free-photo-of-dynamic-tennis-match-on-outdoor-courts.jpeg?auto=compress&cs=tinysrgb&w=1600",
  four: "https://images.unsplash.com/photo-1758887253448-172351fca22d?fm=jpg&q=80&w=1600&auto=format&fit=crop",
  five: "https://images.unsplash.com/photo-1709403552725-97e0ba206cb8?fm=jpg&q=80&w=1400&auto=format&fit=crop&crop=faces",
};

function Ball() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M4.8 5.6A9 9 0 0 0 4.8 18.4"/><path d="M19.2 5.6a9 9 0 0 1 0 12.8"/></svg>; }
function Arrow() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>; }
function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) { return <div className={`b-eyebrow ${light ? "light" : ""}`}>{children}</div>; }
function Lines({ children }: { children: string[] }) { return <>{children.map((line) => <span className="b-line" key={line}><span>{line}</span></span>)}</>; }
function Dots({ count, index, setIndex, light = false }: { count: number; index: number; setIndex: (n: number) => void; light?: boolean }) { return <div className="b-dots" style={{ color: light ? "#fff" : "var(--ink)" }}>{Array.from({ length: count }, (_, i) => <button className={`b-dot ${i === index ? "active" : ""}`} aria-current={i === index} key={i} onClick={() => setIndex(i)}><i /></button>)}</div>; }

const collections = [
  [images.two, "Baseline Pro", "Featured Gear", "Shop the kit"],
  [images.three, "Court Series", "Summer Drop", "View the line"],
  [images.five, "Academy Kit", "Junior Range", "Browse juniors"],
] as const;
const coaches = [
  [images.five, "Marco Vidal", "Head Coach", ["Expert", "Result-", "Driven", "Coaching"]],
  [images.four, "Elena Sokolova", "Performance Coach", ["Sharper", "Faster", "Stronger", "Player"]],
  [images.one, "James Okoro", "Juniors Lead", ["Future", "Champions", "Start", "Here"]],
] as const;

function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const t = setTimeout(() => nameRef.current?.focus(), 120); return () => clearTimeout(t); }, []);
  const submit = (e: FormEvent) => { e.preventDefault(); setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 650); };
  return <div className="b-modal-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="b-modal" role="dialog" aria-modal="true" aria-label="Book a visit">
      <div className="b-modal-head"><div><Eyebrow>Book a visit</Eyebrow><h2><Lines>{["Come see", "the courts"]}</Lines></h2></div><button className="b-close" onClick={onClose} aria-label="Close">×</button></div>
      {!sent ? <form className="b-form" onSubmit={submit} noValidate>
        <label>Full name<input ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" required /></label>
        <label>Email<input type="email" placeholder="you@email.com" required /></label>
        <label>What would you like to play?<textarea rows={3} placeholder="I'd love to try a private lesson on the clay courts…" /></label>
        <button className="b-pill solid" disabled={sending}>{sending ? "Sending…" : "Request a visit"} <Arrow /></button>
      </form> : <div className="b-success"><div className="b-success-mark"><svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg></div><h3>Request received</h3><p>Thanks, {name.split(" ")[0] || "there"} — our team will be in touch to lock in your visit.</p><button className="b-pill solid" onClick={onClose}>Done</button></div>}
    </div>
  </div>;
}

function Menu({ onClose, onContact }: { onClose: () => void; onContact: () => void }) {
  const links = [["Programs", "#programs"], ["Facilities", "#facilities"], ["Reviews", "#testimonials"], ["Contact", "#contact"]];
  return <div className="b-overlay"><div className="b-overlay-inner"><div className="b-overlay-top"><div className="b-brand"><Ball />Apex</div><button className="b-close" onClick={onClose} aria-label="Close menu">×</button></div><nav className="b-overlay-nav">{links.map(([label, href]) => <a href={href} onClick={onClose} key={href}>{label}</a>)}</nav><div className="b-overlay-bottom"><button className="b-pill light" onClick={() => { onClose(); onContact(); }}>Book a Visit <Arrow /></button><nav><a href="#instagram">Instagram</a>　<a href="#x">X</a>　<a href="#youtube">YouTube</a>　<a href="#linkedin">LinkedIn</a></nav></div></div></div>;
}

export function Baseline() {
  const [ready, setReady] = useState(false);
  const [loader, setLoader] = useState(true);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [collection, setCollection] = useState(0);
  const [coach, setCoach] = useState(0);
  const heroPlate = useRef<HTMLDivElement>(null);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const root = document.documentElement;
    const lock = () => { root.style.overflow = "hidden"; };
    const unlock = () => { root.style.overflow = ""; };
    lock(); window.scrollTo(0, 0);
    const delay = reduced ? 200 : 1400;
    const t = setTimeout(() => { setReady(true); unlock(); setTimeout(() => setLoader(false), reduced ? 20 : 850); }, delay);
    return () => { clearTimeout(t); unlock(); };
  }, [reduced]);
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setCollection(i => (i + 1) % 3), 3800);
    return () => clearInterval(t);
  }, [ready]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setModal(false); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const onScroll = () => { if (heroPlate.current) heroPlate.current.style.transform = `translateY(${Math.min(12, window.scrollY / Math.max(1, window.innerHeight) * 12)}%)`; };
    window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const openModal = () => { setMenu(false); setModal(true); document.documentElement.style.overflow = "hidden"; };
  const closeModal = () => { setModal(false); document.documentElement.style.overflow = ""; };
  const activeCoach = coaches[coach];
  return <div className={`baseline ${ready ? "ready" : ""}`}>
    {loader && <div className={`b-loader ${ready ? "exit" : ""}`}><div className="b-loader-inner"><div className="b-loader-brand"><Ball />Apex</div><div className="b-progress"><i /></div></div></div>}
    <main className="baseline-shell">
      <section className="b-hero b-card split-layout" id="top">
        <div className="b-hero-content">
          <header className="b-header"><nav className="b-nav"><a href="#programs">Programs &amp; Coaches</a><a href="#facilities">Club &amp; Events</a></nav><div className="b-brand"><Ball />Apex</div><div className="b-head-actions"><button className="b-visit" onClick={openModal}>Book a Visit</button><button className="b-burger" onClick={() => { setMenu(true); document.documentElement.style.overflow = "hidden"; }} aria-label="Open menu"><i/><i/></button></div></header>
          <div className="b-hero-copy"><h1>{["Own", "The", "Court"].map((word, i) => <span className="clip" key={word}><span style={{ transitionDelay: `${i * 140}ms` }}>{word}</span></span>)}</h1></div>
          <div className="b-bottom"><div className="b-tagline"><span className="clip"><span>Show Up,</span></span><span className="clip"><span>Level Up</span></span></div><div className="b-hero-cluster"><div className="b-collection"><div className="b-collection-card"><img src={collections[collection][0]} alt={collections[collection][1]} /><div><div className="b-mini-label">{collections[collection][1]}</div><div className="b-mini-title">{collections[collection][2]}</div><div className="b-mini-cta">{collections[collection][3]} →</div></div></div><Dots count={3} index={collection} setIndex={setCollection} light /></div><article className="b-member"><div className="b-member-info"><strong>9K+</strong><div className="b-avatars"><i style={{ background: "#5790e6" }}/><i style={{ background: "#c2e029" }}/><i style={{ background: "#0b6e97" }}/><i style={{ background: "#fff" }}/></div><small>Members on court</small></div><img src={images.one} alt="Player waiting to return on a clay court" loading="lazy" /></article></div></div>
        </div>
        <div className="b-hero-plate split" ref={heroPlate}><img src={images.hero} alt="Player lunging for a shot on a hard court" fetchPriority="high" /></div>
      </section>
      <section className="b-section b-trust"><div className="b-trust-top"><div className="b-badge-circle"><strong>100%</strong><small>Coaching built around your game</small></div><article className="b-badge-card"><div className="b-index">#01</div><div><strong>Trusted by serious players</strong><p>From first-timers to nationally ranked juniors, players train here because the progress shows up on the scoreboard.</p></div></article></div><div className="b-ghost">{[activeCoach[3].slice(0,2), activeCoach[3].slice(2)].map((row, ri) => <div className="b-ghost-row" key={ri}>{row.map((word, wi) => <span className="b-ghost-word" style={{ color: ri === 1 && wi === 0 ? "var(--ink)" : undefined }} key={word}>{word}</span>)}</div>)}</div><figure className="b-coach"><img src={activeCoach[0]} alt={activeCoach[3].join(" ")} /><figcaption className="b-coach-caption"><strong>{activeCoach[1]}</strong><small>{activeCoach[2]}</small></figcaption></figure><div className="b-trust-controls"><button className="b-arrow" onClick={() => setCoach((coach + 2) % 3)} aria-label="Previous coach"><Arrow /></button><Dots count={3} index={coach} setIndex={setCoach} /><button className="b-arrow" style={{ background: "var(--ink)", color: "#fff" }} onClick={() => setCoach((coach + 1) % 3)} aria-label="Next coach"><Arrow /></button></div></section>
       <section className="b-section b-surface b-programs" id="programs"><Eyebrow>Training programs</Eyebrow><h2 className="b-heading"><Lines>{["Built for", "every level"]}</Lines></h2><div className="b-program-list">{[["01", "Junior Development", "Fundamentals, footwork, and match play for ages 6–14.", "#junior"], ["02", "Performance Squad", "High-volume training for competitive and ranked players.", "#performance"], ["03", "Adult Clinics", "Small-group sessions to sharpen technique and fitness.", "#adult"], ["04", "Private Coaching", "One-to-one sessions tailored to your goals and schedule.", "#private"]].map(p => <a className="b-program" href={p[3]} key={p[0]}><span className="b-program-index">{p[0]}</span><span className="b-program-main"><strong>{p[1]}</strong><p>{p[2]}</p></span><span className="b-arrow"><Arrow /></span></a>)}</div><div className="b-program-note"><span>02</span><strong>One club. Every level.</strong><small>Progress is a practice, not a finish line.</small></div></section>
      <section className="b-section b-facilities b-card" id="facilities"><div className="b-facility-grid"><div className="b-facility-copy"><img className="b-facility-icon" src={images.three} alt="Player stretching for a forehand on clay" loading="lazy" /><h2 className="b-heading"><Lines>{["Tour Our", "World-Class", "Courts"]}</Lines></h2><p>Reserve a court for focused practice, squad drills, or private sessions — and train in the same conditions you'll compete in.</p></div><div className="b-courts"><figure className="b-court"><img src="/redline_clay.jpg" alt="A pristine, empty red clay tennis court outdoors" loading="lazy" /><figcaption className="b-court-caption"><strong>Redline Clay</strong><small>A fast outdoor clay court tuned for long, physical rallies.</small></figcaption></figure><figure className="b-court blue"><img src="/harbor_court.jpg" alt="A pristine, empty blue hard tennis court sheltered indoors" loading="lazy" /><figcaption className="b-court-caption"><strong>Harbor Court</strong><small>A sheltered hard court built for precision and night play.</small></figcaption></figure></div></div></section>
      <section className="b-section b-stats b-card"><Eyebrow light>By the numbers</Eyebrow><h2 className="b-heading"><Lines>{["A club that", "keeps score"]}</Lines></h2><dl className="b-stats-grid">{[["24", "Certified coaches"], ["12", "Championship courts"], ["9K+", "Members training"], ["15", "Years on the baseline"]].map(s => <div className="b-stat" key={s[1]}><dt className="sr-only">{s[1]}</dt><dd><strong>{s[0]}</strong><span>{s[1]}</span></dd></div>)}</dl></section>
      <section className="b-section b-testimonials" id="testimonials"><Eyebrow>What players say</Eyebrow><h2 className="b-heading"><Lines>{["Loved by", "the locker room"]}</Lines></h2><div className="b-testimonial-grid">{[["I added a level to my serve in one season. The coaching is detailed and it actually sticks.", "Priya Anand", "Performance Squad"], ["Best courts in the city and a team that treats every member like a competitor.", "Lukas Brenner", "Adult Clinics"], ["My daughter went from shy beginner to club champion. Worth every minute.", "Dana Okafor", "Parent, Junior Development"]].map(t => <figure className="b-quote" key={t[1]}><q>{t[0]}</q><figcaption><strong>{t[1]}</strong><small>{t[2]}</small></figcaption></figure>)}</div></section>
      <footer className="b-footer b-card" id="contact"><div className="b-footer-cta"><div><Eyebrow light>Get started</Eyebrow><h2><Lines>{["Ready to", "play?"]}</Lines></h2></div><button className="b-pill light" onClick={openModal}>Book a Visit <Arrow /></button></div><div className="b-footer-grid"><div><div className="b-footer-brand"><Ball /> Apex</div><p>A members' tennis club and academy where focused coaching meets championship courts.</p><address><a href="mailto:play@apex.club">play@apex.club</a><br/><a href="tel:+12125550148">+1 (212) 555-0148</a><br/><span>120 Court Lane, New York</span></address></div>{[["Programs", ["Junior Development", "Performance Squad", "Adult Clinics", "Private Coaching"]], ["Club", ["Membership", "Facilities", "Events", "Pro Shop"]], ["Company", ["About", "Coaches", "Careers", "Contact"]]].map(col => <nav className="b-footer-col" key={String(col[0])}><h3>{col[0]}</h3><ul>{(col[1] as string[]).map(x => <li key={x}><a href={`#${x.toLowerCase().replaceAll(" ", "-")}`}>{x}</a></li>)}</ul></nav>)}</div><div className="b-footer-bottom"><span>© 2026 Apex Tennis Club. All rights reserved.</span><nav><a href="#instagram">Instagram</a><a href="#x">X</a><a href="#youtube">YouTube</a><a href="#linkedin">LinkedIn</a></nav><nav><a href="#privacy">Privacy</a><a href="#terms">Terms</a></nav></div></footer>
    </main>
    {menu && <Menu onClose={() => { setMenu(false); document.documentElement.style.overflow = ""; }} onContact={openModal} />}
    {modal && <ContactModal onClose={closeModal} />}
  </div>;
}