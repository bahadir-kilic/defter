# 📓 Defter (Scriptor) — Doğal El Yazısı & Taktil Not Defteri

> **"Klavye hızında yaz, ekranda yaşayan gerçek bir analog defter hissi yaşa."**

Defter (Scriptor), geleneksel dijital not editörlerinin (Notion, Google Docs vb.) soğuk, steril ve mekanik havasından sıkılanlar için geliştirilmiş, dokunsal (tactile) bir el yazısı çalışma alanıdır. Klavyenin hızından ödün vermeden, mürekkep ve kağıt estetiğini ekrana taşır.

---

## ✨ Öne Çıkan Özellikler

### 1. ✍️ Klavye Hızında Organik El Yazısı Deneyimi
- **Gecikmesiz Yazım:** Tuş gecikmesi (typing lag) olmadan dakikada 80+ kelime hızıyla akıcı yazım.
- **Akıllı Satır Kilitleme (Baseline Grid Lock):** Yazı boyutu değiştiğinde defter çizgileri pikseli pikseline yeniden hizalanır; harfler havada asılı kalmaz, tam çizginin üzerine oturur.
- **Defter Marjini:** Sol taraftaki kırmızı kılavuz çizgisinin tam arkasından başlayan doğal sayfa düzeni.
- **Mürekkep Lif Efekti (Ink Bleed):** Kağıt dokusuna nüfuz eden doğal mürekkep dağılması ve gölgelendirmesi.

### 2. 📚 Çoklu Defterler & Taktil Cilt Tasarımları
- **Sıcak Deri Cilt (Moleskine):** Dikişli kenarlar ve altın varak kabartma efekti.
- **Gümüş Spiral Kolej Defteri:** Çift halkalı metal spiral delikleri ve öğrenci defteri hissi.
- **Adaçayı Keten Kumaş:** Üstten sarkan nostaljik kumaş kurdele ayraç.
- **Retro Kraft Karton:** Taslak ve nostaljik eskiz defteri estetiği.
- **Mat Siyah Lüks:** Minimalist yönetici defteri.

### 3. 📄 Sayfa Yönetimi & Otomatik Sayfalama (Auto Page-Break)
- Sayfalar arası geçiş: `[ < Sayfa 1 / 3 > ]`
- Tek tıkla yeni sayfa açma veya silme.
- Sayfa taştığında otomatik algılama ve yazıyı kesintisiz yeni sayfaya aktarma.

### 4. 🎨 Kişiselleştirme & Ayarlar Alanı
- **10 Farklı El Yazısı Tipi:** Caveat (Türkçe), Kalam (Tükenmez), Marck Script (Dolma Kalem), Patrick Hand, Shadows Into Light, Indie Flower, Architects Daughter, vb.
- **Gerçekçi Mürekkep Tonları:** Dolma Kalem Mavisi, Pilot Jel Siyahı, Lamy Gece Mavisi, Vintage Sepya, Zümrüt Yeşili, Bordo, Kurşun Kalem ve Dahili Özel Renk Seçici (Color Picker).
- **6 Kağıt Zemini:** Çizgili, Sarı Amerikan Hukuk Defteri (Legal Pad), Noktalı (Bullet Journal), Kareli, Krem Moleskine ve Vintage Parşömen.

### 5. ✨ Dahili AI Edebi Asistan (Co-Writer & Marginalia)
- **Düşünceyi Devam Ettir (Co-Writer):** Yazarın atmosferini bozmadan sonraki paragrafı el yazısıyla üretir.
- **Edebi Günlüğe Çevir (Journalize):** Dağınık notları sıcak, edebi bir günlüğe dönüştürür.
- **Kenar Notu & İlham (Marginalia):** Sayfa kenarına el çizimi havasında zekice notlar iliştirir.
- **Çift Motor:** İsteğe bağlı Google Gemini 1.5 API entegrasyonu veya sıfır kurulumla çalışan yerleşik yaratıcı motor.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda **http://localhost:5173** adresini açın.

---

## 🛠️ Teknoloji Yığını
- **Frontend:** React 19, Vite
- **Stil & Tipografi:** Tailwind CSS, Google Fonts OpenType
- **İkonlar:** Lucide React
- **Yapay Zeka:** Gemini 1.5 Flash & Yerleşik Yaratıcı Motor
- **Veri Saklama:** LocalStorage Persistence

---

## 🗺️ Yol Haritası & Moat Vizyonu
- [x] Çoklu Defter & Kitaplık
- [x] Dokunsal Cilt & Spiral Efektleri
- [x] Otomatik Sayfalama
- [x] Scriptor AI Co-Writer & Kenar Notları
- [ ] **One-Shot Handwriting Clone:** Kullanıcının kağıda yazdığı 1 paragraftan kişisel el yazısını klonlayan AI motoru.
- [ ] **ASMR Ses Motoru:** Mekanik klavye ve kağıt üzerinde dolma kalem hışırtısı.
- [ ] **Polaroid / Masaüstü Defter Dışa Aktarma:** Sosyal medya paylaşımları için yüksek çözünürlüklü perspektif görsel çıktısı.
