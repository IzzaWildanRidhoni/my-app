import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Moon } from 'lucide-react';
import { useState } from 'react';

const style = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --green:#0f4c2a;--green-mid:#1e7545;--green-light:#2ea060;--green-pale:#e8f5ed;
  --gold:#b8840c;--gold-light:#d4a435;--gold-pale:#fdf3dc;
  --cream:#fafaf7;--cream-dark:#f2f0e8;--surface:#fff;
  --text:#111418;--text-muted:#5c6370;--text-light:#8b939f;
  --border:rgba(0,0,0,0.09);--border-gold:rgba(184,132,12,0.2);
  --sh-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --sh-md:0 4px 16px rgba(0,0,0,0.08),0 2px 6px rgba(0,0,0,0.04);
  --sh-lg:0 24px 64px rgba(0,0,0,0.1),0 8px 24px rgba(0,0,0,0.06);
  --sh-g:0 20px 60px rgba(15,76,42,0.22);
  --r:14px;--rlg:22px;--rxl:32px;--rsm:8px;
}

html,body{min-height:100%}
body{
  font-family:'DM Sans',sans-serif;
  background:var(--cream);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
  display:flex;flex-direction:column;
}

/* ── LAYOUT ── */
.auth-page{
  min-height:100vh;display:grid;grid-template-columns:1fr 1fr;
}

/* LEFT PANEL */
.auth-left{
  background:var(--green);
  padding:64px 56px;
  display:flex;flex-direction:column;justify-content:space-between;
  position:relative;overflow:hidden;
}
.auth-left::before{content:'';position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:rgba(255,255,255,0.04);border-radius:50%}
.auth-left::after{content:'';position:absolute;bottom:-60px;left:-60px;width:220px;height:220px;background:rgba(255,255,255,0.03);border-radius:50%}
.auth-left-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}

.al-logo{display:flex;align-items:center;gap:14px;position:relative;z-index:1;text-decoration:none}
.al-emblem{width:48px;height:48px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:24px;color:var(--gold-light)}
.al-brand{line-height:1.3}
.al-name{font-size:14px;font-weight:700;color:#fff}
.al-sub{font-size:11px;color:rgba(255,255,255,0.5)}

.al-content{position:relative;z-index:1}
.al-arabic{font-family:'Amiri',serif;font-size:2.4rem;color:var(--gold-light);direction:rtl;text-align:left;margin-bottom:16px;opacity:.9;line-height:1.5}
.al-heading{font-family:'Lora',serif;font-size:2rem;font-weight:700;color:#fff;line-height:1.25;margin-bottom:16px}
.al-desc{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.75;max-width:360px}
.al-stats{display:flex;gap:28px;margin-top:36px}
.al-stat-num{font-family:'Lora',serif;font-size:1.5rem;font-weight:700;color:var(--gold-light);display:block;line-height:1}
.al-stat-lbl{font-size:11px;color:rgba(255,255,255,0.45);margin-top:3px}

.al-footer{position:relative;z-index:1}
.al-quote{font-family:'Amiri',serif;font-size:1rem;color:rgba(255,255,255,0.35);font-style:italic}

/* RIGHT PANEL */
.auth-right{
  display:flex;align-items:center;justify-content:center;
  padding:48px 40px;
  background:var(--cream);
  position:relative;
}
.auth-right::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(15,76,42,0.03) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}

.auth-form-wrap{width:100%;max-width:400px;position:relative;z-index:1}

.af-header{margin-bottom:36px}
.af-kicker{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.af-kicker::after{content:'';display:inline-block;width:24px;height:1.5px;background:var(--gold);opacity:.5}
.af-title{font-family:'Lora',serif;font-size:2rem;font-weight:700;color:var(--text);letter-spacing:-.02em;margin-bottom:8px;line-height:1.2}
.af-sub{font-size:14px;color:var(--text-muted);line-height:1.6}

/* CARD */
.af-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--rlg);
  padding:36px;
  box-shadow:var(--sh-lg);
}

/* STATUS */
.af-status{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--rsm);padding:12px 16px;font-size:13px;color:#15803d;margin-bottom:24px;display:flex;align-items:center;gap:8px}

/* FORM */
.af-form{display:flex;flex-direction:column;gap:20px}
.af-field{display:flex;flex-direction:column;gap:6px}
.af-label{font-size:13px;font-weight:600;color:var(--text)}
.af-label-row{display:flex;align-items:center;justify-content:space-between}
.af-forgot{font-size:12px;color:var(--text-muted);text-decoration:none;transition:color .2s}
.af-forgot:hover{color:var(--green)}
.af-input-wrap{position:relative}
.af-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-light);pointer-events:none}
.af-input-icon-right{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--text-light);cursor:pointer;border:none;background:none;padding:2px;transition:color .2s}
.af-input-icon-right:hover{color:var(--green)}
.af-input{
  width:100%;height:46px;
  padding:0 44px 0 42px;
  border:1.5px solid var(--border);
  border-radius:var(--rsm);
  font-family:'DM Sans',sans-serif;
  font-size:14px;color:var(--text);
  background:var(--cream);
  transition:border-color .2s,box-shadow .2s;
  outline:none;
}
.af-input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(15,76,42,0.08);background:var(--surface)}
.af-input::placeholder{color:var(--text-light)}
.af-input.err{border-color:#ef4444}
.af-error{font-size:12px;color:#ef4444;margin-top:4px}

/* REMEMBER */
.af-remember{display:flex;align-items:center;gap:10px}
.af-checkbox{
  width:18px;height:18px;border:1.5px solid var(--border);border-radius:5px;
  appearance:none;cursor:pointer;background:var(--cream);
  display:flex;align-items:center;justify-content:center;
  transition:border-color .2s,background .2s;flex-shrink:0;
  position:relative;
}
.af-checkbox:checked{background:var(--green);border-color:var(--green)}
.af-checkbox:checked::after{content:'';position:absolute;width:10px;height:6px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px)}
.af-remember-lbl{font-size:13px;color:var(--text-muted);cursor:pointer}

/* SUBMIT BTN */
.af-btn{
  width:100%;height:48px;
  background:var(--green);color:#fff;
  border:none;border-radius:var(--rsm);
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 16px rgba(15,76,42,0.3);
  transition:transform .2s,box-shadow .2s,background .2s;
  margin-top:4px;
}
.af-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(15,76,42,0.4)}
.af-btn:disabled{opacity:.65;cursor:not-allowed}

/* DIVIDER */
.af-divider{display:flex;align-items:center;gap:12px;margin:4px 0}
.af-divider::before,.af-divider::after{content:'';flex:1;height:1px;background:var(--border)}
.af-divider span{font-size:12px;color:var(--text-light)}

/* BOTTOM LINK */
.af-bottom{text-align:center;margin-top:20px;font-size:13px;color:var(--text-muted)}
.af-link{color:var(--green);font-weight:600;text-decoration:none;transition:color .2s}
.af-link:hover{color:var(--green-mid);text-decoration:underline}

/* MOBILE */
@media(max-width:900px){
  .auth-page{grid-template-columns:1fr}
  .auth-left{display:none}
  .auth-right{padding:32px 20px;min-height:100vh}
  .af-card{padding:28px 24px}
}
@media(max-width:480px){
  .af-title{font-size:1.6rem}
}
`;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });
    const [showPw, setShowPw] = useState(false);

    useEffect(() => { return () => { reset('password'); }; }, []);

    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <>
            <Head title="Masuk — LPQ Masjid Syuhada"/>
            <style>{style}</style>

            <div className="auth-page">
                {/* LEFT PANEL */}
                <div className="auth-left">
                    <div className="auth-left-dots"/>
                    <a href="/" className="al-logo">
                        <div className="al-emblem">ق</div>
                        <div className="al-brand">
                            <div className="al-name">LPQ Masjid Syuhada</div>
                            <div className="al-sub">Lembaga Pendidikan Quran</div>
                        </div>
                    </a>

                    <div className="al-content">
                        <div className="al-arabic">اِقْرَأْ بِاسْمِ رَبِّكَ</div>
                        <h2 className="al-heading">Selamat Datang<br/>Kembali</h2>
                        <p className="al-desc">Lanjutkan perjalanan belajar Al-Quran Anda bersama ratusan santri di LPQ Masjid Syuhada Yogyakarta.</p>
                        <div className="al-stats">
                            {[['500+','Santri Aktif'],['20+','Pengajar'],['15+','Tahun Berdiri']].map(([n,l]) => (
                                <div key={l}>
                                    <span className="al-stat-num">{n}</span>
                                    <div className="al-stat-lbl">{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="al-footer">
                        <div className="al-quote">بَارَكَ اللَّهُ فِيكُمْ — Semoga Allah memberkahi kalian</div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="auth-right">
                    <div className="auth-form-wrap">
                        <div className="af-header">
                            <div className="af-kicker">Masuk Akun</div>
                            <h1 className="af-title">Selamat Datang</h1>
                            <p className="af-sub">Masuk untuk melanjutkan belajar Al-Quran bersama kami.</p>
                        </div>

                        <div className="af-card">
                            {status && (
                                <div className="af-status">
                                    <span>✓</span> {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="af-form">
                                {/* Email */}
                                <div className="af-field">
                                    <label className="af-label" htmlFor="email">Alamat Email</label>
                                    <div className="af-input-wrap">
                                        <span className="af-input-icon"><Mail size={16}/></span>
                                        <input
                                            id="email" type="email" className={`af-input${errors.email?' err':''}`}
                                            value={data.email} onChange={e => setData('email', e.target.value)}
                                            placeholder="anda@email.com" required autoComplete="username"
                                        />
                                    </div>
                                    {errors.email && <div className="af-error">{errors.email}</div>}
                                </div>

                                {/* Password */}
                                <div className="af-field">
                                    <div className="af-label-row">
                                        <label className="af-label" htmlFor="password">Kata Sandi</label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="af-forgot">Lupa kata sandi?</Link>
                                        )}
                                    </div>
                                    <div className="af-input-wrap">
                                        <span className="af-input-icon"><Lock size={16}/></span>
                                        <input
                                            id="password" type={showPw ? 'text' : 'password'}
                                            className={`af-input${errors.password?' err':''}`}
                                            value={data.password} onChange={e => setData('password', e.target.value)}
                                            placeholder="••••••••" required autoComplete="current-password"
                                        />
                                        <button type="button" className="af-input-icon-right" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                                            {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                    {errors.password && <div className="af-error">{errors.password}</div>}
                                </div>

                                {/* Remember */}
                                <div className="af-remember">
                                    <input
                                        type="checkbox" id="remember" className="af-checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                    />
                                    <label htmlFor="remember" className="af-remember-lbl">Ingat saya di perangkat ini</label>
                                </div>

                                <button type="submit" className="af-btn" disabled={processing}>
                                    {processing ? 'Sedang masuk…' : <><span>Masuk</span><ArrowRight size={16}/></>}
                                </button>
                            </form>
                        </div>

                        <div className="af-bottom">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="af-link">Daftar sekarang</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}