import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}

function CurrentWeatherCard({ location, currentWeather }: { location: string, currentWeather: any }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <h5 className="text-xs font-medium text-zinc-400">Weather Forecast: {location}</h5>
      <div className="flex flex-col shadow-md gap-2 w-full rounded-lg items-center bg-blue-500 text-white p-3 border border-zinc-200">
        <div className="flex flex-col items-center">
          <h4 className="text-xs">{currentWeather.current.weather[0].main}</h4>
          {currentWeather.current.weather[0].main === "Clouds" ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 300 300" fill="none">
            <g filter="url(#filter0_b_105_38)">
            <g filter="url(#filter1_i_105_38)">
            <path d="M276.412 61.9888C276.851 59.4969 277.08 56.9336 277.08 54.3172C277.08 29.8415 257.053 10 232.349 10C213.984 10 198.204 20.9657 191.315 36.6491C185.734 31.8754 178.493 28.9931 170.579 28.9931C152.933 28.9931 138.629 43.3231 138.629 61C138.629 61.9843 138.673 62.9583 138.76 63.92C130.273 68.0387 124.428 76.6811 124.428 86.6759C124.428 100.662 135.872 112 149.989 112H270.69C284.806 112 296.25 100.662 296.25 86.6759C296.25 74.6388 287.773 64.5633 276.412 61.9888Z" fill="url(#paint0_linear_105_38)"/>
            </g>
            </g>
            <g filter="url(#filter2_b_105_38)">
            <g filter="url(#filter3_i_105_38)">
            <path d="M187.744 132.221C188.287 129.143 188.569 125.977 188.569 122.745C188.569 92.5101 163.831 68 133.314 68C110.628 68 91.1343 81.5459 82.6246 100.92C75.7307 95.0225 66.7851 91.4621 57.0093 91.4621C35.2117 91.4621 17.5413 109.164 17.5413 131C17.5413 132.216 17.5961 133.419 17.7034 134.607C7.21913 139.695 0 150.371 0 162.717C0 179.994 14.1363 194 31.5744 194H180.676C198.114 194 212.25 179.994 212.25 162.717C212.25 147.848 201.779 135.402 187.744 132.221Z" fill="url(#paint1_linear_105_38)"/>
            </g>
            </g>
            <g filter="url(#filter4_i_105_38)">
            <path d="M268.843 212.09C269.528 208.203 269.885 204.205 269.885 200.124C269.885 161.948 238.648 131 200.116 131C171.471 131 146.858 148.104 136.113 172.566C127.408 165.12 116.113 160.625 103.769 160.625C76.2462 160.625 53.9344 182.976 53.9344 210.548C53.9344 212.083 54.0036 213.602 54.139 215.102C40.901 221.526 31.7856 235.006 31.7856 250.596C31.7856 272.411 49.6351 290.095 71.6534 290.095H259.918C281.936 290.095 299.786 272.411 299.786 250.596C299.786 231.821 286.565 216.106 268.843 212.09Z" fill="url(#paint2_linear_105_38)"/>
            </g>
            <defs>
            <filter id="filter0_b_105_38" x="108.036" y="-6.39286" width="204.607" height="134.786" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="8.19643"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_105_38"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_105_38" result="shape"/>
            </filter>
            <filter id="filter1_i_105_38" x="124.428" y="10" width="171.821" height="108.071" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="6.67857"/>
            <feGaussianBlur stdDeviation="3.03571"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_105_38"/>
            </filter>
            <filter id="filter2_b_105_38" x="-20.25" y="47.75" width="252.75" height="166.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="10.125"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_105_38"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_105_38" result="shape"/>
            </filter>
            <filter id="filter3_i_105_38" x="0" y="68" width="212.25" height="133.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="8.25"/>
            <feGaussianBlur stdDeviation="3.75"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_105_38"/>
            </filter>
            <filter id="filter4_i_105_38" x="31.7856" y="131" width="268" height="168.565" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="10.417"/>
            <feGaussianBlur stdDeviation="4.73498"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_105_38"/>
            </filter>
            <linearGradient id="paint0_linear_105_38" x1="135.357" y1="102.893" x2="308.696" y2="-26.7322" gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="white" stop-opacity="0.58"/>
            </linearGradient>
            <linearGradient id="paint1_linear_105_38" x1="13.5" y1="182.75" x2="227.625" y2="22.625" gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="white" stop-opacity="0.58"/>
            </linearGradient>
            <linearGradient id="paint2_linear_105_38" x1="48.8316" y1="275.89" x2="319.199" y2="73.7067" gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="white" stop-opacity="0.58"/>
            </linearGradient>
            </defs>
            </svg>
            // add other icons for different weather conditions
          : currentWeather.current.weather[0].main === "Clear" ?
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 300 300" fill="none">
          <g clip-path="url(#clip0_103_18)">
          <g filter="url(#filter0_i_103_18)">
          <path d="M284.717 69.4443C285.055 67.5313 285.231 65.5634 285.231 63.5549C285.231 44.7648 269.802 29.5323 250.77 29.5323C236.621 29.5323 224.464 37.9508 219.156 49.991C214.857 46.3261 209.278 44.1134 203.181 44.1134C189.586 44.1134 178.566 55.1146 178.566 68.6852C178.566 69.4409 178.6 70.1886 178.667 70.9269C172.128 74.0889 167.626 80.7237 167.626 88.3967C167.626 99.1339 176.442 107.838 187.318 107.838H280.308C291.184 107.838 300 99.1339 300 88.3967C300 79.1558 293.47 71.4208 284.717 69.4443Z" fill="url(#paint0_linear_103_18)"/>
          </g>
          <g filter="url(#filter1_f_103_18)">
          <rect x="31" y="51" width="220" height="208" rx="104" fill="#FFEF9A"/>
          </g>
          <g filter="url(#filter2_i_103_18)">
          <path d="M273.165 155C273.165 223.022 218.538 278.165 151.151 278.165C83.7644 278.165 29.1367 223.022 29.1367 155C29.1367 86.9776 83.7644 31.8345 151.151 31.8345C218.538 31.8345 273.165 86.9776 273.165 155Z" fill="url(#paint1_linear_103_18)"/>
          </g>
          <g filter="url(#filter3_i_103_18)">
          <path d="M116.32 247.624C116.647 245.778 116.817 243.879 116.817 241.94C116.817 223.803 101.925 209.101 83.5543 209.101C69.8976 209.101 58.1631 217.226 53.0404 228.848C48.8905 225.31 43.5054 223.175 37.6206 223.175C24.4989 223.175 13.8617 233.793 13.8617 246.892C13.8617 247.621 13.8947 248.343 13.9593 249.055C7.64799 252.107 3.30224 258.512 3.30224 265.918C3.30224 276.281 11.812 284.683 22.3093 284.683H112.065C122.562 284.683 131.072 276.281 131.072 265.918C131.072 256.998 124.769 249.532 116.32 247.624Z" fill="url(#paint2_linear_103_18)"/>
          </g>
          </g>
          <defs>
          <filter id="filter0_i_103_18" x="167.626" y="29.5323" width="132.374" height="87.6279" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="10.2543"/>
          <feGaussianBlur stdDeviation="4.66106"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_18"/>
          </filter>
          <filter id="filter1_f_103_18" x="-57.6331" y="-37.6331" width="397.266" height="385.266" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="44.3165" result="effect1_foregroundBlur_103_18"/>
          </filter>
          <filter id="filter2_i_103_18" x="29.1367" y="31.8345" width="244.029" height="252.086" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.7554"/>
          <feGaussianBlur stdDeviation="10.3597"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.81 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_18"/>
          </filter>
          <filter id="filter3_i_103_18" x="3.30225" y="209.101" width="127.77" height="84.58" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="9.89766"/>
          <feGaussianBlur stdDeviation="4.49894"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_18"/>
          </filter>
          <linearGradient id="paint0_linear_103_18" x1="176.045" y1="100.847" x2="309.251" y2="0.882219" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="white" stop-opacity="0.58"/>
          </linearGradient>
          <linearGradient id="paint1_linear_103_18" x1="132.617" y1="222.039" x2="234.438" y2="45.1298" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF9900"/>
          <stop offset="1" stop-color="#FFEE94"/>
          </linearGradient>
          <linearGradient id="paint2_linear_103_18" x1="11.4289" y1="277.934" x2="140.001" y2="181.447" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="white" stop-opacity="0.58"/>
          </linearGradient>
          <clipPath id="clip0_103_18">
          <rect width="300" height="300" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          : currentWeather.current.weather[0].main === "Rain" ?
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 300 300" fill="none">
          <g clip-path="url(#clip0_104_26)">
          <g filter="url(#filter0_b_104_26)">
          <g filter="url(#filter1_i_104_26)">
          <path d="M258.441 119.594C259.162 115.504 259.537 111.297 259.537 107.003C259.537 66.8322 226.669 34.2675 186.124 34.2675C155.982 34.2675 130.083 52.2649 118.777 78.0051C109.618 70.1702 97.7321 65.4397 84.7438 65.4397C55.7831 65.4397 32.3058 88.9587 32.3058 117.971C32.3058 119.586 32.3786 121.185 32.5211 122.763C18.5915 129.523 9 143.707 9 160.111C9 183.066 27.7819 201.674 50.9504 201.674H249.05C272.218 201.674 291 183.066 291 160.111C291 140.355 277.088 123.819 258.441 119.594Z" fill="url(#paint0_linear_104_26)"/>
          </g>
          </g>
          <g filter="url(#filter2_di_104_26)">
          <path d="M64.1088 170C51.9527 185.999 34.9342 217.998 64.1088 217.998C93.2834 217.998 76.2649 185.999 64.1088 170Z" fill="#00BCFF"/>
          </g>
          <g filter="url(#filter3_di_104_26)">
          <path d="M158.789 170C146.633 185.999 129.615 217.998 158.789 217.998C187.964 217.998 170.945 185.999 158.789 170Z" fill="#00BCFF"/>
          </g>
          <g filter="url(#filter4_di_104_26)">
          <path d="M241.476 170C229.32 185.999 212.302 217.998 241.476 217.998C270.651 217.998 253.633 185.999 241.476 170Z" fill="#00BCFF"/>
          </g>
          <g filter="url(#filter5_di_104_26)">
          <path d="M113.422 209.362C101.265 225.361 84.2469 257.359 113.422 257.359C142.596 257.359 125.578 225.361 113.422 209.362Z" fill="#00BCFF"/>
          </g>
          <g filter="url(#filter6_di_104_26)">
          <path d="M196.109 209.362C183.953 225.361 166.934 257.359 196.109 257.359C225.283 257.359 208.265 225.361 196.109 209.362Z" fill="#00BCFF"/>
          </g>
          <g filter="url(#filter7_f_104_26)">
          <rect x="57" y="207" width="186" height="31" rx="15.5" fill="#00BCFF"/>
          </g>
          </g>
          <defs>
          <filter id="filter0_b_104_26" x="-15.2484" y="10.0191" width="330.497" height="215.903" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="12.1242"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_104_26" result="shape"/>
          </filter>
          <filter id="filter1_i_104_26" x="9" y="34.2675" width="282" height="176.387" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="9.87898"/>
          <feGaussianBlur stdDeviation="4.49045"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_104_26"/>
          </filter>
          <filter id="filter2_di_104_26" x="35.5074" y="170" width="57.2026" height="73.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="13.1501"/>
          <feGaussianBlur stdDeviation="6.24628"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.283785 0 0 0 0 0.178889 0 0 0 0 0.933333 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_26" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.91752"/>
          <feGaussianBlur stdDeviation="0.986254"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_104_26"/>
          </filter>
          <filter id="filter3_di_104_26" x="130.188" y="170" width="57.2026" height="73.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="13.1501"/>
          <feGaussianBlur stdDeviation="6.24628"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.283785 0 0 0 0 0.178889 0 0 0 0 0.933333 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_26" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.91752"/>
          <feGaussianBlur stdDeviation="0.986254"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_104_26"/>
          </filter>
          <filter id="filter4_di_104_26" x="212.875" y="170" width="57.2026" height="73.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="13.1501"/>
          <feGaussianBlur stdDeviation="6.24628"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.283785 0 0 0 0 0.178889 0 0 0 0 0.933333 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_26" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.91752"/>
          <feGaussianBlur stdDeviation="0.986254"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_104_26"/>
          </filter>
          <filter id="filter5_di_104_26" x="84.8202" y="209.362" width="57.2026" height="73.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="13.1501"/>
          <feGaussianBlur stdDeviation="6.24628"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.283785 0 0 0 0 0.178889 0 0 0 0 0.933333 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_26" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.91752"/>
          <feGaussianBlur stdDeviation="0.986254"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_104_26"/>
          </filter>
          <filter id="filter6_di_104_26" x="167.507" y="209.362" width="57.2026" height="73.6403" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="13.1501"/>
          <feGaussianBlur stdDeviation="6.24628"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.283785 0 0 0 0 0.178889 0 0 0 0 0.933333 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_26"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_26" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="5.91752"/>
          <feGaussianBlur stdDeviation="0.986254"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_104_26"/>
          </filter>
          <filter id="filter7_f_104_26" x="-13.051" y="136.949" width="326.102" height="171.102" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="35.0255" result="effect1_foregroundBlur_104_26"/>
          </filter>
          <linearGradient id="paint0_linear_104_26" x1="26.9364" y1="186.727" x2="311.428" y2="-26.0187" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="white" stop-opacity="0.58"/>
          </linearGradient>
          <clipPath id="clip0_104_26">
          <rect width="300" height="300" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          : null
          }
        </div>
        <div className="flex flex-row gap-1 pl-3">
          <h2 className="text-2xl font-semibold">{currentWeather.current.temp}</h2><h5>°C</h5>
        </div>
        <div className="flex flex-row gap-4">
        {currentWeather.hourly.slice(0, 7).map((hour: any, index: number) => (
          <div className="flex flex-col gap-1" key={index}>
            <h5 className="text-xs text-zinc-100">{index === 0 ? 'Now' : index === 1 ? '1 hour' : `${index} hours`}</h5>
            <h4 className="font-medium">{Math.round(hour.temp)} °C</h4>
          </div>
        ))}
      </div>
        </div>
    </div>
  )
}
 
// An example of a flight card component.

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

 
// An example of a function that fetches weather information from an external API.
async function get_weather_forecast(location: string, forecast_days: number, units: string) {
  try {
    let url = `${process.env.URL}/api/weather-forecast?location=${location}`
    if (units) {
      url += `&units=${units}`
    }
    if (forecast_days) {
      url += `&forecast_days=${forecast_days}`
    } else {
      url += `&forecast_days=${1}`
    }
    const response = await fetch(url,{method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

// An example of a function that fetches weather information from an external API.
async function get_current_weather(location: string, units?: string) {
  try {
    let url = `${process.env.URL}/api/current-weather?location=${location}`
    if (units) {
      url += `&units=${units}`
    }
    const response = await fetch(url, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}
 
async function submitUserMessage(userInput: string) {
  'use server';
 
  const aiState: any = getMutableAIState<typeof AI>();
 
  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: userInput,
    },
  ]);
 
  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: 'gpt-4-0125-preview',
    provider: openai,
    messages: [
      { role: 'system', content: 'You help people understand the weather forecast' },
      ...aiState.get()
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content
          }
        ]);
      }
 
      return <div className="w-full">{content}</div>
    },
    tools: {
      get_current_weather: {
        description: 'Get the current weather forecast for a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather forecast for'),
          units: z.string().optional().describe('The units to display the temperature in. Can be "metric" or "imperial"'),
        }).required(),
        render: async function* ({ location, units }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner/>

          // Fetch the flight information from an external API.
          const currentWeather = await get_current_weather(location, units)
 
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_forecast",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(currentWeather),
            }
          ]);
          // show the weather forecast for the first object in weatherForecast array

          // Return the flight card to the client.
          return <CurrentWeatherCard location={location} currentWeather={currentWeather} />;
        }
      }
    }
  })
 
  return {
    id: Date.now(),
    display: ui,
    role: "assistant"
  };
}
 
// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];
 
// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];
 
// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
});