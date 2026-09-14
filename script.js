// هالة للسياحة والأسفار — إعدادات التواصل
const WHATSAPP_NUMBER = "213561935285"; // استبدل هذا الرقم برقم الواتساب الحقيقي
const PHONE_NUMBER = "+213561935285";    // استبدل هذا الرقم برقم الوكالة الحقيقي

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const defaultMessage = "السلام عليكم، أريد الاستفسار عن عروض العمرة لدى وكالة هالة للسياحة والأسفار.";

document.getElementById("mainWhatsapp")?.setAttribute("href", whatsappUrl(defaultMessage));
document.getElementById("floatingWhatsapp")?.setAttribute("href", whatsappUrl(defaultMessage));
document.getElementById("octoberWhatsapp")?.setAttribute("href", whatsappUrl("السلام عليكم، أريد الاستفسار عن أسعار شهر أكتوبر (البرنامج الأول أو الثاني)."));

document.querySelectorAll(".whatsapp-offer").forEach(btn => {
  const offer = btn.dataset.offer || "عرض العمرة";
  btn.setAttribute("href", whatsappUrl(`السلام عليكم، أريد الاستفسار عن: ${offer}`));
});

document.getElementById("mainPhone")?.setAttribute("href", `tel:${PHONE_NUMBER}`);
const footerPhone = document.getElementById("footerPhone");
if (footerPhone) { footerPhone.href = `tel:${PHONE_NUMBER}`; footerPhone.textContent = PHONE_NUMBER; }

document.getElementById("year").textContent = new Date().getFullYear();

const top = document.getElementById("backTop");
window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 500));
top.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  navItems.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
});
