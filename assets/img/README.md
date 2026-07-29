# Görseller

Sitedeki her görsel yuvası "koy ve çalışsın" mantığıyla kurulu.
Dosyayı doğru adla bu klasöre koyduğunuzda otomatik görünür; **kod
değişikliği gerekmez**. Dosya yoksa `assets/js/main.js` içindeki
`initPhotoSlots()` `<img>` etiketini kaldırır ve altındaki SVG çizim
görünür kalır — kırık görsel ikonu asla çıkmaz.

## 1. Anasayfa kahraman görseli

| Dosya | Oran | Önerilen boyut |
|---|---|---|
| `hero.jpg` | 5:4 | 1600 × 1280 px |

Aracı ortalayın; alt %20'lik şeride "2 yıl garanti" kutusu biniyor.

## 2. Model ve proje kartları → `models/` klasörü

Hepsi **4:3**, önerilen **1200 × 900 px**, 250 KB altı.

### Satış — sıfır (`satis.html`)
| Dosya | Kart |
|---|---|
| `models/primavera-125.jpg` | Primavera 125 |
| `models/primavera-150.jpg` | Primavera 150 *(anasayfada da kullanılır)* |
| `models/sprint-150.jpg` | Sprint S 150 |
| `models/gts-super-300.jpg` | GTS Super 300 *(anasayfada da kullanılır)* |
| `models/gtv-300.jpg` | GTV 300 |
| `models/elettrica.jpg` | Elettrica 70 *(anasayfada da kullanılır)* |

### Satış — ikinci el (`satis.html`)
| Dosya | Kart |
|---|---|
| `models/used-gts-300-2022.jpg` | 2022 GTS 300 |
| `models/used-primavera-150-2021.jpg` | 2021 Primavera 150 |
| `models/used-sprint-125-2019.jpg` | 2019 Sprint 125 |

### Modifiye projeleri (`modifiye.html`)
| Dosya | Kart |
|---|---|
| `models/proje-px150-restomod.jpg` | "Nispetiye" PX 150 |
| `models/proje-gts300-gece-yarisi.jpg` | "Gece Yarısı" GTS 300 |
| `models/proje-primavera-salvia.jpg` | "Salvia" Primavera |

Anasayfadaki üç vitrin kartı satış görselleriyle aynı dosyaları
kullanır — bir kez koyduğunuzda iki sayfada birden görünür.

## 3. Logo

| Dosya | Kullanım |
|---|---|
| `logo-motoetiler.png` | Açık tema başlık (koyu mürekkep) |
| `logo-motoetiler-light.png` | Koyu tema başlık + alt bilgi (beyaz) |

Tabela fotoğrafından çıkarıldı; kaynak 468 px genişliğinde olduğu için
**başlık boyutunda nettir ama baskıya veya büyük kullanıma uygun
değildir.** Tabelacınızdaki vektör orijinal (AI / EPS / SVG) varsa
onunla değiştirin.

## Instagram'dan fotoğraf almak

Instagram giriş yapmamış istemcilere fotoğrafları vermiyor. En kolay yol:

1. instagram.com'da giriş yapın, gönderiyi açın
2. **⋯ → İndir** *(veya telefondaki galeriden orijinali alın)*
3. Yukarıdaki adla bu klasöre kaydedin

Gönderi bağlantısı verirseniz (`instagram.com/p/XXXX/`) görseli çıkarıp
kırpma işini yapabiliriz — bkz. `tools/ig-photo.py`.

**Not:** Reel/video gönderilerinin kapak görselinde oynat düğmesi gömülü
gelir. Site için normal **fotoğraf** gönderilerini tercih edin.

## Telif

Yalnızca size ait veya kullanım hakkına sahip olduğunuz fotoğrafları koyun.
