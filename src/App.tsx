
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  Headphones,
  Languages,
  Menu,
  MessageCircle,
  Sparkles,
  Volume2,
  X,
  Star,
  Mail,
  MapPin,
  Leaf,
  FileText,
  Users,
  Brain,
} from 'lucide-react'

const hindiWords = [
  'शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ',
  'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह',
  'अठारह', 'उन्नीस', 'बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस',
  'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस', 'इकतीस', 'बत्तीस',
  'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस',
  'चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस',
  'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास', 'इक्यावन',
  'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन',
  'उनसठ', 'साठ', 'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ',
  'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर', 'इकहत्तर', 'बहत्तर', 'तिहत्तर',
  'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी',
  'अस्सी', 'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी',
  'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे', 'इक्यानवे', 'बानवे', 'तिरानवे',
  'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे',
  'सौ',
]

const englishNumbers = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-one', 'Twenty-two',
  'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven',
  'Twenty-eight', 'Twenty-nine', 'Thirty', 'Thirty-one', 'Thirty-two',
  'Thirty-three', 'Thirty-four', 'Thirty-five', 'Thirty-six', 'Thirty-seven',
  'Thirty-eight', 'Thirty-nine', 'Forty', 'Forty-one', 'Forty-two',
  'Forty-three', 'Forty-four', 'Forty-five', 'Forty-six', 'Forty-seven',
  'Forty-eight', 'Forty-nine', 'Fifty', 'Fifty-one', 'Fifty-two',
  'Fifty-three', 'Fifty-four', 'Fifty-five', 'Fifty-six', 'Fifty-seven',
  'Fifty-eight', 'Fifty-nine', 'Sixty', 'Sixty-one', 'Sixty-two',
  'Sixty-three', 'Sixty-four', 'Sixty-five', 'Sixty-six', 'Sixty-seven',
  'Sixty-eight', 'Sixty-nine', 'Seventy', 'Seventy-one', 'Seventy-two',
  'Seventy-three', 'Seventy-four', 'Seventy-five', 'Seventy-six',
  'Seventy-seven', 'Seventy-eight', 'Seventy-nine', 'Eighty', 'Eighty-one',
  'Eighty-two', 'Eighty-three', 'Eighty-four', 'Eighty-five', 'Eighty-six',
  'Eighty-seven', 'Eighty-eight', 'Eighty-nine', 'Ninety', 'Ninety-one',
  'Ninety-two', 'Ninety-three', 'Ninety-four', 'Ninety-five', 'Ninety-six',
  'Ninety-seven', 'Ninety-eight', 'Ninety-nine', 'One hundred',
]

const devanagariDigits = '०१२३४५६७८९'

const numbers = Array.from({ length: 100 }, (_, index) => ({
  value: index + 1,
  digit: String(index + 1).replace(/\d/g, (d) => devanagariDigits[Number(d)]),
  hindi: hindiWords[index + 1],
  english: englishNumbers[index + 1],
}))

const ranges = Array.from({ length: 10 }, (_, index) => ({
  label: `${index * 10 + 1}–${index * 10 + 10}`,
  start: index * 10 + 1,
}))

const lessons = [
  {
    title: 'Hindi Alphabet',
    subtitle: 'हिंदी वर्णमाला',
    description: 'Learn Hindi letters, their sounds, and how to write them.',
    time: '30 mins',
    level: 'Beginner',
    art: 'अ आ इ ई',
    style: 'from-orange-100 to-amber-50',
    icon: BookOpen,
  },
  {
    title: 'Everyday Conversations',
    subtitle: 'रोज़मर्रा की बातचीत',
    description: 'Practise greetings and useful phrases for daily life.',
    time: '45 mins',
    level: 'Beginner',
    art: 'नमस्ते!',
    style: 'from-rose-100 to-orange-50',
    icon: MessageCircle,
  },
  {
    title: 'Food & Drinks',
    subtitle: 'खाना और पेय',
    description: 'Learn vocabulary for meals, drinks, and ordering food.',
    time: '40 mins',
    level: 'Beginner',
    art: 'खाना',
    style: 'from-yellow-100 to-orange-50',
    icon: Languages,
  },
  {
    title: 'Culture & Travel',
    subtitle: 'संस्कृति और यात्रा',
    description: 'Discover Indian culture and practical travel phrases.',
    time: '35 mins',
    level: 'Intermediate',
    art: 'भारत',
    style: 'from-emerald-100 to-lime-50',
    icon: GraduationCap,
  },
]

const vocabulary = [
  { hindi: 'नमस्ते', roman: 'Namaste', english: 'Hello', color: 'bg-amber-50 border-amber-100', symbol: '☀' },
  { hindi: 'धन्यवाद', roman: 'Dhanyavaad', english: 'Thank you', color: 'bg-rose-50 border-rose-100', symbol: '♡' },
  { hindi: 'कृपया', roman: 'Kripaya', english: 'Please', color: 'bg-blue-50 border-blue-100', symbol: '✦' },
  { hindi: 'हाँ', roman: 'Haan', english: 'Yes', color: 'bg-emerald-50 border-emerald-100', symbol: '✓' },
  { hindi: 'नहीं', roman: 'Nahin', english: 'No', color: 'bg-purple-50 border-purple-100', symbol: '×' },
  { hindi: 'पानी', roman: 'Paani', english: 'Water', color: 'bg-cyan-50 border-cyan-100', symbol: '♢' },
]

const sentences = [
  { hindi: 'मुझे पानी चाहिए।', english: 'I need water.' },
  { hindi: 'यह मेरी किताब है।', english: 'This is my book.' },
  { hindi: 'आप कैसे हैं?', english: 'How are you?' },
]

const quizQuestions = [
  {
    question: 'What does “नमस्ते” mean?',
    options: ['Goodbye', 'Hello / Greetings', 'Thank you', 'Please'],
    answer: 1,
    explanation: 'नमस्ते is a common Hindi greeting.',
  },
  {
    question: 'How do you say “One” in Hindi?',
    options: ['दो', 'तीन', 'एक', 'चार'],
    answer: 2,
    explanation: 'एक (ek) means one.',
  },
  {
    question: 'What does “पानी” mean?',
    options: ['Food', 'Water', 'Book', 'House'],
    answer: 1,
    explanation: 'पानी (paani) means water.',
  },
  {
    question: 'What does “धन्यवाद” mean?',
    options: ['Please', 'Welcome', 'Thank you', 'Sorry'],
    answer: 2,
    explanation: 'धन्यवाद (dhanyavaad) means thank you.',
  },
  {
    question: 'Which Hindi word means “Yes”?',
    options: ['नहीं', 'हाँ', 'किताब', 'घर'],
    answer: 1,
    explanation: 'हाँ (haan) means yes.',
  },
]

function speakHindi(text: string) {
  if (!('speechSynthesis' in window)) {
    window.alert('Speech playback is not supported by this browser.')
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hi-IN'
  utterance.rate = 0.8

  const hindiVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('hi'))

  if (hindiVoice) utterance.voice = hindiVoice
  window.speechSynthesis.speak(utterance)
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#421a36] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
        {description}
      </p>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [numberRange, setNumberRange] = useState(1)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentMessage, setStudentMessage] = useState('')
  const [formNotice, setFormNotice] = useState('')

  // Replace with your mother's WhatsApp number, including India's country code.
  // Example: 919876543210 — digits only, no spaces or + sign.
  const whatsappNumber = '91XXXXXXXXXX'

  const visibleNumbers = numbers.filter(
    (number) =>
      number.value >= numberRange && number.value < numberRange + 10,
  )

  const navItems = [
    ['Home', '#home'],
    ['Lessons', '#lessons'],
    ['Vocabulary', '#vocabulary'],
    ['Numbers', '#practice'],
    ['Quiz', '#quiz'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ]

  const quiz = quizQuestions[quizIndex]

  function selectRange(start: number) {
    setNumberRange(start)
  }

  function submitAnswer() {
    if (selectedAnswer === null) return

    if (selectedAnswer === quiz.answer) {
      setScore((current) => current + 1)
    }

    if (quizIndex === quizQuestions.length - 1) {
      setQuizFinished(true)
    } else {
      setQuizIndex((current) => current + 1)
      setSelectedAnswer(null)
    }
  }

  function restartQuiz() {
    setQuizIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizFinished(false)
  }

  function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!studentName.trim() || !studentMessage.trim()) {
      setFormNotice('Please fill in both fields.')
      return
    }

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      setFormNotice(
        'Add your mother’s WhatsApp number in App.tsx before sending an enquiry.',
      )
      return
    }

    const message = `Namaste! I am ${studentName.trim()}.\n\nMy enquiry: ${studentMessage.trim()}\n\nI would like to know more about Hindi classes.`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setFormNotice('WhatsApp opened. Please review and send your message.')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf3] text-[#421a36]">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#fffaf3]/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#home" className="flex shrink-0 items-center gap-3" aria-label="Hindi with Geetha home">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#421a36] text-xl font-bold text-amber-200">
              हि
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight sm:text-lg">
                Hindi with Geetha
              </span>
              <span className="block text-[10px] tracking-[0.16em] text-stone-500">
                LEARN · PRACTICE · GROW
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-xs font-medium text-stone-600 transition hover:text-orange-700"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden items-center rounded-full bg-[#351537] px-5 py-3 text-xs font-semibold text-white transition hover:bg-orange-700 sm:inline-flex"
          >
            <MessageCircle className="mr-2" size={15} />
            Book a class
          </a>

          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-orange-100 bg-[#fffaf3] px-5 py-3 lg:hidden">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-orange-50"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 block rounded-full bg-[#421a36] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Book a class
            </a>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="paper-pattern hero-glow scroll-mt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:py-20">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold text-orange-800">
                <Sparkles size={15} />
                Welcome to Hindi with Geetha
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-[#421a36] sm:text-6xl lg:text-7xl">
                Learn Hindi
                <span className="block text-orange-700">with Geetha.</span>
              </h1>

              <p className="hindi mt-5 text-2xl font-medium text-[#6e3440] sm:text-3xl">
                नई भाषा, नई दुनिया।
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                Discover the beauty of Hindi through friendly lessons,
                practical vocabulary, and fun quizzes. Start as a beginner and
                grow your confidence one word at a time.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lessons"
                  className="rounded-full bg-[#c74712] px-7 py-4 text-center text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-800"
                >
                  Start learning <ArrowRight className="ml-2 inline" size={16} />
                </a>
                <a
                  href="#practice"
                  className="rounded-full border border-orange-600 bg-white/70 px-7 py-4 text-center text-sm font-semibold text-[#421a36] transition hover:bg-white"
                >
                  Explore numbers
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-stone-600">
                <span><Check className="mr-1 inline text-emerald-700" size={15} /> Beginner friendly</span>
                <span><Check className="mr-1 inline text-emerald-700" size={15} /> Learn at your pace</span>
                <span><Check className="mr-1 inline text-emerald-700" size={15} /> Listen and practise</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -right-3 top-8 h-36 w-36 rounded-full bg-orange-200/70 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-[#f5e5cc] to-[#e8d0b0] p-3 shadow-2xl shadow-[#5b3025]/10 sm:p-5">
                <div className="relative flex min-h-[330px] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-[#d8bd96] bg-gradient-to-br from-[#fffaf2] via-[#f9ead8] to-[#f0d6b8] p-6 text-center sm:min-h-[400px] sm:p-9">
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full border border-orange-200/80" />
                  <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full border border-orange-200/80" />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#ead1b0] shadow-lg">
                    <GraduationCap size={52} strokeWidth={1.3} className="text-[#641f30]" />
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
                    Meet your teacher
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#421a36] sm:text-4xl">
                    Geetha
                  </h2>
                  <p className="hindi mt-3 text-2xl text-[#7d3d49]">
                    हिंदी सीखें, आगे बढ़ें
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">
                    A warm, supportive space to learn Hindi through clear
                    explanations, everyday examples, and guided practice.
                  </p>
                  <a
                    href="#about"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#421a36] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    Get to know us <ArrowRight size={15} />
                  </a>

                  <span className="absolute bottom-4 right-4 text-4xl text-orange-300/80">✦</span>
                </div>
                <div className="flex items-center justify-between px-3 pt-4 text-sm text-[#75533b]">
                  <span className="hindi text-lg">सीखते रहें</span>
                  <span className="text-xs">Keep learning ✦</span>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-stone-500">
                Teacher photo placeholder — add your mom’s photo here later.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-orange-100 bg-white px-5 py-7 sm:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: BookOpen, title: 'Structured Lessons', text: 'Step-by-step learning', color: 'bg-purple-100 text-purple-700' },
              { icon: Languages, title: 'Useful Vocabulary', text: 'Everyday words', color: 'bg-emerald-100 text-emerald-700' },
              { icon: Brain, title: 'Interactive Quizzes', text: 'Test your knowledge', color: 'bg-rose-100 text-rose-700' },
              { icon: FileText, title: 'Study Resources', text: 'Notes and PDFs', color: 'bg-blue-100 text-blue-700' },
              { icon: Users, title: 'Personal Support', text: 'Ask your questions', color: 'bg-amber-100 text-amber-700' },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex flex-col items-center gap-2">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.color}`}>
                    <Icon size={23} />
                  </span>
                  <p className="text-xs font-semibold text-[#421a36]">{feature.title}</p>
                  <p className="text-[11px] text-stone-500">{feature.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section id="lessons" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Start exploring</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#421a36] sm:text-4xl">Featured lessons</h2>
                <p className="mt-2 text-sm text-stone-600">Small steps, useful skills, and steady progress.</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-[#421a36] hover:bg-orange-50">
                Ask about lessons <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {lessons.map((lesson, index) => (
                <article key={lesson.title} className="group overflow-hidden rounded-2xl border border-orange-100 bg-white p-2 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5">
                  <div className={`flex h-32 items-center justify-center rounded-xl bg-gradient-to-br ${lesson.style}`}>
                    <span className="hindi text-4xl font-semibold tracking-wider text-[#7d3d49] sm:text-5xl">{lesson.art}</span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#421a36]">{index + 1}. {lesson.title}</h3>
                      <a href="#practice" aria-label={`Explore ${lesson.title}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-100 transition group-hover:bg-[#421a36] group-hover:text-white">
                        <ArrowRight size={14} />
                      </a>
                    </div>
                    <p className="hindi mt-1 text-xs text-orange-700">{lesson.subtitle}</p>
                    <p className="mt-2 min-h-10 text-xs leading-5 text-stone-600">{lesson.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-stone-500">
                      <span><Clock3 className="mr-1 inline" size={12} />{lesson.time}</span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">{lesson.level}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="practice" className="scroll-mt-24 bg-[#f3e9da] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Learn by doing"
              title="Hindi numbers from 1 to 100"
              description="Choose a range or move the slider. Tap any number to hear its Hindi pronunciation."
            />

            <div className="mb-8 rounded-3xl border border-[#e3d0b4] bg-[#fffaf2] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">Your number range</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#421a36]">
                    {numberRange}–{numberRange + 9}
                  </h3>
                </div>
                <span className="rounded-full bg-[#f0e2ca] px-3 py-2 text-xs font-semibold text-[#81552e]">
                  {numberRange === 1 ? 'Getting started' : numberRange === 91 ? 'Almost there!' : 'Keep practising'}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="9"
                step="1"
                value={(numberRange - 1) / 10}
                onChange={(event) => selectRange(Number(event.target.value) * 10 + 1)}
                aria-label="Choose Hindi number range"
                className="mt-5 w-full cursor-pointer accent-[#641f30]"
              />

              <div className="mt-1 flex justify-between text-[11px] text-stone-500">
                <span>1</span><span>50</span><span>100</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {ranges.map((range) => (
                  <button
                    key={range.start}
                    type="button"
                    onClick={() => selectRange(range.start)}
                    aria-pressed={numberRange === range.start}
                    className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                      numberRange === range.start
                        ? 'bg-[#421a36] text-white shadow-sm'
                        : 'border border-[#e3d0b4] bg-white text-[#421a36] hover:bg-orange-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {visibleNumbers.map((number) => (
                <button
                  key={number.value}
                  type="button"
                  onClick={() => speakHindi(number.hindi)}
                  aria-label={`Listen to ${number.english} in Hindi`}
                  className="group rounded-2xl border border-[#e3d0b4] bg-[#fffaf2] p-4 text-center transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg sm:p-5"
                >
                  <span className="hindi block text-4xl font-semibold text-[#641f30]">{number.digit}</span>
                  <span className="hindi mt-2 block text-base font-medium text-[#795047]">{number.hindi}</span>
                  <span className="mt-1 block text-xs text-stone-500">{number.english}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-orange-700">
                    <Volume2 size={13} /> Listen
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-center text-xs leading-6 text-stone-600">
              Audio depends on the Hindi speech voices available in your browser or device.
            </p>
          </div>
        </section>

        <section id="vocabulary" className="scroll-mt-24 bg-[#f1f7f1] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">A little every day</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#421a36] sm:text-4xl">Hindi vocabulary</h2>
                <p className="mt-2 text-sm text-stone-600">Common words for everyday conversations.</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-800">Tap a word to listen</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {vocabulary.map((word) => (
                <button
                  key={word.hindi}
                  type="button"
                  onClick={() => speakHindi(word.hindi)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${word.color}`}
                >
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg text-[#641f30]">{word.symbol}</span>
                  <span className="hindi block text-xl font-semibold text-[#421a36]">{word.hindi}</span>
                  <span className="mt-1 block text-xs text-stone-500">{word.roman}</span>
                  <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-orange-700"><Volume2 size={12} />{word.english}</span>
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {sentences.map((item) => (
                <button
                  key={item.hindi}
                  type="button"
                  onClick={() => speakHindi(item.hindi)}
                  className="rounded-2xl border border-emerald-100 bg-white p-4 text-left transition hover:border-emerald-300"
                >
                  <p className="hindi text-lg font-medium text-[#641f30]">{item.hindi}</p>
                  <p className="mt-2 text-xs text-stone-500">{item.english}</p>
                  <p className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><Volume2 size={12} /> Listen to sentence</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="quiz" className="scroll-mt-24 bg-[#421a36] px-5 py-16 text-white sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-9 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-amber-200">
                <GraduationCap size={25} />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Check your progress</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A little quiz, a little growth.</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">Test what you've learned with these quick questions.</p>
            </div>

            <div className="rounded-3xl bg-[#fffaf2] p-6 text-[#421a36] sm:p-9">
              {quizFinished ? (
                <div className="py-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-[#641f30]">
                    <Check size={30} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">Well done!</h3>
                  <p className="mt-3 text-stone-600">
                    You scored <strong className="text-[#421a36]">{score} out of {quizQuestions.length}</strong>.
                  </p>
                  <p className="mt-2 text-sm text-stone-600">Every word you practise brings you one step forward.</p>
                  <button type="button" onClick={restartQuiz} className="mt-7 rounded-full bg-[#421a36] px-7 py-3.5 text-sm font-semibold text-white hover:bg-orange-700">
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-orange-800">QUESTION {quizIndex + 1} OF {quizQuestions.length}</span>
                    <span className="flex items-center gap-1 text-xs text-stone-500"><Clock3 size={14} /> Mini quiz</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-orange-100">
                    <div className="h-full rounded-full bg-orange-700 transition-all" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
                  </div>
                  <h3 className="mt-7 text-xl font-semibold sm:text-2xl">{quiz.question}</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {quiz.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrect = index === quiz.answer
                      let style = 'border-orange-100 bg-white hover:border-orange-300'
                      if (selectedAnswer !== null && isCorrect) style = 'border-emerald-600 bg-emerald-50'
                      else if (isSelected) style = 'border-orange-600 bg-orange-50'

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={selectedAnswer !== null}
                          onClick={() => setSelectedAnswer(index)}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm transition disabled:cursor-default ${style}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrect && <Check size={17} className="shrink-0 text-emerald-700" />}
                        </button>
                      )
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mt-5 rounded-xl bg-orange-50 p-4 text-sm leading-6 text-stone-700">
                      <strong>{selectedAnswer === quiz.answer ? 'Correct! ' : 'Not quite. '}</strong>
                      {quiz.explanation}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={selectedAnswer === null}
                    onClick={submitAnswer}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#421a36] px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {quizIndex === quizQuestions.length - 1 ? 'See my score' : 'Next question'} <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-y border-orange-100 bg-white/70 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">A warm welcome</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Learn with patience.
                <br />
                Grow with confidence.
              </h2>
              <div className="mt-6 flex items-center gap-3 text-sm text-stone-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-800"><Leaf size={20} /></span>
                Simple explanations. Practical learning.
              </div>
            </div>
            <div>
              <p className="text-sm leading-8 text-stone-600 sm:text-base">
                Welcome to Hindi with Geetha, a friendly learning space for
                anyone who wants to understand and speak Hindi. Explore clear
                explanations, useful examples, and opportunities to practise
                at your own pace.
              </p>
              <p className="hindi mt-4 text-lg leading-8 text-[#7d3d49]">हर दिन थोड़ा सीखें, हर दिन आगे बढ़ें।</p>
              <p className="mt-1 text-sm text-stone-500">Learn a little every day, and keep moving forward.</p>
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#421a36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                Ask about classes <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#fffaf3] to-[#f5edf7] px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Learning made friendly</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#421a36] sm:text-3xl">A little encouragement goes a long way</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { quote: 'Clear explanations and small steps can make learning a new language feel easier.', name: 'For beginners' },
                { quote: 'Practise useful vocabulary and everyday phrases at your own pace.', name: 'For daily learners' },
                { quote: 'Listen, repeat, and revisit lessons whenever you need more practice.', name: 'For every learner' },
              ].map((item) => (
                <article key={item.name} className="rounded-2xl border border-white bg-white/90 p-5 shadow-sm">
                  <div className="mb-4 flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm leading-6 text-stone-600">“{item.quote}”</p>
                  <p className="mt-4 text-xs font-semibold text-[#421a36]">— {item.name}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-stone-500">
              These are learning highlights, not testimonials from actual students.
            </p>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-gradient-to-r from-[#ffead6] via-[#fff4e8] to-[#fce5df] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-800">Let's begin</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
                Ready to start
                <br />
                learning Hindi?
              </h2>
              <p className="mt-5 max-w-md text-sm leading-8 text-stone-600 sm:text-base">
                Have a question about lessons or classes? Send an enquiry and
                take the first step in your Hindi learning journey.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700"><MessageCircle size={20} /></span>
                  <div><p className="text-sm font-semibold">WhatsApp enquiries</p><p className="mt-1 text-xs text-stone-500">Ask about lessons and class availability</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700"><Mail size={20} /></span>
                  <div><p className="text-sm font-semibold">Email</p><p className="mt-1 text-xs text-stone-500">Add your teaching email when ready</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-orange-700"><MapPin size={20} /></span>
                  <div><p className="text-sm font-semibold">Online learning</p><p className="mt-1 text-xs text-stone-500">Ask about available class options</p></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleEnquiry} className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-orange-900/5 sm:p-9">
              <h3 className="text-xl font-semibold">Send an enquiry</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">Fill in the details below to prepare a WhatsApp message.</p>

              <label htmlFor="student-name" className="mt-7 block text-sm font-medium text-stone-700">Your name</label>
              <input
                id="student-name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-xl border border-orange-100 bg-[#fffdf9] px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <label htmlFor="student-message" className="mt-5 block text-sm font-medium text-stone-700">What would you like to learn?</label>
              <textarea
                id="student-message"
                value={studentMessage}
                onChange={(event) => setStudentMessage(event.target.value)}
                placeholder="For example, I'm a beginner and want to learn conversational Hindi..."
                rows={4}
                required
                className="mt-2 w-full resize-y rounded-xl border border-orange-100 bg-[#fffdf9] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {formNotice && <p role="status" className="mt-4 text-sm leading-6 text-[#7d3d49]">{formNotice}</p>}

              <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#421a36] px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700">
                <MessageCircle size={17} /> Continue with WhatsApp <ArrowRight size={16} />
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-stone-500">Your message opens in WhatsApp for you to review and send.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#30213b] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 font-bold text-[#421a36]">हि</span>
            <span>
              <span className="block text-sm font-semibold">Hindi with Geetha</span>
              <span className="block text-[10px] text-white/60">Learn · Practise · Grow</span>
            </span>
          </a>
          <p className="hindi text-center text-xs leading-6 text-white/70">हर शब्द एक नई शुरुआत है।</p>
          <a href="#home" className="text-xs font-medium text-white/80 hover:text-white">Back to top ↑</a>
        </div>
        <p className="mt-5 text-center text-[11px] text-white/50">© {new Date().getFullYear()} Hindi with Geetha. Made with care.</p>
      </footer>
    </div>
  )
}

export default App