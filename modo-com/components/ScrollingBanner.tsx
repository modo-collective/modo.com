import type React from "react"

const ScrollingBanner: React.FC = () => {
  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mx-4">
          <strong>Modo developer positions</strong> filled — <strong>leave your email</strong> for future opportunities.
        </span>
        <span className="mx-4">
          <strong>Modo developer positions</strong> filled — <strong>leave your email</strong> for future opportunities.
        </span>
      </div>
      <div className="animate-marquee inline-block" aria-hidden="true">
        <span className="mx-4">
          <strong>Modo developer positions</strong> filled — <strong>leave your email</strong> for future opportunities.
        </span>
        <span className="mx-4">
          <strong>Modo developer positions</strong> filled — <strong>leave your email</strong> for future opportunities.
        </span>
      </div>
    </div>
  )
}

export default ScrollingBanner