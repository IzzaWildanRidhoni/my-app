import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Link } from '@inertiajs/react';
import { BookOpen, MapPin, User, Calendar, DollarSign, CreditCard } from 'lucide-react';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export default function KelasForm({ data, setData, errors, processing, onSubmit, mode = 'create', backRoute }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-3">
                {/* LEFT - Main Info */}
                <div className="lg:col-span-2 space-y-5">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BookOpen className="h-4 w-4" /> Informasi Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="nama_kelas">Nama Kelas <span className="text-destructive">*</span></Label>
                                <Input id="nama_kelas" value={data.nama_kelas} onChange={e => setData('nama_kelas', e.target.value)} placeholder="Contoh: Kelas Memasak Dasar" className="mt-1" />
                                <FieldError message={errors.nama_kelas} />
                            </div>
                            <div>
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea id="deskripsi" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} placeholder="Deskripsi singkat kelas..." rows={3} className="mt-1" />
                                <FieldError message={errors.deskripsi} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="lokasi">Lokasi</Label>
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="lokasi" value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} placeholder="Gedung A, Lantai 2" className="pl-9" />
                                    </div>
                                    <FieldError message={errors.lokasi} />
                                </div>
                                <div>
                                    <Label htmlFor="pengajar">Pengajar</Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="pengajar" value={data.pengajar} onChange={e => setData('pengajar', e.target.value)} placeholder="Nama pengajar..." className="pl-9" />
                                    </div>
                                    <FieldError message={errors.pengajar} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" /> Jadwal & Kuota
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                    <Input id="tanggal_mulai" type="date" value={data.tanggal_mulai} onChange={e => setData('tanggal_mulai', e.target.value)} className="mt-1" />
                                    <FieldError message={errors.tanggal_mulai} />
                                </div>
                                <div>
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                    <Input id="tanggal_selesai" type="date" value={data.tanggal_selesai} onChange={e => setData('tanggal_selesai', e.target.value)} className="mt-1" />
                                    <FieldError message={errors.tanggal_selesai} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="kuota">Kuota Peserta <span className="text-muted-foreground text-xs">(kosongkan = tidak terbatas)</span></Label>
                                <Input id="kuota" type="number" min="1" value={data.kuota} onChange={e => setData('kuota', e.target.value)} placeholder="Contoh: 30" className="mt-1" />
                                <FieldError message={errors.kuota} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT - Settings */}
                <div className="space-y-5">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Pengaturan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tipe Kelas <span className="text-destructive">*</span></Label>
                                <Select value={data.tipe} onValueChange={v => setData('tipe', v)}>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="event">Event (sekali)</SelectItem>
                                        <SelectItem value="rutin">Rutin (berkala)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.tipe} />
                            </div>
                            <div>
                                <Label>Status <span className="text-destructive">*</span></Label>
                                <Select value={data.status} onValueChange={v => setData('status', v)}>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.status} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4" /> Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="biaya">Biaya (Rp) <span className="text-destructive">*</span></Label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="biaya" type="number" min="0" value={data.biaya} onChange={e => setData('biaya', e.target.value)} placeholder="0" className="pl-9" />
                                </div>
                                <FieldError message={errors.biaya} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="text-sm font-medium">Wajib Bayar</p>
                                    <p className="text-xs text-muted-foreground">Peserta harus upload bukti</p>
                                </div>
                                <Switch
                                    checked={!!data.perlu_pembayaran}
                                    onCheckedChange={v => setData('perlu_pembayaran', v)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2">
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Menyimpan...' : mode === 'create' ? 'Tambah Kelas' : 'Simpan Perubahan'}
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link href={backRoute}>Batal</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}