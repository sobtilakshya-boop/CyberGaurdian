import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Courses</h1>
          <p className="text-slate-300 text-lg">Enhance your cybersecurity knowledge with our comprehensive courses</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cyber Hygiene Course */}
          <Link
            href="/dashboard/courses/cyber-hygiene"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />

            <div className="relative z-10">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-3xl font-bold text-white mb-2">Cyber Hygiene Fundamentals</h2>
              <p className="text-blue-100 mb-6">Master the essential practices to keep yourself and your data safe online. Learn about passwords, phishing, updates, and more.</p>

              <div className="flex items-center gap-2 text-blue-200">
                <span className="text-sm font-semibold">9 Chapters</span>
                <span>•</span>
                <span className="text-sm font-semibold">2.5 hours</span>
                <span>•</span>
                <span className="text-sm font-semibold">1,200 XP</span>
              </div>

              <div className="mt-6 inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold group-hover:bg-blue-50 transition-colors">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Coming Soon */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 opacity-50 cursor-not-allowed">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white">Coming Soon</span>
            </div>

            <div>
              <div className="text-6xl mb-4 opacity-50">🔐</div>
              <h2 className="text-3xl font-bold text-white mb-2">Advanced Threats & Prevention</h2>
              <p className="text-slate-300 mb-6">Dive deep into advanced cybersecurity topics including ransomware, APTs, and enterprise defense strategies.</p>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-sm font-semibold">Coming Q2 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
