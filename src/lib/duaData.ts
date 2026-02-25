export interface Dua {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  reference?: string;
}

export interface DuaCategory {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  duas: Dua[];
}

export const DUA_DATA: DuaCategory[] = [
  {
    id: "quran",
    title: "Duas from Quran",
    titleAr: "أدعية من القرآن",
    icon: "book",
    duas: [
      { id: 1, arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhab an-nar", translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.", source: "Quran", reference: "2:201" },
      { id: 2, arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ", transliteration: "Rabbana la tuzigh quloobana ba'da idh hadaytana wa hab lana min ladunka rahmah innaka antal-Wahhab", translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.", source: "Quran", reference: "3:8" },
      { id: 3, arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ", transliteration: "Rabbij'alni muqeemas-salati wa min dhurriyyati Rabbana wa taqabbal du'a", translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.", source: "Quran", reference: "14:40" },
      { id: 4, arabic: "رَبِّ زِدْنِي عِلْمًا", transliteration: "Rabbi zidni 'ilma", translation: "My Lord, increase me in knowledge.", source: "Quran", reference: "20:114" },
      { id: 5, arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي", transliteration: "Rabbish-rahli sadri wa yassir li amri wahlul 'uqdatan min lisani yafqahu qawli", translation: "My Lord, expand for me my breast and ease for me my task and untie the knot from my tongue that they may understand my speech.", source: "Quran", reference: "20:25-28" },
      { id: 6, arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama", translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.", source: "Quran", reference: "25:74" },
      { id: 7, arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ", transliteration: "Rabbana-ghfir lana wa li-ikhwaninal-ladhina sabaquna bil-iman", translation: "Our Lord, forgive us and our brothers who preceded us in faith.", source: "Quran", reference: "59:10" },
      { id: 8, arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", transliteration: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasireen", translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", source: "Quran", reference: "7:23" },
    ],
  },
  {
    id: "sunnah",
    title: "Duas from Sunnah",
    titleAr: "أدعية من السنة",
    icon: "star",
    duas: [
      { id: 10, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina", translation: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.", source: "Sunnah", reference: "Muslim 2721" },
      { id: 11, arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal", translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.", source: "Sunnah", reference: "Bukhari 6369" },
      { id: 12, arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي", transliteration: "Allahumma aslih li deeni alladhi huwa 'ismatu amri, wa aslih li dunyaya allati fiha ma'ashi, wa aslih li akhirati allati fiha ma'adi", translation: "O Allah, set right for me my religion which is the safeguard of my affairs, set right my worldly life wherein is my livelihood, and set right my Hereafter to which is my return.", source: "Sunnah", reference: "Muslim 2720" },
      { id: 13, arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhab an-nar", translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.", source: "Sunnah", reference: "Bukhari 6389" },
      { id: 14, arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni", translation: "O Allah, You are the Pardoner, You love to pardon, so pardon me.", source: "Sunnah", reference: "Tirmidhi 3513" },
      { id: 15, arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", transliteration: "Ya muqallibal-qulubi thabbit qalbi 'ala dinik", translation: "O Turner of hearts, make my heart firm upon Your religion.", source: "Sunnah", reference: "Tirmidhi 2140" },
    ],
  },
  {
    id: "daily",
    title: "Daily Life",
    titleAr: "أدعية الحياة اليومية",
    icon: "heart",
    duas: [
      { id: 20, arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim", translation: "In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.", source: "Sunnah", reference: "Abu Dawud 5088" },
      { id: 21, arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur", translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.", source: "Sunnah", reference: "Tirmidhi 3391" },
      { id: 22, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbala", translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.", source: "Sunnah", reference: "Ibn Majah 925" },
      { id: 23, arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", transliteration: "Bismillahi tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah", translation: "In the Name of Allah, I place my trust in Allah. There is no might nor power except with Allah.", source: "Sunnah", reference: "Abu Dawud 5095" },
      { id: 24, arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا", transliteration: "Allahummaj'al fi qalbi nuran wa fi basari nuran wa fi sam'i nuran", translation: "O Allah, place light in my heart, light in my sight, and light in my hearing.", source: "Sunnah", reference: "Bukhari 6316" },
    ],
  },
  {
    id: "protection",
    title: "Protection & Healing",
    titleAr: "أدعية الحماية والشفاء",
    icon: "shield",
    duas: [
      { id: 30, arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bi kalimatil-lahit-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.", source: "Sunnah", reference: "Muslim 2708" },
      { id: 31, arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ", transliteration: "Allahumma inni a'udhu bika minal-barasi wal-jununi wal-judhami wa min sayyi'il-asqam", translation: "O Allah, I seek refuge in You from leprosy, madness, elephantiasis, and evil diseases.", source: "Sunnah", reference: "Abu Dawud 1554" },
      { id: 32, arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي", transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari", translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.", source: "Sunnah", reference: "Abu Dawud 5090" },
      { id: 33, arabic: "بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ اللَّهُ يَشْفِيكَ", transliteration: "Bismillahi arqika min kulli shay'in yu'dhika, min sharri kulli nafsin aw 'aynin hasidin, Allahu yashfik", translation: "In the Name of Allah I perform ruqyah for you, from everything that is harming you, from the evil of every soul or envious eye. May Allah heal you.", source: "Sunnah", reference: "Muslim 2186" },
    ],
  },
  {
    id: "forgiveness",
    title: "Forgiveness",
    titleAr: "أدعية الاستغفار",
    icon: "refresh",
    duas: [
      { id: 40, arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya wa abu'u bidhanbi, faghfirli fa innahu la yaghfirudh-dhunuba illa anta", translation: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant. I abide by Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins except You.", source: "Sunnah", reference: "Bukhari 6306 (Sayyid al-Istighfar)" },
      { id: 41, arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", transliteration: "Rabbigh-fir li wa tub 'alayya innaka antat-Tawwabur-Rahim", translation: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of Repentance, the Most Merciful.", source: "Sunnah", reference: "Abu Dawud 1516" },
      { id: 42, arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", transliteration: "Astaghfirullaha al-'Azim alladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh", translation: "I seek forgiveness from Allah, the Magnificent, whom there is no deity but Him, the Living, the Sustainer, and I repent to Him.", source: "Sunnah", reference: "Abu Dawud 1517" },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Strength",
    titleAr: "أدعية الهداية والقوة",
    icon: "compass",
    duas: [
      { id: 50, arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي", transliteration: "Allahummah-dini wa saddidni", translation: "O Allah, guide me and keep me on the right path.", source: "Sunnah", reference: "Muslim 2725" },
      { id: 51, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ", transliteration: "Allahumma inni as'alukat-thabata fil-amri wal-'azimata 'alar-rushd", translation: "O Allah, I ask You for steadfastness in my affairs and determination upon the right guidance.", source: "Sunnah", reference: "Nasai 1305" },
      { id: 52, arabic: "اللَّهُمَّ أَلْهِمْنِي رُشْدِي وَأَعِذْنِي مِنْ شَرِّ نَفْسِي", transliteration: "Allahumma alhimni rushdi wa a'idhni min sharri nafsi", translation: "O Allah, inspire me with right guidance and protect me from the evil of myself.", source: "Sunnah", reference: "Tirmidhi 3483" },
      { id: 53, arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ وَتَرْكَ الْمُنْكَرَاتِ وَحُبَّ الْمَسَاكِينِ", transliteration: "Allahumma inni as'aluka fi'lal-khayrati wa tarkal-munkarati wa hubbal-masakin", translation: "O Allah, I ask You for the doing of good deeds, leaving evil deeds, and love of the poor.", source: "Sunnah", reference: "Tirmidhi 3233" },
    ],
  },
  {
    id: "travel",
    title: "Travel & Journey",
    titleAr: "أدعية السفر",
    icon: "plane",
    duas: [
      { id: 60, arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila Rabbina lamunqalibun", translation: "Glory to Him who has subjected this to us, and we could never have it by our efforts. And to our Lord we shall surely return.", source: "Quran", reference: "43:13-14" },
      { id: 61, arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى", transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa wa minal-'amali ma tarda", translation: "O Allah, we ask You in this journey of ours for righteousness, piety, and deeds that please You.", source: "Sunnah", reference: "Muslim 1342" },
      { id: 62, arabic: "اللَّهُمَّ اطْوِ لَنَا الْأَرْضَ وَهَوِّنْ عَلَيْنَا السَّفَرَ", transliteration: "Allahumma-twi lanal-arda wa hawwin 'alaynas-safar", translation: "O Allah, fold up the earth for us and make the journey easy for us.", source: "Sunnah", reference: "Muslim 1342" },
    ],
  },
  {
    id: "family",
    title: "Family & Children",
    titleAr: "أدعية الأسرة والأولاد",
    icon: "users",
    duas: [
      { id: 70, arabic: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ", transliteration: "Rabbi hab li minas-salihin", translation: "My Lord, grant me righteous offspring.", source: "Quran", reference: "37:100" },
      { id: 71, arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ", transliteration: "Rabbi la tadharni fardan wa anta khayrul-warithin", translation: "My Lord, do not leave me alone, and You are the Best of inheritors.", source: "Quran", reference: "21:89" },
      { id: 72, arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama", translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us a leader for the righteous.", source: "Quran", reference: "25:74" },
    ],
  },
];
