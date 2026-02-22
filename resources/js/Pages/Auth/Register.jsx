import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, BookOpen, GraduationCap, Leaf, CheckCircle } from 'lucide-react';

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
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}

/* LAYOUT */
.auth-page{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}

/* LEFT PANEL */
.auth-left{
  background:var(--green);padding:64px 56px;
  display:flex;flex-direction:column;justify-content:space-between;
  position:relative;overflow:hidden;
}
.auth-left::before{content:'';position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:rgba(255,255,255,0.04);border-radius:50%}
.auth-left::after{content:'';position:absolute;bottom:-60px;left:-60px;width:220px;height:220px;background:rgba(255,255,255,0.03);border-radius:50%}
.al-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}

.al-logo{display:flex;align-items:center;gap:14px;position:relative;z-index:1;text-decoration:none}
.al-emblem{width:48px;height:48px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:24px;color:var(--gold-light)}
.al-name{font-size:14px;font-weight:700;color:#fff;line-height:1.3}
.al-sub{font-size:11px;color:rgba(255,255,255,0.5)}

.al-content{position:relative;z-index:1}
.al-arabic{font-family:'Amiri',serif;font-size:2.2rem;color:var(--gold-light);direction:rtl;text-align:left;margin-bottom:16px;opacity:.9;line-height:1.5}
.al-heading{font-family:'Lora',serif;font-size:2rem;font-weight:700;color:#fff;line-height:1.25;margin-bottom:16px}
.al-desc{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.75;max-width:360px;margin-bottom:32px}

/* Feature list on left */
.al-features{display:flex;flex-direction:column;gap:14px}
.al-feat{display:flex;align-items:flex-start;gap:12px}
.al-feat-dot{width:28px;height:28px;min-width:28px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--gold-light);margin-top:1px}
.al-feat-text{font-size:13px;color:rgba(255,255,255,0.65);line-height:1.5}
.al-feat-text strong{color:#fff;font-weight:600}

.al-footer{position:relative;z-index:1}
.al-quote{font-family:'Amiri',serif;font-size:1rem;color:rgba(255,255,255,0.35);font-style:italic}

/* RIGHT PANEL */
.auth-right{
  display:flex;align-items:center;justify-content:center;
  padding:48px 40px;background:var(--cream);position:relative;
  overflow-y:auto;
}
.auth-right::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(15,76,42,0.03) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}

.auth-form-wrap{width:100%;max-width:420px;position:relative;z-index:1;padding:24px 0}

.af-header{margin-bottom:32px}
.af-kicker{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.af-kicker::after{content:'';display:inline-block;width:24px;height:1.5px;background:var(--gold);opacity:.5}
.af-title{font-family:'Lora',serif;font-size:2rem;font-weight:700;color:var(--text);letter-spacing:-.02em;margin-bottom:8px;line-height:1.2}
.af-sub{font-size:14px;color:var(--text-muted);line-height:1.6}

/* CARD */
.af-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--rlg);padding:36px;box-shadow:var(--sh-lg)}

/* FORM */
.af-form{display:flex;flex-direction:column;gap:18px}
.af-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.af-field{display:flex;flex-direction:column;gap:6px}
.af-label{font-size:13px;font-weight:600;color:var(--text)}
.af-input-wrap{position:relative}
.af-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-light);pointer-events:none}
.af-input-icon-r{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--text-light);cursor:pointer;border:none;background:none;padding:2px;transition:color .2s}
.af-input-icon-r:hover{color:var(--green)}
.af-input{
  width:100%;height:46px;padding:0 44px 0 42px;
  border:1.5px solid var(--border);border-radius:var(--rsm);
  font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);
  background:var(--cream);transition:border-color .2s,box-shadow .2s;outline:none;
}
.af-input.no-right-pad{padding-right:14px}
.af-input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(15,76,42,0.08);background:var(--surface)}
.af-input::placeholder{color:var(--text-light)}
.af-input.err{border-color:#ef4444}
.af-error{font-size:12px;color:#ef4444;margin-top:3px}

/* PASSWORD STRENGTH */
.pw-strength{margin-top:6px}
.pw-bars{display:flex;gap:4px;margin-bottom:4px}
.pw-bar{height:3px;flex:1;border-radius:2px;background:var(--cream-dark);transition:background .3s}
.pw-bar.w{background:#ef4444}
.pw-bar.m{background:var(--gold)}
.pw-bar.s{background:var(--green-light)}
.pw-bar.vs{background:var(--green)}
.pw-label{font-size:11px;color:var(--text-light)}

/* TERMS */
.af-terms{display:flex;align-items:flex-start;gap:10px}
.af-chk{
  width:18px;height:18px;min-width:18px;
  border:1.5px solid var(--border);border-radius:5px;
  appearance:none;cursor:pointer;background:var(--cream);
  transition:border-color .2s,background .2s;
  flex-shrink:0;position:relative;align-self:center;
}
.af-chk:checked{background:var(--green);border-color:var(--green)}
.af-chk:checked::after{
  content:'';
  position:absolute;
  left:50%;top:50%;
  width:10px;height:6px;
  border-left:2px solid #fff;
  border-bottom:2px solid #fff;
  transform:translate(-50%,-60%) rotate(-45deg);
}
.af-terms-lbl{font-size:12px;color:var(--text-muted);line-height:1.55}
.af-terms-lbl a{color:var(--green);font-weight:600;text-decoration:none}
.af-terms-lbl a:hover{text-decoration:underline}

/* BTN */
.af-btn{
  width:100%;height:48px;background:var(--green);color:#fff;
  border:none;border-radius:var(--rsm);
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 16px rgba(15,76,42,0.3);
  transition:transform .2s,box-shadow .2s;margin-top:4px;
}
.af-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(15,76,42,0.4)}
.af-btn:disabled{opacity:.65;cursor:not-allowed}

/* BOTTOM */
.af-bottom{text-align:center;margin-top:20px;font-size:13px;color:var(--text-muted)}
.af-link{color:var(--green);font-weight:600;text-decoration:none;transition:color .2s}
.af-link:hover{color:var(--green-mid);text-decoration:underline}

/* RESPONSIVE */
@media(max-width:900px){
  .auth-page{grid-template-columns:1fr}
  .auth-left{display:none}
  .auth-right{padding:32px 20px;min-height:100vh;align-items:flex-start;padding-top:48px}
  .af-card{padding:28px 24px}
}
@media(max-width:520px){
  .af-row{grid-template-columns:1fr}
  .af-title{font-size:1.6rem}
}
`;

function getStrength(pw) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}
const STRENGTH_LABELS = ['','Lemah','Cukup','Kuat','Sangat Kuat'];
const STRENGTH_CLASSES = ['','w','m','s','vs'];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [showCPw, setShowCPw] = useState(false);
    const strength = getStrength(data.password);

    useEffect(() => { return () => { reset('password', 'password_confirmation'); }; }, []);

    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <>
            <Head title="Daftar — LPQ Masjid Syuhada"/>
            <style>{style}</style>

            <div className="auth-page">
                {/* LEFT */}
                <div className="auth-left">
                    <div className="al-dots"/>
                    <a href="/" className="al-logo">
                        <div className="al-emblem">ق</div>
                        <div>
                            <div className="al-name">LPQ Masjid Syuhada</div>
                            <div className="al-sub">Lembaga Pendidikan Quran</div>
                        </div>
                    </a>

                    <div className="al-content">
                        <div className="al-arabic">وَمَنْ يَتَّقِ اللَّهَ</div>
                        <h2 className="al-heading">Mulai Perjalanan<br/>Qurani Anda</h2>
                        <p className="al-desc">Bergabunglah dengan 500+ santri yang telah merasakan manfaat belajar Al-Quran bersama kami.</p>
                        <div className="al-features">
                            {[
                                [BookOpen,    'Program beragam',    'dari Iqro, Tahsin, Tahfizh, hingga Kajian Fiqih'],
                                [GraduationCap,'Pengajar bersanad','semua pengajar memiliki sanad keilmuan yang jelas'],
                                [Leaf,        'Lingkungan masjid',  'belajar dalam suasana kondusif dan penuh berkah'],
                                [CheckCircle, 'Gratis & berbayar', 'beberapa program tersedia secara gratis untuk umum'],
                            ].map(([Icon, title, desc]) => (
                                <div key={title} className="al-feat">
                                    <div className="al-feat-dot"><Icon size={14} strokeWidth={1.8}/></div>
                                    <div className="al-feat-text"><strong>{title}</strong> — {desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="al-footer">
                        <div className="al-quote">بَارَكَ اللَّهُ فِيكُمْ — Semoga Allah memberkahi kalian</div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="auth-right">
                    <div className="auth-form-wrap">
                        <div className="af-header">
                            <div className="af-kicker">Buat Akun</div>
                            <h1 className="af-title">Daftar Sekarang</h1>
                            <p className="af-sub">Isi data di bawah untuk membuat akun dan mulai belajar Al-Quran.</p>
                        </div>

                        <div className="af-card">
                            <form onSubmit={submit} className="af-form">
                                {/* Name */}
                                <div className="af-field">
                                    <label className="af-label" htmlFor="name">Nama Lengkap</label>
                                    <div className="af-input-wrap">
                                        <span className="af-input-icon"><User size={16}/></span>
                                        <input
                                            id="name" type="text" className={`af-input no-right-pad${errors.name?' err':''}`}
                                            style={{paddingRight:'14px'}}
                                            value={data.name} onChange={e => setData('name', e.target.value)}
                                            placeholder="Nama lengkap Anda" required autoComplete="name"
                                        />
                                    </div>
                                    {errors.name && <div className="af-error">{errors.name}</div>}
                                </div>

                                {/* Email */}
                                <div className="af-field">
                                    <label className="af-label" htmlFor="email">Alamat Email</label>
                                    <div className="af-input-wrap">
                                        <span className="af-input-icon"><Mail size={16}/></span>
                                        <input
                                            id="email" type="email" className={`af-input no-right-pad${errors.email?' err':''}`}
                                            style={{paddingRight:'14px'}}
                                            value={data.email} onChange={e => setData('email', e.target.value)}
                                            placeholder="anda@email.com" required
                                        />
                                    </div>
                                    {errors.email && <div className="af-error">{errors.email}</div>}
                                </div>

                                {/* Password row */}
                                <div className="af-row">
                                    <div className="af-field">
                                        <label className="af-label" htmlFor="password">Kata Sandi</label>
                                        <div className="af-input-wrap">
                                            <span className="af-input-icon"><Lock size={16}/></span>
                                            <input
                                                id="password" type={showPw?'text':'password'}
                                                className={`af-input${errors.password?' err':''}`}
                                                value={data.password} onChange={e => setData('password', e.target.value)}
                                                placeholder="Min. 8 karakter" required
                                            />
                                            <button type="button" className="af-input-icon-r" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                                                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                                            </button>
                                        </div>
                                        {data.password && (
                                            <div className="pw-strength">
                                                <div className="pw-bars">
                                                    {[1,2,3,4].map(i => (
                                                        <div key={i} className={`pw-bar${strength>=i?' '+STRENGTH_CLASSES[strength]:''}`}/>
                                                    ))}
                                                </div>
                                                <div className="pw-label">{STRENGTH_LABELS[strength]}</div>
                                            </div>
                                        )}
                                        {errors.password && <div className="af-error">{errors.password}</div>}
                                    </div>

                                    <div className="af-field">
                                        <label className="af-label" htmlFor="pw2">Konfirmasi</label>
                                        <div className="af-input-wrap">
                                            <span className="af-input-icon"><Lock size={16}/></span>
                                            <input
                                                id="pw2" type={showCPw?'text':'password'}
                                                className="af-input"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi sandi" required
                                            />
                                            <button type="button" className="af-input-icon-r" onClick={() => setShowCPw(!showCPw)} tabIndex={-1}>
                                                {showCPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="af-terms">
                                    <input type="checkbox" id="terms" className="af-chk" required/>
                                    <label htmlFor="terms" className="af-terms-lbl">
                                        Saya menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> LPQ Masjid Syuhada
                                    </label>
                                </div>

                                <button type="submit" className="af-btn" disabled={processing}>
                                    {processing ? 'Membuat akun…' : <><span>Buat Akun</span><ArrowRight size={16}/></>}
                                </button>
                            </form>
                        </div>

                        <div className="af-bottom">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="af-link">Masuk di sini</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}