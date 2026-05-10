// Real YouTube-style SVG logo with "YouTube Clone" text
function YouTubeLogo() {
  return (
    <div className="yt-logo">
      {/* YouTube play button icon (SVG) */}
      <svg
        className="yt-logo-icon"
        viewBox="0 0 90 63"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="90" height="63" rx="14" fill="#FF0000" />
        <polygon points="36,16 36,47 62,31.5" fill="#FFFFFF" />
      </svg>

      {/* Text: YouTube Clone */}
      <span className="yt-logo-text">
        YouTube<span className="yt-logo-clone"> Clone</span>
      </span>
    </div>
  )
}

export default YouTubeLogo
