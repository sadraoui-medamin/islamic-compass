export type Language = "ar" | "en" | "fr";

export const translations = {
  // Bottom nav
  "nav.quran": { ar: "القرآن", en: "Quran", fr: "Coran" },
  "nav.adhkar": { ar: "الأذكار", en: "Adhkar", fr: "Adhkar" },
  "nav.dua": { ar: "الدعاء", en: "Dua", fr: "Doua" },
  "nav.tasbih": { ar: "التسبيح", en: "Tasbih", fr: "Tasbih" },
  "nav.qibla": { ar: "القبلة", en: "Qibla", fr: "Qibla" },
  "nav.prayer": { ar: "الصلاة", en: "Prayer", fr: "Prière" },
  "nav.more": { ar: "المزيد", en: "More", fr: "Plus" },

  // Quran page
  "quran.title": { ar: "القرآن الكريم", en: "Al-Quran", fr: "Le Coran" },
  "quran.subtitle": { ar: "القرآن الكريم", en: "القرآن الكريم", fr: "القرآن الكريم" },
  "quran.surahList": { ar: "قائمة السور", en: "Surah List", fr: "Liste des Sourates" },
  "quran.continueReading": { ar: "متابعة القراءة", en: "Continue Reading", fr: "Continuer la lecture" },
  "quran.search": { ar: "البحث عن سورة، آية...", en: "Search surah, ayah, or translation...", fr: "Rechercher sourate, verset..." },
  "quran.bookmarks": { ar: "المحفوظات", en: "Bookmarked Verses", fr: "Versets favoris" },
  "quran.noBookmarks": { ar: "لا توجد محفوظات", en: "No bookmarks yet", fr: "Pas encore de favoris" },
  "quran.tapBookmark": { ar: "اضغط على أيقونة الحفظ لحفظ الآية", en: "Tap the bookmark icon on any verse to save it", fr: "Appuyez sur l'icône favori pour sauvegarder" },
  "quran.searchResults": { ar: "نتائج البحث", en: "Search Results", fr: "Résultats" },
  "quran.surah": { ar: "سورة", en: "Surah", fr: "Sourate" },
  "quran.juz": { ar: "جزء", en: "Juz", fr: "Juz" },
  "quran.page": { ar: "صفحة", en: "Page", fr: "Page" },
  "quran.verses": { ar: "آية", en: "verses", fr: "versets" },
  "quran.meccan": { ar: "مكية", en: "Meccan", fr: "Mecquoise" },
  "quran.medinan": { ar: "مدنية", en: "Medinan", fr: "Médinoise" },
  "quran.navigatePage": { ar: "انتقل إلى صفحة محددة (1-604)", en: "Navigate to a specific Mushaf page (1–604)", fr: "Aller à une page du Mushaf (1–604)" },
  "quran.ayah": { ar: "آية", en: "Ayah", fr: "Verset" },
  "quran.startsAt": { ar: "تبدأ من", en: "Starts at", fr: "Commence à" },
  "quran.searching": { ar: "جارٍ البحث...", en: "Searching...", fr: "Recherche..." },
  "quran.loading": { ar: "جارٍ التحميل...", en: "Loading...", fr: "Chargement..." },
  "quran.failed": { ar: "فشل التحميل. يرجى المحاولة مرة أخرى.", en: "Failed to load. Please try again.", fr: "Échec du chargement. Réessayez." },
  "quran.bookmarkRemoved": { ar: "تم إزالة المحفوظة", en: "Bookmark removed", fr: "Favori supprimé" },
  "quran.bookmarkAdded": { ar: "تم حفظ الآية ✓", en: "Verse bookmarked ✓", fr: "Verset sauvegardé ✓" },
  "quran.audioFailed": { ar: "فشل تشغيل الصوت", en: "Audio failed", fr: "Échec audio" },
  "quran.repeating": { ar: "🔂 تكرار الآية", en: "🔂 Repeating ayah", fr: "🔂 Répétition du verset" },
  "quran.fullscreen": { ar: "وضع القراءة الكاملة", en: "Fullscreen reading", fr: "Lecture plein écran" },

  // Page reader themes
  "theme.light": { ar: "فاتح", en: "Light", fr: "Clair" },
  "theme.classic": { ar: "كلاسيك", en: "Classic", fr: "Classique" },
  "theme.night": { ar: "ليلي", en: "Night", fr: "Nuit" },
  "theme.dark": { ar: "داكن", en: "Dark", fr: "Sombre" },

  // Adhkar
  "adhkar.title": { ar: "الأذكار", en: "Adhkar", fr: "Adhkar" },
  "adhkar.subtitle": { ar: "الأذكار", en: "الأذكار", fr: "الأذكار" },
  "adhkar.completed": { ar: "مكتملة", en: "completed", fr: "terminés" },
  "adhkar.count": { ar: "أذكار", en: "adhkar", fr: "adhkar" },

  // Dua
  "dua.title": { ar: "الدعاء", en: "Duas", fr: "Douaas" },
  "dua.subtitle": { ar: "الدعاء", en: "الدعاء", fr: "الدعاء" },
  "dua.duas": { ar: "دعاء", en: "duas", fr: "douaas" },
  "dua.copied": { ar: "تم النسخ ✓", en: "Copied to clipboard ✓", fr: "Copié ✓" },

  // Tasbih
  "tasbih.title": { ar: "التسبيح", en: "Tasbih", fr: "Tasbih" },
  "tasbih.subtitle": { ar: "التسبيح", en: "التسبيح", fr: "التسبيح" },
  "tasbih.addCustom": { ar: "إضافة تسبيح مخصص", en: "Add Custom Tasbih", fr: "Ajouter un Tasbih" },
  "tasbih.arabicText": { ar: "النص العربي", en: "Arabic text (e.g. سبحان الله)", fr: "Texte arabe" },
  "tasbih.englishName": { ar: "الاسم بالانجليزية", en: "English name", fr: "Nom en anglais" },
  "tasbih.targetCount": { ar: "العدد المستهدف", en: "Target count", fr: "Nombre cible" },
  "tasbih.cancel": { ar: "إلغاء", en: "Cancel", fr: "Annuler" },
  "tasbih.add": { ar: "إضافة", en: "Add", fr: "Ajouter" },
  "tasbih.tapToCount": { ar: "اضغط للعد · اسحب للتالي", en: "Tap to count · Swipe for next", fr: "Appuyez pour compter · Glissez" },

  // Qibla
  "qibla.title": { ar: "القبلة", en: "Qibla", fr: "Qibla" },
  "qibla.subtitle": { ar: "القبلة", en: "القبلة", fr: "القبلة" },
  "qibla.fromNorth": { ar: "درجة من الشمال", en: "° from North", fr: "° du Nord" },
  "qibla.gettingLocation": { ar: "جارٍ تحديد الموقع...", en: "Getting location...", fr: "Localisation..." },
  "qibla.pointPhone": { ar: "وجّه هاتفك نحو علامة الكعبة لتحديد اتجاه القبلة", en: "Point your phone towards the Kaaba marker for accurate Qibla direction", fr: "Pointez votre téléphone vers le marqueur de la Kaaba" },
  "qibla.enableLocation": { ar: "يرجى تفعيل خدمات الموقع لتحديد اتجاه القبلة.", en: "Please enable location services to find Qibla direction.", fr: "Activez la localisation pour trouver la Qibla." },
  "qibla.kaaba": { ar: "الكعبة", en: "Kaaba", fr: "Kaaba" },

  // Prayer
  "prayer.title": { ar: "أوقات الصلاة", en: "Prayer Times", fr: "Heures de prière" },
  "prayer.subtitle": { ar: "أوقات الصلاة", en: "أوقات الصلاة", fr: "أوقات الصلاة" },
  "prayer.next": { ar: "التالي:", en: "Next:", fr: "Suivant:" },
  "prayer.at": { ar: "في", en: "at", fr: "à" },
  "prayer.location": { ar: "موقعك", en: "Your Location", fr: "Votre position" },
  "prayer.locationUnavailable": { ar: "الموقع غير متاح", en: "Location unavailable", fr: "Position indisponible" },
  "prayer.detectingLocation": { ar: "جارٍ تحديد الموقع...", en: "Detecting location...", fr: "Détection..." },
  "prayer.calculationMethod": { ar: "طريقة الحساب", en: "Calculation method", fr: "Méthode de calcul" },

  // Settings
  "settings.title": { ar: "الإعدادات", en: "Settings", fr: "Paramètres" },
  "settings.customize": { ar: "تخصيص تجربتك", en: "Customize your experience", fr: "Personnalisez votre expérience" },
  "settings.donate": { ar: "تبرع لدعمنا", en: "Donate to Support Us", fr: "Faire un don" },
  "settings.donateDesc": { ar: "ساعدنا في إبقاء التطبيق مجانياً", en: "Help us keep the app free", fr: "Aidez-nous à garder l'app gratuite" },
  "settings.language": { ar: "اللغة", en: "Language", fr: "Langue" },
  "settings.theme": { ar: "المظهر", en: "Theme", fr: "Thème" },
  "settings.themeLight": { ar: "فاتح", en: "Light", fr: "Clair" },
  "settings.themeLightDesc": { ar: "أبيض مع تدرج أرجواني", en: "White & purple-blue gradient", fr: "Blanc avec dégradé violet" },
  "settings.themeDark": { ar: "داكن", en: "Dark", fr: "Sombre" },
  "settings.themeDarkDesc": { ar: "مريح في الإضاءة المنخفضة", en: "Comfortable in low light", fr: "Confortable en faible lumière" },
  "settings.themeEyecare": { ar: "راحة العين", en: "Eye Care", fr: "Confort visuel" },
  "settings.themeEyecareDesc": { ar: "ألوان دافئة، إجهاد أقل", en: "Warm tones, less strain", fr: "Tons chauds, moins de fatigue" },
  "settings.notifications": { ar: "الإشعارات", en: "Notifications", fr: "Notifications" },
  "settings.notificationsDesc": { ar: "تذكيرات الصلاة والأذكار", en: "Prayer & Adhkar reminders", fr: "Rappels de prière et adhkar" },
  "settings.prayerTimes": { ar: "أوقات الصلاة", en: "Prayer Times", fr: "Heures de prière" },
  "settings.prayerTimesDesc": { ar: "إشعار لكل صلاة", en: "Get notified for each prayer", fr: "Notification pour chaque prière" },
  "settings.dailyAdhkar": { ar: "أذكار يومية", en: "Daily Adhkar", fr: "Adhkar quotidiens" },
  "settings.dailyAdhkarDesc": { ar: "تذكير الصباح والمساء", en: "Morning and evening reminders", fr: "Rappels matin et soir" },
  "settings.morningReminder": { ar: "تذكير الصباح", en: "Morning Reminder", fr: "Rappel matinal" },
  "settings.morningReminderDesc": { ar: "ابدأ يومك بالذكر", en: "Start your day with dhikr", fr: "Commencez par le dhikr" },
  "settings.eveningReminder": { ar: "تذكير المساء", en: "Evening Reminder", fr: "Rappel du soir" },
  "settings.eveningReminderDesc": { ar: "اختم يومك بالذكر", en: "Wind down with remembrance", fr: "Terminez avec le dhikr" },
  "settings.about": { ar: "عن التطبيق", en: "About", fr: "À propos" },
  "settings.aboutDesc": { ar: "معلومات التطبيق", en: "App information", fr: "Informations" },
  "settings.contact": { ar: "تواصل معنا", en: "Contact Us", fr: "Contactez-nous" },
  "settings.contactDesc": { ar: "أرسل ملاحظاتك", en: "Send feedback", fr: "Envoyer un retour" },
  "settings.rate": { ar: "قيّم التطبيق", en: "Rate Our App", fr: "Évaluer l'app" },
  "settings.rateDesc": { ar: "اترك تقييمك", en: "Leave a review", fr: "Laisser un avis" },
  "settings.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy", fr: "Politique de confidentialité" },
  "settings.privacyDesc": { ar: "بياناتك وخصوصيتك", en: "Your data & privacy", fr: "Vos données" },
  "settings.aboutTitle": { ar: "تطبيق إسلامي", en: "Islamic App", fr: "App Islamique" },
  "settings.aboutBody": { ar: "تطبيق إسلامي شامل يحتوي على القرآن والأذكار والأدعية والتسبيح واتجاه القبلة وأوقات الصلاة. صُنع بحب لخدمة الأمة الإسلامية.", en: "A comprehensive Islamic companion app featuring Quran, Adhkar, Duas, Tasbih, Qibla direction, and Prayer Times. Built with love for the Muslim community.", fr: "Une application islamique complète avec Coran, Adhkar, Douaas, Tasbih, direction de la Qibla et heures de prière." },
  "settings.contactBody": { ar: "نسعد بسماع آرائكم!", en: "We'd love to hear from you!", fr: "Nous serions ravis de vous entendre !" },
  "settings.contactSubtext": { ar: "أرسل لنا اقتراحاتك أو ملاحظاتك أو قل سلام", en: "Send us your suggestions, bug reports, or just say salam.", fr: "Envoyez-nous vos suggestions ou dites salam." },
  "settings.supportApp": { ar: "ادعم هذا التطبيق", en: "Support This App", fr: "Soutenez cette app" },
  "settings.donateBody": { ar: "هذا التطبيق مجاني بالكامل. تبرعك يساعدنا في صيانته وتطويره.", en: "This app is completely free. Your donation helps us maintain and improve it for the entire Muslim community.", fr: "Cette app est gratuite. Votre don nous aide à l'améliorer." },
  "settings.donateAmount": { ar: "تبرع بـ", en: "Donate", fr: "Donner" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.["en"] || key;
}
