import { Link, Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const style = `
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
        --green:       #1a5c38;
        --green-mid:   #2d7a50;
        --green-light: #3d9e68;
        --gold:        #c9972c;
        --gold-light:  #e8b94a;
        --cream:       #fdf8f0;
        --cream-dark:  #f5ead6;
        --text:        #1a1a1a;
        --text-muted:  #5a5a5a;
    }

    html { scroll-behavior: smooth; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--cream); color: var(--text); overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); }
    ::-webkit-scrollbar-thumb { background: var(--green-mid); border-radius: 3px; }

    .lpq-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        padding: 0 5%; height: 68px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(253,248,240,0.92); backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(201,151,44,0.2);
        transition: box-shadow 0.3s;
    }
    .lpq-nav.scrolled { box-shadow: 0 4px 24px rgba(26,92,56,0.1); }
    .nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
    .nav-logo-icon { width:40px; height:40px; background:linear-gradient(135deg,var(--green),var(--green-light)); border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Amiri',serif; font-size:20px; color:var(--gold-light); }
    .nav-logo-text { font-size:15px; font-weight:700; color:var(--green); line-height:1.2; }
    .nav-logo-text span { display:block; font-size:11px; font-weight:400; color:var(--text-muted); }
    .nav-links { display:flex; align-items:center; gap:32px; list-style:none; }
    .nav-links a { text-decoration:none; font-size:14px; font-weight:500; color:var(--text-muted); transition:color 0.2s; }
    .nav-links a:hover { color:var(--green); }
    .nav-cta { background:var(--green)!important; color:#fff!important; padding:9px 22px; border-radius:8px; font-weight:600!important; transition:background 0.2s,transform 0.15s!important; }
    .nav-cta:hover { background:var(--green-mid)!important; transform:translateY(-1px); }

    .hero { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; padding:100px 5% 60px; gap:60px; position:relative; overflow:hidden; }
    .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 80% 50%,rgba(45,122,80,0.08) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 10% 80%,rgba(201,151,44,0.06) 0%,transparent 50%); pointer-events:none; }
    .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(26,92,56,0.08); border:1px solid rgba(26,92,56,0.2); border-radius:100px; padding:6px 16px; font-size:13px; font-weight:500; color:var(--green); margin-bottom:24px; }
    .hero-badge::before { content:'✦'; font-size:10px; color:var(--gold); }
    .hero h1 { font-family:'Amiri',serif; font-size:clamp(2.4rem,4vw,3.6rem); font-weight:700; line-height:1.2; color:var(--green); margin-bottom:8px; }
    .hero h1 em { font-style:normal; color:var(--gold); }
    .hero-arabic { font-family:'Amiri',serif; font-size:clamp(1.2rem,2vw,1.7rem); color:var(--green-mid); opacity:0.7; direction:rtl; margin-bottom:24px; }
    .hero p { font-size:16px; line-height:1.75; color:var(--text-muted); max-width:500px; margin-bottom:36px; }
    .hero-actions { display:flex; gap:14px; flex-wrap:wrap; }

    .btn-primary { display:inline-flex; align-items:center; gap:8px; background:var(--green); color:#fff; padding:14px 28px; border-radius:10px; font-weight:600; font-size:15px; text-decoration:none; transition:background 0.2s,transform 0.15s,box-shadow 0.2s; box-shadow:0 4px 16px rgba(26,92,56,0.3); }
    .btn-primary:hover { background:var(--green-mid); transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,92,56,0.35); }
    .btn-secondary { display:inline-flex; align-items:center; gap:8px; border:1.5px solid rgba(26,92,56,0.3); color:var(--green); padding:13px 28px; border-radius:10px; font-weight:600; font-size:15px; text-decoration:none; transition:border-color 0.2s,background 0.2s,transform 0.15s; }
    .btn-secondary:hover { border-color:var(--green); background:rgba(26,92,56,0.05); transform:translateY(-2px); }

    .hero-visual { display:flex; justify-content:center; align-items:center; }
    .mosque-card { position:relative; width:100%; max-width:460px; }
    .mosque-card-inner { background:linear-gradient(145deg,var(--green) 0%,#0f3d24 100%); border-radius:24px; padding:48px 40px; text-align:center; box-shadow:0 32px 80px rgba(26,92,56,0.25); position:relative; overflow:hidden; }
    .mosque-card-inner::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:rgba(255,255,255,0.04); border-radius:50%; }
    .card-arabic-main { font-family:'Amiri',serif; font-size:2.8rem; color:var(--gold-light); direction:rtl; line-height:1.5; margin-bottom:16px; position:relative; z-index:1; }
    .card-divider { width:60px; height:2px; background:linear-gradient(to right,transparent,var(--gold),transparent); margin:16px auto; }
    .card-title { font-family:'Amiri',serif; font-size:1.4rem; color:#fff; margin-bottom:8px; position:relative; z-index:1; }
    .card-subtitle { font-size:13px; color:rgba(255,255,255,0.6); position:relative; z-index:1; }
    .card-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.1); border-radius:14px; overflow:hidden; margin-top:28px; position:relative; z-index:1; }
    .card-stat { background:rgba(255,255,255,0.05); padding:16px 8px; text-align:center; }
    .card-stat-num { font-size:1.6rem; font-weight:700; color:var(--gold-light); display:block; }
    .card-stat-label { font-size:11px; color:rgba(255,255,255,0.55); margin-top:4px; }

    .ornament { position:absolute; border-radius:50%; pointer-events:none; }
    .ornament-1 { width:80px; height:80px; background:radial-gradient(circle,rgba(201,151,44,0.15),transparent); top:-20px; right:20px; animation:float 4s ease-in-out infinite; }
    .ornament-2 { width:50px; height:50px; background:radial-gradient(circle,rgba(45,122,80,0.2),transparent); bottom:30px; left:-10px; animation:float 5s 1s ease-in-out infinite; }

    .stats-strip { background:var(--green); padding:40px 5%; }
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; max-width:1000px; margin:0 auto; }
    .stat-item { text-align:center; padding:16px; border-right:1px solid rgba(255,255,255,0.12); }
    .stat-item:last-child { border-right:none; }
    .stat-num { font-family:'Amiri',serif; font-size:2.4rem; font-weight:700; color:var(--gold-light); display:block; }
    .stat-label { font-size:13px; color:rgba(255,255,255,0.65); margin-top:4px; }

    section { padding:100px 5%; }
    .section-tag { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
    .section-tag::before, .section-tag::after { content:'—'; opacity:0.4; }
    .section-title { font-family:'Amiri',serif; font-size:clamp(1.8rem,3vw,2.6rem); font-weight:700; color:var(--green); line-height:1.25; margin-bottom:16px; }
    .section-desc { font-size:16px; line-height:1.75; color:var(--text-muted); max-width:560px; }

    .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
    .about-pattern { width:100%; aspect-ratio:1; max-width:400px; background:linear-gradient(135deg,var(--cream-dark) 0%,var(--cream) 100%); border-radius:24px; border:1px solid rgba(201,151,44,0.2); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
    .about-pattern::before { content:''; position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,rgba(26,92,56,0.04) 0px,rgba(26,92,56,0.04) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(-45deg,rgba(201,151,44,0.04) 0px,rgba(201,151,44,0.04) 1px,transparent 1px,transparent 20px); }
    .about-pattern-center { width:200px; height:200px; background:linear-gradient(135deg,var(--green) 0%,var(--green-mid) 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; box-shadow:0 20px 60px rgba(26,92,56,0.3); }
    .about-pattern-arabic { font-family:'Amiri',serif; font-size:2.5rem; color:var(--gold-light); text-align:center; line-height:1.4; direction:rtl; }
    .about-visual { position:relative; }
    .about-tag { position:absolute; background:#fff; border:1px solid rgba(201,151,44,0.2); border-radius:12px; padding:12px 16px; box-shadow:0 8px 24px rgba(0,0,0,0.06); font-size:13px; font-weight:600; }
    .about-tag-1 { top:-12px; right:-20px; color:var(--green); }
    .about-tag-2 { bottom:30px; left:-24px; color:var(--gold); }
    .about-values { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:40px; }
    .value-card { background:#fff; border:1px solid rgba(201,151,44,0.15); border-radius:14px; padding:20px; transition:transform 0.2s,box-shadow 0.2s; }
    .value-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(26,92,56,0.1); }
    .value-icon { width:40px; height:40px; background:rgba(26,92,56,0.08); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:10px; }
    .value-title { font-size:14px; font-weight:700; color:var(--green); margin-bottom:4px; }
    .value-desc { font-size:12px; color:var(--text-muted); line-height:1.5; }

    .programs { background:linear-gradient(180deg,var(--cream) 0%,var(--cream-dark) 100%); }
    .programs-header { text-align:center; margin-bottom:60px; }
    .programs-header .section-desc { margin:0 auto; }
    .programs-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .program-card { background:#fff; border-radius:20px; overflow:hidden; border:1px solid rgba(201,151,44,0.12); transition:transform 0.25s,box-shadow 0.25s; }
    .program-card:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(26,92,56,0.12); }
    .program-card-top { padding:32px 28px; position:relative; overflow:hidden; }
    .program-card-top::after { content:''; position:absolute; bottom:-30px; right:-30px; width:100px; height:100px; background:rgba(255,255,255,0.05); border-radius:50%; }
    .program-icon { width:52px; height:52px; background:rgba(255,255,255,0.1); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:14px; }
    .program-title { font-family:'Amiri',serif; font-size:1.3rem; color:#fff; margin-bottom:4px; }
    .program-subtitle { font-size:12px; color:rgba(255,255,255,0.6); }
    .program-card-body { padding:24px 28px; }
    .program-desc { font-size:14px; line-height:1.65; color:var(--text-muted); margin-bottom:20px; }
    .program-meta { display:flex; gap:8px; flex-wrap:wrap; }
    .program-tag { font-size:12px; font-weight:500; padding:4px 12px; border-radius:100px; background:rgba(26,92,56,0.08); color:var(--green); }

    .steps-wrap { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
    .steps-list { margin-top:40px; display:flex; flex-direction:column; gap:0; }
    .step-item { display:flex; gap:20px; padding-bottom:32px; position:relative; }
    .step-item::before { content:''; position:absolute; left:19px; top:44px; width:2px; bottom:0; background:linear-gradient(to bottom,var(--green-light),transparent); }
    .step-item:last-child::before { display:none; }
    .step-num { width:40px; height:40px; min-width:40px; background:var(--green); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; position:relative; z-index:1; }
    .step-content { padding-top:6px; }
    .step-title { font-size:16px; font-weight:700; color:var(--green); margin-bottom:4px; }
    .step-desc { font-size:14px; color:var(--text-muted); line-height:1.6; }
    .steps-cta-card { background:linear-gradient(145deg,var(--green) 0%,#0f3d24 100%); border-radius:24px; padding:44px 40px; color:#fff; position:sticky; top:90px; }
    .steps-cta-arabic { font-family:'Amiri',serif; font-size:1.8rem; color:var(--gold-light); direction:rtl; margin-bottom:16px; opacity:0.9; }
    .steps-cta-title { font-family:'Amiri',serif; font-size:1.6rem; margin-bottom:14px; }
    .steps-cta-desc { font-size:14px; color:rgba(255,255,255,0.7); line-height:1.7; margin-bottom:28px; }
    .steps-cta-btn { display:inline-flex; align-items:center; gap:8px; background:var(--gold); color:var(--green); padding:13px 28px; border-radius:10px; font-weight:700; font-size:14px; text-decoration:none; transition:background 0.2s,transform 0.15s; }
    .steps-cta-btn:hover { background:var(--gold-light); transform:translateY(-2px); }

    .pengajar-section { background:var(--cream-dark); }
    .pengajar-header { text-align:center; margin-bottom:56px; }
    .pengajar-header .section-desc { margin:0 auto; }
    .pengajar-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .pengajar-card { background:#fff; border-radius:18px; padding:28px 20px; text-align:center; border:1px solid rgba(201,151,44,0.1); transition:transform 0.25s,box-shadow 0.25s; }
    .pengajar-card:hover { transform:translateY(-5px); box-shadow:0 16px 48px rgba(26,92,56,0.1); }
    .pengajar-avatar { width:80px; height:80px; border-radius:50%; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:700; color:#fff; }
    .pengajar-name { font-size:15px; font-weight:700; color:var(--green); margin-bottom:4px; }
    .pengajar-role { font-size:12px; color:var(--gold); font-weight:500; margin-bottom:8px; }
    .pengajar-desc { font-size:12px; color:var(--text-muted); line-height:1.5; }

    .testimonial-section { background:var(--green); text-align:center; padding:100px 5%; }
    .testimonial-section .section-title { color:#fff; }
    .testimonial-section .section-tag { color:var(--gold-light); }
    .testimonials-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:56px; }
    .testimonial-card { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:28px; text-align:left; transition:background 0.2s; }
    .testimonial-card:hover { background:rgba(255,255,255,0.11); }
    .testimonial-quote { font-size:28px; color:var(--gold-light); font-family:'Amiri',serif; margin-bottom:12px; line-height:1; }
    .testimonial-text { font-size:14px; color:rgba(255,255,255,0.8); line-height:1.7; margin-bottom:20px; }
    .testimonial-author { display:flex; align-items:center; gap:12px; }
    .testimonial-avatar { width:40px; height:40px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:var(--green); min-width:40px; }
    .testimonial-name { font-size:14px; font-weight:600; color:#fff; }
    .testimonial-role { font-size:12px; color:rgba(255,255,255,0.5); }

    .faq-section { background:var(--cream); }
    .faq-header { text-align:center; margin-bottom:56px; }
    .faq-header .section-desc { margin:0 auto; }
    .faq-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:900px; margin:0 auto; }
    .faq-item { background:#fff; border:1px solid rgba(201,151,44,0.15); border-radius:14px; overflow:hidden; }
    .faq-q { width:100%; display:flex; justify-content:space-between; align-items:center; padding:20px 24px; background:none; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; color:var(--green); text-align:left; gap:12px; transition:background 0.2s; }
    .faq-q:hover { background:rgba(26,92,56,0.03); }
    .faq-icon { width:24px; height:24px; min-width:24px; background:rgba(26,92,56,0.08); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; transition:transform 0.2s,background 0.2s; }
    .faq-item.open .faq-icon { transform:rotate(45deg); background:var(--green); color:#fff; }
    .faq-a { max-height:0; overflow:hidden; transition:max-height 0.3s ease; }
    .faq-item.open .faq-a { max-height:200px; }
    .faq-a-inner { padding:0 24px 20px; font-size:14px; color:var(--text-muted); line-height:1.7; }

    .location-section { background:var(--cream-dark); }
    .location-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
    .location-address { background:#fff; border-radius:16px; padding:28px; margin-top:32px; border:1px solid rgba(201,151,44,0.15); }
    .location-row { display:flex; gap:14px; align-items:flex-start; padding:12px 0; border-bottom:1px solid rgba(0,0,0,0.05); }
    .location-row:last-child { border-bottom:none; }
    .location-row-icon { width:36px; height:36px; min-width:36px; background:rgba(26,92,56,0.08); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; }
    .location-row-label { font-size:11px; font-weight:600; color:var(--gold); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px; }
    .location-row-value { font-size:14px; color:var(--text); line-height:1.5; }
    .map-placeholder { background:var(--green); border-radius:20px; overflow:hidden; aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; position:relative; }
    .map-placeholder::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 40px); }
    .map-pin { position:relative; z-index:1; text-align:center; }
    .map-pin-icon { font-size:3rem; display:block; margin-bottom:12px; animation:float 2.5s ease-in-out infinite; }
    .map-pin-name { font-family:'Amiri',serif; font-size:1.2rem; color:var(--gold-light); margin-bottom:6px; }
    .map-pin-addr { font-size:13px; color:rgba(255,255,255,0.6); max-width:220px; }

    footer { background:#0a2416; color:rgba(255,255,255,0.7); padding:64px 5% 32px; }
    .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:48px; }
    .footer-brand-name { font-family:'Amiri',serif; font-size:1.5rem; color:#fff; margin-bottom:8px; }
    .footer-brand-sub { font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:20px; line-height:1.6; }
    .footer-social { display:flex; gap:10px; }
    .footer-social a { width:36px; height:36px; background:rgba(255,255,255,0.07); border-radius:8px; display:flex; align-items:center; justify-content:center; text-decoration:none; font-size:15px; transition:background 0.2s; }
    .footer-social a:hover { background:rgba(255,255,255,0.14); }
    .footer-col-title { font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-light); margin-bottom:16px; }
    .footer-links { list-style:none; display:flex; flex-direction:column; gap:10px; }
    .footer-links a { text-decoration:none; font-size:14px; color:rgba(255,255,255,0.55); transition:color 0.2s; }
    .footer-links a:hover { color:#fff; }
    .footer-bottom { border-top:1px solid rgba(255,255,255,0.07); padding-top:28px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:rgba(255,255,255,0.35); }
    .footer-bottom-right { font-family:'Amiri',serif; font-size:1.1rem; color:var(--gold); opacity:0.7; }

    .reveal { opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease; }
    .reveal.visible { opacity:1; transform:translateY(0); }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

    .anim-1 { animation:fadeUp 0.6s ease both; }
    .anim-2 { animation:fadeUp 0.6s 0.1s ease both; }
    .anim-3 { animation:fadeUp 0.6s 0.2s ease both; }
    .anim-4 { animation:fadeUp 0.6s 0.3s ease both; }
    .anim-5 { animation:fadeUp 0.6s 0.4s ease both; }

    @media(max-width:1024px){
        .hero{grid-template-columns:1fr;text-align:center}
        .hero p{margin-left:auto;margin-right:auto}
        .hero-actions{justify-content:center}
        .hero-visual{order:-1}
        .about-grid,.steps-wrap,.location-grid{grid-template-columns:1fr}
        .pengajar-grid{grid-template-columns:repeat(2,1fr)}
        .footer-grid{grid-template-columns:1fr 1fr}
    }
    @media(max-width:768px){
        .nav-links{display:none}
        section{padding:72px 4%}
        .stats-grid{grid-template-columns:repeat(2,1fr)}
        .programs-grid{grid-template-columns:1fr}
        .testimonials-grid{grid-template-columns:1fr}
        .faq-grid{grid-template-columns:1fr}
        .footer-grid{grid-template-columns:1fr;gap:32px}
        .footer-bottom{flex-direction:column;gap:12px;text-align:center}
    }
`;

function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
}

function useNavScroll() {
    useEffect(() => {
        const nav = document.getElementById('lpq-nav');
        const handler = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);
}

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' open' : ''}`}>
            <button className="faq-q" onClick={() => setOpen(!open)}>
                {q}
                <span className="faq-icon">+</span>
            </button>
            <div className="faq-a">
                <div className="faq-a-inner">{a}</div>
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    useReveal();
    useNavScroll();

    const smoothScroll = (e, id) => {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="LPQ Masjid Syuhada — Lembaga Pendidikan Quran" />
            <style>{style}</style>

            {/* NAVBAR */}
            <nav className="lpq-nav" id="lpq-nav">
                <a href="#" className="nav-logo">
                    <div className="nav-logo-icon">ق</div>
                    <div className="nav-logo-text">
                        LPQ Masjid Syuhada
                        <span>Lembaga Pendidikan Quran</span>
                    </div>
                </a>
                <ul className="nav-links">
                    {['#tentang','#program','#pengajar','#cara-daftar','#lokasi'].map(href => (
                        <li key={href}><a href={href} onClick={e => smoothScroll(e, href)}>
                            {href.replace('#','').replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </a></li>
                    ))}
                    {auth.user ? (
                        <li><Link href={route('dashboard')} className="nav-cta">Dashboard →</Link></li>
                    ) : (
                        <li><Link href={route('login')} className="nav-cta">Masuk / Daftar →</Link></li>
                    )}
                </ul>
            </nav>

            {/* HERO */}
            <section className="hero" id="home">
                <div>
                    <div className="hero-badge anim-1">Lembaga Pendidikan Quran Terpercaya</div>
                    <h1 className="anim-2">Belajar Al-Quran<br />di <em>Masjid Syuhada</em></h1>
                    <div className="hero-arabic anim-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                    <p className="anim-4">Wujudkan impian membaca, memahami, dan menghafal Al-Quran bersama para pengajar berpengalaman di lingkungan Masjid Syuhada Yogyakarta. Terbuka untuk semua usia dan tingkatan.</p>
                    <div className="hero-actions anim-5">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="btn-primary">Lihat Program →</Link>
                        ) : (
                            <>
                                <Link href={route('register')} className="btn-primary">Daftar Sekarang →</Link>
                                <a href="#program" className="btn-secondary" onClick={e => smoothScroll(e, '#program')}>Lihat Program</a>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="mosque-card">
                        <div className="ornament ornament-1" />
                        <div className="ornament ornament-2" />
                        <div className="mosque-card-inner">
                            <div className="card-arabic-main">اِقْرَأْ بِاسْمِ رَبِّكَ</div>
                            <div className="card-divider" />
                            <div className="card-title">LPQ Masjid Syuhada</div>
                            <div className="card-subtitle">Yogyakarta</div>
                            <div className="card-stats">
                                {[['500+','Santri'],['20+','Pengajar'],['10+','Program']].map(([n,l]) => (
                                    <div key={l} className="card-stat">
                                        <span className="card-stat-num">{n}</span>
                                        <div className="card-stat-label">{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <div className="stats-strip">
                <div className="stats-grid">
                    {[['500+','Santri Aktif'],['20+','Pengajar Bersertifikat'],['15+','Tahun Berdiri'],['10+','Jenis Program']].map(([n,l]) => (
                        <div key={l} className="stat-item">
                            <span className="stat-num">{n}</span>
                            <div className="stat-label">{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TENTANG */}
            <section id="tentang">
                <div className="about-grid">
                    <div className="about-visual reveal">
                        <div className="about-pattern">
                            <div className="about-pattern-center">
                                <div className="about-pattern-arabic">الْقُرْآن<br /><span style={{fontSize:'1.4rem'}}>نُور</span></div>
                            </div>
                        </div>
                        <div className="about-tag about-tag-1">🏛️ Masjid Syuhada</div>
                        <div className="about-tag about-tag-2">✨ Sejak 2005</div>
                    </div>
                    <div className="reveal">
                        <div className="section-tag">Tentang Kami</div>
                        <h2 className="section-title">Menerangi Hati dengan<br />Cahaya Al-Quran</h2>
                        <p className="section-desc">LPQ Masjid Syuhada adalah lembaga pendidikan Al-Quran yang bernaung di bawah Masjid Syuhada Yogyakarta. Kami hadir dengan misi mencetak generasi yang Qurani, berakhlak mulia, dan berkontribusi bagi umat.</p>
                        <div className="about-values">
                            {[['📖','Metode Teruji','Menggunakan metode Iqro dan Tartil yang telah terbukti efektif'],
                              ['🎓','Pengajar Bersanad','Semua pengajar memiliki sanad keilmuan yang jelas dan terpercaya'],
                              ['🌟','Lingkungan Islami','Belajar di lingkungan masjid yang kondusif dan penuh berkah'],
                              ['🤝','Semua Usia','Program tersedia untuk anak-anak, remaja, hingga dewasa']].map(([icon,title,desc]) => (
                                <div key={title} className="value-card">
                                    <div className="value-icon">{icon}</div>
                                    <div className="value-title">{title}</div>
                                    <div className="value-desc">{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAM */}
            <section className="programs" id="program">
                <div className="programs-header reveal">
                    <div className="section-tag">Program Unggulan</div>
                    <h2 className="section-title">Pilih Program yang<br />Sesuai Kebutuhan Anda</h2>
                    <p className="section-desc">Berbagai program dirancang khusus untuk berbagai usia dan tingkat kemampuan membaca Al-Quran.</p>
                </div>
                <div className="programs-grid">
                    {[
                        {icon:'📗',title:'Iqro & Dasar',sub:'Untuk Pemula',bg:'linear-gradient(135deg,#1a5c38 0%,#0f3d24 100%)',desc:'Belajar mengenal huruf hijaiyah dan dasar-dasar tajwid untuk pemula. Cocok untuk anak-anak usia 4 tahun ke atas dan dewasa yang baru mulai.',tags:['Anak & Dewasa','Rutin','Gratis']},
                        {icon:'📘',title:'Tahsin Al-Quran',sub:'Penyempurnaan Bacaan',bg:'linear-gradient(135deg,#7b3f00 0%,#3d1f00 100%)',desc:'Program penyempurnaan bacaan Al-Quran dengan fokus pada tajwid, makharijul huruf, dan lantunan yang indah sesuai kaidah ilmu tajwid.',tags:['Remaja & Dewasa','Rutin','Berbayar']},
                        {icon:'📕',title:'Tahfizh Quran',sub:'Hafalan Al-Quran',bg:'linear-gradient(135deg,#1a3a5c 0%,#0a1f33 100%)',desc:'Program menghafal Al-Quran dengan metode talaqqi dan muroja\'ah yang terstruktur. Dipandu langsung oleh hafizh/hafizhah berpengalaman.',tags:['Semua Usia','Intensif','Bersertifikat']},
                        {icon:'🎤',title:'Tartil & Tilawah',sub:'Seni Baca Al-Quran',bg:'linear-gradient(135deg,#4a1942 0%,#260d22 100%)',desc:'Mempelajari seni tilawah Al-Quran dengan maqamat yang indah. Dipersiapkan untuk mengikuti MTQ dan perlombaan tilawah.',tags:['Remaja','Event','Kompetitif']},
                        {icon:'👶',title:'TPA Anak',sub:'Taman Pendidikan Al-Quran',bg:'linear-gradient(135deg,#1a4a3a 0%,#0a2a1f 100%)',desc:'Program TPA untuk anak-anak usia 4–12 tahun. Belajar Al-Quran sambil bermain dengan suasana yang menyenangkan dan penuh kasih sayang.',tags:['Anak 4–12 Thn','Rutin','Sore Hari']},
                        {icon:'📚',title:'Kajian Fiqih',sub:'Ilmu Praktis Ibadah',bg:'linear-gradient(135deg,#5c4a1a 0%,#33280a 100%)',desc:'Kajian fiqih ibadah sehari-hari yang praktis dan mudah dipahami. Meliputi thaharah, shalat, puasa, dan muamalah dasar.',tags:['Dewasa','Rutin','Gratis']},
                    ].map(p => (
                        <div key={p.title} className="program-card reveal">
                            <div className="program-card-top" style={{background: p.bg}}>
                                <div className="program-icon">{p.icon}</div>
                                <div className="program-title">{p.title}</div>
                                <div className="program-subtitle">{p.sub}</div>
                            </div>
                            <div className="program-card-body">
                                <p className="program-desc">{p.desc}</p>
                                <div className="program-meta">
                                    {p.tags.map(t => <span key={t} className="program-tag">{t}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CARA DAFTAR */}
            <section id="cara-daftar">
                <div className="steps-wrap">
                    <div>
                        <div className="section-tag reveal">Cara Mendaftar</div>
                        <h2 className="section-title reveal">Mudah & Cepat<br />dalam 4 Langkah</h2>
                        <p className="section-desc reveal">Proses pendaftaran dirancang sesederhana mungkin agar Anda bisa langsung mulai belajar Al-Quran.</p>
                        <div className="steps-list">
                            {[
                                ['Buat Akun','Daftar akun di website LPQ Masjid Syuhada dengan email dan kata sandi. Proses hanya membutuhkan beberapa menit.'],
                                ['Pilih Program','Jelajahi program yang tersedia dan pilih yang sesuai dengan usia, tingkat kemampuan, dan jadwal Anda.'],
                                ['Bayar & Upload Bukti','Lakukan pembayaran (untuk program berbayar) dan upload bukti transfer. Admin akan memverifikasi dalam 1×24 jam.'],
                                ['Mulai Belajar','Setelah terverifikasi, Anda akan menerima informasi jadwal dan bergabung dengan grup kelas. Bismillah!'],
                            ].map(([title, desc], i) => (
                                <div key={title} className="step-item reveal">
                                    <div className="step-num">{i + 1}</div>
                                    <div className="step-content">
                                        <div className="step-title">{title}</div>
                                        <div className="step-desc">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="reveal">
                        <div className="steps-cta-card">
                            <div className="steps-cta-arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
                            <div className="steps-cta-title">Siap Memulai Perjalanan Qurani Anda?</div>
                            <p className="steps-cta-desc">Bergabunglah dengan ratusan santri yang telah merasakan manfaat belajar Al-Quran di LPQ Masjid Syuhada.</p>
                            {auth.user ? (
                                <Link href={route('dashboard')} className="steps-cta-btn">Lihat Program Tersedia →</Link>
                            ) : (
                                <Link href={route('register')} className="steps-cta-btn">Daftar Sekarang →</Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* PENGAJAR */}
            <section className="pengajar-section" id="pengajar">
                <div className="pengajar-header reveal">
                    <div className="section-tag">Tim Pengajar</div>
                    <h2 className="section-title">Dibimbing Para Ahli<br />yang Berpengalaman</h2>
                    <p className="section-desc">Seluruh pengajar LPQ Masjid Syuhada memiliki latar belakang pendidikan Al-Quran yang kuat dan bersanad.</p>
                </div>
                <div className="pengajar-grid">
                    {[
                        {initial:'A',bg:'linear-gradient(135deg,#1a5c38,#2d7a50)',name:'Ust. Ahmad Fauzi',role:'Kepala LPQ',desc:'Hafizh 30 juz, lulusan Universitas Islam Madinah. 15 tahun pengalaman mengajar tahfizh.'},
                        {initial:'H',bg:'linear-gradient(135deg,#7b3f00,#b35a00)',name:'Ust. Hasan Basri',role:'Pengajar Tahsin',desc:'Spesialis ilmu tajwid dan tahsin, bersanad ke Syaikh Mahmud Khalil Al-Hushari.'},
                        {initial:'F',bg:'linear-gradient(135deg,#1a3a5c,#2a5a8c)',name:'Ustdzh. Fatimah',role:'Pengajar Tahfizh Putri',desc:'Hafizhah 30 juz, lulusan Pesantren Tahfizh Putri Jogja. Spesialis halaqah putri.'},
                        {initial:'R',bg:'linear-gradient(135deg,#4a1942,#7a2e6e)',name:'Ust. Rizki Amanah',role:'Pengajar Tilawah',desc:'Juara MTQ Nasional, spesialis tilawah maqamat. Aktif sebagai qori di berbagai acara.'},
                    ].map(p => (
                        <div key={p.name} className="pengajar-card reveal">
                            <div className="pengajar-avatar" style={{background: p.bg}}>{p.initial}</div>
                            <div className="pengajar-name">{p.name}</div>
                            <div className="pengajar-role">{p.role}</div>
                            <div className="pengajar-desc">{p.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONI */}
            <section className="testimonial-section">
                <div className="section-tag">Testimoni</div>
                <h2 className="section-title">Apa Kata Santri & Wali</h2>
                <div className="testimonials-grid">
                    {[
                        {initial:'B',name:'Bapak Rahmat Hidayat',role:'Peserta Tahsin 2023',text:'Alhamdulillah, setelah ikut program tahsin di sini bacaan Al-Quran saya jauh lebih baik. Pengajarnya sabar dan metodologis. Sangat direkomendasikan!'},
                        {initial:'I',name:'Ibu Siti Aminah',role:'Wali Santri TPA',text:'Anak saya yang sebelumnya susah diajak belajar agama, sekarang semangat ke TPA. Dalam 6 bulan sudah bisa baca Iqro 4. Alhamdulillah.'},
                        {initial:'M',name:'Muhammad Rizal',role:'Santri Tahfizh, 3 Juz',text:'Program tahfizh di LPQ ini luar biasa. Dalam setahun berhasil menghafal 3 juz dengan muroja\'ah yang terstruktur. Jazakumullahu khairan.'},
                    ].map(t => (
                        <div key={t.name} className="testimonial-card reveal">
                            <div className="testimonial-quote">"</div>
                            <p className="testimonial-text">{t.text}</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{t.initial}</div>
                                <div>
                                    <div className="testimonial-name">{t.name}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section">
                <div className="faq-header reveal">
                    <div className="section-tag">FAQ</div>
                    <h2 className="section-title">Pertanyaan yang Sering Ditanyakan</h2>
                    <p className="section-desc">Tidak menemukan jawaban? Hubungi kami langsung via WhatsApp.</p>
                </div>
                <div className="faq-grid">
                    {[
                        ['Berapa biaya pendaftaran program?','Biaya bervariasi tergantung program. TPA Anak dan Kajian Fiqih gratis. Program Tahsin dan Tahfizh mulai dari Rp150.000/bulan. Tersedia subsidi bagi yang membutuhkan.'],
                        ['Apakah ada program untuk dewasa yang baru bisa baca Iqro?','Tentu ada! Kami memiliki kelas khusus untuk dewasa pemula yang belajar dari dasar. Tidak perlu malu, banyak peserta dewasa yang memulai dari nol.'],
                        ['Bagaimana jadwal kegiatan belajar?','TPA anak sore hari Senin–Jumat. Kelas dewasa pagi/malam sesuai program. Detail jadwal diberikan setelah pendaftaran dikonfirmasi admin.'],
                        ['Apakah bisa daftar di tengah bulan berjalan?','Bisa. Penerimaan santri baru dibuka setiap saat selama kuota masih tersedia. Biaya dihitung proporsional sesuai tanggal masuk.'],
                        ['Apakah ada sertifikat setelah menyelesaikan program?','Ya, setiap peserta yang menyelesaikan program mendapat sertifikat resmi dari LPQ Masjid Syuhada. Tahfizh diberikan per juz.'],
                        ['Bagaimana cara menghubungi panitia?','Via WhatsApp di nomor yang tertera di bagian lokasi, datang langsung ke sekretariat LPQ, atau DM Instagram @lpqsyuhada.'],
                    ].map(([q, a]) => (
                        <FaqItem key={q} q={q} a={a} />
                    ))}
                </div>
            </section>

            {/* LOKASI */}
            <section className="location-section" id="lokasi">
                <div className="location-grid">
                    <div>
                        <div className="section-tag reveal">Lokasi</div>
                        <h2 className="section-title reveal">Temukan Kami di<br />Masjid Syuhada</h2>
                        <p className="section-desc reveal">Masjid Syuhada adalah salah satu masjid bersejarah di Yogyakarta yang berdiri sejak 1952. Mudah dijangkau dari berbagai penjuru kota.</p>
                        <div className="location-address reveal">
                            {[
                                ['📍','Alamat','Jl. Sudirman No. 139, Kotabaru\nGondokusuman, Yogyakarta 55224'],
                                ['🕐','Jam Operasional','Senin – Sabtu, 07.00 – 21.00 WIB'],
                                ['📱','WhatsApp','+62 812-2700-XXXX'],
                                ['📧','Email','lpq@masjidsyuhada.id'],
                            ].map(([icon, label, value]) => (
                                <div key={label} className="location-row">
                                    <div className="location-row-icon">{icon}</div>
                                    <div>
                                        <div className="location-row-label">{label}</div>
                                        <div className="location-row-value" style={{whiteSpace:'pre-line'}}>{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="map-placeholder reveal">
                        <div className="map-pin">
                            <span className="map-pin-icon">🕌</span>
                            <div className="map-pin-name">Masjid Syuhada</div>
                            <div className="map-pin-addr">Jl. Sudirman No. 139, Yogyakarta</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand-name">LPQ Masjid Syuhada</div>
                        <p className="footer-brand-sub">Lembaga Pendidikan Quran yang bernaung di bawah Masjid Syuhada Yogyakarta. Mencetak generasi Qurani sejak 2005.</p>
                        <div className="footer-social">
                            {['📷','▶️','💬','👥'].map(icon => <a key={icon} href="#">{icon}</a>)}
                        </div>
                    </div>
                    <div>
                        <div className="footer-col-title">Program</div>
                        <ul className="footer-links">
                            {['TPA Anak','Iqro & Dasar','Tahsin Al-Quran','Tahfizh Quran','Tilawah & Tartil','Kajian Fiqih'].map(p => (
                                <li key={p}><a href="#program" onClick={e => smoothScroll(e,'#program')}>{p}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Navigasi</div>
                        <ul className="footer-links">
                            {[['Tentang LPQ','#tentang'],['Tim Pengajar','#pengajar'],['Cara Daftar','#cara-daftar'],['Lokasi','#lokasi']].map(([label, href]) => (
                                <li key={label}><a href={href} onClick={e => smoothScroll(e, href)}>{label}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Akun</div>
                        <ul className="footer-links">
                            {auth.user ? (
                                <li><Link href={route('dashboard')}>Dashboard</Link></li>
                            ) : (
                                <>
                                    <li><Link href={route('login')}>Masuk</Link></li>
                                    <li><Link href={route('register')}>Daftar</Link></li>
                                </>
                            )}
                            <li><a href="#cara-daftar" onClick={e => smoothScroll(e,'#cara-daftar')}>Cara Mendaftar</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div>© {new Date().getFullYear()} LPQ Masjid Syuhada. Hak cipta dilindungi.</div>
                    <div className="footer-bottom-right">بَارَكَ اللَّهُ فِيكُمْ</div>
                </div>
            </footer>
        </>
    );
}