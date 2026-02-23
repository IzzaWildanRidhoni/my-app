import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users, BookOpen, ClipboardList, CreditCard, TrendingUp,
    AlertCircle, CheckCircle2, Clock, XCircle, ChevronRight,
    Wallet, Calendar, MapPin, BarChart3, PieChart, Activity,
    UserCheck, Landmark
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const COLORS = {
    emerald: '#10b981',
    blue:    '#3b82f6',
    amber:   '#f59e0b',
    red:     '#ef4444',
    purple:  '#8b5cf6',
    slate:   '#64748b',
};

const PIE_COLORS = [COLORS.emerald, COLORS.amber, COLORS.red, COLORS.blue, COLORS.purple];

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald', href }) {
    const colorMap = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        blue:    'bg-blue-50 text-blue-700 border-blue-200',
        amber:   'bg-amber-50 text-amber-700 border-amber-200',
        red:     'bg-red-50 text-red-700 border-red-200',
        purple:  'bg-purple-50 text-purple-700 border-purple-200',
        slate:   'bg-slate-50 text-slate-700 border-slate-200',
    };

    const card = (
        <Card className={`border transition-shadow hover:shadow-md ${href ? 'cursor-pointer' : ''}`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
                        <p className="text-2xl font-bold truncate">{value}</p>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colorMap[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, rupiah = false }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="rounded-lg border bg-white shadow-lg p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground mb-1">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-medium">{rupiah ? formatRupiah(p.value) : p.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

const statusBayarCfg = {
    belum_bayar:         { label: 'Belum Bayar',       icon: XCircle,      cls: 'text-red-600 bg-red-50 border-red-200' },
    menunggu_verifikasi: { label: 'Menunggu',          icon: Clock,        cls: 'text-amber-600 bg-amber-50 border-amber-200' },
    lunas:               { label: 'Lunas',             icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    ditolak:             { label: 'Ditolak',           icon: XCircle,      cls: 'text-red-600 bg-red-50 border-red-200' },
};
const statusCfg = {
    pending:  { label: 'Pending',  cls: 'text-amber-600 bg-amber-50 border-amber-200' },
    diterima: { label: 'Diterima', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    ditolak:  { label: 'Ditolak',  cls: 'text-red-600 bg-red-50 border-red-200' },
    batal:    { label: 'Batal',    cls: 'text-slate-600 bg-slate-50 border-slate-200' },
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

function AdminDashboard({ stats }) {
    const ov = stats.overview || {};

    // Normalize data chart
    const pendaftaranData = (stats.pendaftaran_bulanan || []).map(d => ({
        name:  d.label,
        Daftar: Number(d.total),
        Lunas:  Number(d.lunas),
    }));

    const pendapatanData = (stats.pendapatan_bulanan || []).map(d => ({
        name:  d.label,
        Pendapatan: Number(d.total),
    }));

    const pesertaData = (stats.peserta_baru || []).map(d => ({
        name:  d.label,
        Peserta: Number(d.total),
    }));

    // Pie status pendaftaran
    const statusLabels = { pending: 'Pending', diterima: 'Diterima', ditolak: 'Ditolak', batal: 'Batal' };
    const statusData = (stats.status_pendaftaran || []).map(d => ({
        name:  statusLabels[d.status] || d.status,
        value: Number(d.total),
    }));

    // Top kelas — bar chart
    const topKelasData = (stats.top_kelas || []).map(d => ({
        name:    d.nama_kelas.length > 18 ? d.nama_kelas.slice(0, 18) + '…' : d.nama_kelas,
        Peserta: Number(d.jumlah_peserta),
    }));

    return (
        <div className="space-y-6">

            {/* ── Stat Cards Row 1 ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Peserta"
                    value={ov.total_peserta ?? 0}
                    subtitle="Terdaftar di sistem"
                    icon={Users}
                    color="blue"
                    href={route('admin.peserta.index')}
                />
                <StatCard
                    title="Kelas Aktif"
                    value={`${ov.kelas_aktif ?? 0} / ${ov.total_kelas ?? 0}`}
                    subtitle="Dari total kelas"
                    icon={BookOpen}
                    color="emerald"
                    href={route('admin.kelas.index')}
                />
                <StatCard
                    title="Menunggu Verifikasi"
                    value={ov.menunggu_verifikasi ?? 0}
                    subtitle="Bukti pembayaran"
                    icon={Clock}
                    color="amber"
                    href={route('admin.pembayaran-kelas.index')}
                />
                <StatCard
                    title="Total Pendapatan"
                    value={formatRupiah(ov.total_pendapatan)}
                    subtitle="Pembayaran diterima"
                    icon={Wallet}
                    color="purple"
                />
            </div>

            {/* ── Stat Cards Row 2 ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Pendaftaran"
                    value={ov.total_pendaftaran ?? 0}
                    subtitle="Semua status"
                    icon={ClipboardList}
                    color="slate"
                    href={route('admin.pendaftaran-kelas.index')}
                />
                <StatCard
                    title="Pendaftaran Lunas"
                    value={ov.total_lunas ?? 0}
                    subtitle="Pembayaran dikonfirmasi"
                    icon={CheckCircle2}
                    color="emerald"
                />
                <StatCard
                    title="Bukti Menunggu"
                    value={ov.bukti_menunggu ?? 0}
                    subtitle="Perlu tindakan admin"
                    icon={AlertCircle}
                    color="red"
                    href={route('admin.pembayaran-kelas.index')}
                />
                <StatCard
                    title="Total Users"
                    value={stats.total_users ?? 0}
                    subtitle={`${stats.total_roles} roles · ${stats.total_permissions} permissions`}
                    icon={UserCheck}
                    color="blue"
                    href={route('admin.users.index')}
                />
            </div>

            {/* ── Charts Row 1 ── */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* Line: Pendaftaran Bulanan */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            Pendaftaran 6 Bulan Terakhir
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendaftaranData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={pendaftaranData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Line type="monotone" dataKey="Daftar" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Lunas" stroke={COLORS.emerald} strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart label="Belum ada data pendaftaran" />
                        )}
                    </CardContent>
                </Card>

                {/* Pie: Status Pendaftaran */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-blue-600" />
                            Status Pendaftaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <RechartsPie>
                                        <Pie
                                            data={statusData}
                                            cx="50%" cy="50%"
                                            innerRadius={45} outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {statusData.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPie>
                                </ResponsiveContainer>
                                <div className="mt-2 space-y-1.5">
                                    {statusData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                {d.name}
                                            </div>
                                            <span className="font-semibold">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyChart label="Belum ada data" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Charts Row 2 ── */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Bar: Pendapatan Bulanan */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                            Pendapatan Bulanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendapatanData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={pendapatanData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                                    <Tooltip content={<CustomTooltip rupiah />} />
                                    <Bar dataKey="Pendapatan" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart label="Belum ada pendapatan tercatat" />
                        )}
                    </CardContent>
                </Card>

                {/* Bar: Top Kelas */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-600" />
                            Top 5 Kelas Terpopuler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topKelasData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={topKelasData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="Peserta" fill={COLORS.emerald} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart label="Belum ada data kelas" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bar: Peserta Baru */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Peserta Baru per Bulan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pesertaData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={pesertaData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="Peserta" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart label="Belum ada data peserta baru" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// USER DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

function UserDashboard({ stats }) {
    if (!stats.has_peserta) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Users className="h-12 w-12 opacity-20 mb-3" />
                    <p className="font-medium text-sm">Profil peserta belum ada</p>
                    <p className="text-xs mt-1">Hubungi admin untuk melengkapi data Anda.</p>
                    <Button className="mt-4" asChild>
                        <Link href={route('user.kelas.index')}>Lihat Jadwal Kelas</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const ov = stats.overview || {};
    const peserta = stats.peserta || {};

    // Pie chart status bayar
    const bayarLabels = {
        belum_bayar:         'Belum Bayar',
        menunggu_verifikasi: 'Menunggu',
        lunas:               'Lunas',
        ditolak:             'Ditolak',
    };
    const pieData = (stats.status_bayar || []).map(d => ({
        name:  bayarLabels[d.status] || d.status,
        value: Number(d.total),
    }));

    return (
        <div className="space-y-6">

            {/* Greeting */}
            <div className="rounded-xl border bg-gradient-to-r from-emerald-50 to-white p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-lg font-bold">Halo, {peserta.nama}! 👋</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Berikut ringkasan aktivitas kelas Anda.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href={route('user.kelas.index')}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Cari Kelas
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Daftar"
                    value={ov.total_daftar ?? 0}
                    subtitle="Semua kelas"
                    icon={ClipboardList}
                    color="blue"
                    href={route('user.pendaftaran.index')}
                />
                <StatCard
                    title="Kelas Lunas"
                    value={ov.lunas ?? 0}
                    subtitle="Pembayaran dikonfirmasi"
                    icon={CheckCircle2}
                    color="emerald"
                />
                <StatCard
                    title="Menunggu Verifikasi"
                    value={ov.menunggu_verifikasi ?? 0}
                    subtitle="Bukti dikirim"
                    icon={Clock}
                    color="amber"
                />
                <StatCard
                    title="Kelas Tersedia"
                    value={stats.kelas_tersedia ?? 0}
                    subtitle="Bisa didaftarkan"
                    icon={BookOpen}
                    color="purple"
                    href={route('user.kelas.index')}
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">

                {/* Riwayat Pendaftaran */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-600" />
                                Pendaftaran Terbaru
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                <Link href={route('user.pendaftaran.index')}>
                                    Semua <ChevronRight className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {(stats.riwayat || []).length === 0 ? (
                            <div className="flex flex-col items-center py-10 text-muted-foreground">
                                <ClipboardList className="h-8 w-8 opacity-20 mb-2" />
                                <p className="text-xs">Belum ada pendaftaran</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {stats.riwayat.map((r) => {
                                    const sc  = statusCfg[r.status]     || statusCfg.pending;
                                    const bc  = statusBayarCfg[r.status_pembayaran] || statusBayarCfg.belum_bayar;
                                    const BcIcon = bc.icon;
                                    return (
                                        <Link key={r.id} href={route('user.pendaftaran.show', r.id)}>
                                            <div className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{r.nama_kelas}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${sc.cls}`}>
                                                            {sc.label}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${bc.cls}`}>
                                                            <BcIcon className="h-3 w-3" /> {bc.label}
                                                        </span>
                                                    </div>
                                                    {r.tanggal_mulai && (
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" /> {formatDate(r.tanggal_mulai)}
                                                            {r.lokasi && <><MapPin className="h-3 w-3 ml-1" /> {r.lokasi}</>}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs font-semibold">
                                                        {r.kelas_biaya > 0 ? formatRupiah(r.kelas_biaya) : (
                                                            <span className="text-emerald-600">Gratis</span>
                                                        )}
                                                    </p>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie: Status Pembayaran */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-600" />
                            Status Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <RechartsPie>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="50%"
                                            innerRadius={45} outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPie>
                                </ResponsiveContainer>
                                <div className="mt-2 space-y-1.5">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                {d.name}
                                            </div>
                                            <span className="font-semibold">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyChart label="Belum ada pendaftaran" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Belum bayar alert */}
            {(ov.belum_bayar > 0) && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div className="flex-1 text-sm">
                        <span className="font-semibold text-amber-800">
                            {ov.belum_bayar} pendaftaran belum dibayar.
                        </span>{' '}
                        <span className="text-amber-700">Upload bukti pembayaran agar segera diverifikasi.</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0" asChild>
                        <Link href={route('user.pendaftaran.index')}>Lihat</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Empty Chart Placeholder ──────────────────────────────────────────────────

function EmptyChart({ label }) {
    return (
        <div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground">
            <BarChart3 className="h-8 w-8 opacity-20 mb-2" />
            <p className="text-xs">{label}</p>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function Dashboard({ stats, userRole }) {
    const isAdmin = userRole === 'admin';

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            {isAdmin ? 'Ringkasan data seluruh sistem' : 'Aktivitas kelas Anda'}
                        </p>
                    </div>
                    <Badge variant={isAdmin ? 'default' : 'secondary'} className="capitalize text-xs px-3 py-1">
                        {userRole}
                    </Badge>
                </div>

                {/* Content */}
                {isAdmin
                    ? <AdminDashboard stats={stats} />
                    : <UserDashboard stats={stats} />
                }
            </div>
        </AuthenticatedLayout>
    );
}