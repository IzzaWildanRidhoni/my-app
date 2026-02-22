import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    BookOpen, Users, Award, MapPin, Phone, Mail, Clock,
    ChevronDown, Star, Heart, Shield, Mic2,
    BookMarked, GraduationCap, Baby, Lightbulb, Home,
    Info, Calendar, Navigation, ArrowRight,
    Instagram, Youtube, MessageCircle, Facebook,
    CheckCircle, Sparkles, Moon, Menu
} from 'lucide-react';

const style = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --green:#0f4c2a;--green-mid:#1e7545;--green-light:#2ea060;--green-pale:#e8f5ed;
  --gold:#b8840c;--gold-light:#d4a435;--gold-pale:#fdf3dc;
  --cream:#fafaf7;--cream-dark:#f2f0e8;--surface:#fff;
  --text:#111418;--text-muted:#5c6370;--text-light:#8b939f;
  --border:rgba(0,0,0,0.08);--border-gold:rgba(184,132,12,0.2);
  --sh-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --sh-md:0 4px 16px rgba(0,0,0,0.08),0 2px 6px rgba(0,0,0,0.04);
  --sh-lg:0 20px 60px rgba(0,0,0,0.1),0 8px 24px rgba(0,0,0,0.06);
  --sh-g:0 20px 60px rgba(15,76,42,0.25);
  --r:14px;--rlg:22px;--rxl:32px;--rsm:8px;
}

html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--cream-dark)}::-webkit-scrollbar-thumb{background:var(--green-mid);border-radius:10px}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;background:rgba(250,250,247,0.88);backdrop-filter:blur(20px) saturate(1.6);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
.nav.scrolled{border-color:var(--border);box-shadow:0 1px 0 rgba(0,0,0,0.04),0 4px 20px rgba(0,0,0,0.04)}
.nav-logo{display:flex;align-items:center;gap:14px;text-decoration:none}
.nav-logo-emblem{width:44px;height:44px;background:var(--green);border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:22px;color:var(--gold-light);box-shadow:0 4px 12px rgba(15,76,42,0.3);flex-shrink:0}
.nav-logo-name{font-size:14px;font-weight:700;color:var(--green);letter-spacing:-.01em;line-height:1.3}
.nav-logo-sub{font-size:11px;color:var(--text-muted)}
.nav-links{display:flex;align-items:center;gap:4px;list-style:none}
.nav-links a{text-decoration:none;font-size:14px;font-weight:500;color:var(--text-muted);padding:8px 14px;border-radius:var(--rsm);transition:color .2s,background .2s}
.nav-links a:hover{color:var(--green);background:var(--green-pale)}
.nav-cta{background:var(--green)!important;color:#fff!important;padding:9px 20px!important;border-radius:var(--rsm)!important;font-weight:600!important;font-size:13px!important;display:inline-flex!important;align-items:center!important;gap:6px!important;box-shadow:0 2px 8px rgba(15,76,42,0.3)!important;transition:transform .15s,box-shadow .15s!important;text-decoration:none!important}
.nav-cta:hover{transform:translateY(-1px)!important;box-shadow:0 4px 16px rgba(15,76,42,0.4)!important}
.nav-hbg{display:none;background:none;border:none;cursor:pointer;padding:8px;color:var(--green);border-radius:var(--rsm)}

/* BOTTOM NAV */
.bnav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:300}
.bnav-wrap{
  margin:0 10px 10px;
  background:rgba(10,18,14,0.93);
  backdrop-filter:blur(28px) saturate(2);
  border-radius:22px;
  box-shadow:0 -2px 0 rgba(255,255,255,0.05) inset,0 12px 40px rgba(0,0,0,0.35),0 2px 8px rgba(0,0,0,0.2);
  display:flex;align-items:center;justify-content:space-around;
  padding:8px 4px calc(8px + env(safe-area-inset-bottom,0px));
  gap:2px;
}
.bnav-item{
  display:flex;flex-direction:column;align-items:center;gap:3px;
  flex:1;padding:6px 4px;border-radius:16px;
  border:none;background:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:9px;font-weight:500;
  color:rgba(255,255,255,0.35);text-decoration:none;
  transition:color .2s,background .2s;
  white-space:nowrap;
}
.bnav-item:hover{color:rgba(255,255,255,0.65)}
.bnav-item.on{color:#fff}
.bnav-icon{
  width:36px;height:36px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s,box-shadow .2s;
}
.bnav-item.on .bnav-icon{
  background:var(--green);
  box-shadow:0 4px 14px rgba(15,76,42,0.6);
}
.bnav-item:hover:not(.on) .bnav-icon{background:rgba(255,255,255,0.07)}
/* CTA (daftar) button in bottom nav */
.bnav-reg .bnav-icon{
  background:var(--gold);
  box-shadow:0 4px 14px rgba(184,132,12,0.5);
  width:40px;height:40px;border-radius:14px;
}
.bnav-reg{color:rgba(212,164,53,0.85)!important}
.bnav-reg.on .bnav-icon,.bnav-reg:hover .bnav-icon{background:var(--gold-light)!important}

/* HERO */
.hero{min-height:100vh;padding:120px 5% 80px;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:80px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 70% at 100% 50%,rgba(30,117,69,0.06) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 5% 90%,rgba(184,132,12,0.05) 0%,transparent 50%)}
.hero-dots{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(15,76,42,0.04) 1px,transparent 1px);background-size:32px 32px}
.hero-left{position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--gold-pale);border:1px solid var(--border-gold);border-radius:100px;padding:6px 16px 6px 10px;font-size:12px;font-weight:600;color:var(--gold);letter-spacing:.02em;margin-bottom:28px}
.hero-bdot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite}
.hero h1{font-family:'Lora',serif;font-size:clamp(2.4rem,4.5vw,3.8rem);font-weight:700;line-height:1.15;color:var(--text);letter-spacing:-.02em;margin-bottom:12px}
.hero h1 .accent{color:var(--green)}
.hero-ar{font-family:'Amiri',serif;font-size:clamp(1rem,1.8vw,1.4rem);color:var(--gold);direction:rtl;margin-bottom:24px;opacity:.85;font-style:italic}
.hero-desc{font-size:16px;line-height:1.8;color:var(--text-muted);max-width:480px;margin-bottom:40px}
.hero-acts{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.btn-p{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:#fff;padding:14px 28px;border-radius:var(--r);font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 4px 20px rgba(15,76,42,0.35);transition:transform .2s,box-shadow .2s}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(15,76,42,0.4)}
.btn-o{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);padding:13px 24px;border-radius:var(--r);font-weight:500;font-size:14px;text-decoration:none;transition:border-color .2s,transform .2s}
.btn-o:hover{border-color:var(--green);color:var(--green);transform:translateY(-2px)}
.hero-vis{position:relative;z-index:1}
.hcard{background:var(--green);border-radius:var(--rxl);padding:52px 44px;position:relative;overflow:hidden;box-shadow:var(--sh-g)}
.hcard::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:rgba(255,255,255,0.04);border-radius:50%}
.hcard::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;background:rgba(255,255,255,0.03);border-radius:50%}
.hc-lbl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-light);margin-bottom:8px;opacity:.8}
.hc-title{font-family:'Lora',serif;font-size:1.8rem;color:#fff;font-weight:700;margin-bottom:6px;line-height:1.3}
.hc-sub{font-size:13px;color:rgba(255,255,255,0.55);margin-bottom:24px}
.hc-div{height:1px;background:rgba(255,255,255,0.1);margin:20px 0}
.hc-ar{font-family:'Amiri',serif;font-size:2.2rem;color:var(--gold-light);direction:rtl;text-align:center;margin-bottom:6px;position:relative;z-index:1}
.hc-tr{font-size:12px;color:rgba(255,255,255,0.45);text-align:center;font-style:italic;position:relative;z-index:1}
.hc-stats{display:grid;grid-template-columns:repeat(3,1fr);margin-top:28px;background:rgba(255,255,255,0.06);border-radius:var(--r);overflow:hidden;position:relative;z-index:1;border:1px solid rgba(255,255,255,0.08)}
.hc-stat{padding:18px 10px;text-align:center;border-right:1px solid rgba(255,255,255,0.08)}
.hc-stat:last-child{border-right:none}
.hc-num{font-family:'Lora',serif;font-size:1.7rem;font-weight:700;color:var(--gold-light);display:block;line-height:1}
.hc-label{font-size:10px;color:rgba(255,255,255,0.45);margin-top:5px}
.hfloat{position:absolute;background:var(--surface);border-radius:var(--r);padding:12px 16px;box-shadow:var(--sh-md);border:1px solid var(--border);display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:var(--text);animation:float 4s ease-in-out infinite;z-index:2}
.hf1{top:-16px;right:20px;animation-delay:0s}
.hf2{bottom:40px;left:-20px;animation-delay:1.5s}
.hfi{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center}

/* STATS BAR */
.sbar{background:var(--green);padding:44px 5%}
.sbar-in{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.si{text-align:center;padding:8px 20px;border-right:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;gap:8px}
.si:last-child{border-right:none}
.si-icon{width:40px;height:40px;background:rgba(255,255,255,0.08);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--gold-light)}
.si-num{font-family:'Lora',serif;font-size:2rem;font-weight:700;color:#fff;line-height:1}
.si-lbl{font-size:12px;color:rgba(255,255,255,0.55)}

/* SECTION */
section{padding:108px 5%}
.sk{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.sk::after{content:'';display:inline-block;width:32px;height:1.5px;background:var(--gold);opacity:.5}
.sh{font-family:'Lora',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;color:var(--text);line-height:1.2;letter-spacing:-.02em;margin-bottom:16px}
.sh .g{color:var(--green)}
.sd{font-size:15px;line-height:1.8;color:var(--text-muted);max-width:520px}

/* ABOUT */
#tentang{background:var(--cream)}
.about-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-photos{position:relative;height:500px}
.aimg{position:absolute;border-radius:var(--rlg);overflow:hidden;box-shadow:var(--sh-lg);border:3px solid var(--surface)}
.aimg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.aimg:hover img{transform:scale(1.04)}
.aimg-a{width:65%;height:330px;top:0;right:0}
.aimg-b{width:50%;height:210px;bottom:0;left:0}
.aimg-c{width:38%;height:158px;bottom:24px;right:4%;border:2px solid rgba(255,255,255,0.8)}
.a-since{position:absolute;top:16px;left:16px;z-index:10;background:var(--green);color:#fff;border-radius:var(--rsm);padding:8px 14px;font-size:12px;font-weight:700;box-shadow:0 4px 12px rgba(15,76,42,0.35);display:flex;align-items:center;gap:6px}
.about-right .sd{margin-bottom:36px}
.pillars{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pillar{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px;transition:border-color .2s,box-shadow .2s,transform .2s}
.pillar:hover{border-color:var(--green-pale);box-shadow:var(--sh-md);transform:translateY(-2px)}
.pi{width:40px;height:40px;background:var(--green-pale);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;color:var(--green);margin-bottom:12px}
.pt{font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px}
.pd{font-size:12px;color:var(--text-muted);line-height:1.55}

/* PROGRAMS */
#program{background:var(--cream-dark)}
.progs-head{text-align:center;margin-bottom:64px}
.progs-head .sd{margin:0 auto}
.progs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.prog-card{border-radius:var(--rlg);overflow:hidden;transition:transform .25s,box-shadow .25s;box-shadow:var(--sh-sm)}
.prog-card:hover{transform:translateY(-6px);box-shadow:var(--sh-lg)}
.prog-top{padding:32px 28px 24px;position:relative;overflow:hidden;min-height:170px;display:flex;flex-direction:column;justify-content:flex-end}
.prog-top::before{content:'';position:absolute;top:-40px;right:-40px;width:130px;height:130px;background:rgba(255,255,255,0.06);border-radius:50%}
.prog-top::after{content:'';position:absolute;bottom:-20px;left:-20px;width:80px;height:80px;background:rgba(255,255,255,0.04);border-radius:50%}
.prog-icon{width:52px;height:52px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;margin-bottom:16px;position:relative;z-index:1}
.prog-title{font-family:'Lora',serif;font-size:1.15rem;font-weight:700;color:#fff;margin-bottom:3px;position:relative;z-index:1}
.prog-sub{font-size:11px;color:rgba(255,255,255,0.6);font-weight:500;letter-spacing:.04em;position:relative;z-index:1}
.prog-body{background:var(--surface);padding:22px 28px 26px}
.prog-desc{font-size:13px;line-height:1.65;color:var(--text-muted);margin-bottom:18px}
.prog-tags{display:flex;gap:6px;flex-wrap:wrap}
.prog-tag{font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;background:var(--green-pale);color:var(--green);border:1px solid rgba(15,76,42,0.1)}

/* CARA DAFTAR — TIMELINE */
#cara-daftar{background:var(--cream)}
.steps-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.steps-l .sd{margin-bottom:52px}
.timeline{position:relative}
.timeline::before{content:'';position:absolute;left:27px;top:52px;width:2px;bottom:28px;background:linear-gradient(to bottom,var(--green) 0%,rgba(15,76,42,0.1) 100%);border-radius:2px}
.tl-item{display:flex;gap:20px;padding-bottom:32px;position:relative}
.tl-item:last-child{padding-bottom:0}
.tl-num{width:56px;height:56px;min-width:56px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Lora',serif;font-size:1.3rem;font-weight:700;color:#fff;box-shadow:0 4px 16px rgba(15,76,42,0.35);position:relative;z-index:1;border:3px solid var(--cream);transition:transform .2s;flex-shrink:0}
.tl-item:hover .tl-num{transform:scale(1.08)}
.tl-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--rlg);padding:20px 24px;flex:1;transition:border-color .2s,box-shadow .2s;position:relative}
.tl-card::before{content:'';position:absolute;left:-8px;top:20px;width:14px;height:14px;background:var(--surface);border-left:1px solid var(--border);border-bottom:1px solid var(--border);transform:rotate(45deg);border-radius:2px}
.tl-item:hover .tl-card{border-color:rgba(15,76,42,0.2);box-shadow:var(--sh-md)}
.tl-step{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.tl-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px}
.tl-desc{font-size:13px;color:var(--text-muted);line-height:1.65}
.tl-badge{position:absolute;top:16px;right:16px;width:30px;height:30px;background:var(--green-pale);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--green)}

/* CTA CARD */
.cta-card{background:var(--green);border-radius:var(--rxl);padding:48px 40px;position:sticky;top:90px;overflow:hidden}
.cta-card::before{content:'';position:absolute;top:-80px;right:-80px;width:260px;height:260px;background:rgba(255,255,255,0.04);border-radius:50%}
.cta-ar{font-family:'Amiri',serif;font-size:1.6rem;color:var(--gold-light);direction:rtl;margin-bottom:20px;opacity:.9;position:relative;z-index:1}
.cta-title{font-family:'Lora',serif;font-size:1.45rem;color:#fff;font-weight:700;margin-bottom:12px;line-height:1.35;position:relative;z-index:1}
.cta-desc{font-size:14px;color:rgba(255,255,255,0.65);line-height:1.75;margin-bottom:28px;position:relative;z-index:1}
.cta-checks{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;position:relative;z-index:1}
.cta-check{display:flex;gap:10px;align-items:center;font-size:13px;color:rgba(255,255,255,0.75)}
.btn-g{display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:var(--green);padding:14px 28px;border-radius:var(--r);font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 4px 16px rgba(184,132,12,0.35);transition:transform .2s,box-shadow .2s;position:relative;z-index:1}
.btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(184,132,12,0.45)}

/* PENGAJAR */
.pj-sec{background:var(--surface)}
.pj-head{text-align:center;margin-bottom:60px}
.pj-head .sd{margin:0 auto}
.pj-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.pj-card{background:var(--cream);border-radius:var(--rlg);overflow:hidden;border:1px solid var(--border);transition:transform .25s,box-shadow .25s}
.pj-card:hover{transform:translateY(-5px);box-shadow:var(--sh-md)}
.pj-top{height:120px;display:flex;align-items:center;justify-content:center;position:relative}
.pj-av{width:80px;height:80px;border-radius:50%;border:3px solid var(--surface);display:flex;align-items:center;justify-content:center;font-family:'Lora',serif;font-size:1.8rem;font-weight:700;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.2);position:relative;z-index:1}
.pj-body{padding:20px;text-align:center}
.pj-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px}
.pj-role{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
.pj-desc{font-size:12px;color:var(--text-muted);line-height:1.55}
.pj-badges{display:flex;gap:4px;justify-content:center;margin-top:10px;flex-wrap:wrap}
.pj-badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px;background:var(--green-pale);color:var(--green)}

/* TESTIMONIALS */
.testi-sec{background:var(--green);padding:108px 5%}
.testi-head{text-align:center;margin-bottom:60px}
.testi-head .sk{color:var(--gold-light)}
.testi-head .sh{color:#fff}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.testi-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:var(--rlg);padding:32px;transition:background .2s,transform .2s}
.testi-card:hover{background:rgba(255,255,255,0.1);transform:translateY(-3px)}
.testi-stars{display:flex;gap:3px;margin-bottom:16px}
.testi-txt{font-size:14px;color:rgba(255,255,255,0.78);line-height:1.75;margin-bottom:24px;font-style:italic}
.testi-auth{display:flex;align-items:center;gap:12px}
.testi-av{width:42px;height:42px;border-radius:50%;background:var(--gold);color:var(--green);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
.testi-name{font-size:14px;font-weight:700;color:#fff}
.testi-role{font-size:12px;color:rgba(255,255,255,0.45)}

/* FAQ */
.faq-sec{background:var(--cream-dark)}
.faq-head{text-align:center;margin-bottom:56px}
.faq-head .sd{margin:0 auto}
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:860px;margin:0 auto}
.faq-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:border-color .2s}
.faq-item.open{border-color:rgba(15,76,42,0.2)}
.faq-btn{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:20px 22px;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--text);text-align:left;transition:background .2s}
.faq-btn:hover{background:var(--green-pale)}
.faq-chev{min-width:22px;height:22px;background:var(--green-pale);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--green);transition:transform .25s,background .2s}
.faq-item.open .faq-chev{transform:rotate(180deg);background:var(--green);color:#fff}
.faq-body{max-height:0;overflow:hidden;transition:max-height .3s ease}
.faq-item.open .faq-body{max-height:200px}
.faq-body-in{padding:0 22px 20px;font-size:13px;color:var(--text-muted);line-height:1.7}

/* LOCATION */
.loc-sec{background:var(--cream)}
.loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.loc-details{background:var(--surface);border:1px solid var(--border);border-radius:var(--rlg);overflow:hidden;margin-top:36px}
.loc-row{display:flex;gap:16px;align-items:flex-start;padding:18px 24px;border-bottom:1px solid var(--border)}
.loc-row:last-child{border-bottom:none}
.loc-icon{width:38px;height:38px;min-width:38px;background:var(--green-pale);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;color:var(--green)}
.loc-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:3px}
.loc-val{font-size:14px;color:var(--text);line-height:1.5}
.map-box{aspect-ratio:4/3;background:var(--green);border-radius:var(--rxl);overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh-g)}
.map-box::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px)}
.map-pin{position:relative;z-index:1;text-align:center}
.map-circle{width:72px;height:72px;background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:var(--gold-light);animation:float 3s ease-in-out infinite}
.map-name{font-family:'Lora',serif;font-size:1.2rem;color:var(--gold-light);margin-bottom:6px}
.map-addr{font-size:13px;color:rgba(255,255,255,0.55);max-width:200px;margin:0 auto;line-height:1.5}

/* FOOTER */
footer{background:#071810;padding:72px 5% 36px;color:rgba(255,255,255,0.55)}
.ft-grid{display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:56px;margin-bottom:60px}
.ft-logo{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.ft-emb{width:40px;height:40px;background:var(--green);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:20px;color:var(--gold-light)}
.ft-name{font-family:'Lora',serif;font-size:1.1rem;color:#fff}
.ft-desc{font-size:13px;line-height:1.7;margin-bottom:24px;max-width:280px}
.ft-socials{display:flex;gap:8px}
.ft-social{width:36px;height:36px;background:rgba(255,255,255,0.06);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;text-decoration:none;color:rgba(255,255,255,0.5);transition:background .2s,color .2s}
.ft-social:hover{background:rgba(255,255,255,0.12);color:#fff}
.ft-ct{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-light);margin-bottom:18px;opacity:.8}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:10px}
.ft-links a{text-decoration:none;font-size:13px;color:rgba(255,255,255,0.45);transition:color .2s}
.ft-links a:hover{color:#fff}
.ft-bot{border-top:1px solid rgba(255,255,255,0.07);padding-top:32px;display:flex;justify-content:space-between;align-items:center;font-size:12px}
.ft-ar{font-family:'Amiri',serif;font-size:1rem;color:var(--gold);opacity:.6}

/* REVEAL */
.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.reveal.in{opacity:1;transform:translateY(0)}

/* KEYFRAMES */
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}

.a1{animation:fadeUp .6s 0s both}.a2{animation:fadeUp .6s .1s both}.a3{animation:fadeUp .6s .2s both}.a4{animation:fadeUp .6s .3s both}.a5{animation:fadeUp .6s .4s both}

/* RESPONSIVE */
@media(max-width:1100px){
  .hero{grid-template-columns:1fr;text-align:center;gap:60px}
  .hero-desc{margin-left:auto;margin-right:auto}
  .hero-acts{justify-content:center}
  .hero-vis{order:-1}
  .about-layout{grid-template-columns:1fr}
  .about-photos{height:380px}
  .steps-wrap{grid-template-columns:1fr}
  .loc-grid{grid-template-columns:1fr}
  .pj-grid{grid-template-columns:repeat(2,1fr)}
  .ft-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:768px){
  .nav-links{display:none}
  .nav-hbg{display:flex}
  .bnav{display:block}
  body{padding-bottom:88px}
  section{padding:72px 4%}
  .sbar-in{grid-template-columns:repeat(2,1fr)}
  .si{border-right:none;padding:14px 12px}
  .si:nth-child(odd){border-right:1px solid rgba(255,255,255,0.1)}
  .progs-grid{grid-template-columns:1fr}
  .testi-grid{grid-template-columns:1fr}
  .faq-grid{grid-template-columns:1fr}
  .ft-grid{grid-template-columns:1fr;gap:36px}
  .ft-bot{flex-direction:column;gap:12px;text-align:center}
  .pj-grid{grid-template-columns:1fr 1fr}
  .about-photos{height:320px}
  .timeline::before{left:24px}
  .tl-num{width:48px;height:48px;min-width:48px;font-size:1.1rem}
}
@media(max-width:480px){
  .pj-grid{grid-template-columns:1fr}
  .about-photos{height:260px}
  .hcard{padding:36px 28px}
}
`;

function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver(entries => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('in'), i * 80);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
}

function useNavScroll() {
    useEffect(() => {
        const nav = document.getElementById('main-nav');
        const h = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);
}

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' open' : ''}`}>
            <button className="faq-btn" onClick={() => setOpen(!open)}>
                {q}
                <span className="faq-chev"><ChevronDown size={13} strokeWidth={2.5}/></span>
            </button>
            <div className="faq-body">
                <div className="faq-body-in">{a}</div>
            </div>
        </div>
    );
}

/* Unsplash photos for Al-Qur'an / Islamic section */
const PHOTOS = {
    a: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80', // Mushaf Al-Qur'an terbuka
    b: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80', // Detail ornamen masjid/arsitektur
    c: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80', // Tasbih dan suasana tenang
};

const STEPS = [
    ['Buat Akun',         'Daftar akun di website LPQ dengan email dan kata sandi. Proses hanya membutuhkan beberapa menit saja.', Users],
    ['Pilih Program',     'Jelajahi program yang tersedia dan pilih sesuai usia, kemampuan, dan jadwal Anda.', BookOpen],
    ['Pembayaran',        'Bayar untuk program berbayar dan upload bukti transfer. Admin verifikasi dalam 1×24 jam.', CheckCircle],
    ['Mulai Belajar',     'Terima info jadwal, bergabung grup kelas, dan mulai perjalanan Qurani Anda. Bismillah!', Sparkles],
];

const PROGS = [
    {Icon:BookOpen,      title:'Iqro & Dasar',      sub:'Untuk Pemula',             bg:'linear-gradient(135deg,#1e7545 0%,#0f4c2a 100%)', desc:'Belajar mengenal huruf hijaiyah dan dasar-dasar tajwid untuk pemula. Cocok untuk anak-anak usia 4 tahun ke atas dan dewasa yang baru memulai.', tags:['Anak & Dewasa','Rutin','Gratis']},
    {Icon:BookMarked,    title:'Tahsin Al-Quran',   sub:'Penyempurnaan Bacaan',     bg:'linear-gradient(135deg,#92400e 0%,#451a03 100%)', desc:'Program penyempurnaan bacaan Al-Quran dengan fokus pada tajwid, makharijul huruf, dan lantunan yang indah sesuai kaidah.', tags:['Remaja & Dewasa','Rutin','Berbayar']},
    {Icon:GraduationCap, title:'Tahfizh Quran',     sub:'Hafalan Al-Quran',          bg:'linear-gradient(135deg,#1e3a5f 0%,#0c1f3f 100%)', desc:"Program menghafal Al-Quran dengan metode talaqqi dan muroja'ah terstruktur. Dipandu langsung oleh hafizh berpengalaman.", tags:['Semua Usia','Intensif','Bersertifikat']},
    {Icon:Mic2,          title:'Tartil & Tilawah',  sub:'Seni Baca Al-Quran',       bg:'linear-gradient(135deg,#581c87 0%,#2e1065 100%)', desc:'Mempelajari seni tilawah Al-Quran dengan maqamat yang indah. Dipersiapkan untuk mengikuti MTQ dan perlombaan tilawah.', tags:['Remaja','Event','Kompetitif']},
    {Icon:Baby,          title:'TPA Anak',           sub:'Taman Pendidikan Al-Quran',bg:'linear-gradient(135deg,#065f46 0%,#022c22 100%)', desc:'Program TPA untuk anak-anak usia 4–12 tahun. Belajar Al-Quran sambil bermain dengan suasana yang menyenangkan.', tags:['Anak 4–12 Thn','Sore Hari','Gratis']},
    {Icon:Lightbulb,     title:'Kajian Fiqih',       sub:'Ilmu Praktis Ibadah',      bg:'linear-gradient(135deg,#78350f 0%,#3c1a00 100%)', desc:'Kajian fiqih ibadah sehari-hari yang praktis dan mudah dipahami. Meliputi thaharah, shalat, puasa, dan muamalah dasar.', tags:['Dewasa','Rutin','Gratis']},
];

export default function Welcome({ auth }) {
    useReveal();
    useNavScroll();
    const [active, setActive] = useState('home');

    const go = (e, id) => {
        e?.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        setActive(id.replace('#', ''));
    };

    const navItems = [
        { id:'home',        label:'Beranda', Icon:Home },
        { id:'tentang',     label:'Tentang', Icon:Info },
        { id:'program',     label:'Program', Icon:BookOpen },
        { id:'cara-daftar', label:'Daftar',  Icon:Calendar },
        { id:'lokasi',      label:'Lokasi',  Icon:Navigation },
    ];

    return (
        <>
            <Head title="LPQ Masjid Syuhada — Lembaga Pendidikan Quran"/>
            <style>{style}</style>

            {/* NAV */}
            <nav className="nav" id="main-nav">
                <a href="#" className="nav-logo" onClick={e => go(e,'#home')}>
                    <div className="nav-logo-emblem">ق</div>
                    <div>
                        <div className="nav-logo-name">LPQ Masjid Syuhada</div>
                        <div className="nav-logo-sub">Lembaga Pendidikan Quran</div>
                    </div>
                </a>
                <ul className="nav-links">
                    {[['#tentang','Tentang'],['#program','Program'],['#pengajar','Pengajar'],['#cara-daftar','Cara Daftar'],['#lokasi','Lokasi']].map(([href,lbl]) => (
                        <li key={href}><a href={href} onClick={e => go(e,href)}>{lbl}</a></li>
                    ))}
                    {auth.user
                        ? <li><Link href={route('dashboard')} className="nav-cta">Dashboard <ArrowRight size={13}/></Link></li>
                        : <li><Link href={route('login')} className="nav-cta">Masuk / Daftar <ArrowRight size={13}/></Link></li>
                    }
                </ul>
                <button className="nav-hbg"><Menu size={22}/></button>
            </nav>

            {/* BOTTOM NAV */}
            <div className="bnav">
                <div className="bnav-wrap">
                    {navItems.map(({ id, label, Icon }) => (
                        <button key={id} className={`bnav-item${active===id?' on':''}`} onClick={e => go(e,`#${id}`)}>
                            <div className="bnav-icon"><Icon size={18} strokeWidth={active===id?2.5:1.8}/></div>
                            {label}
                        </button>
                    ))}
                    {auth.user
                        ? <Link href={route('dashboard')} className="bnav-item bnav-reg">
                            <div className="bnav-icon"><ArrowRight size={18} strokeWidth={2.5}/></div>
                            Dashboard
                          </Link>
                        : <Link href={route('register')} className="bnav-item bnav-reg">
                            <div className="bnav-icon"><ArrowRight size={18} strokeWidth={2.5}/></div>
                            Daftar
                          </Link>
                    }
                </div>
            </div>

            {/* HERO */}
            <section className="hero" id="home">
                <div className="hero-bg"/><div className="hero-dots"/>
                <div className="hero-left">
                    <div className="hero-badge a1"><span className="hero-bdot"/>Lembaga Pendidikan Quran Terpercaya</div>
                    <h1 className="a2">Belajar Al-Quran di<br/><span className="accent">Masjid Syuhada</span></h1>
                    <div className="hero-ar a3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                    <p className="hero-desc a4">Wujudkan impian membaca, memahami, dan menghafal Al-Quran bersama para pengajar berpengalaman di lingkungan Masjid Syuhada Yogyakarta. Terbuka untuk semua usia dan tingkatan.</p>
                    <div className="hero-acts a5">
                        {auth.user
                            ? <Link href={route('dashboard')} className="btn-p">Lihat Program <ArrowRight size={15}/></Link>
                            : <><Link href={route('register')} className="btn-p">Daftar Sekarang <ArrowRight size={15}/></Link>
                               <a href="#program" className="btn-o" onClick={e=>go(e,'#program')}><BookOpen size={15}/>Lihat Program</a></>
                        }
                    </div>
                </div>
                <div className="hero-vis a3">
                    <div style={{position:'relative',maxWidth:'440px',margin:'0 auto'}}>
                        <div className="hfloat hf1">
                            <div className="hfi" style={{background:'#e8f5ed'}}><Users size={16} color="#1e7545"/></div>
                            <span style={{color:'#0f4c2a',fontWeight:700}}>500+ Peserta Aktif</span>
                        </div>
                        <div className="hfloat hf2">
                            <div className="hfi" style={{background:'#fdf3dc'}}><Award size={16} color="#b8840c"/></div>
                            <span style={{color:'#0f4c2a',fontWeight:700}}>Bersertifikat Resmi</span>
                        </div>
                        <div className="hcard">
                            <div className="hc-lbl">LPQ Masjid Syuhada • Yogyakarta</div>
                            <div className="hc-title">Generasi Qurani Berakhlak Mulia</div>
                            <div className="hc-sub">Mendidik sejak 1952</div>
                            <div className="hc-div"/>
                            <div className="hc-ar">اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِيْ خَلَقَ</div>
                            <div className="hc-tr">"Bacalah dengan nama Tuhanmu yang menciptakan…" — Al-Alaq: 1</div>
                            <div className="hc-stats">
                                {[['500+','Santri'],['20+','Pengajar'],['10+','Program']].map(([n,l])=>(
                                    <div key={l} className="hc-stat"><span className="hc-num">{n}</span><div className="hc-label">{l}</div></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <div className="sbar">
                <div className="sbar-in">
                    {[[Users,'500+','Peserta Aktif'],[GraduationCap,'20+','Pengajar Bersertifikat'],[BookMarked,'15+','Tahun Berdiri'],[Sparkles,'10+','Jenis Program']].map(([Icon,n,l])=>(
                        <div key={l} className="si">
                            <div className="si-icon"><Icon size={18}/></div>
                            <span className="si-num">{n}</span>
                            <div className="si-lbl">{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TENTANG */}
            <section id="tentang">
                <div className="about-layout">
                    <div className="about-photos reveal">
                        <div className="aimg aimg-a"><img src={PHOTOS.a} alt="Kegiatan LPQ Masjid Syuhada"/></div>
                        <div className="aimg aimg-b"><img src={PHOTOS.b} alt="Peserta belajar Al-Quran"/></div>
                        <div className="aimg aimg-c"><img src={PHOTOS.c} alt="Pengajaran Al-Quran"/></div>
                        <div className="a-since"><Moon size={12}/> Sejak 1952</div>
                    </div>
                    <div className="about-right reveal">
                        <div className="sk">Tentang Kami</div>
                        <h2 className="sh">Menerangi Hati dengan<br/><span className="g">Cahaya Al-Quran</span></h2>
                        <p className="sd">LPQ Masjid Syuhada adalah lembaga pendidikan Al-Quran yang bernaung di bawah Masjid Syuhada Yogyakarta. Kami hadir dengan misi mencetak generasi yang Qurani, berakhlak mulia, dan berkontribusi bagi umat sejak tahun 1952.</p>
                        <div className="pillars">
                            {[[BookOpen,'Metode Teruji','Metode Iqro dan Tartil yang telah terbukti efektif selama puluhan tahun.'],[Shield,'Pengajar Bersanad','Semua pengajar memiliki sanad keilmuan yang jelas dan terpercaya.'],[Heart,'Lingkungan Islami','Belajar di lingkungan masjid yang kondusif dan penuh berkah.'],[Users,'Semua Usia','Program tersedia untuk anak-anak, remaja, hingga dewasa.']].map(([Icon,t,d])=>(
                                <div key={t} className="pillar">
                                    <div className="pi"><Icon size={18}/></div>
                                    <div className="pt">{t}</div>
                                    <div className="pd">{d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAM */}
            <section id="program">
                <div className="progs-head reveal">
                    <div className="sk">Program Unggulan</div>
                    <h2 className="sh">Pilih Program yang<br/><span className="g">Sesuai Kebutuhan Anda</span></h2>
                    <p className="sd">Berbagai program dirancang khusus untuk berbagai usia dan tingkat kemampuan membaca Al-Quran.</p>
                </div>
                <div className="progs-grid">
                    {PROGS.map(({ Icon, title, sub, bg, desc, tags }) => (
                        <div key={title} className="prog-card reveal">
                            <div className="prog-top" style={{background:bg}}>
                                <div className="prog-icon"><Icon size={24}/></div>
                                <div className="prog-title">{title}</div>
                                <div className="prog-sub">{sub}</div>
                            </div>
                            <div className="prog-body">
                                <p className="prog-desc">{desc}</p>
                                <div className="prog-tags">{tags.map(t=><span key={t} className="prog-tag">{t}</span>)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CARA DAFTAR */}
            <section id="cara-daftar">
                <div className="steps-wrap">
                    <div className="steps-l">
                        <div className="sk reveal">Cara Mendaftar</div>
                        <h2 className="sh reveal">Mulai dalam<br/><span className="g">4 Langkah Mudah</span></h2>
                        <p className="sd reveal">Proses pendaftaran dirancang sesederhana mungkin agar Anda bisa langsung mulai belajar Al-Quran.</p>
                        <div className="timeline">
                            {STEPS.map(([title, desc, Icon], i) => (
                                <div key={title} className="tl-item reveal">
                                    <div className="tl-num">{i+1}</div>
                                    <div className="tl-card">
                                        <div className="tl-step">Langkah {i+1}</div>
                                        <div className="tl-title">{title}</div>
                                        <div className="tl-desc">{desc}</div>
                                        <div className="tl-badge"><Icon size={15}/></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="reveal">
                        <div className="cta-card">
                            <div className="cta-ar">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
                            <div className="cta-title">Siap Memulai Perjalanan Qurani Anda?</div>
                            <p className="cta-desc">Bergabunglah dengan ratusan Peserta yang telah merasakan manfaat belajar Al-Quran di LPQ Masjid Syuhada.</p>
                            <div className="cta-checks">
                                {['Gratis untuk program TPA & Kajian Fiqih','Subsidi tersedia bagi yang membutuhkan','Pengajar bersertifikat & bersanad'].map(t=>(
                                    <div key={t} className="cta-check"><CheckCircle size={14} color="var(--gold-light)" strokeWidth={2.5}/>{t}</div>
                                ))}
                            </div>
                            {auth.user
                                ? <Link href={route('dashboard')} className="btn-g">Lihat Program <ArrowRight size={15}/></Link>
                                : <Link href={route('register')} className="btn-g">Daftar Sekarang <ArrowRight size={15}/></Link>
                            }
                        </div>
                    </div>
                </div>
            </section>

            {/* PENGAJAR */}
            <section className="pj-sec" id="pengajar">
                <div className="pj-head reveal">
                    <div className="sk">Tim Pengajar</div>
                    <h2 className="sh">Dibimbing Para Ahli<br/><span className="g">yang Berpengalaman</span></h2>
                    <p className="sd">Seluruh pengajar LPQ Masjid Syuhada memiliki latar belakang pendidikan Al-Quran yang kuat dan bersanad.</p>
                </div>
                <div className="pj-grid">
                    {[
                        {i:'A',bg:'linear-gradient(135deg,#1e7545,#2ea060)',name:'Ust. Ahmad Fauzi',  role:'Kepala LPQ',           desc:'Hafizh 30 juz, lulusan Universitas Islam Madinah. 15 tahun mengajar tahfizh.',badges:['Hafizh 30 Juz','S1 Madinah']},
                        {i:'H',bg:'linear-gradient(135deg,#92400e,#b35a00)',name:'Ust. Hasan Basri',  role:'Pengajar Tahsin',       desc:'Spesialis ilmu tajwid dan tahsin, bersanad ke Syaikh Mahmud Khalil Al-Hushari.',badges:['Bersanad','Spesialis Tajwid']},
                        {i:'F',bg:'linear-gradient(135deg,#1e3a5f,#2a5a8c)',name:'Ustdzh. Fatimah',   role:'Pengajar Tahfizh Putri',desc:'Hafizhah 30 juz, lulusan Pesantren Tahfizh Putri Jogja. Spesialis halaqah putri.',badges:['Hafizhah 30 Juz','Putri']},
                        {i:'R',bg:'linear-gradient(135deg,#581c87,#7c3aed)',name:'Ust. Rizki Amanah', role:'Pengajar Tilawah',      desc:'Juara MTQ Nasional, spesialis tilawah maqamat. Aktif sebagai qori di berbagai acara.',badges:['Juara MTQ','Qori Nasional']},
                    ].map(p=>(
                        <div key={p.name} className="pj-card reveal">
                            <div className="pj-top" style={{background:p.bg}}><div className="pj-av" style={{background:p.bg}}>{p.i}</div></div>
                            <div className="pj-body">
                                <div className="pj-name">{p.name}</div>
                                <div className="pj-role">{p.role}</div>
                                <div className="pj-desc">{p.desc}</div>
                                <div className="pj-badges">{p.badges.map(b=><span key={b} className="pj-badge">{b}</span>)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONI */}
            <section className="testi-sec">
                <div className="testi-head reveal">
                    <div className="sk">Testimoni</div>
                    <h2 className="sh">Apa Kata Peserta</h2>
                </div>
                <div className="testi-grid">
                    {[
                        {a:'B',name:'Bapak Rahmat Hidayat',role:'Peserta Tahsin 2023',  txt:'Alhamdulillah, setelah ikut program tahsin di sini bacaan Al-Quran saya jauh lebih baik. Pengajarnya sabar dan metodologis. Sangat direkomendasikan!'},
                        {a:'I',name:'Ibu Siti Aminah',      role:'Peserta TPA',      txt:'Anak saya yang sebelumnya susah diajak belajar agama, sekarang semangat ke TPA. Dalam 6 bulan sudah bisa baca Iqro 4. Alhamdulillah.'},
                        {a:'M',name:'Muhammad Rizal',       role:'Peserta Tahfizh, 3 Juz',txt:"Program tahfizh di LPQ ini luar biasa. Dalam setahun berhasil menghafal 3 juz dengan muroja'ah yang terstruktur. Jazakumullahu khairan."},
                    ].map(t=>(
                        <div key={t.name} className="testi-card reveal">
                            <div className="testi-stars">{[...Array(5)].map((_,i)=><Star key={i} size={13} fill="#d4a435" color="#d4a435"/>)}</div>
                            <p className="testi-txt">{t.txt}</p>
                            <div className="testi-auth">
                                <div className="testi-av">{t.a}</div>
                                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-sec">
                <div className="faq-head reveal">
                    <div className="sk">FAQ</div>
                    <h2 className="sh">Pertanyaan yang Sering<br/>Ditanyakan</h2>
                    <p className="sd">Tidak menemukan jawaban? Hubungi kami langsung via WhatsApp.</p>
                </div>
                <div className="faq-grid">
                    {[
                        ['Berapa biaya pendaftaran program?','Biaya bervariasi tergantung program. TPA Anak dan Kajian Fiqih gratis. Program Tahsin dan Tahfizh mulai dari Rp150.000/bulan. Tersedia subsidi bagi yang membutuhkan.'],
                        ['Apakah ada program untuk dewasa pemula?','Tentu ada! Kami memiliki kelas khusus untuk dewasa pemula yang belajar dari dasar. Tidak perlu malu, banyak peserta dewasa memulai dari nol.'],
                        ['Bagaimana jadwal kegiatan belajar?','TPA anak sore hari Senin–Jumat. Kelas dewasa pagi/malam sesuai program. Detail jadwal diberikan setelah pendaftaran dikonfirmasi admin.'],
                        ['Apakah bisa daftar di tengah bulan?','Bisa. Penerimaan Peserta baru dibuka setiap saat selama kuota masih tersedia. Biaya dihitung proporsional sesuai tanggal masuk.'],
                        ['Apakah ada sertifikat setelah selesai program?','Ya, setiap peserta mendapat sertifikat resmi dari LPQ Masjid Syuhada. Program Tahfizh diberikan sertifikat per juz.'],
                        ['Bagaimana cara menghubungi panitia?','Via WhatsApp di nomor yang tertera di bagian lokasi, datang langsung ke sekretariat LPQ, atau DM Instagram @lpqsyuhada.'],
                    ].map(([q,a])=><FaqItem key={q} q={q} a={a}/>)}
                </div>
            </section>

            {/* LOKASI */}
            <section className="loc-sec" id="lokasi">
                <div className="loc-grid">
                    <div>
                        <div className="sk reveal">Lokasi</div>
                        <h2 className="sh reveal">Temukan Kami di<br/><span className="g">Masjid Syuhada</span></h2>
                        <p className="sd reveal">Masjid Syuhada adalah salah satu masjid bersejarah di Yogyakarta yang berdiri sejak 1952. Mudah dijangkau dari berbagai penjuru kota.</p>
                        <div className="loc-details reveal">
                            {[[MapPin,'Alamat','Jl. Sudirman No. 139, Kotabaru\nGondokusuman, Yogyakarta 55224'],[Clock,'Jam Operasional','Senin – Sabtu, 07.00 – 21.00 WIB'],[Phone,'WhatsApp','+62 812-2700-XXXX'],[Mail,'Email','lpq@masjidsyuhada.id']].map(([Icon,lbl,val])=>(
                                <div key={lbl} className="loc-row">
                                    <div className="loc-icon"><Icon size={16}/></div>
                                    <div><div className="loc-lbl">{lbl}</div><div className="loc-val" style={{whiteSpace:'pre-line'}}>{val}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="map-box reveal">
                        <div className="map-pin">
                            <div className="map-circle"><MapPin size={28} strokeWidth={1.5}/></div>
                            <div className="map-name">Masjid Syuhada</div>
                            <div className="map-addr">Jl. Sudirman No. 139, Yogyakarta</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="ft-grid">
                    <div>
                        <div className="ft-logo">
                            <div className="ft-emb">ق</div>
                            <div className="ft-name">LPQ Masjid Syuhada</div>
                        </div>
                        <p className="ft-desc">Lembaga Pendidikan Quran yang bernaung di bawah Masjid Syuhada Yogyakarta. Mencetak generasi Qurani sejak 1952.</p>
                        <div className="ft-socials">
                            {[[Instagram,'Instagram'],[Youtube,'YouTube'],[MessageCircle,'WhatsApp'],[Facebook,'Facebook']].map(([Icon,lbl])=>(
                                <a key={lbl} href="#" className="ft-social" aria-label={lbl}><Icon size={15}/></a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="ft-ct">Program</div>
                        <ul className="ft-links">
                            {['TPA Anak','Iqro & Dasar','Tahsin Al-Quran','Tahfizh Quran','Tilawah & Tartil','Kajian Fiqih'].map(p=>(
                                <li key={p}><a href="#program" onClick={e=>go(e,'#program')}>{p}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="ft-ct">Navigasi</div>
                        <ul className="ft-links">
                            {[['Tentang LPQ','#tentang'],['Tim Pengajar','#pengajar'],['Cara Daftar','#cara-daftar'],['Lokasi','#lokasi']].map(([lbl,href])=>(
                                <li key={lbl}><a href={href} onClick={e=>go(e,href)}>{lbl}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="ft-ct">Akun</div>
                        <ul className="ft-links">
                            {auth.user
                                ? <li><Link href={route('dashboard')}>Dashboard</Link></li>
                                : <><li><Link href={route('login')}>Masuk</Link></li><li><Link href={route('register')}>Daftar</Link></li></>
                            }
                            <li><a href="#cara-daftar" onClick={e=>go(e,'#cara-daftar')}>Cara Mendaftar</a></li>
                        </ul>
                    </div>
                </div>
                <div className="ft-bot">
                    <div>© {new Date().getFullYear()} LPQ Masjid Syuhada. Hak cipta dilindungi.</div>
                    <div className="ft-ar">بَارَكَ اللَّهُ فِيكُمْ</div>
                </div>
            </footer>
        </>
    );
}