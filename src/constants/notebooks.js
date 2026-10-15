export const COVER_STYLES = [
  {
    id: 'leather-brown',
    name: 'Sıcak Deri Cilt',
    category: 'Klasik',
    bgClass: 'bg-gradient-to-br from-[#4a2e1b] via-[#3a2010] to-[#271408]',
    borderClass: 'border-[#5e3b23]',
    textureClass: 'border-l-8 border-l-[#1f0e04] shadow-2xl',
    accent: '#D4AF37', // Gold foil
    spineType: 'leather',
    tag: 'Moleskine Estetiği'
  },
  {
    id: 'leather-navy',
    name: 'Gece Mavisi Deri',
    category: 'Klasik',
    bgClass: 'bg-gradient-to-br from-[#13273e] via-[#0b1726] to-[#060c14]',
    borderClass: 'border-[#1e3957]',
    textureClass: 'border-l-8 border-l-[#050a10] shadow-2xl',
    accent: '#C0C0C0', // Silver foil
    spineType: 'leather',
    tag: 'Yönetici Defteri'
  },
  {
    id: 'spiral-wire',
    name: 'Gümüş Spiral Kolej',
    category: 'Spiral',
    bgClass: 'bg-gradient-to-br from-[#2c3e50] to-[#1a252f]',
    borderClass: 'border-[#34495e]',
    textureClass: 'shadow-2xl',
    accent: '#38bdf8',
    spineType: 'spiral',
    tag: 'Öğrenci & Çalışma'
  },
  {
    id: 'linen-sage',
    name: 'Adaçayı Keten Kumaş',
    category: 'Kumaş',
    bgClass: 'bg-gradient-to-br from-[#3d5a45] via-[#2d4233] to-[#1c2b20]',
    borderClass: 'border-[#4e7057]',
    textureClass: 'border-l-6 border-l-[#16221a] shadow-2xl',
    accent: '#E2E8F0',
    spineType: 'ribbon',
    tag: 'Doğal & Dingin'
  },
  {
    id: 'vintage-kraft',
    name: 'Retro Kraft Karton',
    category: 'Nostaljik',
    bgClass: 'bg-gradient-to-br from-[#b08968] via-[#936639] to-[#7f5539]',
    borderClass: 'border-[#ddb892]',
    textureClass: 'border-l-6 border-l-[#582f0e] shadow-2xl',
    accent: '#FDF0D5',
    spineType: 'tape',
    tag: 'Eskiz & Taslak'
  },
  {
    id: 'noir-matte',
    name: 'Mat Siyah Lüks',
    category: 'Modern',
    bgClass: 'bg-gradient-to-br from-[#1f1f23] via-[#141416] to-[#09090a]',
    borderClass: 'border-[#333338]',
    textureClass: 'border-l-8 border-l-[#000000] shadow-2xl',
    accent: '#E11D48',
    spineType: 'minimal',
    tag: 'Minimalist & Gizemli'
  }
];

export const INITIAL_NOTEBOOKS = [
  {
    id: 'nb-journal',
    title: 'Kişisel Günlük & Düşünceler',
    subtitle: 'Sabah sayfaları ve serbest akış',
    coverId: 'leather-brown',
    paperId: 'ruled',
    fontId: 'caveat',
    fontSize: 26,
    inkColor: '#1d4ed8',
    createdAt: '2026-10-15',
    pages: [
      {
        id: 'p-1',
        title: 'İlk Sayfa — Başlangıç',
        date: '15 Ekim 2026',
        content: `15 Ekim, Gece Yarısı

Bugün klavyenin o soğuk, standart fontlarından kaçıp kendime sakin bir köşe açtım. Parmaklarım tuşlara hızla basarken, ekranda harflerin mürekkeple deftere dökülüşünü izlemek büyüleyici bir dinginlik veriyor.

Zihnimdeki dağınık düşünceleri toplamak için bazen sadece sıcak bir kağıt dokusuna ve dolma kalem hissi veren bir el yazısına ihtiyaç duyuyorsun.

Yapılacaklar & Notlar:
- Kahveyi tazelemek
- Düşünceleri özgürce satırlara dökmek
- Hız ile estetiğin buluştuğu anların tadını çıkarmak...`
      },
      {
        id: 'p-2',
        title: 'Sayfa 2 — Yaratıcı Fikirler',
        date: '15 Ekim 2026',
        content: `Yaratıcı Yazı Masası & Proje Notları:

1. Dijital dünyada analog hissi yakalamak neden bu kadar etkileyici?
Çünkü insan zihni mekanik piksellerden ziyade dokunsal (tactile) şeylerle bağ kuruyor.

2. Geleceğin araçları nasıl olmalı?
Yüksek teknolojiyi gizleyen, kullanıcıya sadece samimi ve organik bir deneyim sunan yazılımlar kazanacak.`
      }
    ],
    activePageIndex: 0
  },
  {
    id: 'nb-ideas',
    title: 'Fikirler & Eskiz Defteri',
    subtitle: 'Projeler, mimari ve planlar',
    coverId: 'spiral-wire',
    paperId: 'dots',
    fontId: 'kalam',
    fontSize: 24,
    inkColor: '#18181b',
    createdAt: '2026-10-15',
    pages: [
      {
        id: 'p-ideas-1',
        title: 'Proje Yol Haritası',
        date: '15 Ekim 2026',
        content: `Scriptor — Proje Vizyonu & Moat Stratejisi

- Hedef: Klavye hızında el yazısı estetiği sunan dünya çapında lider çalışma alanı.
- Temel Fark: Stylus zorunluluğu yok, sıkıcı PDF dönüştürücülerden bağımsız.

AI Destekli Büyüme Stratejisi:
* Kendi el yazını klonlama motoru
* Dağınık notları edebi günlüğe çeviren Co-Writer
* Organik kenar notları ve el çizimi krokiler`
      }
    ],
    activePageIndex: 0
  }
];
