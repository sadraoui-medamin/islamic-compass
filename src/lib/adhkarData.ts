export interface Dhikr {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  repeat: number;
  source: string;
}

export interface AdhkarCategory {
  id: string;
  title: string;
  arabic: string;
  icon: string;
  adhkar: Dhikr[];
}

export const adhkarCategories: AdhkarCategory[] = [
  {
    id: "morning",
    title: "Morning Adhkar",
    arabic: "أذكار الصباح",
    icon: "sun",
    adhkar: [
      {
        id: 1,
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wa huwa 'ala kulli shay'in qadir.",
        translation: "We have reached the morning and at this very time the kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
        repeat: 1,
        source: "Muslim"
      },
      {
        id: 2,
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur.",
        translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
        repeat: 1,
        source: "Tirmidhi"
      },
      {
        id: 3,
        arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdihi.",
        translation: "Glory is to Allah and praise is to Him.",
        repeat: 100,
        source: "Muslim"
      },
      {
        id: 4,
        arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
        translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
        repeat: 10,
        source: "Bukhari & Muslim"
      },
      {
        id: 5,
        arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bikalimati-llahit-tammati min sharri ma khalaq.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        repeat: 3,
        source: "Muslim"
      },
      {
        id: 6,
        arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim.",
        translation: "In the Name of Allah, Who with His Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        repeat: 3,
        source: "Abu Dawud & Tirmidhi"
      },
      {
        id: 7,
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
        transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah.",
        translation: "O Allah, I ask You for well-being in this world and the Hereafter.",
        repeat: 1,
        source: "Abu Dawud & Ibn Majah"
      },
    ],
  },
  {
    id: "evening",
    title: "Evening Adhkar",
    arabic: "أذكار المساء",
    icon: "moon",
    adhkar: [
      {
        id: 8,
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wa huwa 'ala kulli shay'in qadir.",
        translation: "We have reached the evening and at this very time the kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
        repeat: 1,
        source: "Muslim"
      },
      {
        id: 9,
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir.",
        translation: "O Allah, by Your leave we have reached the evening, by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
        repeat: 1,
        source: "Tirmidhi"
      },
      {
        id: 10,
        arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bikalimati-llahit-tammati min sharri ma khalaq.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        repeat: 3,
        source: "Muslim"
      },
      {
        id: 11,
        arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdihi.",
        translation: "Glory is to Allah and praise is to Him.",
        repeat: 100,
        source: "Muslim"
      },
      {
        id: 12,
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal.",
        translation: "O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from inability and laziness.",
        repeat: 1,
        source: "Bukhari"
      },
    ],
  },
  {
    id: "after-prayer",
    title: "After Prayer",
    arabic: "أذكار بعد الصلاة",
    icon: "star",
    adhkar: [
      {
        id: 13,
        arabic: "أَسْتَغْفِرُ اللهَ",
        transliteration: "Astaghfirullah.",
        translation: "I seek the forgiveness of Allah.",
        repeat: 3,
        source: "Muslim"
      },
      {
        id: 14,
        arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
        transliteration: "Allahumma antas-salam, wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.",
        translation: "O Allah, You are As-Salam (Peace), and from You is all peace. Blessed are You, O Possessor of Majesty and Honor.",
        repeat: 1,
        source: "Muslim"
      },
      {
        id: 15,
        arabic: "سُبْحَانَ اللهِ",
        transliteration: "SubhanAllah.",
        translation: "Glory is to Allah.",
        repeat: 33,
        source: "Muslim"
      },
      {
        id: 16,
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "All praise is for Allah.",
        repeat: 33,
        source: "Muslim"
      },
      {
        id: 17,
        arabic: "اللهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        repeat: 34,
        source: "Muslim"
      },
      {
        id: 18,
        arabic: "آيَةُ الْكُرْسِيِّ",
        transliteration: "Ayatul-Kursi (Al-Baqarah 2:255).",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...",
        repeat: 1,
        source: "An-Nasa'i"
      },
    ],
  },
  {
    id: "before-sleep",
    title: "Before Sleep",
    arabic: "أذكار النوم",
    icon: "moon",
    adhkar: [
      {
        id: 19,
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya.",
        translation: "In Your name O Allah, I die and I live.",
        repeat: 1,
        source: "Bukhari"
      },
      {
        id: 20,
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak.",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
        repeat: 3,
        source: "Abu Dawud & Tirmidhi"
      },
      {
        id: 21,
        arabic: "سُبْحَانَ اللهِ",
        transliteration: "SubhanAllah.",
        translation: "Glory is to Allah.",
        repeat: 33,
        source: "Bukhari & Muslim"
      },
      {
        id: 22,
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "All praise is for Allah.",
        repeat: 33,
        source: "Bukhari & Muslim"
      },
      {
        id: 23,
        arabic: "اللهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        repeat: 34,
        source: "Bukhari & Muslim"
      },
    ],
  },
  {
    id: "upon-waking",
    title: "Upon Waking",
    arabic: "أذكار الاستيقاظ",
    icon: "sun",
    adhkar: [
      {
        id: 24,
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
        translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
        repeat: 1,
        source: "Bukhari"
      },
      {
        id: 25,
        arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
        translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise.",
        repeat: 1,
        source: "Bukhari"
      },
    ],
  },
  {
    id: "entering-mosque",
    title: "Entering Mosque",
    arabic: "دخول المسجد",
    icon: "star",
    adhkar: [
      {
        id: 26,
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahumma-ftah li abwaba rahmatik.",
        translation: "O Allah, open the gates of Your mercy for me.",
        repeat: 1,
        source: "Muslim"
      },
      {
        id: 27,
        arabic: "أَعُوذُ بِاللهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'udhu billahil-'azim, wa bi wajhihil-karim, wa sultanihil-qadim, minash-shaytanir-rajim.",
        translation: "I seek refuge with Allah, the Supreme and with His Noble Face and His eternal authority from the accursed devil.",
        repeat: 1,
        source: "Abu Dawud"
      },
    ],
  },
  {
    id: "after-eating",
    title: "After Eating",
    arabic: "بعد الطعام",
    icon: "star",
    adhkar: [
      {
        id: 28,
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alhamdu lillahilladhi at'amani hadha, wa razaqanihi min ghayri hawlin minni wa la quwwah.",
        translation: "All praise is for Allah who fed me this and provided it for me without any might or power from myself.",
        repeat: 1,
        source: "Abu Dawud & Tirmidhi"
      },
      {
        id: 29,
        arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",
        transliteration: "Alhamdu lillahi hamdan kathiran tayyiban mubarakan fih.",
        translation: "All praise is for Allah, much good and blessed praise.",
        repeat: 1,
        source: "Bukhari"
      },
    ],
  },
  {
    id: "traveling",
    title: "Traveling",
    arabic: "أذكار السفر",
    icon: "star",
    adhkar: [
      {
        id: 30,
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun.",
        translation: "How perfect is He who has placed this at our service, and we ourselves would not have been capable of that, and to our Lord is our final destiny.",
        repeat: 1,
        source: "Muslim"
      },
      {
        id: 31,
        arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى",
        transliteration: "Allahumma inna nas'aluka fi safarina hadha al-birra wat-taqwa, wa minal-'amali ma tarda.",
        translation: "O Allah, we ask You on this journey for goodness and piety, and for works that are pleasing to You.",
        repeat: 1,
        source: "Muslim"
      },
    ],
  },
];
