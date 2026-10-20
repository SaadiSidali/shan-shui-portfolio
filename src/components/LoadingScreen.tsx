export function LoadingScreen() {
  return (
    <div className="page-loader" role="status">
      <span className="loading-status">Loading landscape…</span>
      <svg
        className="loading-landscape"
        viewBox="0 0 280 150"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="loading-ink-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#596052" stopOpacity=".13" />
            <stop offset="1" stopColor="#596052" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#loading-ink-wash)"
          d="M13 118 33 100 48 82 60 75 75 49 84 60 92 64 108 87 127 105 143 123Z"
        />
        <path
          fill="url(#loading-ink-wash)"
          d="M54 123 70 104 79 92 88 87 96 68 109 56 119 40 127 25 134 30 141 48 149 51 158 70 169 78 181 97 197 110 216 126Z"
        />
        <path
          fill="url(#loading-ink-wash)"
          d="M157 127 174 106 191 91 201 72 211 63 224 82 231 86 243 105 265 125Z"
        />
        <g className="loading-ghost">
          <path d="m13 118 20-18 15-18 12-7 15-26 9 11 8 4 16 23 19 18 16 18" />
          <path d="m54 123 16-19 9-12 9-5 8-19 13-12 10-16 8-15 7 5 7 18 8 3 9 19 11 8 12 19 16 13 19 16" />
          <path d="m157 127 17-21 17-15 10-19 10-9 13 19 7 4 12 19 22 20" />
        </g>
        <g className="loading-ink">
          <path
            pathLength="1"
            d="m13 118 20-18 15-18 12-7 15-26 9 11 8 4 16 23 19 18 16 18"
          />
          <path
            pathLength="1"
            d="m54 123 16-19 9-12 9-5 8-19 13-12 10-16 8-15 7 5 7 18 8 3 9 19 11 8 12 19 16 13 19 16"
          />
          <path
            pathLength="1"
            d="m157 127 17-21 17-15 10-19 10-9 13 19 7 4 12 19 22 20"
          />
        </g>
        <g className="loading-detail">
          <path d="m127 27-5 20 4 8-11 17 3 8-12 16-2 17m30-77 3 19 9 13-1 7 13 19 14 15M75 51l-5 23 5 8-9 17m145-34-3 22 7 10-4 16" />
          <path d="m117 68-12 13-2 9m14-9-13 20-9 6m49-39 8 18 10 8m-35-48-13 12m26 32 7 17m-61-31-5 14m149 11 7 10" />
          <path d="M21 127c28-5 43-3 64-1s47 3 70 0 50-3 65-1 29 2 45-1M48 133c19-2 32-1 45 0m91-1 30-1" />
        </g>
      </svg>
    </div>
  );
}
