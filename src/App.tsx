
import { useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  GraduationCap,
  Headphones,
  Languages,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'

const learningPaths = [
  {
    number: '01',
    icon: Languages,
    title: 'Hindi for Beginners',
    description:
      'Start from the basics with Hindi letters, pronunciation, everyday words, and simple sentences.',
    tag: 'START HERE',
    color: 'bg-[#f4e8d6]',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Hindi Grammar',
    description:
      'Understand sentence formation, tenses, gender, nouns, verbs, and grammar rules with examples.',
    tag: 'BUILD YOUR SKILLS',
    color: 'bg-[#eee0e0]',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Notes & Lessons',
    description:
      'Explore organized learning notes, lesson summaries, and study materials in Hindi and English.',
    tag: 'LEARN AT YOUR PACE',
    color: 'bg-[#e9e8d8]',
  },
]

const numbers = [
  { digit: '०', hindi: 'शून्य', english: 'Zero', sound: 'शून्य' },
  { digit: '१', hindi: 'एक', english: 'One', sound: 'एक' },
  { digit: '२', hindi: 'दो', english: 'Two', sound: 'दो' },
  { digit: '३', hindi: 'तीन', english: 'Three', sound: 'तीन' },
  { digit: '४', hindi: 'चार', english: 'Four', sound: 'चार' },
  { digit: '५', hindi: 'पाँच', english: 'Five', sound: 'पाँच' },
  { digit: '६', hindi: 'छह', english: 'Six', sound: 'छह' },
  { digit: '७', hindi: 'सात', english: 'Seven', sound: 'सात' },
  { digit: '८', hindi: 'आठ', english: 'Eight', sound: 'आठ' },
  { digit: '९', hindi: 'नौ', english: 'Nine', sound: 'नौ' },
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
]

function speakHindi(text: string) {
  if (!('speechSynthesis' in window)) {
    alert('Speech playback is not supported by this browser.')
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hi-IN'
  utterance.rate = 0.78

  const voices = window.speechSynthesis.getVoices()
  const hindiVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('hi'))

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
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9a653c]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#4e1925] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#796963] sm:text-base">
        {description}
      </p>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentMessage, setStudentMessage] = useState('')
  const [formNotice, setFormNotice] = useState('')

  // Replace this with your mother's WhatsApp number, including country code.
  const whatsappNumber = '91XXXXXXXXXX'

  const quiz = quizQuestions[quizIndex]

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

  function handleEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!studentName.trim() || !studentMessage.trim()) {
      setFormNotice('Please fill in both fields.')
      return
    }

    const message = `Namaste! I am ${studentName.trim()}.\n\nMy enquiry: ${studentMessage.trim()}\n\nI would like to know more about Hindi classes.`

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      setFormNotice(
        'Please add your WhatsApp number in the code before sending your enquiry.',
      )
      return
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )

    setFormNotice('Your enquiry is ready to send in WhatsApp.')
  }

  const navItems = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Lessons', '#lessons'],
    ['Practice', '#practice'],
    ['Contact', '#contact'],
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf2]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#eadcc9]/80 bg-[#fffaf2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Hindi with Geetha home">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#641f30] text-xl font-bold text-[#f7dfac]">
              हि
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[#541b29] sm:text-lg">
                Hindi with Geetha
              </p>
              <p className="text-[10px] tracking-[0.16em] text-[#97765f]">
                LEARN · SPEAK · GROW
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-[#6f5a50] transition hover:text-[#8a3446]"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full bg-[#641f30] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#812b40]"
            >
              Book a class <ArrowRight className="ml-1 inline" size={15} />
            </a>
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-[#641f30] md:hidden"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#eadcc9] bg-[#fffaf2] px-5 py-4 md:hidden">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-[#641f30] hover:bg-[#f4e8d6]"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 block rounded-full bg-[#641f30] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Book a class
            </a>
          </nav>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="hero-glow paper-pattern relative scroll-mt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e5cfab] bg-white/70 px-4 py-2 text-xs font-semibold text-[#84552f]">
                <Sparkles size={15} />
                YOUR JOURNEY INTO HINDI STARTS HERE
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.13] tracking-tight text-[#4e1925] sm:text-6xl lg:text-[4.25rem]">
                A beautiful language.
                <span className="mt-2 block text-[#a16b38]">
                  A new way to connect.
                </span>
              </h1>

              <p className="hindi mt-6 text-2xl font-medium text-[#6e3440] sm:text-3xl">
                हिंदी सीखें, आत्मविश्वास से बोलें।
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#796963]">
                Discover Hindi through simple lessons, clear explanations, and
                everyday conversations. Learn at your own pace, one word at a
                time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lessons"
                  className="rounded-full bg-[#641f30] px-7 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-[#641f30]/10 transition hover:-translate-y-0.5 hover:bg-[#812b40]"
                >
                  Explore lessons <ArrowRight className="ml-2 inline" size={17} />
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-[#d7b995] bg-white/60 px-7 py-4 text-center text-sm font-semibold text-[#641f30] transition hover:bg-white"
                >
                  <MessageCircle className="mr-2 inline" size={17} />
                  Book a class
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#806c5e]">
                <span><Check className="mr-1 inline text-[#8a673b]" size={15} /> Beginner friendly</span>
                <span><Check className="mr-1 inline text-[#8a673b]" size={15} /> Learn at your pace</span>
                <span><Check className="mr-1 inline text-[#8a673b]" size={15} /> Practical examples</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -right-2 top-8 h-32 w-32 rounded-full bg-[#e4c99f]/50 blur-3xl sm:-right-4" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-[#f1e2cb] p-5 shadow-2xl shadow-[#5b3025]/10 sm:p-8">
                <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-[#c49b69]/30" />
                <div className="absolute -right-1 -top-5 h-32 w-32 rounded-full border border-[#c49b69]/30" />

                <div className="relative rounded-[1.5rem] border border-[#d8bd96] bg-[#fffaf2] p-6 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.22em] text-[#9a653c]">
                      WORD OF THE DAY
                    </span>
                    <span className="rounded-full bg-[#f0e2ca] px-3 py-1 text-xs text-[#81552e]">
                      01 / 10
                    </span>
                  </div>

                  <div className="py-10 text-center">
                    <p className="hindi text-7xl font-semibold text-[#641f30] sm:text-8xl">
                      नमस्ते
                    </p>
                    <p className="mt-4 text-lg font-medium text-[#805a46]">Namaste</p>
                    <p className="mt-2 text-sm text-[#8d7b6c]">Hello · Greetings</p>
                    <button
                      type="button"
                      onClick={() => speakHindi('नमस्ते')}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#641f30] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#812b40]"
                    >
                      <Volume2 size={17} /> Listen to pronunciation
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#e8d9c4] pt-4 text-xs text-[#8d7b6c]">
                    <span className="hindi">नमस्ते!</span>
                    <span>Namaste!</span>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between text-sm text-[#75533b]">
                  <span className="hindi text-lg">सीखते रहें</span>
                  <span className="text-xs">Keep learning ✦</span>
                </div>
              </div>
            </div>
          </div>

          <a
            href="#about"
            className="mx-auto flex w-fit items-center gap-2 pb-7 text-xs font-medium text-[#8c725e]"
          >
            Discover your learning journey <ArrowDown size={14} />
          </a>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24 border-y border-[#eadcc9] bg-white/55">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a653c]">
                A WARM WELCOME
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#4e1925] sm:text-4xl">
                Learn with patience.
                <br />
                Grow with confidence.
              </h2>
            </div>
            <div>
              <p className="text-base leading-8 text-[#796963]">
                Welcome to Hindi with Geetha, a friendly learning space for
                anyone who wants to understand and speak Hindi. Lessons are
                designed to make a new language feel approachable, with simple
                explanations, useful examples, and opportunities to practise.
              </p>
              <p className="hindi mt-4 text-lg leading-8 text-[#7d3d49]">
                हर दिन थोड़ा सीखें, हर दिन आगे बढ़ें।
              </p>
              <p className="mt-1 text-sm text-[#8d7b6c]">
                Learn a little every day, and keep moving forward.
              </p>
            </div>
          </div>
        </section>

        {/* Learning paths */}
        <section id="lessons" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="YOUR LEARNING PATH"
              title="Find your way into Hindi"
              description="Whether you're starting from scratch or strengthening your grammar, begin with the learning path that suits you."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {learningPaths.map((path) => {
                const Icon = path.icon
                return (
                  <article
                    key={path.number}
                    className="group rounded-3xl border border-[#eadcc9] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4b48e] hover:shadow-xl hover:shadow-[#5b3025]/5 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${path.color} text-[#641f30]`}>
                        <Icon size={23} strokeWidth={1.7} />
                      </div>
                      <span className="text-sm font-medium text-[#c1a98e]">{path.number}</span>
                    </div>

                    <p className="mt-7 text-[10px] font-bold tracking-[0.16em] text-[#a16b38]">
                      {path.tag}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#4e1925]">
                      {path.title}
                    </h3>
                    <p className="mt-3 min-h-[84px] text-sm leading-7 text-[#796963]">
                      {path.description}
                    </p>

                    <a
                      href="#practice"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#641f30] transition group-hover:gap-3"
                    >
                      Start exploring <ArrowRight size={16} />
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Number practice */}
        <section id="practice" className="scroll-mt-24 bg-[#f3e9da] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="LEARN BY DOING"
              title="Your first Hindi numbers"
              description="Tap any number to hear its Hindi pronunciation. Try saying it aloud, then practise with the quiz below."
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
              {numbers.map((number) => (
                <button
                  key={number.digit}
                  type="button"
                  onClick={() => speakHindi(number.sound)}
                  className="group rounded-2xl border border-[#e3d0b4] bg-[#fffaf2] p-5 text-center transition hover:-translate-y-1 hover:border-[#b98a54] hover:shadow-lg hover:shadow-[#5b3025]/5"
                  aria-label={`Listen to ${number.english} in Hindi`}
                >
                  <span className="hindi block text-4xl font-semibold text-[#641f30]">
                    {number.digit}
                  </span>
                  <span className="hindi mt-2 block text-base font-medium text-[#795047]">
                    {number.hindi}
                  </span>
                  <span className="mt-1 block text-xs text-[#978475]">
                    {number.english}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#a16b38]">
                    <Volume2 size={13} /> Listen
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-xs leading-6 text-[#806c5e]">
              Audio uses your browser's Hindi speech voice, if available.
            </p>
          </div>
        </section>

        {/* Sample lesson */}
        <section id="vocabulary" className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 rounded-[2rem] border border-[#eadcc9] bg-white p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a653c]">
                  A LITTLE PRACTICE
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#4e1925] sm:text-4xl">
                  Everyday Hindi,
                  <br /> made simple.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#796963]">
                  Begin with the words you can use every day. Listen to each
                  word, learn its meaning, and build your vocabulary naturally.
                </p>
                <a
                  href="#quiz"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#641f30] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#812b40]"
                >
                  Try the mini quiz <ArrowRight size={16} />
                </a>
              </div>

              <div className="space-y-3">
                {[
                  { hindi: 'पानी', english: 'Water', sentence: 'मुझे पानी चाहिए।', translation: 'I need water.' },
                  { hindi: 'किताब', english: 'Book', sentence: 'यह मेरी किताब है।', translation: 'This is my book.' },
                  { hindi: 'धन्यवाद', english: 'Thank you', sentence: 'आपकी मदद के लिए धन्यवाद।', translation: 'Thank you for your help.' },
                ].map((word) => (
                  <div
                    key={word.hindi}
                    className="flex items-center gap-4 rounded-2xl bg-[#fff8ee] p-4 sm:p-5"
                  >
                    <button
                      type="button"
                      onClick={() => speakHindi(word.hindi)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e6d4bb] bg-white text-[#641f30] transition hover:bg-[#f0e2ca]"
                      aria-label={`Listen to ${word.hindi}`}
                    >
                      <Volume2 size={18} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="hindi text-xl font-semibold text-[#641f30]">{word.hindi}</span>
                        <span className="text-xs text-[#a16b38]">{word.english}</span>
                      </div>
                      <p className="hindi mt-1 text-sm text-[#6f5148]">{word.sentence}</p>
                      <p className="mt-1 text-xs text-[#958273]">{word.translation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section id="quiz" className="scroll-mt-24 bg-[#641f30] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-9 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#f2d5a1]">
                <GraduationCap size={25} />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#edcb91]">
                CHECK YOUR PROGRESS
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A little quiz, a little growth.</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Test what you've learned with these three quick questions.
              </p>
            </div>

            <div className="rounded-3xl bg-[#fffaf2] p-6 text-[#4e1925] sm:p-9">
              {quizFinished ? (
                <div className="py-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8dcc3] text-[#641f30]">
                    <Check size={30} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">Well done!</h3>
                  <p className="mt-3 text-[#796963]">
                    You scored <strong className="text-[#641f30">{score} out of {quizQuestions.length}</strong>.
                  </p>
                  <p className="mt-2 text-sm text-[#796963]">
                    Every word you practise brings you one step forward.
                  </p>
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="mt-7 rounded-full bg-[#641f30] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#812b40]"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-[#9a653c]">
                      QUESTION {quizIndex + 1} OF {quizQuestions.length}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#978475]">
                      <Clock3 size={14} /> Mini quiz
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eee3d5]">
                    <div
                      className="h-full rounded-full bg-[#a16b38] transition-all"
                      style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold sm:text-2xl">
                    {quiz.question}
                  </h3>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {quiz.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrect = index === quiz.answer

                      let style = 'border-[#eadcc9] bg-white hover:border-[#c6a17b]'

                      if (selectedAnswer !== null && isCorrect) {
                        style = 'border-emerald-600 bg-emerald-50'
                      } else if (isSelected) {
                        style = 'border-[#a16b38] bg-[#f4e8d6]'
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={selectedAnswer !== null}
                          onClick={() => setSelectedAnswer(index)}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrect && (
                            <Check size={17} className="shrink-0 text-emerald-700" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mt-5 rounded-xl bg-[#f4e8d6] p-4 text-sm leading-6 text-[#6f5148]">
                      <strong>
                        {selectedAnswer === quiz.answer ? 'Correct! ' : 'Not quite. '}
                      </strong>
                      {quiz.explanation}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={selectedAnswer === null}
                    onClick={submitAnswer}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#641f30] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#812b40] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {quizIndex === quizQuestions.length - 1 ? 'See my score' : 'Next question'}
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a653c]">
                LET'S BEGIN
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#4e1925] sm:text-5xl">
                Ready to start
                <br />
                learning Hindi?
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#796963]">
                Have a question about lessons or classes? Send an enquiry and
                take the first step in your Hindi learning journey.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0e2ca] text-[#641f30]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#4e1925]">WhatsApp enquiries</p>
                    <p className="mt-1 text-xs text-[#8d7b6c]">Ask about lessons and class availability</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0e2ca] text-[#641f30]">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#4e1925]">Learn at your pace</p>
                    <p className="mt-1 text-xs text-[#8d7b6c]">Ask which learning path suits you</p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleEnquiry}
              className="rounded-3xl border border-[#eadcc9] bg-white p-6 shadow-xl shadow-[#5b3025]/5 sm:p-9"
            >
              <h3 className="text-xl font-semibold text-[#4e1925]">Send an enquiry</h3>
              <p className="mt-2 text-sm leading-6 text-[#8d7b6c]">
                Fill in the details below to prepare a message in WhatsApp.
              </p>

              <label htmlFor="student-name" className="mt-7 block text-sm font-medium text-[#6f5148]">
                Your name
              </label>
              <input
                id="student-name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-xl border border-[#e4d6c5] bg-[#fffdf9] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b3a395] focus:border-[#a16b38] focus:ring-2 focus:ring-[#a16b38]/15"
              />

              <label htmlFor="student-message" className="mt-5 block text-sm font-medium text-[#6f5148]">
                What would you like to learn?
              </label>
              <textarea
                id="student-message"
                value={studentMessage}
                onChange={(event) => setStudentMessage(event.target.value)}
                placeholder="For example, I'm a beginner and want to learn conversational Hindi..."
                rows={4}
                required
                className="mt-2 w-full resize-y rounded-xl border border-[#e4d6c5] bg-[#fffdf9] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-[#b3a395] focus:border-[#a16b38] focus:ring-2 focus:ring-[#a16b38]/15"
              />

              {formNotice && (
                <p role="status" className="mt-4 text-sm leading-6 text-[#7d3d49]">
                  {formNotice}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#641f30] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#812b40]"
              >
                <MessageCircle size={17} />
                Continue with WhatsApp
                <ArrowRight size={16} />
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-[#a08d7c]">
                Your message will open in WhatsApp for you to review and send.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#eadcc9] bg-[#f5ecdf] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a href="#home" className="flex items-center gap-3">
            <span className="hindi flex h-9 w-9 items-center justify-center rounded-full bg-[#641f30] font-bold text-[#f7dfac]">
              हि
            </span>
            <span className="text-sm font-semibold text-[#541b29]">Hindi with Geetha</span>
          </a>

          <p className="text-center text-xs leading-6 text-[#8d7b6c]">
            हर शब्द एक नई शुरुआत है। · Every word is a new beginning.
          </p>

          <a href="#home" className="text-xs font-medium text-[#641f30] hover:underline">
            Back to top ↑
          </a>
        </div>
        <p className="mt-5 text-center text-[11px] text-[#a08d7c]">
          © {new Date().getFullYear()} Hindi with Geetha. Made with care.
        </p>
      </footer>
    </div>
  )
}

export default App