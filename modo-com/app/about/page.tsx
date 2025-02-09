import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">About Modo</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold mb-4">An app for artists, by artists</h2>
          <p className="mb-4">
            Modo is a revolutionary social media platform designed specifically for artists to showcase their work,
            connect with fellow creatives, and find inspiration. Our mission is to create a space where creativity
            thrives and artists can focus on what they do best: creating.
          </p>
          <p className="mb-4">
            Unlike traditional social media platforms, Modo puts the emphasis on the art itself, not on endless
            scrolling. We believe that by providing a dedicated space for artists, we can foster a community that truly
            appreciates and supports creative endeavors.
          </p>
          <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Customizable portfolios</li>
            <li>Collaborative tools for artists</li>
            <li>Art-focused feed with minimal distractions</li>
            <li>Opportunities to connect with art enthusiasts and potential clients</li>
            <li>Resources for professional development</li>
          </ul>
          <p>Join us in revolutionizing the way artists interact online. Stop scrolling, start creating with Modo.</p>
        </div>
      </main>
      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            {(() => {
              const startYear = 2025
              const currentYear = new Date().getFullYear()
              if (currentYear > startYear) {
                return `© ${startYear}-${currentYear} Modo. All rights reserved.`
              } else {
                return `© ${startYear} Modo. All rights reserved.`
              }
            })()}
          </p>
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}