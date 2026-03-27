# Sosyal Hak Rehberi – Dijital Sosyal Haklar Rehberlik Platformu

![Social Rights Guide](./public/assets/hero.jpg)

Frontend repository of **[https://sosyalhakrehberi.com/](https://sosyalhakrehberi.com/)**

Bireylerin Türkiye’deki sosyal haklarını anlamalarına ve bu haklara erişmelerine yardımcı olan kamu odaklı dijital platform.

* Website: [https://sosyalhakrehberi.com/](https://sosyalhakrehberi.com/)
* Instagram: [https://www.instagram.com/sosyalhizmet.danismanligi/](https://www.instagram.com/sosyalhizmet.danismanligi/)
* Contact: [info@sosyalhizmetdanismani.com](mailto:info@sosyalhizmetdanismani.com)

---

## 🌍 What is this?

Sosyal Hak Rehberi, sosyal hakları:

* anlaşılabilir
* erişilebilir
* uygulanabilir

hale getirmeyi amaçlayan bir rehberlik platformudur.

Kullanıcılara:

* hangi haklara sahip olabileceklerini anlamalarını sağlar
* karar mantığını açık şekilde gösterir
* doğru sonraki adımları sunar

> Bu platform resmi bir devlet sistemi değildir, yalnızca rehberlik sağlar.

---

## 🎯 Why it exists

Birçok birey:

* haklarını bilmez
* yanlış başvuru yapar
* karmaşık süreçleri yönetemez

Bu platform:

* hatalı başvuruları azaltmayı
* farkındalığı artırmayı
* rehberlik sağlamayı

aamaclar.

---

## 🌍 Social Impact & Context

Sosyal haklara erişim önemli bir problemdir.

Resmi veriler ve saha gözlemleri göstermektedir ki:

* milyonlarca kişi sosyal yardımlardan faydalanmaktadır
* başvuruların önemli kısmı eksik veya hatalıdır
* birçok hak sahibi birey rehberlik eksikliği nedeniyle haklarına ulaşamaz

Bu durum:

* kurumlarda iş yükü oluşturur
* başvuru süreçlerini uzatır
* vatandaşların hak kaybına yol açar

---

## 🎯 Mission

Bireylerin sosyal haklarını doğru anlamasını sağlayan açık, yapılandırılmış ve erişilebilir bir rehberlik sistemi sunmak.

---

## 🚀 Vision

Milyonlarca kullanıcıya ulaşan, ölçeklenebilir bir **Sosyal Hak İşletim Sistemi** oluşturmak.

---

## ⚖️ Public Value

Bu platform:

* bireyleri güçlendirir
* kamu kaynaklarına adil erişimi destekler
* vatandaş-kurum arasındaki sürtünmeyi azaltır

---

## ⚙️ How it works

1. Kullanıcı testi başlatır
2. Bilgilerini girer
3. Frontend backend’e gönderir
4. Backend değerlendirir
5. Frontend sonucu gösterir:

   * karar
   * açıklama
   * sonraki adımlar

---

## 🧩 Product Position

* socialrightlabs → backend karar motoru
* sosyalhakrehberi-web → frontend

Frontend:

* UX
* SEO
* yönlendirme

Backend:

* karar
* kural
* uygunluk hesaplama

---

## ❗ Core Principle

> Backend decides, frontend renders

Frontend:

* karar vermez
* eşik hesaplamaz
* kural içermez

---

## 🔍 Example Output

```json
{
  "decision": "eligible",
  "confidence": "high",
  "rule_trace": [
    "income_below_threshold"
  ],
  "next_step": "Apply via local office"
}
```

---

## 📈 Scaling and Sustainability

Each guided test triggers backend processing.

As usage grows:

* API load increases
* infrastructure cost increases

To sustain the platform, these layers must continue operating reliably:

* backend engine
* hosting
* development
* maintenance

---

## 💖 Supporting the Project

This is a public-benefit system.

Support helps us:

* keep it free
* improve quality
* reach more people

---

## 🤝 Contributing

Use Issues for:

* bugs
* policy updates
* improvements

---

## 💬 Community

Use Discussions for ideas and feedback.

---

# Technical Documentation

## Tech Stack

* Next.js
* React
* TypeScript

## Local Development

```bash
npm ci
npm run dev
```

---

## License

This repository is proprietary and distributed under an **All Rights Reserved** notice.
See [LICENSE](LICENSE).

