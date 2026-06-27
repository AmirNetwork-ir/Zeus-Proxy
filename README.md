
<div align="center">
  <img width="100%" alt="Zeus Panel Interface" src="https://github.com/user-attachments/assets/05e68294-0eed-41fd-9cdf-35ad4b6c140f" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);" />
  <br><br>
  <img width="100%" alt="Zeus Panel Status" src="https://github.com/user-attachments/assets/ae9c3c6b-a410-429d-b405-a5ff5dd27b5d" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);" />
  
  <br><br>

  <h1>⚡️ پنل مدیریت زئوس (Zeus Panel)</h1>
  <strong>سیستم یکپارچه و هوشمند مدیریت پروکسی بر بستر Cloudflare Workers</strong>

  <br><br>

  <p>
    <a href="https://github.com/IR-NETLIFY/zeus"><img src="https://img.shields.io/badge/Version-1.2.3-0052CC?style=for-the-badge&logo=semver&logoColor=white" alt="Version"></a>
    <a href="https://cloudflare.com"><img src="https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Platform"></a>
    <a href="https://t.me/IR_NETLIFY"><img src="https://img.shields.io/badge/Developer-IR__NETLIFY-00792D?style=for-the-badge&logo=telegram&logoColor=white" alt="Developer"></a>
  </p>
</div>

---

## 🌟 معرفی پلتفرم

**زئوس (Zeus)**، یک راهکار جامع، بهینه و پیشرفته جهت استقرار و مدیریت شبکه‌های ارتباطی مبتنی بر پروتکل `VLESS` بر روی زیرساخت پردازش ابری رایگان Cloudflare می‌باشد. 

هسته و ایده اولیه این سامانه برگرفته از پروژه قدرتمند [EasySNI](https://github.com/macan-dev/EasySNI) است؛ با این وجود، معماری فعلی پلتفرم به صورت بنیادین بازطراحی شده است. **توسعه، بهینه‌سازی، هوشمندسازی و پیاده‌سازی مکانیزم‌های خودکار در این نسخه، منحصراً توسط بنده (IR_NETLIFY) صورت پذیرفته است.**

---

## ✨ ویژگی‌ها و معماری سیستم

توسعه‌های اختصاصی صورت گرفته بر روی این پلتفرم، آن را به یکی از کامل‌ترین پنل‌های مدیریت تحت وب تبدیل کرده است:

* 🔄 <kbd><b>بروزرسانی درون‌برنامه‌ای (OTA)</b></kbd>
  <br> سیستم ارزیابی هوشمند که امکان دریافت و اعمال نسخه‌های جدید پنل را تنها با یک کلیک و بدون کوچکترین اختلال در پایگاه داده یا نشست کاربران فراهم می‌سازد.

* 📊 <kbd><b>مانیتورینگ و تحلیلگر ترافیک</b></kbd>
  <br> یکپارچه‌سازی مستقیم با `Cloudflare GraphQL API` جهت پایش لحظه‌ای و دقیق درخواست‌های مصرف‌شده (Requests) در قالب رابط کاربری گرافیکی.

* 👥 <kbd><b>مدیریت پیشرفته پایگاه داده (D1)</b></kbd>
  * تعریف دقیق محدودیت‌های حجمی (GB) و زمانی (روز) برای هر کاربر.
  * سیستم تغییر وضعیت خودکار (Active / Expired / Suspended).
  * ایجاد صفحات اختصاصی وضعیت (Status Page) مجهز به نمودارهای گرافیکی برای پایش حجم توسط خود کاربران.

* ⚙️ <kbd><b>پیکربندی سطح پایین پروکسی</b></kbd>
  * پشتیبانی کامل از تنظیمات `Fragment` (شامل پارامترهای Length و Interval).
  * قابلیت تخصیص شناسه‌های کاربری ثابت یا پویا (Clean IPs) به صورت مجزا برای هر کلاینت.
  * شبیه‌سازی و جعل اثر انگشت مرورگر (Browser Fingerprinting) شامل گزینه‌های `iOS`, `Chrome`, `Safari` و مقادیر تصادفی (Randomized).

* 🎨 <kbd><b>رابط کاربری و تجربه کاربری (UI/UX) مدرن</b></kbd>
  <br> بهره‌گیری از استانداردهای طراحی `Glassmorphism`، پشتیبانی یکپارچه از تم‌های تاریک/روشن (Dark/Light Mode) و انیمیشن‌های تعاملی.

---

## 🚀 راهنمای استقرار (Deployment)

فرآیند نصب و استقرار این پلتفرم به صورت **تمام‌خودکار (Zero-Touch)** طراحی شده است و نیازمند هیچ‌گونه دانش برنامه‌نویسی یا اجرای اسکریپت نمی‌باشد.

> 💡 **توجه:** تمامی مراحل ساخت Worker، پایگاه داده، اتصال دامنه‌ها و تزریق متغیرهای محیطی (Secrets) توسط ربات دیپلوی انجام می‌پذیرد.


 ### مراحل اجرا:

۱. **ورود به سایت دیپلوی:** ابتدا به سایت استقرار خودکار مراجعه نمایید:

<br>
<div align="center">
  <h2>🚀 <a href="https://zeus-panel.ir-netlify.workers.dev/"><b>ورود به سایت استقرار خودکار زئوس</b></a> 🚀</h2>
  <a href="https://zeus-panel.ir-netlify.workers.dev/"><img src="https://img.shields.io/badge/Deploy-Zeus_Panel-00792D?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Deploy Zeus"></a>
  <br><br>
  <a href="https://zeus-panel.ir-netlify.workers.dev/" dir="ltr"><b>https://zeus-panel.ir-netlify.workers.dev</b></a>
</div>
<br>

۲. **اخذ مجوز (Token):** بر روی گزینه **«دریافت توکن»** کلیک نمایید. این لینک شما را به پنل کلودفلر هدایت نموده تا دسترسی‌های امنیتی لازم (Permissions) جهت استقرار منابع ایجاد گردد. در انتهای صفحه باز شده، توکن را تایید و کپی کنید.

۳. **آغاز فرآیند:** توکن دریافت شده را در فیلد مربوطه در پورتال استقرار وارد نموده و گزینه **«ساخت پنل»** را انتخاب کنید.

۴. **اتمام و ورود:** پس از گذشت چند ثانیه و اتمام عملیات، لینک دسترسی به پنل مدیریت در اختیار شما قرار خواهد گرفت. (رمز عبور مدیریت در اولین ورود پیکربندی خواهد شد).

---

## 🔄 راهنمای به‌روزرسانی (Maintenance)

پلتفرم زئوس مجهز به سیستم هوشمند تشخیص نسخه است. 
جهت ارتقاء پنل به نسخه‌های جدیدتر، نیازی به استقرار مجدد منابع نمی‌باشد. کافیست از منوی فوقانی پنل مدیریت خود، بر روی نشانگر **«بررسی به‌روزرسانی»** کلیک نمایید. 
در صورت تایید، سیستم به صورت خودکار آخرین توابع و کدهای منبع را از این مخزن دریافت و جایگزین می‌نماید. پایگاه داده و پیکربندی کاربران کاملاً ایزوله و محفوظ باقی خواهند ماند.

---

## ⚖️ حقوق مادی و معنوی (Credits & Acknowledgement)

بدین‌وسیله از خالق هسته اولیه این پلتفرم قدردانی می‌گردد. ساختار فعلی، ماحصل توسعه و مهندسی مجدد بر پایه نسخه پایه می‌باشد:

* 🏗 **طراح و توسعه‌دهنده هسته اولیه:** [Macan-dev](https://github.com/macan-dev/EasySNI) (پشتیبانی نسخه پایه: [@EzAccess1](https://t.me/EzAccess1))
* 🛠 **توسعه، بازطراحی، هوشمندسازی و برنامه‌نویسی پلتفرم زئوس:** بنده، **[IR_NETLIFY](https://t.me/IR_NETLIFY)**

<br>

<div align="center">
  <blockquote>
    <i>توسعه یافته جهت تضمین ارتباطات پایدار و دسترسی آزاد به اطلاعات. ✌️</i>
  </blockquote>
</div>
