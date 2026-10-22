const QURAN_READER = {
    label: "Open the Quran reader",
    href: "/deen-islam/learning/quran",
    note: "Arabic text, Bengali translation, and audio are provided by the existing AlQuran Cloud integration.",
};

const QURAN_SOURCE = {
    label: "AlQuran Cloud",
    href: "https://alquran.cloud",
    note: "The source used by this project for Quranic text and translations.",
};

const FATIHAH = {
    label: "Surah Al-Fatihah (1)",
    href: "/deen-islam/learning/quran/1",
    note: "Read the verified Arabic text and Bengali translation in the Academy reader.",
};

const IKHLAS = {
    label: "Surah Al-Ikhlas (112)",
    href: "/deen-islam/learning/quran/112",
    note: "A short surah for guided reading practice.",
};

const FALAQ = {
    label: "Surah Al-Falaq (113)",
    href: "/deen-islam/learning/quran/113",
    note: "A short surah for guided reading practice.",
};

const NAS = {
    label: "Surah An-Nas (114)",
    href: "/deen-islam/learning/quran/114",
    note: "A short surah for guided reading practice.",
};

function lesson(lessonData) {
    return {
        type: "lesson",
        passingScore: 70,
        ...lessonData,
    };
}

const foundationModules = [
    {
        id: "letters-and-sounds",
        title: "Letters and Sounds",
        description:
            "Recognise the Arabic alphabet and build a careful foundation for pronunciation.",
        lessons: [
            lesson({
                id: "arabic-letters",
                title: "Arabic Letters and Letter Recognition",
                estimatedMinutes: 25,
                summary:
                    "Meet the 28 Arabic letters, their names, and the idea that letters change shape depending on where they appear in a word.",
                objectives: [
                    "Recognise the Arabic alphabet in its isolated form.",
                    "Understand that Arabic is read from right to left.",
                    "Notice how letters connect differently at the beginning, middle, and end of a word.",
                ],
                sections: [
                    {
                        heading: "Start with the alphabet",
                        paragraphs: [
                            "The Arabic alphabet contains 28 letters. Each letter has a name and a basic shape. Arabic is written and read from right to left, so the first letter of a word appears on the right.",
                            "A useful first goal is recognition, not speed. Learn to point at a letter and name it consistently before trying to read full words.",
                        ],
                    },
                    {
                        heading: "Letters change shape",
                        paragraphs: [
                            "Most Arabic letters take a different form depending on whether they stand alone, join at the beginning of a word, join in the middle, or join at the end. The underlying letter does not change, but its written shape does.",
                            "Some letters do not connect to the letter after them. These non-connecting letters are ا, د, ذ, ر, ز, and و. They can still connect to a previous letter, but the following letter starts a new connected section.",
                        ],
                    },
                    {
                        heading: "A practical study method",
                        points: [
                            "Learn a small group of letters at a time instead of all 28 at once.",
                            "Compare letters with similar shapes, such as ب, ت, and ث, and notice the dots that distinguish them.",
                            "Write each letter in isolated, initial, medial, and final form.",
                            "Use the Quran reader only for recognition practice at this stage, not for independent recitation.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Letter recognition practice",
                    instructions:
                        "Choose a short surah in the Academy Quran reader. Without trying to read it aloud, find and name ten Arabic letters. Then write those ten letters in a notebook and circle the ones whose shape changes when joined.",
                },
                quiz: [
                    {
                        id: "letters-1",
                        question: "How many letters are in the Arabic alphabet?",
                        options: ["24", "26", "28", "30"],
                        answer: 2,
                        explanation:
                            "The Arabic alphabet has 28 letters.",
                    },
                    {
                        id: "letters-2",
                        question: "In which direction is Arabic read?",
                        options: [
                            "Left to right",
                            "Right to left",
                            "Top to bottom only",
                            "Alternating direction",
                        ],
                        answer: 1,
                        explanation:
                            "Arabic is read from right to left.",
                    },
                    {
                        id: "letters-3",
                        question:
                            "Which of these letters does not connect to the letter after it?",
                        options: ["ب", "ت", "ا", "م"],
                        answer: 2,
                        explanation:
                            "Alif (ا) is one of the non-connecting letters.",
                    },
                ],
            }),
            lesson({
                id: "pronunciation-articulation",
                title: "Correct Pronunciation and Articulation",
                estimatedMinutes: 30,
                summary:
                    "Learn what articulation points are, why listening matters, and why pronunciation should be checked with a qualified teacher.",
                objectives: [
                    "Understand the basic idea of makhraj (articulation point).",
                    "Recognise that several Arabic letters sound similar to new learners.",
                    "Know when to seek human feedback instead of relying on text alone.",
                ],
                sections: [
                    {
                        heading: "What is makhraj?",
                        paragraphs: [
                            "Makhraj refers to the place in the mouth, throat, lips, or nasal passage where a letter is produced. Tajweed teachers describe several broad articulation areas: the throat, the tongue, the lips, and the nasal cavity.",
                            "Beginners do not need to memorise every detailed articulation point immediately. The first step is to listen carefully and avoid replacing unfamiliar Arabic sounds with the closest sound from another language.",
                        ],
                    },
                    {
                        heading: "Listen, repeat, and check",
                        points: [
                            "Use a reliable reciter or a qualified teacher as your pronunciation model.",
                            "Repeat a short sound slowly before joining it to other letters.",
                            "Ask a teacher to check letters that sound similar to you.",
                            "Do not treat a text-based answer as certification that your pronunciation is correct.",
                        ],
                    },
                    {
                        heading: "A note about AI feedback",
                        paragraphs: [
                            "The Academy assistant can explain where a letter is typically articulated, but it cannot hear you and cannot certify correct recitation. Pronunciation is a physical skill that needs listening and guided correction.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Listening and repetition",
                    instructions:
                        "Pick three letters that are difficult for you. Listen to a reliable reciter, repeat each sound five times slowly, then ask a qualified teacher or experienced reader to identify one correction.",
                },
                quiz: [
                    {
                        id: "pronunciation-1",
                        question: "What does makhraj refer to?",
                        options: [
                            "The length of a surah",
                            "The place where a letter is articulated",
                            "The translation of a verse",
                            "The number of verses in a surah",
                        ],
                        answer: 1,
                        explanation:
                            "Makhraj is the articulation point of a letter.",
                    },
                    {
                        id: "pronunciation-2",
                        question:
                            "Can the text-based AI assistant certify correct pronunciation?",
                        options: [
                            "Yes, it can hear the learner",
                            "Yes, if the learner types carefully",
                            "No, it cannot hear or certify recitation",
                            "Only for short surahs",
                        ],
                        answer: 2,
                        explanation:
                            "A text-based assistant cannot hear pronunciation. Human or audio-based feedback is required.",
                    },
                ],
            }),
        ],
    },
    {
        id: "harakat-and-joining",
        title: "Harakat and Joining",
        description:
            "Read short vowels, silent letters, doubled letters, and connected words step by step.",
        lessons: [
            lesson({
                id: "fatha-kasra-damma",
                title: "Basic Harakat: Fatha, Kasra, and Damma",
                estimatedMinutes: 25,
                summary:
                    "Learn the three basic short vowel marks and how they change the sound of a letter.",
                objectives: [
                    "Identify fatha, kasra, and damma.",
                    "Read a single letter with each short vowel.",
                    "Understand why ignoring harakat changes the reading.",
                ],
                sections: [
                    {
                        heading: "The three basic marks",
                        points: [
                            "Fatha is a small diagonal mark above a letter and gives a short 'a' sound.",
                            "Kasra is a small diagonal mark below a letter and gives a short 'i' sound.",
                            "Damma is a small loop-like mark above a letter and gives a short 'u' sound.",
                        ],
                        paragraphs: [
                            "Practice with a single letter first. For example, the letter ب can be read with fatha, kasra, or damma. Keep the sound short; these marks do not create a long vowel by themselves.",
                        ],
                    },
                    {
                        heading: "Read slowly before reading whole words",
                        paragraphs: [
                            "Point to the letter, identify the mark, then produce the sound. This three-step habit prevents guessing. Once single letters are comfortable, join two letters and then three.",
                        ],
                    },
                    {
                        heading: "Common beginner mistake",
                        paragraphs: [
                            "The most common mistake is reading the bare letter and ignoring its mark. Slow down enough to see every mark before you say the sound.",
                        ],
                    },
                ],
                resources: [QURAN_READER, FATIHAH],
                exercise: {
                    title: "Three-column reading drill",
                    instructions:
                        "Write five letters in a notebook. Beside each letter, write the same letter with fatha, kasra, and damma. Read each column slowly with a teacher or reliable audio model.",
                },
                quiz: [
                    {
                        id: "harakat-1",
                        question: "Which mark gives a short 'i' sound?",
                        options: ["Fatha", "Kasra", "Damma", "Sukoon"],
                        answer: 1,
                        explanation: "Kasra is placed below the letter and gives a short 'i' sound.",
                    },
                    {
                        id: "harakat-2",
                        question: "Where is a fatha placed?",
                        options: [
                            "Below the letter",
                            "Above the letter",
                            "Inside the letter",
                            "After the word",
                        ],
                        answer: 1,
                        explanation: "Fatha is written above the letter.",
                    },
                    {
                        id: "harakat-3",
                        question: "What does damma give?",
                        options: [
                            "A short 'a' sound",
                            "A short 'i' sound",
                            "A short 'u' sound",
                            "No sound at all",
                        ],
                        answer: 2,
                        explanation: "Damma gives a short 'u' sound.",
                    },
                ],
            }),
            lesson({
                id: "sukoon-shaddah-tanween",
                title: "Sukoon, Shaddah, and Tanween",
                estimatedMinutes: 30,
                summary:
                    "Understand silence, doubling, and the three double-vowel endings.",
                objectives: [
                    "Recognise sukoon and explain what it does.",
                    "Recognise shaddah and read a doubled letter.",
                    "Distinguish the three forms of tanween.",
                ],
                sections: [
                    {
                        heading: "Sukoon",
                        paragraphs: [
                            "Sukoon is a small mark that shows a letter has no vowel after it. It helps you close the previous sound and move to the next letter without adding an extra vowel.",
                        ],
                    },
                    {
                        heading: "Shaddah",
                        paragraphs: [
                            "Shaddah is a mark that indicates a doubled letter. Read the letter once with pressure and hold it briefly rather than adding a separate vowel in the middle.",
                        ],
                    },
                    {
                        heading: "Tanween",
                        points: [
                            "Fathatan is a double fatha, usually written at the end of a word.",
                            "Kasratan is a double kasra.",
                            "Dammatan is a double damma.",
                            "Tanween adds a short 'n' sound at the end of a word in reading.",
                        ],
                    },
                ],
                resources: [QURAN_READER, IKHLAS],
                exercise: {
                    title: "Mark-spotting practice",
                    instructions:
                        "Open a short surah in the Academy reader. Find three examples of sukoon, two examples of shaddah, and one example of tanween. Copy only the individual words into a notebook and mark each feature with a coloured pencil.",
                },
                quiz: [
                    {
                        id: "sukoon-1",
                        question: "What does sukoon indicate?",
                        options: [
                            "A doubled letter",
                            "A long vowel",
                            "A letter with no vowel",
                            "A silent whole word",
                        ],
                        answer: 2,
                        explanation: "Sukoon indicates that the letter has no vowel.",
                    },
                    {
                        id: "sukoon-2",
                        question: "What does shaddah indicate?",
                        options: [
                            "A doubled letter",
                            "A pause at the end of a verse",
                            "A question mark",
                            "A translation note",
                        ],
                        answer: 0,
                        explanation: "Shaddah marks a doubled letter.",
                    },
                    {
                        id: "sukoon-3",
                        question: "How many forms of tanween are there?",
                        options: ["One", "Two", "Three", "Four"],
                        answer: 2,
                        explanation:
                            "There are three forms: fathatan, kasratan, and dammatan.",
                    },
                ],
            }),
            lesson({
                id: "joining-letters",
                title: "Joining Letters and Reading Connected Words",
                estimatedMinutes: 30,
                summary:
                    "Move from separate letters to connected words by recognising joining and non-joining letters.",
                objectives: [
                    "Join letters into a single word.",
                    "Recognise the six non-connecting letters.",
                    "Read short connected words slowly and accurately.",
                ],
                sections: [
                    {
                        heading: "Words are built from connected sections",
                        paragraphs: [
                            "Arabic words are written as connected groups. When a letter joins the next letter, the shape changes. When a non-joining letter appears, the next letter begins a new connected section.",
                        ],
                    },
                    {
                        heading: "A reliable decoding routine",
                        points: [
                            "Start from the right and identify each letter.",
                            "Check the harakah on each letter before joining.",
                            "Notice sukoon and shaddah.",
                            "Join only after you can identify every part of the word.",
                            "Read the word slowly, then repeat it at a natural pace.",
                        ],
                    },
                    {
                        heading: "Practice with real text",
                        paragraphs: [
                            "Use the Academy Quran reader for short words from Al-Fatihah and the short surahs. Keep the text in front of you and avoid relying on transliteration alone.",
                        ],
                    },
                ],
                resources: [QURAN_READER, FATIHAH],
                exercise: {
                    title: "Decode five words",
                    instructions:
                        "Open Surah Al-Fatihah in the Academy reader. Select five short words. For each word, write the individual letters, identify the harakat, and then read the word aloud slowly.",
                },
                quiz: [
                    {
                        id: "joining-1",
                        question:
                            "Which letter does not connect to the following letter?",
                        options: ["ب", "ر", "م", "ن"],
                        answer: 1,
                        explanation: "Ra (ر) is one of the non-connecting letters.",
                    },
                    {
                        id: "joining-2",
                        question:
                            "What should you identify before joining the letters of a word?",
                        options: [
                            "The translation only",
                            "Each letter and its mark",
                            "The surah number only",
                            "The page number",
                        ],
                        answer: 1,
                        explanation:
                            "Identify each letter and its harakah before joining the word.",
                    },
                ],
            }),
        ],
    },
    {
        id: "guided-quran-reading",
        title: "Guided Quran Reading",
        description:
            "Apply the foundations to short Quranic words and verses with verified text and teacher-guided practice.",
        lessons: [
            lesson({
                id: "word-reading-exercises",
                title: "Basic Quranic Word-Reading Exercises",
                estimatedMinutes: 30,
                summary:
                    "Build a repeatable routine for decoding unfamiliar Quranic words without guessing.",
                objectives: [
                    "Apply the decode-read-repeat routine.",
                    "Use verified Quranic text rather than invented examples.",
                    "Identify the exact part of a word that causes difficulty.",
                ],
                sections: [
                    {
                        heading: "Decode, read, repeat",
                        paragraphs: [
                            "Choose one short word. Identify every letter from right to left, then check each harakah. Read the word slowly, repeat it three times, and only then move to the next word.",
                            "If you make a mistake, do not start the whole page again. Point to the exact letter or mark that caused the problem and correct only that part.",
                        ],
                    },
                    {
                        heading: "Use verified text",
                        paragraphs: [
                            "This course deliberately does not provide invented Quranic text. Read from the Academy Quran reader, which uses the existing AlQuran Cloud integration, and check translations there.",
                        ],
                    },
                ],
                resources: [QURAN_READER, FATIHAH, QURAN_SOURCE],
                exercise: {
                    title: "Ten-word routine",
                    instructions:
                        "From a short surah, choose ten words. For each word: identify the letters, check every mark, read slowly, and repeat three times. Mark the two words that felt hardest and ask a teacher about them.",
                },
            }),
            lesson({
                id: "guided-short-verses",
                title: "Guided Practice with Short Verses",
                estimatedMinutes: 35,
                summary:
                    "Read short verses in a calm, supported routine that combines listening, reading, and correction.",
                objectives: [
                    "Read a short verse with a steady pace.",
                    "Use audio as a model without simply copying without looking.",
                    "Ask for correction on specific words.",
                ],
                sections: [
                    {
                        heading: "A guided practice cycle",
                        points: [
                            "Listen to the verse once while following the Arabic text.",
                            "Read it slowly aloud while pointing to each word.",
                            "Listen again and notice one difference.",
                            "Repeat the verse twice more.",
                            "Ask a qualified teacher to check one specific word or rule.",
                        ],
                    },
                    {
                        heading: "Suggested practice portions",
                        paragraphs: [
                            "Start with Al-Fatihah, then move to Al-Ikhlas, Al-Falaq, and An-Nas. These are short enough for focused practice, and the Academy reader provides verified Arabic text, Bengali translation, and available audio.",
                        ],
                    },
                ],
                resources: [FATIHAH, IKHLAS, FALAQ, NAS],
                exercise: {
                    title: "One verse, three passes",
                    instructions:
                        "Choose one short verse. Do three passes: listening, slow reading, and normal-pace reading. Write down one correction you received or one word you want to review next time.",
                },
                quiz: [
                    {
                        id: "guided-1",
                        question:
                            "What should you do before reading a verse at normal speed?",
                        options: [
                            "Skip the harakat",
                            "Listen and read it slowly",
                            "Memorise the translation first",
                            "Read a different surah",
                        ],
                        answer: 1,
                        explanation:
                            "Listening and slow reading make the words and marks clearer before speed is increased.",
                    },
                    {
                        id: "guided-2",
                        question: "Where should Quranic text come from?",
                        options: [
                            "Any AI-generated text",
                            "A verified Quran source",
                            "A social media comment",
                            "An invented practice sentence",
                        ],
                        answer: 1,
                        explanation:
                            "Quranic text must come from a verified source. The Academy uses AlQuran Cloud.",
                    },
                ],
            }),
            lesson({
                id: "intro-tajweed",
                title: "Introduction to Tajweed",
                estimatedMinutes: 20,
                summary:
                    "Understand what tajweed is, why it matters, and how to learn it without overwhelming yourself.",
                objectives: [
                    "Define tajweed in simple terms.",
                    "Understand that tajweed is learned gradually with a teacher.",
                    "Name the main areas beginners encounter.",
                ],
                sections: [
                    {
                        heading: "What is tajweed?",
                        paragraphs: [
                            "Tajweed is the study and practice of reciting the Quran with correct articulation and the established rules of recitation. It is a skill built through listening, repetition, and correction.",
                            "Tajweed is not a substitute for learning the meanings of the Quran, and it should not be reduced to a list of labels. The purpose is careful, accurate recitation.",
                        ],
                    },
                    {
                        heading: "What beginners should focus on",
                        points: [
                            "Correct letter sounds and clear harakat.",
                            "A calm pace that allows every mark to be read.",
                            "Basic madd, ghunnah, and noon/meem rules when a teacher introduces them.",
                            "Consistent short practice rather than occasional long sessions.",
                        ],
                    },
                    {
                        heading: "Learn with a teacher",
                        paragraphs: [
                            "Rules can be explained in text, but recitation needs human feedback. Use this course to understand the vocabulary and prepare questions, then verify practice with a qualified teacher.",
                        ],
                    },
                ],
                resources: [QURAN_SOURCE, QURAN_READER],
                exercise: {
                    title: "Prepare three questions",
                    instructions:
                        "Write three questions about pronunciation or tajweed that you want a teacher to answer. Keep them specific, such as a particular letter or a rule you have heard but do not understand.",
                },
                quiz: [
                    {
                        id: "tajweed-1",
                        question: "What is tajweed mainly about?",
                        options: [
                            "Translating every verse",
                            "Reciting with correct articulation and established rules",
                            "Memorising surah names only",
                            "Writing Arabic poetry",
                        ],
                        answer: 1,
                        explanation:
                            "Tajweed is the practice of correct recitation, including articulation and established rules.",
                    },
                    {
                        id: "tajweed-2",
                        question: "How should a beginner approach tajweed?",
                        options: [
                            "Memorise every rule in one day",
                            "Learn gradually with listening and teacher feedback",
                            "Ignore pronunciation until later",
                            "Rely only on text descriptions",
                        ],
                        answer: 1,
                        explanation:
                            "Tajweed is a gradual skill that needs listening, practice, and correction.",
                    },
                ],
            }),
            lesson({
                id: "foundations-assessment",
                title: "Final Reading Assessment",
                type: "assessment",
                estimatedMinutes: 20,
                summary:
                    "Check your understanding of the foundations and identify what to review before moving on.",
                objectives: [
                    "Demonstrate recognition of letters, harakat, sukoon, shaddah, and tanween.",
                    "Apply a decoding routine to short Quranic words.",
                    "Identify areas that need teacher-supported practice.",
                ],
                completionNote:
                    "This assessment is a learning check, not a certificate. A qualified teacher should verify practical recitation.",
                sections: [
                    {
                        heading: "Before you begin",
                        paragraphs: [
                            "Complete the assessment without looking back at the lesson notes. You can retake it. A score of 70% or higher unlocks the next course level.",
                            "The assessment checks knowledge, not the sound of your voice. Continue practising recitation with a teacher.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                quiz: [
                    {
                        id: "foundations-final-1",
                        question: "Which mark is placed below a letter?",
                        options: ["Fatha", "Kasra", "Damma", "Sukoon"],
                        answer: 1,
                        explanation: "Kasra is placed below the letter.",
                    },
                    {
                        id: "foundations-final-2",
                        question: "What does sukoon show?",
                        options: [
                            "A doubled letter",
                            "A letter with no vowel",
                            "A long vowel",
                            "A pause mark",
                        ],
                        answer: 1,
                        explanation: "Sukoon shows that a letter has no vowel.",
                    },
                    {
                        id: "foundations-final-3",
                        question: "Which set contains only non-connecting letters?",
                        options: [
                            "ا، د، ر، ز",
                            "ب، ت، ث، ن",
                            "م، ك، ل، ه",
                            "ع، غ، ف، ق",
                        ],
                        answer: 0,
                        explanation:
                            "Alif, dal, ra, and zay do not connect to the following letter.",
                    },
                    {
                        id: "foundations-final-4",
                        question: "What is the first step when decoding a word?",
                        options: [
                            "Guess the meaning",
                            "Identify each letter from right to left",
                            "Read it as fast as possible",
                            "Skip the harakat",
                        ],
                        answer: 1,
                        explanation:
                            "Start with letter recognition from right to left, then check the marks.",
                    },
                    {
                        id: "foundations-final-5",
                        question: "Which statement is correct?",
                        options: [
                            "Text-based AI can certify recitation",
                            "Tajweed needs no teacher",
                            "Practical recitation should be checked by a qualified teacher",
                            "Harakat are optional decoration",
                        ],
                        answer: 2,
                        explanation:
                            "Practical recitation needs qualified human feedback; AI can explain but cannot certify it.",
                    },
                ],
            }),
        ],
    },
];

const fluencyModules = [
    {
        id: "fluency-foundations",
        title: "Fluency Foundations",
        description:
            "Read connected Quranic text with accuracy first and speed second.",
        lessons: [
            lesson({
                id: "connected-verses",
                title: "Reading Connected Quranic Words and Verses",
                estimatedMinutes: 30,
                summary:
                    "Build the habit of reading whole phrases while keeping every letter and mark visible.",
                objectives: [
                    "Read a complete short verse without losing your place.",
                    "Group words into meaningful phrases.",
                    "Correct errors without restarting the whole verse.",
                ],
                sections: [
                    {
                        heading: "From words to phrases",
                        paragraphs: [
                            "Once individual words are readable, the next step is to group them into short phrases. Read a phrase, pause briefly, then continue. This is more stable than trying to read an entire page in one breath.",
                        ],
                    },
                    {
                        heading: "Keep accuracy first",
                        points: [
                            "Use your finger or a pointer to keep your place.",
                            "Read at a pace that lets you see every harakah.",
                            "Mark the exact word where you stopped.",
                            "Repeat the phrase once after correcting a mistake.",
                        ],
                    },
                ],
                resources: [FATIHAH, IKHLAS, QURAN_READER],
                exercise: {
                    title: "Phrase-by-phrase reading",
                    instructions:
                        "Open Al-Fatihah. Read it in short phrases, pausing after each phrase. Mark any word that required correction and practise only that word three times.",
                },
            }),
            lesson({
                id: "accuracy-fluency",
                title: "Improving Accuracy and Fluency",
                estimatedMinutes: 30,
                summary:
                    "Use repetition, audio comparison, and targeted correction to become more fluent without rushing.",
                objectives: [
                    "Separate accuracy practice from speed practice.",
                    "Use a reliable audio model for comparison.",
                    "Build a short daily practice routine.",
                ],
                sections: [
                    {
                        heading: "Fluency is controlled accuracy",
                        paragraphs: [
                            "Fluency is not reading as quickly as possible. It is reading smoothly while still pronouncing letters and marks correctly. If speed causes mistakes, reduce the pace.",
                        ],
                    },
                    {
                        heading: "A three-stage practice",
                        points: [
                            "Accuracy pass: very slow reading with every mark checked.",
                            "Guided pass: read along with a reliable reciter or teacher.",
                            "Independent pass: read without audio, then compare and note one correction.",
                        ],
                    },
                ],
                resources: [FATIHAH, QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Three-stage passage",
                    instructions:
                        "Choose one short surah. Complete all three passes and write down one thing that improved and one thing that still needs correction.",
                },
                quiz: [
                    {
                        id: "fluency-1",
                        question: "What is the best definition of fluency here?",
                        options: [
                            "Reading as fast as possible",
                            "Reading smoothly while remaining accurate",
                            "Memorising without looking",
                            "Skipping difficult words",
                        ],
                        answer: 1,
                        explanation:
                            "Fluency means smooth, accurate reading, not maximum speed.",
                    },
                    {
                        id: "fluency-2",
                        question:
                            "What should you do if speed causes repeated mistakes?",
                        options: [
                            "Increase speed",
                            "Slow down and correct the specific words",
                            "Stop studying the Quran",
                            "Ignore the mistakes",
                        ],
                        answer: 1,
                        explanation:
                            "Reduce the pace and correct the specific words before increasing speed again.",
                    },
                ],
            }),
            lesson({
                id: "madd-rules",
                title: "Madd Rules and Guided Exercises",
                estimatedMinutes: 30,
                summary:
                    "Learn the basic idea of elongation, the natural madd, and why its length should be learned from a teacher.",
                objectives: [
                    "Explain what madd means.",
                    "Recognise the natural madd in Quranic text.",
                    "Know that madd counts should be learned through qualified recitation.",
                ],
                sections: [
                    {
                        heading: "What is madd?",
                        paragraphs: [
                            "Madd refers to elongation of a vowel sound. The natural madd is the basic two-count elongation associated with the long vowel letters. Other madd categories can have different lengths depending on the rule and the recitation being followed.",
                        ],
                    },
                    {
                        heading: "Why counts need guidance",
                        paragraphs: [
                            "Counting in a text description is not the same as hearing and producing the correct length. Reciters and teachers demonstrate the duration, and different valid recitation traditions can have specific details. Learn the rule, then verify the sound with a qualified teacher.",
                        ],
                    },
                ],
                resources: [QURAN_READER, FATIHAH, QURAN_SOURCE],
                exercise: {
                    title: "Find and mark",
                    instructions:
                        "Open a short surah and find three examples of long vowel letters. Mark them in a notebook. Do not guess the count; ask your teacher to demonstrate each example.",
                },
                quiz: [
                    {
                        id: "madd-1",
                        question: "What does madd refer to?",
                        options: [
                            "Stopping suddenly",
                            "Elongation of a vowel sound",
                            "Writing a letter twice",
                            "Silent reading",
                        ],
                        answer: 1,
                        explanation: "Madd is the elongation of a vowel sound.",
                    },
                    {
                        id: "madd-2",
                        question: "What is the natural madd commonly described as?",
                        options: [
                            "A four-count pause",
                            "A two-count elongation",
                            "No sound",
                            "A whispered letter",
                        ],
                        answer: 1,
                        explanation:
                            "The natural madd is commonly described as a two-count elongation.",
                    },
                    {
                        id: "madd-3",
                        question: "How should madd length be verified?",
                        options: [
                            "By guessing",
                            "With a qualified teacher or reliable recitation model",
                            "By reading faster",
                            "By ignoring it",
                        ],
                        answer: 1,
                        explanation:
                            "Madd length is a recitation skill and should be verified through qualified demonstration.",
                    },
                ],
            }),
        ],
    },
    {
        id: "essential-tajweed",
        title: "Essential Tajweed",
        description:
            "Understand foundational noon and meem rules and find them in verified Quranic text.",
        lessons: [
            lesson({
                id: "noon-meem-rules",
                title: "Ghunnah, Ikhfa, Idgham, and Izhar",
                estimatedMinutes: 35,
                summary:
                    "Meet four foundational tajweed terms and the letters connected to them.",
                objectives: [
                    "Define ghunnah, izhar, idgham, and ikhfa at a beginner level.",
                    "Recognise that these rules require guided listening.",
                    "Avoid applying labels without hearing an example.",
                ],
                sections: [
                    {
                        heading: "The four terms",
                        points: [
                            "Ghunnah is a nasal sound associated with specific letters and conditions.",
                            "Izhar means clarity: a noon sakinah or tanween is read clearly before certain throat letters.",
                            "Idgham means merging: a noon sakinah or tanween is merged into a following letter.",
                            "Ikhfa means concealment: a noon sakinah or tanween is read with a nasal quality before specific letters.",
                        ],
                        paragraphs: [
                            "These definitions are a starting map, not a complete recitation lesson. The exact sound and duration must be learned by listening to a qualified reciter and practising with a teacher.",
                        ],
                    },
                    {
                        heading: "Do not skip the teacher",
                        paragraphs: [
                            "It is easy to memorise a rule name and apply it incorrectly. Work through real examples with a teacher, one rule at a time, and ask for correction.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Rule vocabulary",
                    instructions:
                        "Write each of the four terms on a card. On the back, write its meaning in your own words and one question you want a teacher to demonstrate.",
                },
                quiz: [
                    {
                        id: "rules-1",
                        question: "What does idgham mean?",
                        options: [
                            "Clarity",
                            "Merging",
                            "Stopping",
                            "Elongation",
                        ],
                        answer: 1,
                        explanation: "Idgham refers to merging.",
                    },
                    {
                        id: "rules-2",
                        question: "What does ikhfa mean?",
                        options: [
                            "Concealment",
                            "Clear pronunciation",
                            "Doubling",
                            "Translation",
                        ],
                        answer: 0,
                        explanation: "Ikhfa refers to concealment or hiding.",
                    },
                    {
                        id: "rules-3",
                        question: "Which rule means clarity?",
                        options: ["Ghunnah", "Izhar", "Idgham", "Ikhfa"],
                        answer: 1,
                        explanation: "Izhar means clarity.",
                    },
                    {
                        id: "rules-4",
                        question:
                            "How should these rules be learned correctly?",
                        options: [
                            "Through labels alone",
                            "Through guided listening and teacher correction",
                            "By reading very quickly",
                            "By ignoring examples",
                        ],
                        answer: 1,
                        explanation:
                            "Tajweed rules are heard and practised; teacher correction is essential.",
                    },
                ],
            }),
            lesson({
                id: "rules-in-verses",
                title: "Recognising Learned Rules in Quranic Verses",
                estimatedMinutes: 30,
                summary:
                    "Practise locating familiar rules in verified Quranic text without guessing.",
                objectives: [
                    "Scan a verse for known letters and marks.",
                    "Mark examples of rules already introduced.",
                    "Ask a teacher to verify uncertain examples.",
                ],
                sections: [
                    {
                        heading: "A safe identification method",
                        points: [
                            "Start with one rule only.",
                            "Look for the specific letters and marks connected to that rule.",
                            "Mark the example in a notebook.",
                            "Verify it with a teacher before treating it as certain.",
                        ],
                    },
                    {
                        heading: "Use verified text",
                        paragraphs: [
                            "Work directly from the Academy Quran reader so the Arabic text comes from the existing verified source. Do not copy invented examples from memory.",
                        ],
                    },
                ],
                resources: [FATIHAH, IKHLAS, QURAN_READER],
                exercise: {
                    title: "One-rule hunt",
                    instructions:
                        "Choose one rule from the previous lesson. Find two possible examples in a short surah. Mark them and write why you think each one applies. Ask a teacher to check both.",
                },
                quiz: [
                    {
                        id: "rules-verses-1",
                        question:
                            "What is the safest way to identify a tajweed rule?",
                        options: [
                            "Guess based on sound",
                            "Check the specific letters and verify with a teacher",
                            "Ask an AI to certify your recitation",
                            "Ignore the text",
                        ],
                        answer: 1,
                        explanation:
                            "Rule identification depends on the specific letters and marks, and should be verified with a teacher.",
                    },
                    {
                        id: "rules-verses-2",
                        question: "Why use the Academy Quran reader for examples?",
                        options: [
                            "It generates new verses",
                            "It provides verified Arabic text and translation",
                            "It replaces a teacher",
                            "It hides the harakat",
                        ],
                        answer: 1,
                        explanation:
                            "The reader uses the existing verified Quran source.",
                    },
                ],
            }),
        ],
    },
    {
        id: "fluency-assessment",
        title: "Guided Practice and Review",
        description:
            "Apply accuracy, fluency, madd, and foundational tajweed in short-surah practice.",
        lessons: [
            lesson({
                id: "short-surah-practice",
                title: "Guided Short-Surah Reading Practice",
                estimatedMinutes: 35,
                summary:
                    "Use a repeatable short-surah session to combine reading, listening, and correction.",
                objectives: [
                    "Run a complete practice session independently.",
                    "Track which words and rules need review.",
                    "Ask precise questions when seeking feedback.",
                ],
                sections: [
                    {
                        heading: "A 20-minute session",
                        points: [
                            "Two minutes: listen and follow the Arabic text.",
                            "Five minutes: slow reading with marks checked.",
                            "Five minutes: repeat one difficult phrase.",
                            "Five minutes: read without audio and mark one correction.",
                            "Three minutes: write your next practice question.",
                        ],
                    },
                    {
                        heading: "Choose one surah",
                        paragraphs: [
                            "Use Al-Ikhlas, Al-Falaq, or An-Nas. Stay with one surah for several sessions before moving on so that improvement is measurable.",
                        ],
                    },
                ],
                resources: [IKHLAS, FALAQ, NAS, QURAN_READER],
                exercise: {
                    title: "Practice log",
                    instructions:
                        "Complete one 20-minute session and record the surah, the phrase you repeated, and the specific correction you received.",
                },
            }),
            lesson({
                id: "fluency-final",
                title: "Review Exercises and Final Assessment",
                type: "assessment",
                estimatedMinutes: 25,
                summary:
                    "Review fluency and foundational tajweed, then check your understanding.",
                objectives: [
                    "Review accuracy, fluency, madd, and foundational tajweed concepts.",
                    "Identify areas for teacher-supported revision.",
                    "Pass the knowledge check at 70% or higher.",
                ],
                completionNote:
                    "This assessment is a learning check. Practical recitation remains subject to qualified teacher review.",
                sections: [
                    {
                        heading: "Revision checklist",
                        points: [
                            "Can you explain accuracy before speed?",
                            "Can you describe the natural madd?",
                            "Can you define izhar, idgham, ikhfa, and ghunnah?",
                            "Can you name one part of your recitation that needs correction?",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                quiz: [
                    {
                        id: "fluency-final-1",
                        question: "What comes before speed in Quran reading?",
                        options: ["Volume", "Accuracy", "Memorisation", "Translation"],
                        answer: 1,
                        explanation: "Accuracy must come before speed.",
                    },
                    {
                        id: "fluency-final-2",
                        question: "Madd is best described as:",
                        options: [
                            "Elongation",
                            "Silence",
                            "Merging",
                            "Stopping",
                        ],
                        answer: 0,
                        explanation: "Madd is elongation of a vowel sound.",
                    },
                    {
                        id: "fluency-final-3",
                        question: "Which rule means merging?",
                        options: ["Izhar", "Idgham", "Ikhfa", "Ghunnah"],
                        answer: 1,
                        explanation: "Idgham means merging.",
                    },
                    {
                        id: "fluency-final-4",
                        question: "Who can certify practical recitation?",
                        options: [
                            "A text-only AI",
                            "A qualified teacher",
                            "A word counter",
                            "A translation website",
                        ],
                        answer: 1,
                        explanation:
                            "A qualified teacher provides the human feedback needed for recitation.",
                    },
                    {
                        id: "fluency-final-5",
                        question: "What is a good way to improve fluency?",
                        options: [
                            "Rush through a new page daily",
                            "Use slow accuracy passes and guided repetition",
                            "Avoid listening to reciters",
                            "Skip difficult words",
                        ],
                        answer: 1,
                        explanation:
                            "Slow, accurate repetition and guided listening build fluency.",
                    },
                ],
            }),
        ],
    },
];

const advancedModules = [
    {
        id: "advanced-rules",
        title: "Advanced Rule Application",
        description:
            "Study detailed rules and apply them carefully to verified Quranic passages.",
        lessons: [
            lesson({
                id: "detailed-tajweed",
                title: "More Detailed Tajweed Rules",
                estimatedMinutes: 35,
                summary:
                    "Expand your map of tajweed beyond the basics, with a clear warning against self-certification.",
                objectives: [
                    "Recognise major areas of advanced tajweed study.",
                    "Understand the difference between knowing a rule and performing it.",
                    "Plan a teacher-guided study route.",
                ],
                sections: [
                    {
                        heading: "Areas to study",
                        points: [
                            "Detailed articulation points and letter characteristics.",
                            "Noon and meem rules, including their conditions.",
                            "Madd categories and differences between recitation traditions.",
                            "Qalqalah, lam rules, and the rules of stopping and starting.",
                        ],
                    },
                    {
                        heading: "Knowledge is not performance",
                        paragraphs: [
                            "You can memorise a rule and still apply it incorrectly. Advanced study should pair written understanding with listening, imitation, teacher correction, and regular revision.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Rule map",
                    instructions:
                        "Create a one-page map of the four areas above. Under each area, write one rule you know and one rule you need a teacher to explain.",
                },
                quiz: [
                    {
                        id: "advanced-1",
                        question:
                            "What is the difference between knowing and performing a rule?",
                        options: [
                            "There is no difference",
                            "Knowing is enough for recitation",
                            "Performance requires guided practice and correction",
                            "Only writing matters",
                        ],
                        answer: 2,
                        explanation:
                            "Recitation is a skill; it requires practice and feedback, not only memorised definitions.",
                    },
                    {
                        id: "advanced-2",
                        question:
                            "Which area belongs to advanced tajweed study?",
                        options: [
                            "Letter articulation points",
                            "Madd categories",
                            "Qalqalah",
                            "All of the above",
                        ],
                        answer: 3,
                        explanation:
                            "All three are part of detailed tajweed study.",
                    },
                ],
            }),
            lesson({
                id: "apply-rules-passages",
                title: "Applying Rules to Quranic Passages",
                estimatedMinutes: 35,
                summary:
                    "Move from isolated examples to short passages by applying one or two rules at a time.",
                objectives: [
                    "Annotate a passage for a chosen rule.",
                    "Compare your reading with a reliable model.",
                    "Record corrections instead of relying on memory.",
                ],
                sections: [
                    {
                        heading: "One rule at a time",
                        paragraphs: [
                            "Choose one rule and read a short passage while looking only for that rule. Mark each occurrence, then read the passage slowly. Next, listen to a reliable recitation and compare.",
                        ],
                    },
                    {
                        heading: "Keep a correction log",
                        points: [
                            "Write the word or phrase that needs correction.",
                            "Name the rule involved.",
                            "Write the correction in your own words.",
                            "Review the log at the start of the next session.",
                        ],
                    },
                ],
                resources: [QURAN_READER, IKHLAS, FATIHAH],
                exercise: {
                    title: "Annotated passage",
                    instructions:
                        "Choose one short passage. Annotate two examples of a single rule, read it aloud, then ask a teacher to verify both examples.",
                },
                quiz: [
                    {
                        id: "apply-1",
                        question:
                            "What is a good way to apply a new rule to a passage?",
                        options: [
                            "Look for every rule at once",
                            "Focus on one rule and mark examples",
                            "Read quickly without marking",
                            "Ignore audio",
                        ],
                        answer: 1,
                        explanation:
                            "Focusing on one rule makes application and feedback precise.",
                    },
                    {
                        id: "apply-2",
                        question: "Why keep a correction log?",
                        options: [
                            "To increase word count",
                            "To review recurring mistakes and measure progress",
                            "To replace a teacher",
                            "To memorise translations",
                        ],
                        answer: 1,
                        explanation:
                            "A correction log turns feedback into a focused revision plan.",
                    },
                ],
            }),
        ],
    },
    {
        id: "waqf-and-recitation",
        title: "Waqf, Recitation, and Revision",
        description:
            "Learn stopping and starting, apply rules in longer recitation, and review common mistakes.",
        lessons: [
            lesson({
                id: "waqf-ibtida",
                title: "Waqf and Ibtida Fundamentals",
                estimatedMinutes: 30,
                summary:
                    "Understand why stopping and starting points matter and why they should be learned carefully.",
                objectives: [
                    "Explain waqf and ibtida.",
                    "Recognise that stopping can affect meaning.",
                    "Use verified guidance instead of guessing.",
                ],
                sections: [
                    {
                        heading: "Two connected skills",
                        points: [
                            "Waqf means stopping or pausing during recitation.",
                            "Ibtida means starting again after a stop.",
                            "A stop in the wrong place can distort the meaning, so stopping points should be learned from reliable guidance.",
                        ],
                    },
                    {
                        heading: "Do not guess",
                        paragraphs: [
                            "Beginners should follow a teacher or a verified mushaf with clear stopping marks. When unsure, stop at a natural, complete phrase and ask for guidance rather than making a rule yourself.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Natural phrase practice",
                    instructions:
                        "Read a short passage and mark two places where a complete phrase seems to end. Ask a teacher whether those are appropriate stopping points.",
                },
                quiz: [
                    {
                        id: "waqf-1",
                        question: "What does waqf mean?",
                        options: [
                            "Elongation",
                            "Stopping or pausing",
                            "Merging letters",
                            "Nasal sound",
                        ],
                        answer: 1,
                        explanation: "Waqf refers to stopping or pausing.",
                    },
                    {
                        id: "waqf-2",
                        question: "Why does the place of stopping matter?",
                        options: [
                            "It only changes page layout",
                            "It can affect the meaning",
                            "It changes the surah number",
                            "It has no effect",
                        ],
                        answer: 1,
                        explanation:
                            "Stopping in the wrong place can change or distort meaning.",
                    },
                    {
                        id: "waqf-3",
                        question: "What should a beginner do when unsure?",
                        options: [
                            "Invent a stopping rule",
                            "Ask a qualified teacher or follow verified marks",
                            "Stop at every word",
                            "Read without stopping ever",
                        ],
                        answer: 1,
                        explanation:
                            "Use reliable guidance and qualified correction when unsure.",
                    },
                ],
            }),
            lesson({
                id: "longer-recitation",
                title: "Longer Recitation Practice",
                estimatedMinutes: 40,
                summary:
                    "Build stamina and consistency with longer passages while keeping accuracy and reflection.",
                objectives: [
                    "Plan a longer recitation session without losing accuracy.",
                    "Use short segments and repeated listening.",
                    "Track fatigue and errors honestly.",
                ],
                sections: [
                    {
                        heading: "Segment the passage",
                        paragraphs: [
                            "Choose a passage you have already studied. Divide it into small segments, practise each segment, then join two segments. Increase length only after accuracy remains stable.",
                        ],
                    },
                    {
                        heading: "Build a sustainable routine",
                        points: [
                            "Warm up with a short surah you know well.",
                            "Practise the new passage in two-minute segments.",
                            "Record one correction after each segment.",
                            "Finish with a slow review of the full passage.",
                        ],
                    },
                ],
                resources: [QURAN_READER, FATIHAH, QURAN_SOURCE],
                exercise: {
                    title: "Segment and join",
                    instructions:
                        "Choose a passage of at least ten verses. Practise it in three segments, then join them in one slow reading. Note where accuracy dropped.",
                },
            }),
            lesson({
                id: "common-mistakes",
                title: "Reviewing Common Reading Mistakes",
                estimatedMinutes: 30,
                summary:
                    "Identify recurring mistakes and turn them into a focused revision plan.",
                objectives: [
                    "Recognise common accuracy problems.",
                    "Distinguish a knowledge gap from a performance slip.",
                    "Create a short revision plan.",
                ],
                sections: [
                    {
                        heading: "Common problems",
                        points: [
                            "Rushing past harakat or madd.",
                            "Confusing letters with similar shapes or sounds.",
                            "Ignoring sukoon and shaddah.",
                            "Stopping at an incomplete phrase.",
                            "Assuming a rule applies without checking its conditions.",
                        ],
                    },
                    {
                        heading: "Repair, do not hide",
                        paragraphs: [
                            "A mistake is useful information. Mark it, name it, and practise the smallest unit that needs repair. If the same mistake repeats across sessions, ask a teacher to check your understanding and pronunciation.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Mistake review",
                    instructions:
                        "Look back at your last three practice sessions. List the two most repeated mistakes and write one drill for each. Bring the list to your teacher.",
                },
                quiz: [
                    {
                        id: "mistakes-1",
                        question:
                            "What is the best response to a repeated reading mistake?",
                        options: [
                            "Ignore it and read faster",
                            "Identify it and practise the smallest unit",
                            "Stop studying",
                            "Change surahs every day",
                        ],
                        answer: 1,
                        explanation:
                            "Targeted practice on the smallest problematic unit is more effective than repeating the whole passage.",
                    },
                    {
                        id: "mistakes-2",
                        question: "What can rushing cause?",
                        options: [
                            "More accurate harakat",
                            "Skipped marks and unclear letters",
                            "Better understanding",
                            "Automatic teacher feedback",
                        ],
                        answer: 1,
                        explanation:
                            "Rushing commonly causes skipped marks and unclear articulation.",
                    },
                ],
            }),
            lesson({
                id: "advanced-final",
                title: "Comprehensive Revision and Final Assessment",
                type: "assessment",
                estimatedMinutes: 30,
                summary:
                    "Bring together advanced rules, waqf, recitation practice, and error review.",
                objectives: [
                    "Demonstrate understanding of advanced tajweed concepts.",
                    "Identify a personal revision plan.",
                    "Pass the final knowledge check at 70% or higher.",
                ],
                completionNote:
                    "This is an educational knowledge check. Recitation certification requires qualified human assessment.",
                sections: [
                    {
                        heading: "Final revision",
                        points: [
                            "Review your correction log.",
                            "Revisit one rule that still feels unclear.",
                            "Read one passage slowly with full attention to stopping points.",
                            "Write down the next three things you will practise with a teacher.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                quiz: [
                    {
                        id: "advanced-final-1",
                        question: "What does ibtida mean?",
                        options: [
                            "Stopping",
                            "Starting or resuming after a stop",
                            "Elongating",
                            "Whispering",
                        ],
                        answer: 1,
                        explanation:
                            "Ibtida is starting or resuming recitation after a stop.",
                    },
                    {
                        id: "advanced-final-2",
                        question:
                            "What should guide your stopping points?",
                        options: [
                            "Random breath",
                            "Verified guidance and teacher instruction",
                            "Word count",
                            "Page layout",
                        ],
                        answer: 1,
                        explanation:
                            "Stopping points should follow verified guidance and teacher instruction.",
                    },
                    {
                        id: "advanced-final-3",
                        question:
                            "What is the best sign that a longer passage is ready to speed up?",
                        options: [
                            "You memorised the page number",
                            "Accuracy remains stable at a slow pace",
                            "You skipped the difficult words",
                            "You read it once",
                        ],
                        answer: 1,
                        explanation:
                            "Increase speed only when accuracy remains stable.",
                    },
                    {
                        id: "advanced-final-4",
                        question:
                            "Which is a common reading mistake?",
                        options: [
                            "Checking harakat",
                            "Confusing similar letters",
                            "Listening to a reciter",
                            "Reviewing a correction log",
                        ],
                        answer: 1,
                        explanation:
                            "Confusing similar letters is a common accuracy mistake.",
                    },
                    {
                        id: "advanced-final-5",
                        question:
                            "Can an AI text chat certify your recitation?",
                        options: [
                            "Yes",
                            "No, it cannot hear you",
                            "Only for advanced learners",
                            "Only for long surahs",
                        ],
                        answer: 1,
                        explanation:
                            "A text chat cannot hear or certify recitation.",
                    },
                ],
            }),
        ],
    },
];

const understandingModules = [
    {
        id: "reading-with-meaning",
        title: "Reading with Meaning",
        description:
            "Use verified translations and reliable sources without turning personal reflection into religious rulings.",
        lessons: [
            lesson({
                id: "translation-context",
                title: "Reading with Meaning: Translation and Context",
                estimatedMinutes: 30,
                summary:
                    "Learn how to use translations carefully and why context matters.",
                objectives: [
                    "Use a verified translation alongside the Arabic text.",
                    "Understand that translation is not the same as tafsir.",
                    "Separate personal reflection from religious rulings.",
                ],
                sections: [
                    {
                        heading: "Translation is a bridge",
                        paragraphs: [
                            "A translation helps you follow meaning, but every translation involves interpretation. Read the Arabic text in the Academy reader together with its attributed Bengali translation, and avoid treating one translation as the only possible meaning.",
                        ],
                    },
                    {
                        heading: "Context matters",
                        points: [
                            "Read the surrounding verses before drawing a conclusion.",
                            "Learn the surah's broad theme and setting from reliable sources.",
                            "Do not turn a personal reflection into a ruling.",
                            "Ask a qualified scholar about legal or theological questions.",
                        ],
                    },
                ],
                resources: [QURAN_READER, QURAN_SOURCE],
                exercise: {
                    title: "Translation comparison",
                    instructions:
                        "Choose one short surah. Read the Bengali translation and write a three-sentence summary. Then write one question that requires a reliable tafsir or teacher.",
                },
                quiz: [
                    {
                        id: "meaning-1",
                        question: "What is the difference between translation and tafsir?",
                        options: [
                            "They are exactly the same",
                            "Translation gives meaning; tafsir explains and contextualises",
                            "Tafsir is only a page number",
                            "Translation replaces the Arabic text",
                        ],
                        answer: 1,
                        explanation:
                            "Translation conveys meaning, while tafsir provides explanation and context.",
                    },
                    {
                        id: "meaning-2",
                        question: "What should you avoid doing?",
                        options: [
                            "Reading context",
                            "Turning personal reflection into a religious ruling",
                            "Using a verified translation",
                            "Asking a qualified teacher",
                        ],
                        answer: 1,
                        explanation:
                            "Personal reflection is not a substitute for qualified religious guidance.",
                    },
                ],
            }),
            lesson({
                id: "reliable-tafsir",
                title: "Using Reliable Tafsir Sources",
                estimatedMinutes: 30,
                summary:
                    "Learn how to identify attributed, reliable explanatory sources and use them responsibly.",
                objectives: [
                    "Check that a source is attributed and verifiable.",
                    "Distinguish an educational summary from a formal ruling.",
                    "Record sources in study notes.",
                ],
                sections: [
                    {
                        heading: "Check the source",
                        points: [
                            "Prefer recognised published tafsir works and established educational institutions.",
                            "Check the author, translator, publisher, and edition.",
                            "Do not rely on anonymous screenshots or unattributed social posts.",
                            "Do not use AI output as a primary tafsir source.",
                        ],
                    },
                    {
                        heading: "Use the Academy assistant correctly",
                        paragraphs: [
                            "The assistant can explain a lesson concept or help you form study questions. It is not a mufti, a tafsir authority, or a substitute for verified scholarship.",
                        ],
                    },
                ],
                resources: [QURAN_SOURCE],
                exercise: {
                    title: "Source audit",
                    instructions:
                        "Take one explanation you have read online and identify its author and source. If you cannot verify it, replace it with a recognised published tafsir or ask a teacher.",
                },
                quiz: [
                    {
                        id: "tafsir-1",
                        question: "What should you check before using a tafsir source?",
                        options: [
                            "Only the font",
                            "Author, translator, publisher, and edition",
                            "The number of shares",
                            "The colour of the cover",
                        ],
                        answer: 1,
                        explanation:
                            "Attribution and edition details help establish reliability.",
                    },
                    {
                        id: "tafsir-2",
                        question: "What is the AI assistant's proper role?",
                        options: [
                            "Final religious authority",
                            "Learning support and explanation",
                            "Replacement for the Quran",
                            "Certifier of recitation",
                        ],
                        answer: 1,
                        explanation:
                            "The assistant supports learning but is not a religious authority.",
                    },
                ],
            }),
        ],
    },
    {
        id: "study-and-reflection",
        title: "Study and Reflection",
        description:
            "Build a source-aware study habit and complete a knowledge check.",
        lessons: [
            lesson({
                id: "surah-structure",
                title: "Themes and Structure of a Surah",
                estimatedMinutes: 30,
                summary:
                    "Study a surah as a whole instead of isolating one verse from its setting.",
                objectives: [
                    "Identify the broad theme of a surah from reliable sources.",
                    "Notice how verses connect.",
                    "Keep reflection tied to verified material.",
                ],
                sections: [
                    {
                        heading: "Read the whole arc",
                        paragraphs: [
                            "A surah is not a random collection of isolated lines. Read it from beginning to end, note repeated themes, and use a reliable tafsir to understand how the passage develops.",
                        ],
                    },
                    {
                        heading: "A simple study sheet",
                        points: [
                            "Surah name and number.",
                            "Broad theme in one sentence.",
                            "Three repeated words or ideas.",
                            "One question for a teacher.",
                            "Sources used.",
                        ],
                    },
                ],
                resources: [FATIHAH, IKHLAS, QURAN_READER],
                exercise: {
                    title: "One-surah study sheet",
                    instructions:
                        "Complete the five-part study sheet for a short surah. Use the Academy reader and a recognised tafsir source, and list the sources you used.",
                },
            }),
            lesson({
                id: "reflection-notes",
                title: "Reflection and Personal Study Notes",
                estimatedMinutes: 25,
                summary:
                    "Create reflection notes that are honest, source-aware, and useful for revision.",
                objectives: [
                    "Write a reflection without claiming a new ruling.",
                    "Separate observation, question, and source.",
                    "Review notes regularly.",
                ],
                sections: [
                    {
                        heading: "A responsible note format",
                        points: [
                            "Observation: what the text or translation says.",
                            "Question: what you do not understand.",
                            "Source: where the explanation came from.",
                            "Action: what you will ask a teacher or read next.",
                        ],
                    },
                    {
                        heading: "Keep it humble",
                        paragraphs: [
                            "Reflection can be personal and sincere without becoming a legal or theological verdict. When a question involves practice or belief, take it to a qualified scholar.",
                        ],
                    },
                ],
                resources: [QURAN_SOURCE, QURAN_READER],
                exercise: {
                    title: "Four-part reflection",
                    instructions:
                        "Write one page using the four-part format. End with one precise question for a qualified teacher.",
                },
            }),
            lesson({
                id: "understanding-final",
                title: "Final Knowledge Check",
                type: "assessment",
                estimatedMinutes: 20,
                summary:
                    "Review source awareness, context, and responsible study habits.",
                objectives: [
                    "Check understanding of translation, tafsir, and context.",
                    "Review the difference between study support and religious authority.",
                    "Pass the knowledge check at 70% or higher.",
                ],
                sections: [
                    {
                        heading: "Before the check",
                        points: [
                            "Review the difference between translation and tafsir.",
                            "Review the importance of attribution.",
                            "Review why AI is not a religious authority.",
                        ],
                    },
                ],
                resources: [QURAN_SOURCE],
                quiz: [
                    {
                        id: "understanding-final-1",
                        question: "What should accompany Quranic study?",
                        options: [
                            "Only personal opinion",
                            "Verified translation, context, and reliable sources",
                            "Anonymous social posts",
                            "AI-generated scripture",
                        ],
                        answer: 1,
                        explanation:
                            "Verified sources and context are essential.",
                    },
                    {
                        id: "understanding-final-2",
                        question: "What is the assistant's limitation?",
                        options: [
                            "It can certify recitation",
                            "It cannot replace qualified religious scholarship",
                            "It can invent Quranic verses",
                            "It can issue binding rulings",
                        ],
                        answer: 1,
                        explanation:
                            "The assistant supports learning but does not replace qualified scholarship.",
                    },
                    {
                        id: "understanding-final-3",
                        question: "Why should study notes include sources?",
                        options: [
                            "To make them longer",
                            "To allow verification and revision",
                            "To avoid reading",
                            "To replace tafsir",
                        ],
                        answer: 1,
                        explanation:
                            "Sources make notes verifiable and help distinguish evidence from opinion.",
                    },
                    {
                        id: "understanding-final-4",
                        question: "What should you do with a legal or theological question?",
                        options: [
                            "Ask an AI for a final ruling",
                            "Ask a qualified scholar",
                            "Ignore it",
                            "Invent an answer",
                        ],
                        answer: 1,
                        explanation:
                            "Qualified scholarship is required for religious rulings.",
                    },
                    {
                        id: "understanding-final-5",
                        question: "Which is a responsible reflection?",
                        options: [
                            "A personal opinion presented as a ruling",
                            "An observation with a source and an open question",
                            "An unattributed quote",
                            "A fabricated verse",
                        ],
                        answer: 1,
                        explanation:
                            "A responsible reflection separates observation, source, and question.",
                    },
                ],
            }),
        ],
    },
];

export const LEARNING_COURSES = [
    {
        id: "quran-reading-foundations",
        title: "Quran Reading Foundations",
        level: "Beginner",
        category: "Quran Reading",
        description:
            "A complete starting path for recognising Arabic letters, reading harakat, joining words, and approaching short Quranic verses with care.",
        longDescription:
            "This course turns the former beginner learning path into a structured curriculum. It begins with letter recognition and pronunciation awareness, then builds through harakat, sukoon, shaddah, tanween, joined words, and guided short-verse practice. The final assessment checks knowledge; practical recitation should still be verified with a qualified teacher.",
        objectives: [
            "Recognise the Arabic alphabet and its joined forms.",
            "Read basic harakat, sukoon, shaddah, and tanween.",
            "Decode short Quranic words using a repeatable routine.",
            "Read short verses with verified text and guided audio.",
            "Understand the purpose of introductory tajweed.",
        ],
        estimatedMinutes: 245,
        sequential: true,
        completionCriteria:
            "Complete all nine lessons and pass the final knowledge check with at least 70%. Practical recitation remains subject to teacher feedback.",
        sourceNote:
            "Quranic text and translations are read from the project's existing AlQuran Cloud integration. This curriculum does not invent Quranic verses or religious rulings.",
        modules: foundationModules,
    },
    {
        id: "quran-reading-fluency",
        title: "Reading Fluency and Tajweed",
        level: "Intermediate",
        category: "Tajweed",
        description:
            "Develop accurate, fluent reading of connected Quranic text and learn the foundational rules of madd, ghunnah, ikhfa, idgham, and izhar.",
        longDescription:
            "This course expands the former Tajweed and Correct Recitation learning path. It focuses on accuracy before speed, connected-word reading, the natural madd, and the foundational noon and meem rules. Guided short-surah practice connects every rule back to verified Quranic text.",
        objectives: [
            "Read connected Quranic words and short verses with accuracy.",
            "Build fluency through slow, guided repetition.",
            "Explain the natural madd and recognise long vowel letters.",
            "Define ghunnah, ikhfa, idgham, and izhar.",
            "Apply foundational rules in teacher-supported practice.",
        ],
        estimatedMinutes: 215,
        sequential: true,
        completionCriteria:
            "Complete all seven lessons and pass the final knowledge check with at least 70%. Practical recitation remains subject to teacher feedback.",
        sourceNote:
            "Rules are explained as an educational map. Sound, duration, and application must be verified with a qualified teacher and reliable recitation.",
        modules: fluencyModules,
    },
    {
        id: "advanced-tajweed-recitation",
        title: "Advanced Tajweed and Recitation Practice",
        level: "Advanced",
        category: "Tajweed",
        description:
            "Apply detailed tajweed rules, study waqf and ibtida, practise longer passages, and turn recurring mistakes into a focused revision plan.",
        longDescription:
            "This advanced path continues the existing Tajweed and Correct Recitation theme. It is designed for learners who already read connected Quranic text and want a more systematic study of rules, stopping points, longer recitation, and error correction.",
        objectives: [
            "Explain advanced tajweed categories and their conditions.",
            "Apply rules to verified Quranic passages with teacher verification.",
            "Understand waqf and ibtida without guessing stopping points.",
            "Build a longer recitation practice routine.",
            "Create a correction log and targeted revision plan.",
        ],
        estimatedMinutes: 200,
        sequential: true,
        completionCriteria:
            "Complete all six lessons and pass the final knowledge check with at least 70%. A knowledge check cannot certify recitation.",
        sourceNote:
            "This course is educational. Recitation certification requires qualified human assessment, and stopping points should follow verified guidance.",
        modules: advancedModules,
    },
    {
        id: "understanding-the-quran",
        title: "Understanding the Quran",
        level: "Intermediate",
        category: "Quran Understanding",
        description:
            "Learn to study Quranic meaning with verified translations, reliable tafsir sources, context, and responsible reflection.",
        longDescription:
            "This course reuses the former Understand the Quran learning path and turns it into a source-aware study method. It teaches how to use translations, identify reliable tafsir, read a surah as a whole, and keep personal reflection separate from religious rulings.",
        objectives: [
            "Use a verified translation alongside the Arabic text.",
            "Distinguish translation, tafsir, and personal reflection.",
            "Check attribution and edition details in study sources.",
            "Read a surah as a connected whole.",
            "Write source-aware reflection notes.",
        ],
        estimatedMinutes: 135,
        sequential: true,
        completionCriteria:
            "Complete all five lessons and pass the final knowledge check with at least 70%.",
        sourceNote:
            "This course teaches study method. It does not issue religious rulings or replace qualified scholarship.",
        modules: understandingModules,
    },
];

export function getCourseById(courseId) {
    return LEARNING_COURSES.find((course) => course.id === courseId) || null;
}

export function getCourseLessons(course) {
    if (!course) return [];

    return course.modules.flatMap((module) =>
        module.lessons.map((lesson, index) => ({
            ...lesson,
            moduleId: module.id,
            moduleTitle: module.title,
            moduleIndex: course.modules.indexOf(module),
            lessonIndex: index,
        }))
    );
}

export function getCourseLesson(course, lessonId) {
    return (
        getCourseLessons(course).find((lesson) => lesson.id === lessonId) ||
        null
    );
}

export function getNextCourseLesson(course, lessonId) {
    const lessons = getCourseLessons(course);
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);

    if (index === -1) return null;

    return lessons[index + 1] || null;
}

export function getLessonCourseHref(courseId, lessonId) {
    return `/deen-islam/learning/courses/${courseId}/lessons/${lessonId}`;
}

export function getCourseHref(courseId) {
    return `/deen-islam/learning/courses/${courseId}`;
}

export function getCourseMinutes(course) {
    return getCourseLessons(course).reduce(
        (total, lesson) => total + (Number(lesson.estimatedMinutes) || 0),
        0
    );
}

export function getCourseCategories() {
    return Array.from(
        new Set(LEARNING_COURSES.map((course) => course.category))
    );
}

export function getCourseLevels() {
    return ["Beginner", "Intermediate", "Advanced"];
}
