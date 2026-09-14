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

const backToTopBtn = document.getElementById("backTop");
window.addEventListener("scroll", () => backToTopBtn?.classList.toggle("show", window.scrollY > 500));
backToTopBtn?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

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

// ================= قائمة تجهيز حقيبة العمرة التفاعلية =================
const CHECKLIST_STORAGE_KEY = "hala_umrah_checklist_v1";

const DEFAULT_CHECKLIST_ITEMS = [
  {
    id: "passport",
    title: "جواز السفر البيومتري (Passports)",
    desc: "جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر مع توفير نسخ ورقية ورقمية احتياطية.",
    category: "documents",
    completed: false,
    essential: true
  },
  {
    id: "vaccination",
    title: "شهادة التلقيح والدفتر الصحي (Vaccination Certificate)",
    desc: "شهادة التطعيم ضد الحمى الشوكية (المننجيت) واللقاحات المطلوبة رسميًا للدخول.",
    category: "documents",
    completed: false,
    essential: true
  },
  {
    id: "visa-tickets",
    title: "تأشيرة العمرة وتذاكر الطيران",
    desc: "تأشيرة العمرة المعتمدة وتذاكر الطيران المباشر مع الخطوط السعودية من وهران إلى المدينة.",
    category: "documents",
    completed: false,
    essential: true
  },
  {
    id: "id-copies",
    title: "صور شمسية وبطاقة الهوية الوطنية",
    desc: "صور شخصية حديثة بخلفية بيضاء وبطاقة التعريف الوطنية تحسباً لأي إجراءات.",
    category: "documents",
    completed: false,
    essential: false
  },
  {
    id: "ihram-clothes",
    title: "لباس الإحرام (Ihram Clothes)",
    desc: "إزار ورداء قطني أبيض غير مخيط للرجال / لباس شرعي مريح وساتر وخفيف للنساء.",
    category: "ihram",
    completed: false,
    essential: true
  },
  {
    id: "ihram-belt",
    title: "حزام الإحرام ومحفظة الأمان",
    desc: "حزام لتثبيت الإزار مع جيوب بسحاب لحفظ النقود والهاتف ومفتاح الغرفة.",
    category: "ihram",
    completed: false,
    essential: false
  },
  {
    id: "comfortable-shoes",
    title: "حذاء مريح وخف للطواف والسعي",
    desc: "نعل مريح وخفيف بدون خياطة للمحرم، بالإضافة إلى حذاء للمشي وشبشب للوضوء.",
    category: "ihram",
    completed: false,
    essential: false
  },
  {
    id: "ihram-pins",
    title: "مشابك تثبيت وسوار الوكالة",
    desc: "مشابك آمنة لتثبيت الرداء أثناء الحركة، وسوار المعصم التعريفي الخاص بوكالة هالة.",
    category: "ihram",
    completed: false,
    essential: false
  },
  {
    id: "unscented-toiletries",
    title: "صابون وشامبو غير معطر",
    desc: "مستلزمات نظافة شخصية خالية تماماً من العطور ومناسبة لفترة الإحرام الشرعية.",
    category: "health",
    completed: false,
    essential: true
  },
  {
    id: "personal-meds",
    title: "الأدوية الشخصية والمسكنات",
    desc: "الأدوية المزمنة مع الوصفة الطبية، مسكنات الآلام والصداع، مراهم التسلخات وفيتامينات.",
    category: "health",
    completed: false,
    essential: true
  },
  {
    id: "scissors-umbrella",
    title: "مقص الحلق ومظلة شمسية خفيفة",
    desc: "مقص صغير لتقصير الشعر بعد الفراغ من السعي، مظلة واقية من الشمس وقارورة ماء.",
    category: "health",
    completed: false,
    essential: false
  },
  {
    id: "umrah-guide",
    title: "كتيب صفة العمرة والأدعية",
    desc: "كتيب الخطوات الشرعية للعمرة من الإحرام إلى التحلل مع الأدعية المأثورة.",
    category: "spiritual",
    completed: false,
    essential: true
  },
  {
    id: "prayer-mat",
    title: "سجادة صلاة خفيفة ومسبحة",
    desc: "سجادة جيب سهلة الحمل للصلاة في ساحات الحرمين المفتوحة ومسبحة إلكترونية.",
    category: "spiritual",
    completed: false,
    essential: false
  },
  {
    id: "duas-list",
    title: "قائمة أدعية الأهل والأحباب",
    desc: "دفتر لتسجيل دعوات الأهل والأقارب للذكر والتضرع في الكعبة المشرفة والروضة الشريفة.",
    category: "spiritual",
    completed: false,
    essential: false
  }
];

const CATEGORY_NAMES = {
  documents: "وثائق رسمية",
  ihram: "إحرام وملابس",
  health: "صحة ونظافة",
  spiritual: "أدعية وروحانيات",
  custom: "أغراض خاصة"
};

let checklistItems = [];
let currentFilter = "all";

function loadChecklist() {
  try {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (saved) {
      checklistItems = JSON.parse(saved);
      // Ensure essential user items are present if user had an older cache
      const hasPassport = checklistItems.some(i => i.id === "passport" || i.title.includes("جواز"));
      const hasVaccination = checklistItems.some(i => i.id === "vaccination" || i.title.includes("تلقيح"));
      const hasIhram = checklistItems.some(i => i.id === "ihram-clothes" || i.title.includes("إحرام"));
      if (!hasPassport || !hasVaccination || !hasIhram) {
        checklistItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
        saveChecklist();
      }
    } else {
      checklistItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
      saveChecklist();
    }
  } catch (e) {
    checklistItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
  }
}

function saveChecklist() {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklistItems));
  } catch (e) {
    console.warn("Unable to save checklist to localStorage", e);
  }
}

function updateChecklistStats() {
  const total = checklistItems.length;
  const completed = checklistItems.filter(i => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const completedCountEl = document.getElementById("completedCount");
  const totalCountEl = document.getElementById("totalCount");
  const percentTextEl = document.getElementById("percentText");
  const progressBarFillEl = document.getElementById("progressBarFill");
  const progressBarTrackEl = document.getElementById("progressBarTrack");
  const badgeEl = document.getElementById("checklistBadge");
  const statusNoteEl = document.getElementById("checklistStatusNote");
  const completionBannerEl = document.getElementById("completionBanner");
  const countAllEl = document.getElementById("countAll");

  if (completedCountEl) completedCountEl.textContent = completed;
  if (totalCountEl) totalCountEl.textContent = total;
  if (percentTextEl) percentTextEl.textContent = `${percent}%`;
  if (countAllEl) countAllEl.textContent = total;

  if (progressBarFillEl) {
    progressBarFillEl.style.width = `${percent}%`;
  }
  if (progressBarTrackEl) {
    progressBarTrackEl.setAttribute("aria-valuenow", percent);
  }

  if (badgeEl) {
    if (percent === 100 && total > 0) {
      badgeEl.textContent = "✓ اكتمل التجهيز بالكامل";
      badgeEl.classList.add("all-done");
    } else if (percent >= 50) {
      badgeEl.textContent = "⚡ في منتصف التجهيز";
      badgeEl.classList.remove("all-done");
    } else {
      badgeEl.textContent = "قيد التجهيز";
      badgeEl.classList.remove("all-done");
    }
  }

  if (statusNoteEl) {
    if (percent === 100 && total > 0) {
      statusNoteEl.textContent = "أحسنت! جميع بنود السفر ووثائق العمرة جاهزة.";
    } else {
      const remaining = total - completed;
      statusNoteEl.textContent = `متبقي ${remaining} بند لإتمام تجهيز حقيبة سفرك بالكامل.`;
    }
  }

  if (completionBannerEl) {
    completionBannerEl.style.display = (percent === 100 && total > 0) ? "flex" : "none";
  }
}

function renderChecklistItems() {
  const container = document.getElementById("checklistItemsList");
  if (!container) return;

  const filtered = checklistItems.filter(item => {
    if (currentFilter === "all") return true;
    return item.category === currentFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="checklist-empty-state">
        لا توجد عناصر في هذا التصنيف حالياً. يمكنك إضافة بنودك الخاصة من النموذج أدناه.
      </div>
    `;
    updateChecklistStats();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isCustom = item.id.startsWith("custom_");
    const categoryName = CATEGORY_NAMES[item.category] || "عام";
    return `
      <div class="check-item ${item.completed ? "completed" : ""}" data-id="${item.id}" tabindex="0" role="checkbox" aria-checked="${item.completed}">
        <input type="checkbox" id="chk_${item.id}" ${item.completed ? "checked" : ""} aria-hidden="true" tabindex="-1">
        <div class="custom-checkbox">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="item-content">
          <span class="item-label">${item.title}</span>
          ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ""}
          <div class="item-meta">
            <span class="category-tag">${categoryName}</span>
            ${item.essential ? `<span class="highlight-tag">ضروري ومؤكد</span>` : ""}
          </div>
        </div>
        ${isCustom ? `<button type="button" class="btn-delete-item" data-delete="${item.id}" title="حذف هذا الغرض" aria-label="حذف">✕</button>` : ""}
      </div>
    `;
  }).join("");

  updateChecklistStats();

  // Attach event handlers
  container.querySelectorAll(".check-item").forEach(itemEl => {
    const id = itemEl.dataset.id;

    // Toggle on click
    itemEl.addEventListener("click", (e) => {
      if (e.target.closest(".btn-delete-item")) return;
      toggleItem(id);
    });

    // Keyboard support (Space / Enter)
    itemEl.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleItem(id);
      }
    });
  });

  // Delete custom item buttons
  container.querySelectorAll(".btn-delete-item").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.delete;
      deleteCustomItem(id);
    });
  });
}

function toggleItem(id) {
  const item = checklistItems.find(i => i.id === id);
  if (!item) return;
  item.completed = !item.completed;
  saveChecklist();
  renderChecklistItems();
}

function deleteCustomItem(id) {
  checklistItems = checklistItems.filter(i => i.id !== id);
  saveChecklist();
  renderChecklistItems();
}

// Filter Tabs
const checklistTabs = document.querySelectorAll(".check-tab");
checklistTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    checklistTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter || "all";
    renderChecklistItems();
  });
});

// Add Item Form
const addItemForm = document.getElementById("addItemForm");
if (addItemForm) {
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("customItemInput");
    const categorySelect = document.getElementById("customItemCategory");
    const title = input?.value.trim();
    if (!title) return;

    const newItem = {
      id: "custom_" + Date.now(),
      title: title,
      desc: "غرض شخصي مضاف من قبل المعتمر.",
      category: categorySelect ? categorySelect.value : "custom",
      completed: false,
      essential: false
    };

    checklistItems.push(newItem);
    saveChecklist();
    input.value = "";
    renderChecklistItems();
  });
}

// Reset Checklist
const btnReset = document.getElementById("btnResetChecklist");
btnReset?.addEventListener("click", () => {
  if (confirm("هل ترغب في إعادة ضبط القائمة وإلغاء تحديد البنود؟")) {
    checklistItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item, completed: false }));
    saveChecklist();
    renderChecklistItems();
  }
});

// Print Checklist
const btnPrint = document.getElementById("btnPrintChecklist");
btnPrint?.addEventListener("click", () => {
  window.print();
});

// Share via WhatsApp
const btnShareWhatsapp = document.getElementById("btnShareWhatsapp");
btnShareWhatsapp?.addEventListener("click", () => {
  const total = checklistItems.length;
  const completed = checklistItems.filter(i => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const pendingItems = checklistItems.filter(i => !i.completed).map(i => `• ${i.title}`).slice(0, 5).join("\n");
  let message = `السلام عليكم وكالة هالة للسياحة،\nأنا بصدد تحضير حقيبة العمرة عبر موقعكم:\n- نسبة الجاهزية: ${percent}% (${completed}/${total} بند).\n`;
  if (pendingItems) {
    message += `\nأريد الاستفسار عن بعض الترتيبات المتعلقة بالرحلة:\n${pendingItems}`;
  } else {
    message += `\nالحمد لله أتممت تحضير جميع الوثائق وملابس الإحرام، أود تأكيد موعد اللقاء في مطار وهران.`;
  }
  
  window.open(whatsappUrl(message), "_blank");
});

// Initialize Checklist
loadChecklist();
renderChecklistItems();

// ================= مزارات مكة والمدينة التفاعلية =================
const LANDMARKS_STORAGE_KEY = "hala_planned_landmarks_v1";

const RELIGIOUS_LANDMARKS = [
  {
    id: "ghar-hira",
    name: "غار حراء وجبل النور",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "موقع نبوي وتاريخي",
    desc: "الغار الذي كان يتعبد فيه النبي ﷺ قبل البعثة، وفيه هبط أمين الوحي جبريل عليه السلام بأول آيات القرآن الكريم (اقرأ باسم ربك الذي خلق).",
    tip: "يفضل الصعود في الصباح الباكر أو بعد العصر تجنباً لحرارة الشمس، مع انتعال حذاء مريح وأخذ ماء كافٍ.",
    duration: "ساعتان إلى 3 ساعات"
  },
  {
    id: "ghar-thawr",
    name: "غار ثور وجبل ثور",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "موقع نبوي وتاريخي",
    desc: "الغار الشريف الذي اختبأ فيه النبي ﷺ وصاحبه أبو بكر الصديق رضي الله عنه ثلاث ليالٍ خلال رحلة الهجرة النبوية المباركة.",
    tip: "الجبل صخري وشاهق؛ يكتفي أغلب الزوار بزيارة سفحه والاطلاع على المعرض الثقافي التعريفي المخصص للحدث.",
    duration: "ساعة ونصف"
  },
  {
    id: "arafat-rahmah",
    name: "جبل الرحمة وصعيد عرفات",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "مشاعر مقدسة",
    desc: "ركن الحج الأعظم الذي يقف عليه ضيوف الرحمن يوم التاسع من ذي الحجة، ويتوسطه جبل الرحمة حيث خطب النبي ﷺ خطبة الوداع.",
    tip: "تتيح حافلات وكالة هالة جولة مريحة للتوقف عند الصعيد والدعاء واستحضار عظمة اليوم المشهود.",
    duration: "ساعة واحدة"
  },
  {
    id: "mina-muzdalifah",
    name: "مشعر منى ومزدلفة",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "مشاعر مقدسة",
    desc: "أكبر مدينة خيام في العالم وموقع رمي الجمرات ومسجد الخيف العريق ومزدلفة التي يبيت فيها الحجيج بعد الإفاضة من عرفة.",
    tip: "جولة بانورامية وتثقيفية بالباص مع شروحات دينية وتاريخية مفصلة من مرشد الرحلة.",
    duration: "45 دقيقة"
  },
  {
    id: "masjid-taneem",
    name: "مسجد التنعيم (مسجد السيدة عائشة)",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "مساجد ومواقيت",
    desc: "ميقات أهل مكة لمن أراد تجديد الإحرام لعمرة تطوعية، وهو المكان الذي أحرمت منه أم المؤمنين عائشة رضي الله عنها بأمر النبي ﷺ.",
    tip: "يقع على بعد نحو 7 كم شمال المسجد الحرام وتتوفر به مواضئ ومرافق مجهزة على مدار الساعة.",
    duration: "45 دقيقة"
  },
  {
    id: "jannat-al-muala",
    name: "مقبرة المعلاة (جنة المعلاة)",
    city: "makkah",
    cityName: "مكة المكرمة",
    category: "معالم تاريخية",
    desc: "المقبرة المكية التاريخية التي تضم ثرى أم المؤمنين خديجة بنت خويلد رضي الله عنها، وجد النبي ﷺ عبد المطلب، وعدد من الصحابة.",
    tip: "تقع بالقرب من الحرم المكي الشريف، والزيارة مخصصة للرجال للسلام والدعاء والاعتبار.",
    duration: "30 دقيقة"
  },
  {
    id: "masjid-quba",
    name: "مسجد قباء بالمدينة المنورة",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "مساجد ومواقيت",
    desc: "أول مسجد أُسس على التقوى في الإسلام، وقد قال فيه النبي ﷺ: «من تطهر في بيته ثم أتى مسجد قباء فصلى فيه صلاة كان له كأجر عمرة».",
    tip: "مربوط بالممشى المضاء الرابط بالحرم النبوي الشريف؛ يستحب الذهاب صباحاً وصلاة ركعتين فيه.",
    duration: "ساعة واحدة"
  },
  {
    id: "mount-uhud",
    name: "جبل أحد ومقبرة الشهداء",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "موقع نبوي وتاريخي",
    desc: "الجبل الذي قال فيه النبي ﷺ: «أحد جبل يحبنا ونحبه»، ويضم جبل الرماة ومرقد سيدنا حمزة بن عبد المطلب وسائر شهداء الغزوة.",
    tip: "فرصة للصعود على جبل الرماة، استشعار أحداث غزوة أحد، والسلام على الشهداء بآداب الزيارة الشرعية.",
    duration: "ساعة ونصف"
  },
  {
    id: "masjid-qiblatayn",
    name: "مسجد القبلتين",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "مساجد ومواقيت",
    desc: "المسجد الذي شهد الحدث التاريخي العظيم بتحويل القبلة من بيت المقدس إلى الكعبة المشرفة بمكة أثناء صلاة الظهر بأمر الله تعالى.",
    tip: "مسجد فسيح بتصميم معماري إسلامي بديع، يضم معارض تعريفية ومرافق استقبال متطورة.",
    duration: "45 دقيقة"
  },
  {
    id: "baqi-al-gharqad",
    name: "مقبرة بقيع الغرقد",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "معالم تاريخية",
    desc: "المقبرة المجاورة مباشرة للمسجد النبوي الشريف، وتضم قبور أكثر من عشرة آلاف صحابي جليل وآل بيت النبي الأطهار وأمهات المؤمنين.",
    tip: "تفتح أبوابها للرجال يومياً بعد صلاتي الفجر والعصر مباشرة للسلام والترحم والاتعاظ.",
    duration: "30 دقيقة"
  },
  {
    id: "khandaq-seven-mosques",
    name: "موقع الخندق والمساجد السبعة",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "موقع نبوي وتاريخي",
    desc: "الميدان التاريخي لغزوة الأحزاب (الخندق) وسفح جبل سلع، حيث رابط الصحابة الكرام وصمدوا بقيادة رسول الله ﷺ دفاعاً عن المدينة.",
    tip: "تضم الساحة حديقة ثقافية ومسجد الفتح التاريخي مع لوحات إرشادية تشرح تفاصيل الغزوة.",
    duration: "ساعة واحدة"
  },
  {
    id: "wells-ghars",
    name: "بئر غرس وبئر عذق النبوية",
    city: "madinah",
    cityName: "المدينة المنورة",
    category: "مواقع تاريخية نبوية",
    desc: "آبار تاريخية ارتبطت بالسيرة العطرة، حيث كان النبي ﷺ يستطيب ماءها ويتوضأ منها، وأوصى بأن يغسل بسبع قرب من بئر غرس بعد وفاته.",
    tip: "تمت تهيئتها حديثاً بمسارات مخصصة للزوار وحدائق نخيل تعيد للأذهان أجواء السيرة النبوية.",
    duration: "45 دقيقة"
  }
];

let plannedLandmarkIds = new Set();
let currentLandmarkCity = "all";
let landmarkSearchQuery = "";

function loadPlannedLandmarks() {
  try {
    const saved = localStorage.getItem(LANDMARKS_STORAGE_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      plannedLandmarkIds = new Set(arr);
    }
  } catch (e) {
    plannedLandmarkIds = new Set();
  }
}

function savePlannedLandmarks() {
  try {
    localStorage.setItem(LANDMARKS_STORAGE_KEY, JSON.stringify([...plannedLandmarkIds]));
  } catch (e) {
    console.warn("Could not save planned landmarks", e);
  }
}

function togglePlanLandmark(id) {
  if (plannedLandmarkIds.has(id)) {
    plannedLandmarkIds.delete(id);
  } else {
    plannedLandmarkIds.add(id);
  }
  savePlannedLandmarks();
  renderLandmarks();
  updateLandmarkStats();
}

function updateLandmarkStats() {
  const totalPlanned = plannedLandmarkIds.size;
  const countPlannedEl = document.getElementById("countLmPlanned");
  const countAllEl = document.getElementById("countLmAll");
  const countMakkahEl = document.getElementById("countLmMakkah");
  const countMadinahEl = document.getElementById("countLmMadinah");
  const planTextEl = document.getElementById("planText");
  const planBadgeEl = document.getElementById("planBadge");

  if (countPlannedEl) countPlannedEl.textContent = totalPlanned;
  if (countAllEl) countAllEl.textContent = RELIGIOUS_LANDMARKS.length;
  if (countMakkahEl) countMakkahEl.textContent = RELIGIOUS_LANDMARKS.filter(l => l.city === "makkah").length;
  if (countMadinahEl) countMadinahEl.textContent = RELIGIOUS_LANDMARKS.filter(l => l.city === "madinah").length;

  if (planTextEl) {
    if (totalPlanned === 0) {
      planTextEl.textContent = "قم بالضغط على «أضف للخطة» في أي مزار لتجهيز جدول زياراتك الخاص في مكة والمدينة.";
    } else {
      const makkahCount = RELIGIOUS_LANDMARKS.filter(l => plannedLandmarkIds.has(l.id) && l.city === "makkah").length;
      const madinahCount = RELIGIOUS_LANDMARKS.filter(l => plannedLandmarkIds.has(l.id) && l.city === "madinah").length;
      planTextEl.textContent = `لقد قمت بجدولة ${totalPlanned} مزارات (${makkahCount} في مكة المكرمة و${madinahCount} في المدينة المنورة).`;
    }
  }

  if (planBadgeEl) {
    planBadgeEl.textContent = totalPlanned > 0 ? `⭐ ${totalPlanned} مزارات مجدولة` : "الخطة الشخصية";
  }
}

function renderLandmarks() {
  const container = document.getElementById("landmarksGrid");
  if (!container) return;

  const query = landmarkSearchQuery.trim().toLowerCase();

  const filtered = RELIGIOUS_LANDMARKS.filter(item => {
    // City / Plan filter
    if (currentLandmarkCity === "makkah" && item.city !== "makkah") return false;
    if (currentLandmarkCity === "madinah" && item.city !== "madinah") return false;
    if (currentLandmarkCity === "planned" && !plannedLandmarkIds.has(item.id)) return false;

    // Search query filter
    if (query) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.desc.toLowerCase().includes(query);
      const matchTip = item.tip.toLowerCase().includes(query);
      const matchCity = item.cityName.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchTip && !matchCity) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    let emptyMsg = "لم يتم العثور على مزارات تطابق بحثك.";
    if (currentLandmarkCity === "planned" && plannedLandmarkIds.size === 0) {
      emptyMsg = "لم تقم بإضافة أي مزارات إلى خطتك بعد. تصفح مزارات مكة والمدينة واضغط على «أضف للخطة».";
    }
    container.innerHTML = `
      <div class="landmarks-empty-state">
        <b>لا توجد مزارات للعرض</b>
        <p>${emptyMsg}</p>
      </div>
    `;
    updateLandmarkStats();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isPlanned = plannedLandmarkIds.has(item.id);
    const cityClass = item.city === "makkah" ? "makkah" : "madinah";
    const cityIcon = item.city === "makkah" ? "🕋" : "🕌";

    return `
      <article class="landmark-card ${isPlanned ? "is-planned" : ""}" data-id="${item.id}" id="landmark_${item.id}">
        <div class="landmark-card-top">
          <div class="card-badge-row">
            <span class="city-tag ${cityClass}">${cityIcon} ${item.cityName}</span>
            <span class="category-pill">${item.category}</span>
          </div>
          <h3>${item.name}</h3>
          <p class="landmark-desc">${item.desc}</p>
          <div class="landmark-tip-box">
            <b>💡 نصيحة وتوقيت الزيارة:</b>
            ${item.tip}
          </div>
        </div>

        <div class="landmark-card-footer">
          <span class="landmark-duration">⏱️ مدة الجولة: ${item.duration}</span>
          <button type="button" class="btn-plan ${isPlanned ? "planned" : ""}" data-plan-id="${item.id}" aria-pressed="${isPlanned}">
            ${isPlanned ? "✓ مجدول بالخطة" : "＋ أضف لخطتي"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  updateLandmarkStats();

  // Attach button event handlers
  container.querySelectorAll(".btn-plan").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.planId;
      togglePlanLandmark(id);
    });
  });
}

// Landmark Tabs
const landmarkTabs = document.querySelectorAll(".l-tab");
landmarkTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    landmarkTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentLandmarkCity = tab.dataset.city || "all";
    renderLandmarks();
  });
});

// Landmark Search
const landmarkSearchInput = document.getElementById("landmarkSearchInput");
const clearLmSearch = document.getElementById("clearLmSearch");

landmarkSearchInput?.addEventListener("input", (e) => {
  landmarkSearchQuery = e.target.value;
  if (clearLmSearch) {
    clearLmSearch.style.display = landmarkSearchQuery ? "block" : "none";
  }
  renderLandmarks();
});

clearLmSearch?.addEventListener("click", () => {
  if (landmarkSearchInput) {
    landmarkSearchInput.value = "";
    landmarkSearchQuery = "";
    clearLmSearch.style.display = "none";
    renderLandmarks();
  }
});

// Clear Plan
const btnClearPlan = document.getElementById("btnClearPlan");
btnClearPlan?.addEventListener("click", () => {
  if (plannedLandmarkIds.size === 0) {
    alert("الخطة فارغة بالفعل، اختر مزارات لإضافتها.");
    return;
  }
  if (confirm("هل ترغب في تفريغ خطة المزارات المجدولة؟")) {
    plannedLandmarkIds.clear();
    savePlannedLandmarks();
    renderLandmarks();
    updateLandmarkStats();
  }
});

// Share Plan via WhatsApp
const btnSharePlanWhatsapp = document.getElementById("btnSharePlanWhatsapp");
btnSharePlanWhatsapp?.addEventListener("click", () => {
  const plannedItems = RELIGIOUS_LANDMARKS.filter(item => plannedLandmarkIds.has(item.id));
  
  if (plannedItems.length === 0) {
    alert("يرجى تحديد مزار واحد على الأقل أولاً بالضغط على «أضف للخطة».");
    return;
  }

  const makkahSites = plannedItems.filter(i => i.city === "makkah").map(i => `• ${i.name}`).join("\n");
  const madinahSites = plannedItems.filter(i => i.city === "madinah").map(i => `• ${i.name}`).join("\n");

  let msg = `السلام عليكم وكالة هالة للسياحة،\nلقد قمت بإعداد خطة المزارات الدينية لرحلة العمرة عبر موقعكم:\n`;
  
  if (makkahSites) {
    msg += `\n🕋 مزارات مكة المكرمة المجدولة:\n${makkahSites}\n`;
  }
  if (madinahSites) {
    msg += `\n🕌 مزارات المدينة المنورة المجدولة:\n${madinahSites}\n`;
  }

  msg += `\nنرجو التكرم بإفادتي حول إمكانية ترتيب هذه الجولات ومواعيد حافلات المزارات المرافقة للبرنامج. بارك الله فيكم.`;

  window.open(whatsappUrl(msg), "_blank");
});

// Initialize Landmarks
loadPlannedLandmarks();
renderLandmarks();

// ================= حاسبة تكلفة العمرة التقديرية =================
const HOTELS_DATA = {
  nasamat: {
    name: "فندق نسمات الخير / يافوتة",
    program: "البرنامج الأول",
    location: "محبس الجن بالنقل المجاني 24/24",
    badge: "محبس الجن بالنقل",
    details: "حافلات نقل حديثة ترددية على مدار 24 ساعة بدون انقطاع إلى ساحة الحرم.",
    prices: { room5: 178000, room4: 188000, room3: 198000, room2: 218000 }
  },
  luluat_safa: {
    name: "فندق لؤلؤة الصفا / صلاح أجياد",
    program: "البرنامج الأول",
    location: "650 متر مشياً من ساحة الحرم",
    badge: "650م مشياً — أجياد",
    details: "موقع مميز على بعد 650 متر مشياً من ساحة الحرم المكي الشريف عبر شارع أجياد.",
    prices: { room5: 198000, room4: 210000, room3: 225000, room2: 255000 }
  },
  rawabi_zamzam: {
    name: "فندق روابي زمزم",
    program: "البرنامج الأول",
    location: "300 متر مشياً من ساحة الحرم",
    badge: "300م مشياً صف أول",
    details: "فندق قريب جداً على بعد 300 متر فقط من ساحة الحرم المكي الشريف.",
    prices: { room5: 229000, room4: 240000, room3: 265000, room2: 309000 }
  },
  meeqat_ajyad: {
    name: "فندق ميقات أجياد 250م / ماسة جراند 450م",
    program: "البرنامج الأول",
    location: "250م إلى 450م — ★★★★ 4 نجوم",
    badge: "★★★★ 4 نجوم فاخر",
    details: "إقامة فندقية راقية 4 نجوم مع غرف فسيحة ومرافق ممتازة وخدمة راقية قريبة من الحرم.",
    prices: { room5: 248000, room4: 259000, room3: 295000, room2: 349000 }
  },
  safat: {
    name: "فندق الصافات",
    program: "البرنامج الثاني",
    location: "1500م شارع غزة",
    badge: "شارع غزة بالنقل",
    details: "شارع غزة مع حافلات نقل وتردد دائم لخدمة المعتمرين وراحتهم.",
    prices: { room5: 178000, room4: 188000, room3: 198000, room2: 218000 }
  },
  jazira: {
    name: "فندق الجزيرة",
    program: "البرنامج الثاني",
    location: "750م شارع غزة مشياً",
    badge: "750م مشياً",
    details: "750 متر مشياً عبر شارع غزة التجاري والحيوي المليء بالمطاعم والخدمات.",
    prices: { room5: 195000, room4: 205000, room3: 219000, room2: 247000 }
  },
  manarat_ghaza: {
    name: "فندق منارات غزة (أراتك سابقًا)",
    program: "البرنامج الثاني",
    location: "شارع غزة قريب من ساحات الحرم",
    badge: "شارع غزة قريب",
    details: "موقع مميز وخدمات فندقية متكاملة قريبة من ساحات المسجد الحرام.",
    prices: { room5: 220000, room4: 258000, room3: 288000, room2: 340000 }
  }
};

const DATES_DATA = {
  sep_22_22d: { label: "22 سبتمبر 2026 (22 يوماً)", durationText: "22 يوماً (برنامج ممتد - ابتداءً من 198,000 دج)", extra: 20000 },
  sep_15: { label: "22 سبتمبر 2026 (22 يوماً)", durationText: "22 يوماً (برنامج ممتد)", extra: 20000 },
  sep_22: { label: "22 سبتمبر 2026", durationText: "15 يوماً (رحلة مباشرة)", extra: 0 },
  oct_06: { label: "06 أكتوبر 2026", durationText: "15 يوماً (موسم أكتوبر)", extra: 0 },
  oct_13: { label: "13 أكتوبر 2026", durationText: "15 يوماً (موسم أكتوبر)", extra: 0 },
  oct_20: { label: "20 أكتوبر 2026", durationText: "15 يوماً (موسم أكتوبر)", extra: 0 },
  oct_27: { label: "27 أكتوبر 2026", durationText: "15 يوماً (موسم أكتوبر)", extra: 0 },
  custom_21: { label: "رحلة ممتدة (21 يوماً)", durationText: "21 يوماً", extra: 35000 },
  custom_30: { label: "رحلة شهر كامل (30 يوماً)", durationText: "30 يوماً", extra: 65000 }
};

const ROOM_NAMES = {
  room5: "غرفة خماسية (5 أسرة)",
  room4: "غرفة رباعية (4 أسرة)",
  room3: "غرفة ثلاثية (3 أسرة)",
  room2: "غرفة ثنائية (VIP - سريران)"
};

const CHILD_PRICE = 145000;
const INFANT_PRICE = 75000;
const MEALS_PRICE_PER_PERSON = 28000;

function formatMoney(amount) {
  return amount.toLocaleString("ar-DZ") + " دج";
}
function formatNumber(amount) {
  return amount.toLocaleString("ar-DZ");
}

function initUmrahCalculator() {
  const tripDateSelect = document.getElementById("calcTripDate");
  const hotelSelect = document.getElementById("calcHotelSelect");
  const roomRadioLabels = document.querySelectorAll(".room-option-label");
  const roomRadios = document.querySelectorAll('input[name="calcRoomType"]');
  
  const inputAdults = document.getElementById("inputAdults");
  const btnAdultMinus = document.getElementById("btnAdultMinus");
  const btnAdultPlus = document.getElementById("btnAdultPlus");

  const inputChildren = document.getElementById("inputChildren");
  const btnChildMinus = document.getElementById("btnChildMinus");
  const btnChildPlus = document.getElementById("btnChildPlus");

  const inputInfants = document.getElementById("inputInfants");
  const btnInfantMinus = document.getElementById("btnInfantMinus");
  const btnInfantPlus = document.getElementById("btnInfantPlus");

  const chkAddonMeals = document.getElementById("chkAddonMeals");
  const btnResetCalc = document.getElementById("btnResetCalc");
  const btnBookWithEstimate = document.getElementById("btnBookWithEstimate");
  const btnPrintEstimate = document.getElementById("btnPrintEstimate");

  if (!tripDateSelect || !hotelSelect) return;

  function getSelectedRoomType() {
    const checked = document.querySelector('input[name="calcRoomType"]:checked');
    return checked ? checked.value : "room4";
  }

  function updateRoomPillHighlights(selectedType) {
    roomRadioLabels.forEach(lbl => {
      const radio = lbl.querySelector('input[type="radio"]');
      if (radio && radio.value === selectedType) {
        lbl.classList.add("active");
        radio.checked = true;
      } else {
        lbl.classList.remove("active");
      }
    });
  }

  function updateHotelRoomPriceTags() {
    const hotelKey = hotelSelect.value;
    const hotel = HOTELS_DATA[hotelKey] || HOTELS_DATA.nasamat;

    // Update Hotel description boxes
    const badgeEl = document.getElementById("hotelBadgeText");
    const detailsEl = document.getElementById("hotelDetailsText");
    if (badgeEl) badgeEl.textContent = hotel.badge;
    if (detailsEl) detailsEl.textContent = hotel.details;

    // Update tags on each room
    const tag5 = document.getElementById("priceTagRoom5");
    const tag4 = document.getElementById("priceTagRoom4");
    const tag3 = document.getElementById("priceTagRoom3");
    const tag2 = document.getElementById("priceTagRoom2");

    if (tag5) tag5.textContent = formatMoney(hotel.prices.room5);
    if (tag4) tag4.textContent = formatMoney(hotel.prices.room4);
    if (tag3) tag3.textContent = formatMoney(hotel.prices.room3);
    if (tag2) tag2.textContent = formatMoney(hotel.prices.room2);

    const roomType = getSelectedRoomType();
    const adultNote = document.getElementById("adultCostNote");
    if (adultNote) {
      adultNote.textContent = `${formatMoney(hotel.prices[roomType])} للفرد`;
    }
  }

  function calculateAndRender() {
    const hotelKey = hotelSelect.value;
    const hotel = HOTELS_DATA[hotelKey] || HOTELS_DATA.nasamat;
    const dateKey = tripDateSelect.value;
    const dateConfig = DATES_DATA[dateKey] || DATES_DATA.oct_06;
    const roomType = getSelectedRoomType();

    const adults = Math.max(1, parseInt(inputAdults?.value || "2", 10));
    const children = Math.max(0, parseInt(inputChildren?.value || "0", 10));
    const infants = Math.max(0, parseInt(inputInfants?.value || "0", 10));
    const hasMeals = chkAddonMeals?.checked || false;

    const baseAdultRate = hotel.prices[roomType] || hotel.prices.room4;
    const dateExtraPerAdult = dateConfig.extra || 0;
    const totalAdultRate = baseAdultRate + dateExtraPerAdult;

    const adultsTotal = adults * totalAdultRate;
    const childrenTotal = children * CHILD_PRICE;
    const infantsTotal = infants * INFANT_PRICE;
    const mealsTotal = hasMeals ? (adults + children) * MEALS_PRICE_PER_PERSON : 0;
    const durationExtraTotal = adults * dateExtraPerAdult;

    const grandTotal = adultsTotal + childrenTotal + infantsTotal + mealsTotal;

    // Render Grand Total
    const figureEl = document.getElementById("totalBudgetFigure");
    const perPersonEl = document.getElementById("perPersonFigure");
    if (figureEl) figureEl.textContent = formatNumber(grandTotal);
    if (perPersonEl) perPersonEl.textContent = formatNumber(totalAdultRate);

    // Update Room price note for adults
    const adultNote = document.getElementById("adultCostNote");
    if (adultNote) {
      adultNote.textContent = `${formatMoney(totalAdultRate)} للفرد`;
    }

    // Update Breakdown
    const bAdultsDesc = document.getElementById("bAdultsDesc");
    const bAdultsVal = document.getElementById("bAdultsVal");
    if (bAdultsDesc && bAdultsVal) {
      bAdultsDesc.textContent = `البالغون (${adults} × ${ROOM_NAMES[roomType]}):`;
      bAdultsVal.textContent = formatMoney(adults * baseAdultRate);
    }

    // Children breakdown row
    const rowChildren = document.getElementById("rowChildrenBreakdown");
    const bChildrenDesc = document.getElementById("bChildrenDesc");
    const bChildrenVal = document.getElementById("bChildrenVal");
    if (rowChildren) {
      if (children > 0) {
        rowChildren.style.display = "flex";
        if (bChildrenDesc) bChildrenDesc.textContent = `الأطفال أقل من 12 سنة (${children} × ${formatMoney(CHILD_PRICE)}):`;
        if (bChildrenVal) bChildrenVal.textContent = formatMoney(childrenTotal);
      } else {
        rowChildren.style.display = "none";
      }
    }

    // Infants breakdown row
    const rowInfants = document.getElementById("rowInfantsBreakdown");
    const bInfantsDesc = document.getElementById("bInfantsDesc");
    const bInfantsVal = document.getElementById("bInfantsVal");
    if (rowInfants) {
      if (infants > 0) {
        rowInfants.style.display = "flex";
        if (bInfantsDesc) bInfantsDesc.textContent = `الرضع أقل من سنتين (${infants} × ${formatMoney(INFANT_PRICE)}):`;
        if (bInfantsVal) bInfantsVal.textContent = formatMoney(infantsTotal);
      } else {
        rowInfants.style.display = "none";
      }
    }

    // Meals breakdown row
    const rowMeals = document.getElementById("rowMealsBreakdown");
    const bMealsDesc = document.getElementById("bMealsDesc");
    const bMealsVal = document.getElementById("bMealsVal");
    if (rowMeals) {
      if (hasMeals) {
        rowMeals.style.display = "flex";
        const eaters = adults + children;
        if (bMealsDesc) bMealsDesc.textContent = `الإفطار والعشاء بوفيه (${eaters} × 28,000 دج):`;
        if (bMealsVal) bMealsVal.textContent = formatMoney(mealsTotal);
      } else {
        rowMeals.style.display = "none";
      }
    }

    // Duration extra breakdown row
    const rowDuration = document.getElementById("rowDurationBreakdown");
    const bDurationDesc = document.getElementById("bDurationDesc");
    const bDurationVal = document.getElementById("bDurationVal");
    if (rowDuration) {
      if (dateExtraPerAdult > 0) {
        rowDuration.style.display = "flex";
        if (bDurationDesc) bDurationDesc.textContent = `فارق مدة الرحلة (${dateConfig.durationText}):`;
        if (bDurationVal) bDurationVal.textContent = formatMoney(durationExtraTotal);
      } else {
        rowDuration.style.display = "none";
      }
    }
  }

  // Event Listeners for inputs
  hotelSelect.addEventListener("change", () => {
    updateHotelRoomRoom();
    calculateAndRender();
  });

  function updateHotelRoomRoom() {
    updateHotelRoomPriceTags();
  }

  tripDateSelect.addEventListener("change", calculateAndRender);

  roomRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      updateRoomPillHighlights(e.target.value);
      calculateAndRender();
    });
  });

  roomRadioLabels.forEach(lbl => {
    lbl.addEventListener("click", () => {
      const radio = lbl.querySelector('input[type="radio"]');
      if (radio) {
        updateRoomPillHighlights(radio.value);
        calculateAndRender();
      }
    });
  });

  // Adults counter
  btnAdultMinus?.addEventListener("click", () => {
    let val = parseInt(inputAdults.value || "2", 10);
    if (val > 1) {
      inputAdults.value = val - 1;
      calculateAndRender();
    }
  });
  btnAdultPlus?.addEventListener("click", () => {
    let val = parseInt(inputAdults.value || "2", 10);
    if (val < 20) {
      inputAdults.value = val + 1;
      calculateAndRender();
    }
  });

  // Children counter
  btnChildMinus?.addEventListener("click", () => {
    let val = parseInt(inputChildren.value || "0", 10);
    if (val > 0) {
      inputChildren.value = val - 1;
      calculateAndRender();
    }
  });
  btnChildPlus?.addEventListener("click", () => {
    let val = parseInt(inputChildren.value || "0", 10);
    if (val < 10) {
      inputChildren.value = val + 1;
      calculateAndRender();
    }
  });

  // Infants counter
  btnInfantMinus?.addEventListener("click", () => {
    let val = parseInt(inputInfants.value || "0", 10);
    if (val > 0) {
      inputInfants.value = val - 1;
      calculateAndRender();
    }
  });
  btnInfantPlus?.addEventListener("click", () => {
    let val = parseInt(inputInfants.value || "0", 10);
    if (val < 5) {
      inputInfants.value = val + 1;
      calculateAndRender();
    }
  });

  chkAddonMeals?.addEventListener("change", calculateAndRender);

  // Reset Calculator
  btnResetCalc?.addEventListener("click", () => {
    tripDateSelect.value = "oct_06";
    hotelSelect.value = "nasamat";
    inputAdults.value = "2";
    inputChildren.value = "0";
    inputInfants.value = "0";
    if (chkAddonMeals) chkAddonMeals.checked = false;
    updateRoomPillHighlights("room4");
    updateHotelRoomRoom();
    calculateAndRender();
  });

  // WhatsApp Booking with Estimate
  btnBookWithEstimate?.addEventListener("click", () => {
    const hotel = HOTELS_DATA[hotelSelect.value] || HOTELS_DATA.nasamat;
    const dateConfig = DATES_DATA[tripDateSelect.value] || DATES_DATA.oct_06;
    const roomType = getSelectedRoomType();
    const adults = parseInt(inputAdults.value || "2", 10);
    const children = parseInt(inputChildren.value || "0", 10);
    const infants = parseInt(inputInfants.value || "0", 10);
    const hasMeals = chkAddonMeals?.checked;
    const figureEl = document.getElementById("totalBudgetFigure");
    const totalFormatted = figureEl ? figureEl.textContent + " دج" : "";

    let text = `السلام عليكم ورحمة الله،\nأود طلب استشارة وتأكيد حجز أولي لرحلة العمرة عبر حاسبة التكلفة بموقع هالة للسياحة:\n\n`;
    text += `📅 موعد السفر: ${dateConfig.label} (${dateConfig.durationText})\n`;
    text += `🏨 الفندق المختار: ${hotel.name} (${hotel.location})\n`;
    text += `🛏️ نوع الغرفة: ${ROOM_NAMES[roomType]}\n`;
    text += `👥 عدد المسافرين: ${adults} بالغين`;
    if (children > 0) text += ` + ${children} أطفال`;
    if (infants > 0) text += ` + ${infants} رضع`;
    text += `\n🍽️ وجبات الإفطار والعشاء: ${hasMeals ? "نعم (بوفيه مفتوح)" : "لا"}\n`;
    text += `\n💰 التكلفة التقديرية الإجمالية المحسوبة: ${totalFormatted}\n\n`;
    text += `يرجى موافاتي بالإجراءات المطلوبة والمقاعد المتاحة لتثبيت الحجز. شكراً جزيلاً.`;

    window.open(whatsappUrl(text), "_blank");
  });

  // Print Estimate
  btnPrintEstimate?.addEventListener("click", () => {
    window.print();
  });

  // Initial Calculation Run
  updateHotelRoomRoom();
  updateRoomPillHighlights("room4");
  calculateAndRender();
}

initUmrahCalculator();

// ================= دليل ونصيحة اليوم للمعتمر =================
const UMRAH_TIPS = [
  {
    id: "ihram_sunan",
    category: "ihram",
    categoryName: "أحكام الإحرام",
    icon: "🕋",
    title: "سنن الإحرام والتلبية الخالصة",
    athkar: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً • لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الحَمْدَ وَالنِّعْمَةَ لَكَ وَالمُلْكَ، لا شَرِيكَ لَكَ",
    explanation: "يُسن للمعتمر قبل الإحرام الاغتسال والتنظف والتطيب في البدن فقط (دون ملابس الإحرام)، والتجرد من المخيط للرجال، ثم عقد النية بالقلب والتلفظ بها عند الميقات. ويستمر المعتمر في التلبية رافعاً صوته بها بخشوع حتى يرى الكعبة ويبدأ الطواف.",
    goldenRule: "تذكر: لا يجوز للمحرم بعد النية التطيب أو قص الشعر أو الأظافر أو تغطية رأس الرجل بملاصق. والرفق والتلبية ديدن المعتمر."
  },
  {
    id: "tawaf_athkar",
    category: "tawaf",
    categoryName: "أذكار وسنن الطواف",
    icon: "🌀",
    title: "أذكار الطواف وما بين الركنين",
    athkar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    explanation: "يبدأ كل شوط من محاذاة الحجر الأسود بالتكبير «الله أكبر»، وليس للطواف دعاء مخصص لكل شوط، بل يدعو المعتمر بما فتح الله عليه من خيري الدنيا والآخرة والقرآن والاستغفار. ويُسن استحباباً مؤكداً ختم كل شوط بهذا الدعاء الجامع بين الركن اليماني والحجر الأسود.",
    goldenRule: "الطواف عبادة وصلاة، فاجتنِب التدافع ومزاحمة المعتمرين؛ واستلام الحجر أو الإشارة إليه عن بعد يكفي تماماً دون إلحاق أي أذى."
  },
  {
    id: "maqam_zamzam",
    category: "tawaf",
    categoryName: "ركعتا الطواف وزمزم",
    icon: "📿",
    title: "صلاة خلف المقام والتضلع من ماء زمزم",
    athkar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    explanation: "بعد إتمام الأشواط السبعة، يُسن صلاة ركعتين خفيفتين خلف مقام إبراهيم إن تيسر دون إيذاء الطائفين، أو في أي مكان بالمسجد الحرام، يقرأ فيهما بسورتي الكافرون والإخلاص. ثم يستحب التوجه إلى زمزم والشرب حتى التضلع مع استحضار نية الشفاء والبركة.",
    goldenRule: "قال ﷺ: «ماء زمزم لما شُرب له». فاستحضر عند شربه كل ما ترجوه من خيري الدنيا والآخرة لنفسك ولوالديك."
  },
  {
    id: "saee_safa_marwa",
    category: "tawaf",
    categoryName: "مناسك السعي",
    icon: "⛰️",
    title: "أذكار وسنن الصفا والمروة",
    athkar: "﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ﴾ • لا إِلَهَ إِلا اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
    explanation: "عند التوجه إلى الصفا يبدأ بقراءة الآية الكريمة ويقول «نبدأ بما بدأ الله به». ثم يرقى على الصفا مستقبلاً القبلة موحداً ومكبراً ثلاثاً، ويدعو رافعاً يديه بما يشاء. ويسعى سبعة أشواط بين الصفا والمروة بخشوع وذكر.",
    goldenRule: "الهرولة (الخبب) بين العلمين الأخضرين سنة خاصة بالرجال فقط دون النساء، مع مراعاة السكينة وتجنب مزاحمة العربات وكبار السن."
  },
  {
    id: "tahallul_halq",
    category: "ihram",
    categoryName: "التحلل وإتمام النسك",
    icon: "✂️",
    title: "فضل الحلق والتقصير لتمام العمرة",
    athkar: "«اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ» (قالها ثلاثاً للمحلقين ومرة للمقصرين)",
    explanation: "بعد إنهاء الشوط السابع في المروة، يتحلل المعتمر بالحلق أو التقصير. والحلق أفضل للرجال لنيل دعاء النبي ﷺ بالرحمة والمغفرة ثلاثاً. وفي التقصير يجب تعميم جميع جوانب الرأس، أما المرأة فتقصر من أطراف جدائل شعرها قدر أنملة (حوالي 1.5 سم).",
    goldenRule: "بتمام الحلق أو التقصير يحل للمعتمر كل ما حرم عليه بالإحرام، وتكون عمرته قد تمت بحمد الله، فيحمد الله على توفيقه وتيسيره."
  },
  {
    id: "madinah_salam",
    category: "madinah",
    categoryName: "آداب المسجد النبوي",
    icon: "🕌",
    title: "أدب السلام على النبي ﷺ وصاحبيه",
    athkar: "«السَّلَامُ عَلَيْكَ يَا رَسُولَ اللهِ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، جَزَاكَ اللهُ عَنْ أُمَّتِكَ خَيْرَ مَا جَزَى نَبِيًّا عَنْ أُمَّتِهِ»",
    explanation: "الصلاة في المسجد النبوي الشريف بألف صلاة فيما سواه إلا المسجد الحرام. وعند الوقوف تجاه الحجرة النبوية الشريفة، يقف الزائر بخشوع ووقار وخفض صوت مسلماً على الحبيب المصطفى ﷺ، ثم يخطو خطوة عن يمينه ويسلم على أبي بكر الصديق، ثم عمر بن الخطاب رضي الله عنهما.",
    goldenRule: "احرص على حجز تصريح الصلاة في الروضة الشريفة مسبقاً عبر تطبيق «نُسك»، وكن في قمة السكينة والهدوء تأسياً بقوله تعالى: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَرْفَعُوا أَصْوَاتَكُمْ فَوْقَ صَوْتِ النَّبِيِّ﴾."
  },
  {
    id: "quba_ziyarah",
    category: "madinah",
    categoryName: "فضائل المدينة المنورة",
    icon: "🤍",
    title: "صلاة ركعتين في مسجد قباء كأجر عمرة",
    athkar: "«مَنْ تَطَهَّرَ فِي بَيْتِهِ، ثُمَّ أَتَى مَسْجِدَ قُبَاءٍ فَصَلَّى فِيهِ صَلَاةً، كَانَ لَهُ كَأَجْرِ عُمْرَةٍ» (حديث صحيح)",
    explanation: "من سنن الإقامة في طيبة الطيبة التطهر في الفندق والخروج صباحاً إلى مسجد قباء وصلاة ركعتين فيه، اقتداءً بالنبي ﷺ الذي كان يزوره كل سبت راكباً وماشياً. وطريق ممشى قباء بين الحرم النبوي ومسجد قباء مجهز وممتع للمشي والتأمل.",
    goldenRule: "اغتنم أيام المدينة المنورة أيضاً في الصلاة بالمسجد النبوي وزيارة شهداء أحد ومقبرة البقيع للعظة والاعتبار والدعاء لهم بالمغفرة."
  },
  {
    id: "akhlaq_rifq",
    category: "etiquette",
    categoryName: "الآداب وحسن الخلق",
    icon: "🤝",
    title: "كظم الغيظ والرفق بالمعتمرين في الزحام",
    athkar: "﴿فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ﴾ • «مَا كَانَ الرِّفْقُ فِي شَيْءٍ إِلَّا زَانَهُ»",
    explanation: "رحلة العمرة مدرسة عظيمة لتهذيب النفس والصبر وكظم الغيظ. فإذا واجهت زحاماً شديداً أو تصرفاً يضايقك، فقابل ذلك بابتسامة وصفح واحتساب للأجر عند الله. واحرص على مساعدة الضعفاء وتفريج الطريق للعربات وإيثار غيرك.",
    goldenRule: "أنت في ضيافة الرحمن؛ فلا تشغل نفسك بالخصام أو التعليق على عثرات الناس، بل اجعل شغلك الشاغل ذكر الله وطيب الكلام وحسن المعاملة."
  },
  {
    id: "sihha_wiqaya",
    category: "health",
    categoryName: "الصحة والسلامة في الحرم",
    icon: "💧",
    title: "الوقاية من الإجهاد الحراري والتغذية السليمة",
    athkar: "«نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالفَرَاغُ» • «بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ»",
    explanation: "المحافظة على صحة بدنك وقوتك جزء من تمام عبادتك. احرص على شرب السوائل بانتظام لتجنب الجفاف، واستخدم مظلة بيضاء تقي من حرارة الشمس نهاراً، وانتعِل حذاءً طبياً مريحاً للقدمين أثناء المشي. ولا تمشِ حافياً على البلاط الحار بالساحات الخارجية.",
    goldenRule: "إذا أحسست بإرهاق أو دوار، فاسترح فوراً في الأروقة المكيفة واشرب ماءً، ولا تتردد في طلب المساعدة من مرشد وكالة هالة أو الفرق الطبية الميدانية."
  },
  {
    id: "jawamee_dua",
    category: "etiquette",
    categoryName: "جوامع الدعاء والرجاء",
    icon: "🤲",
    title: "دعاء النبي ﷺ الجامع لخيري الدنيا والآخرة",
    athkar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ",
    explanation: "أوقات وأماكن الحرمين الشريفين من أرجى مواطن إجابة الدعاء: عند رؤية الكعبة، وفي الطواف، وعلى الصفا والمروة، وثلث الليل الآخر، وساعة الجمعة. فاجمع بين الأدعية المأثورة وبين حاجات قلبك وأهلك وأمتك باللغة التي تفيض بها مشاعرك.",
    goldenRule: "استحضر عظمة الله واليقين الجازم بالإجابة، ولا تعجز عن الدعاء؛ فرب العزة سبحانه كريم يحب الملحين في الدعاء."
  }
];

function initUmrahTipsFeature() {
  const LOCAL_STORAGE_FAV_KEY = "hala_umrah_tips_favorites";
  
  // Calculate daily tip index using current day
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const dailyTipIndex = Math.abs(dayOfYear % UMRAH_TIPS.length);
  
  let currentTipIndex = dailyTipIndex;
  let currentCategoryFilter = "all";
  let activeSpeech = false;

  // Favorites management
  function getFavorites() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FAV_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function setFavorites(favs) {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAV_KEY, JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
  }

  function isFavorite(id) {
    return getFavorites().includes(id);
  }

  function toggleFavorite(id) {
    let favs = getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(item => item !== id);
    } else {
      favs.push(id);
    }
    setFavorites(favs);
    updateFavButtons();
    renderDrawerTips();
    updateCounts();
  }

  function updateCounts() {
    const allEl = document.getElementById("drawerCountAll");
    const favEl = document.getElementById("drawerCountFav");
    const favs = getFavorites();
    if (allEl) allEl.textContent = UMRAH_TIPS.length;
    if (favEl) favEl.textContent = favs.length;
  }

  // Update Main Tip Card in Section
  function renderMainTip(index) {
    if (index < 0 || index >= UMRAH_TIPS.length) index = 0;
    currentTipIndex = index;
    const tip = UMRAH_TIPS[index];

    // DOM Elements
    const tipTitle = document.getElementById("tipTitle");
    const tipAthkarText = document.getElementById("tipAthkarText");
    const tipExplanation = document.getElementById("tipExplanation");
    const tipGoldenAdvice = document.getElementById("tipGoldenAdvice");
    const tipCatBadge = document.getElementById("tipCatBadge");
    const tipMainIcon = document.getElementById("tipMainIcon");
    const tipCounterText = document.getElementById("tipCounterText");
    const tipCalendarDate = document.getElementById("tipCalendarDate");
    const topbarTipTitle = document.getElementById("topbarTipTitle");

    // Format Arabic Date
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const dateFormatted = today.toLocaleDateString("ar-DZ", dateOptions);

    if (tipTitle) tipTitle.textContent = tip.title;
    if (tipAthkarText) tipAthkarText.textContent = tip.athkar;
    if (tipExplanation) tipExplanation.textContent = tip.explanation;
    if (tipGoldenAdvice) tipGoldenAdvice.textContent = tip.goldenRule;
    if (tipCatBadge) tipCatBadge.textContent = tip.categoryName;
    if (tipMainIcon) tipMainIcon.textContent = tip.icon;
    if (tipCalendarDate) tipCalendarDate.textContent = dateFormatted;
    if (tipCounterText) tipCounterText.textContent = `نصيحة ${index + 1} من ${UMRAH_TIPS.length}`;
    if (topbarTipTitle) topbarTipTitle.textContent = tip.title;

    updateFavButtons();
    highlightActiveCategoryChips(tip.category);

    // Stop speech if running
    if (window.speechSynthesis && activeSpeech) {
      window.speechSynthesis.cancel();
      resetAudioButton();
    }
  }

  function updateFavButtons() {
    const tip = UMRAH_TIPS[currentTipIndex];
    if (!tip) return;
    const favBtn = document.getElementById("btnFavTip");
    const favIcon = document.getElementById("favTipIcon");
    const favLabel = document.getElementById("favTipLabel");
    const faved = isFavorite(tip.id);

    if (favBtn) {
      favBtn.classList.toggle("active-fav", faved);
    }
    if (favIcon) favIcon.textContent = faved ? "❤️" : "🤍";
    if (favLabel) favLabel.textContent = faved ? "محفوظة" : "المفضلة";
  }

  function highlightActiveCategoryChips(cat) {
    const quickChips = document.querySelectorAll("#tipQuickCats .cat-chip-btn");
    quickChips.forEach(chip => {
      const c = chip.getAttribute("data-cat");
      if (c === cat || (c === "all" && !cat)) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  // Audio Speech Synthesis
  function setupAudioSpeech() {
    const btnAudio = document.getElementById("btnAudioTip");
    const audioIcon = document.getElementById("audioTipIcon");
    const audioLabel = document.getElementById("audioTipLabel");

    if (!btnAudio) return;

    btnAudio.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) {
        alert("خاصية القراءة الصوتية غير مدعومة في متصفحك حالياً.");
        return;
      }

      if (activeSpeech) {
        window.speechSynthesis.cancel();
        resetAudioButton();
        return;
      }

      const tip = UMRAH_TIPS[currentTipIndex];
      const textToRead = `${tip.title}. ${tip.athkar}. ${tip.explanation}. التوجيه الذهبي للمعتمر: ${tip.goldenRule}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "ar-SA";
      utterance.rate = 0.92;

      // Select Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.startsWith("ar"));
      if (arVoice) utterance.voice = arVoice;

      utterance.onstart = () => {
        activeSpeech = true;
        if (audioIcon) audioIcon.textContent = "⏸️";
        if (audioLabel) audioLabel.textContent = "إيقاف الصوت";
        btnAudio.classList.add("gold-highlight");
      };

      utterance.onend = utterance.onerror = () => {
        resetAudioButton();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  function resetAudioButton() {
    activeSpeech = false;
    const btnAudio = document.getElementById("btnAudioTip");
    const audioIcon = document.getElementById("audioTipIcon");
    const audioLabel = document.getElementById("audioTipLabel");
    if (audioIcon) audioIcon.textContent = "🔊";
    if (audioLabel) audioLabel.textContent = "استمع للنصيحة";
    btnAudio?.classList.remove("gold-highlight");
  }

  // Copy Tip
  function setupCopyTip() {
    const btnCopy = document.getElementById("btnCopyTip");
    const copyIcon = document.getElementById("copyTipIcon");
    const copyLabel = document.getElementById("copyTipLabel");

    btnCopy?.addEventListener("click", () => {
      const tip = UMRAH_TIPS[currentTipIndex];
      const copyContent = `💡 نصيحة اليوم للمعتمر — وكالة هالة للسياحة والأسفار\n\n📌 ${tip.title} (${tip.categoryName})\n\n📿 الذكر المأثور:\n« ${tip.athkar} »\n\n📖 الشرح والسنن:\n${tip.explanation}\n\n✨ التوجيه الذهبي:\n${tip.goldenRule}\n\n🌐 لمزيد من البرامج والنصائح: هالة للسياحة والأسفار والعمرة`;

      navigator.clipboard.writeText(copyContent).then(() => {
        if (copyIcon) copyIcon.textContent = "✅";
        if (copyLabel) copyLabel.textContent = "تم النسخ!";
        setTimeout(() => {
          if (copyIcon) copyIcon.textContent = "📋";
          if (copyLabel) copyLabel.textContent = "نسخ";
        }, 2500);
      }).catch(() => {
        alert("تعذر النسخ التلقائي، يمكنك تحديد النص ونسخه يدوياً.");
      });
    });
  }

  // WhatsApp Share Tip
  function setupWhatsAppShare() {
    const btnShare = document.getElementById("btnShareTipWa");
    btnShare?.addEventListener("click", () => {
      const tip = UMRAH_TIPS[currentTipIndex];
      const shareText = `السلام عليكم ورحمة الله،\nأشارككم هذه النصيحة القيمة لرحلة العمرة من وكالة هالة للسياحة:\n\n💡 *${tip.title}* (${tip.categoryName})\n\n📿 *الذكر المأثور:*\n« ${tip.athkar} »\n\n📖 *الشرح:* ${tip.explanation}\n\n✨ *التوجيه الذهبي:* ${tip.goldenRule}\n\nتقبل الله منا ومنكم صالح الأعمال.`;

      window.open(whatsappUrl(shareText), "_blank");
    });
  }

  // Pager & Random Controls
  function setupNavigationControls() {
    const btnPrev = document.getElementById("btnPrevTip");
    const btnNext = document.getElementById("btnNextTip");
    const btnRandom = document.getElementById("btnRandomTip");
    const favBtn = document.getElementById("btnFavTip");

    btnPrev?.addEventListener("click", () => {
      let prevIdx = currentTipIndex - 1;
      if (prevIdx < 0) prevIdx = UMRAH_TIPS.length - 1;
      renderMainTip(prevIdx);
      highlightDrawerCard(prevIdx);
    });

    btnNext?.addEventListener("click", () => {
      let nextIdx = (currentTipIndex + 1) % UMRAH_TIPS.length;
      renderMainTip(nextIdx);
      highlightDrawerCard(nextIdx);
    });

    btnRandom?.addEventListener("click", () => {
      let rIdx = Math.floor(Math.random() * UMRAH_TIPS.length);
      if (rIdx === currentTipIndex) rIdx = (rIdx + 1) % UMRAH_TIPS.length;
      renderMainTip(rIdx);
      highlightDrawerCard(rIdx);
    });

    favBtn?.addEventListener("click", () => {
      const tip = UMRAH_TIPS[currentTipIndex];
      if (tip) toggleFavorite(tip.id);
    });

    // Quick category chips
    const quickChips = document.querySelectorAll("#tipQuickCats .cat-chip-btn");
    quickChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const cat = chip.getAttribute("data-cat");
        quickChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        if (cat === "all") {
          renderMainTip(dailyTipIndex);
          highlightDrawerCard(dailyTipIndex);
        } else {
          const matchIdx = UMRAH_TIPS.findIndex(t => t.category === cat);
          if (matchIdx !== -1) {
            renderMainTip(matchIdx);
            highlightDrawerCard(matchIdx);
          }
        }
      });
    });
  }

  // ================= Drawer (Sidebar) Logic =================
  const tipDrawer = document.getElementById("tipDrawer");
  const tipDrawerOverlay = document.getElementById("tipDrawerOverlay");
  const tipDrawerClose = document.getElementById("tipDrawerClose");
  const sideTipTab = document.getElementById("sideTipTab");
  const btnOpenDrawerFromSection = document.getElementById("btnOpenDrawerFromSection");
  const topbarTipLink = document.getElementById("topbarTipLink");
  const tipDrawerList = document.getElementById("tipDrawerList");

  function openDrawer() {
    tipDrawer?.classList.add("open");
    tipDrawerOverlay?.classList.add("open");
    tipDrawer?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderDrawerTips();
  }

  function closeDrawer() {
    tipDrawer?.classList.remove("open");
    tipDrawerOverlay?.classList.remove("open");
    tipDrawer?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  sideTipTab?.addEventListener("click", openDrawer);
  btnOpenDrawerFromSection?.addEventListener("click", openDrawer);
  tipDrawerClose?.addEventListener("click", closeDrawer);
  tipDrawerOverlay?.addEventListener("click", closeDrawer);

  topbarTipLink?.addEventListener("click", (e) => {
    e.preventDefault();
    const section = document.getElementById("dailyTip");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Drawer Filtering
  const drawerFilterBtns = document.querySelectorAll(".drawer-filter-btn");
  drawerFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      drawerFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategoryFilter = btn.getAttribute("data-filter") || "all";
      renderDrawerTips();
    });
  });

  function renderDrawerTips() {
    if (!tipDrawerList) return;
    const favs = getFavorites();

    let filtered = UMRAH_TIPS;
    if (currentCategoryFilter === "favorites") {
      filtered = UMRAH_TIPS.filter(t => favs.includes(t.id));
    } else if (currentCategoryFilter !== "all") {
      filtered = UMRAH_TIPS.filter(t => t.category === currentCategoryFilter);
    }

    if (filtered.length === 0) {
      tipDrawerList.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--muted)">
          <div style="font-size:36px;margin-bottom:12px">🤍</div>
          <p style="font-size:13px;font-weight:700;color:var(--navy)">لا توجد نصائح في هذه القائمة حالياً</p>
          <small style="display:block;margin-top:5px;font-size:11px">اضغط على زر «المفضلة» بأي نصيحة لحفظها هنا والرجوع إليها بسهولة.</small>
        </div>
      `;
      return;
    }

    tipDrawerList.innerHTML = filtered.map(tip => {
      const origIndex = UMRAH_TIPS.findIndex(t => t.id === tip.id);
      const isSelected = origIndex === currentTipIndex;
      const isFav = favs.includes(tip.id);

      return `
        <article class="drawer-tip-card ${isSelected ? "active-selected" : ""}" data-tip-idx="${origIndex}">
          <div class="drawer-card-top">
            <span class="drawer-card-badge">${tip.icon} ${tip.categoryName}</span>
            <span>${isFav ? "❤️ محفوظة" : ""}</span>
          </div>
          <h4>${tip.title}</h4>
          <div class="drawer-athkar-snippet">« ${tip.athkar} »</div>
          <p class="drawer-card-preview">${tip.explanation}</p>
          <div class="drawer-card-footer">
            <button class="btn-select-tip" type="button">عرض النصيحة في الصفحة الرئيسية ↗</button>
            <span style="color:var(--muted);font-size:9px">نصيحة #${origIndex + 1}</span>
          </div>
        </article>
      `;
    }).join("");

    // Add click listeners to cards
    tipDrawerList.querySelectorAll(".drawer-tip-card").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-tip-idx"), 10);
        renderMainTip(idx);
        highlightDrawerCard(idx);
        closeDrawer();
        document.getElementById("dailyTip")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function highlightDrawerCard(idx) {
    if (!tipDrawerList) return;
    tipDrawerList.querySelectorAll(".drawer-tip-card").forEach(c => {
      const cIdx = parseInt(c.getAttribute("data-tip-idx"), 10);
      c.classList.toggle("active-selected", cIdx === idx);
    });
  }

  // Keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && tipDrawer?.classList.contains("open")) {
      closeDrawer();
    }
  });

  // Init
  updateCounts();
  setupAudioSpeech();
  setupCopyTip();
  setupWhatsAppShare();
  setupNavigationControls();
  renderMainTip(dailyTipIndex);
}

initUmrahTipsFeature();




