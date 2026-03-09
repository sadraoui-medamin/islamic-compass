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
      { id: 1, arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "Asbahna wa asbahal-mulku lillah...", translation: "We have reached the morning and at this very time the kingdom belongs to Allah...", repeat: 1, source: "Muslim" },
      { id: 2, arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna, wa bika amsayna...", translation: "O Allah, by Your leave we have reached the morning...", repeat: 1, source: "Tirmidhi" },
      { id: 3, arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", transliteration: "SubhanAllahi wa bihamdihi.", translation: "Glory is to Allah and praise is to Him.", repeat: 100, source: "Muslim" },
      { id: 4, arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallahu wahdahu la sharika lah...", translation: "None has the right to be worshipped except Allah, alone...", repeat: 10, source: "Bukhari & Muslim" },
      { id: 5, arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimati-llahit-tammati min sharri ma khalaq.", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", repeat: 3, source: "Muslim" },
      { id: 6, arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un...", translation: "In the Name of Allah, with Whose Name nothing can cause harm...", repeat: 3, source: "Abu Dawud & Tirmidhi" },
      { id: 7, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah.", translation: "O Allah, I ask You for well-being in this world and the Hereafter.", repeat: 1, source: "Abu Dawud & Ibn Majah" },
      { id: 100, arabic: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ", transliteration: "Allahumma 'alimal-ghaybi wash-shahadah...", translation: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth...", repeat: 1, source: "Tirmidhi" },
      { id: 101, arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", transliteration: "Raditu billahi rabban, wa bil-islami dinan, wa bi Muhammadin nabiyya.", translation: "I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.", repeat: 3, source: "Abu Dawud" },
      { id: 102, arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", transliteration: "Ya Hayyu ya Qayyum, bi rahmatika astaghith...", translation: "O Ever-Living, O Sustainer, in Your mercy I seek relief, rectify all my affairs...", repeat: 1, source: "Al-Hakim" },
      { id: 103, arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshik...", translation: "O Allah, I have reached the morning and call upon You, the bearers of Your Throne, Your angels and all creation to witness that You are Allah...", repeat: 4, source: "Abu Dawud" },
    ],
  },
  {
    id: "evening",
    title: "Evening Adhkar",
    arabic: "أذكار المساء",
    icon: "moon",
    adhkar: [
      { id: 8, arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "Amsayna wa amsal-mulku lillah...", translation: "We have reached the evening and the kingdom belongs to Allah...", repeat: 1, source: "Muslim" },
      { id: 9, arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", transliteration: "Allahumma bika amsayna, wa bika asbahna...", translation: "O Allah, by Your leave we have reached the evening...", repeat: 1, source: "Tirmidhi" },
      { id: 10, arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimati-llahit-tammati min sharri ma khalaq.", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", repeat: 3, source: "Muslim" },
      { id: 11, arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", transliteration: "SubhanAllahi wa bihamdihi.", translation: "Glory is to Allah and praise is to Him.", repeat: 100, source: "Muslim" },
      { id: 12, arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan...", translation: "O Allah, I seek refuge in You from worry and grief...", repeat: 1, source: "Bukhari" },
      { id: 110, arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", transliteration: "Allahumma ma amsa bi min ni'matin aw bi ahadin min khalqik...", translation: "O Allah, whatever blessing I have this evening is from You alone...", repeat: 1, source: "Abu Dawud" },
      { id: 111, arabic: "حَسْبِيَ اللهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu...", translation: "Allah is sufficient for me. There is no god but Him. I put my trust in Him...", repeat: 7, source: "Abu Dawud" },
    ],
  },
  {
    id: "after-prayer",
    title: "After Prayer",
    arabic: "أذكار بعد الصلاة",
    icon: "star",
    adhkar: [
      { id: 13, arabic: "أَسْتَغْفِرُ اللهَ", transliteration: "Astaghfirullah.", translation: "I seek the forgiveness of Allah.", repeat: 3, source: "Muslim" },
      { id: 14, arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", transliteration: "Allahumma antas-salam, wa minkas-salam...", translation: "O Allah, You are Peace, and from You is peace...", repeat: 1, source: "Muslim" },
      { id: 15, arabic: "سُبْحَانَ اللهِ", transliteration: "SubhanAllah.", translation: "Glory is to Allah.", repeat: 33, source: "Muslim" },
      { id: 16, arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah.", translation: "All praise is for Allah.", repeat: 33, source: "Muslim" },
      { id: 17, arabic: "اللهُ أَكْبَرُ", transliteration: "Allahu Akbar.", translation: "Allah is the Greatest.", repeat: 34, source: "Muslim" },
      { id: 18, arabic: "آيَةُ الْكُرْسِيِّ", transliteration: "Ayatul-Kursi (Al-Baqarah 2:255).", translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...", repeat: 1, source: "An-Nasa'i" },
      { id: 120, arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ", transliteration: "La ilaha illallahu wahdahu la sharika lah... Allahumma la mani'a lima a'tayt...", translation: "None has the right to be worshipped except Allah alone... O Allah, none can prevent what You have willed to bestow...", repeat: 1, source: "Bukhari & Muslim" },
    ],
  },
  {
    id: "before-sleep",
    title: "Before Sleep",
    arabic: "أذكار النوم",
    icon: "moon",
    adhkar: [
      { id: 19, arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration: "Bismika Allahumma amutu wa ahya.", translation: "In Your name O Allah, I die and I live.", repeat: 1, source: "Bukhari" },
      { id: 20, arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak.", translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.", repeat: 3, source: "Abu Dawud & Tirmidhi" },
      { id: 21, arabic: "سُبْحَانَ اللهِ", transliteration: "SubhanAllah.", translation: "Glory is to Allah.", repeat: 33, source: "Bukhari & Muslim" },
      { id: 22, arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah.", translation: "All praise is for Allah.", repeat: 33, source: "Bukhari & Muslim" },
      { id: 23, arabic: "اللهُ أَكْبَرُ", transliteration: "Allahu Akbar.", translation: "Allah is the Greatest.", repeat: 34, source: "Bukhari & Muslim" },
      { id: 130, arabic: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ وَوَجَّهْتُ وَجْهِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ رَغْبَةً وَرَهْبَةً إِلَيْكَ", transliteration: "Allahumma inni aslamtu nafsi ilayk wa wajjahtu wajhi ilayk...", translation: "O Allah, I submit myself to You, turn my face to You, entrust my affairs to You...", repeat: 1, source: "Bukhari & Muslim" },
      { id: 131, arabic: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْعَرْشِ الْعَظِيمِ رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ فَالِقَ الْحَبِّ وَالنَّوَى وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ", transliteration: "Allahumma rabbas-samawatis-sab'i wa rabbal-'arshil-'azim...", translation: "O Allah, Lord of the seven heavens and Lord of the Magnificent Throne, our Lord and Lord of everything...", repeat: 1, source: "Muslim" },
    ],
  },
  {
    id: "upon-waking",
    title: "Upon Waking",
    arabic: "أذكار الاستيقاظ",
    icon: "sun",
    adhkar: [
      { id: 24, arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", transliteration: "Alhamdu lillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.", translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.", repeat: 1, source: "Bukhari" },
      { id: 25, arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallahu wahdahu la sharika lah...", translation: "None has the right to be worshipped except Allah, alone...", repeat: 1, source: "Bukhari" },
      { id: 140, arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ", transliteration: "Alhamdu lillahilladhi 'afani fi jasadi wa radda 'alayya ruhi...", translation: "Praise is to Allah Who gave health to my body, returned my soul, and permitted me to remember Him.", repeat: 1, source: "Tirmidhi" },
    ],
  },
  {
    id: "entering-mosque",
    title: "Entering Mosque",
    arabic: "دخول المسجد",
    icon: "star",
    adhkar: [
      { id: 26, arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", transliteration: "Allahumma-ftah li abwaba rahmatik.", translation: "O Allah, open the gates of Your mercy for me.", repeat: 1, source: "Muslim" },
      { id: 27, arabic: "أَعُوذُ بِاللهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration: "A'udhu billahil-'azim, wa bi wajhihil-karim...", translation: "I seek refuge with Allah, the Supreme...", repeat: 1, source: "Abu Dawud" },
    ],
  },
  {
    id: "leaving-mosque",
    title: "Leaving Mosque",
    arabic: "الخروج من المسجد",
    icon: "star",
    adhkar: [
      { id: 150, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", transliteration: "Allahumma inni as'aluka min fadlik.", translation: "O Allah, I ask You of Your bounty.", repeat: 1, source: "Muslim" },
      { id: 151, arabic: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration: "Bismillah, was-salatu was-salamu 'ala Rasulillah...", translation: "In the Name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You of Your bounty...", repeat: 1, source: "Abu Dawud" },
    ],
  },
  {
    id: "after-eating",
    title: "After Eating",
    arabic: "بعد الطعام",
    icon: "star",
    adhkar: [
      { id: 28, arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", transliteration: "Alhamdu lillahilladhi at'amani hadha...", translation: "All praise is for Allah who fed me this and provided it for me...", repeat: 1, source: "Abu Dawud & Tirmidhi" },
      { id: 29, arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ", transliteration: "Alhamdu lillahi hamdan kathiran tayyiban mubarakan fih.", translation: "All praise is for Allah, much good and blessed praise.", repeat: 1, source: "Bukhari" },
    ],
  },
  {
    id: "before-eating",
    title: "Before Eating",
    arabic: "قبل الطعام",
    icon: "star",
    adhkar: [
      { id: 160, arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah.", translation: "In the Name of Allah.", repeat: 1, source: "Abu Dawud & Tirmidhi" },
      { id: 161, arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ بِسْمِ اللَّهِ", transliteration: "Allahumma barik lana fima razaqtana wa qina 'adhaban-nar, bismillah.", translation: "O Allah, bless us in what You have provided for us and protect us from the punishment of the Fire. In the Name of Allah.", repeat: 1, source: "Ibn As-Sunni" },
    ],
  },
  {
    id: "traveling",
    title: "Traveling",
    arabic: "أذكار السفر",
    icon: "star",
    adhkar: [
      { id: 30, arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", transliteration: "Subhanalladhi sakhkhara lana hadha...", translation: "How perfect is He who has placed this at our service...", repeat: 1, source: "Muslim" },
      { id: 31, arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى", transliteration: "Allahumma inna nas'aluka fi safarina hadha al-birra wat-taqwa...", translation: "O Allah, we ask You on this journey for goodness and piety...", repeat: 1, source: "Muslim" },
      { id: 170, arabic: "اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ", transliteration: "Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah.", translation: "O Allah, make this journey easy for us and shorten the distance for us.", repeat: 1, source: "Muslim" },
    ],
  },
  {
    id: "entering-home",
    title: "Entering Home",
    arabic: "دخول المنزل",
    icon: "star",
    adhkar: [
      { id: 180, arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا", transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala rabbina tawakkalna.", translation: "In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we depend.", repeat: 1, source: "Abu Dawud" },
    ],
  },
  {
    id: "rain",
    title: "When It Rains",
    arabic: "عند نزول المطر",
    icon: "star",
    adhkar: [
      { id: 190, arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا", transliteration: "Allahumma sayyiban nafi'an.", translation: "O Allah, let it be a beneficial rain.", repeat: 1, source: "Bukhari" },
      { id: 191, arabic: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ", transliteration: "Mutirna bi fadlillahi wa rahmatihi.", translation: "We have been given rain by the grace and mercy of Allah.", repeat: 1, source: "Bukhari & Muslim" },
    ],
  },
];
