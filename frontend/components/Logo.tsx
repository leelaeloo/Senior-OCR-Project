/**
 * 읽어드림 로고 컴포넌트
 */

export default function Logo() {
  return (
    <svg
      width="280"
      height="70"
      viewBox="0 0 550 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      style={{ display: "block", verticalAlign: "middle" }}
    >
      {/* 그림 로고: 책 왼쪽 페이지 */}
      <path d="M15 35 L15 135 L73 135 L78 127 L78 35 L73 30 Z" fill="#FDB91A" />

      {/* 그림 로고: 책 오른쪽 페이지 */}
      <path
        d="M78 35 L83 30 L141 35 L141 135 L83 135 L78 127 Z"
        fill="#FCCA3D"
      />

      {/* 그림 로고: 책 중앙선 */}
      <rect x="73" y="30" width="10" height="105" fill="#E5A319" />

      {/* 그림 로고: 책 윗부분 3D */}
      <path
        d="M15 35 L73 30 L78 22 L83 30 L141 35 L83 42 L78 36 L73 42 Z"
        fill="#FCCA3D"
      />

      {/* 그림 로고: 안경 왼쪽 렌즈 */}
      <circle
        cx="48"
        cy="85"
        r="18"
        fill="none"
        stroke="#1F2937"
        strokeWidth="7"
      />

      {/* 그림 로고: 안경 오른쪽 렌즈 */}
      <circle
        cx="108"
        cy="85"
        r="18"
        fill="none"
        stroke="#1F2937"
        strokeWidth="7"
      />

      {/* 그림 로고: 안경 브릿지 */}
      <path
        d="M66 85 L90 85"
        stroke="#1F2937"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* 그림 로고: 안경 왼쪽 다리 */}
      <path
        d="M30 85 L15 82"
        stroke="#1F2937"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* 그림 로고: 안경 오른쪽 다리 */}
      <path
        d="M126 85 L141 82"
        stroke="#1F2937"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* 글자 로고: 읽어드림 */}
      <text
        x="170"
        y="80"
        style={{ fontFamily: "var(--font-chiron-go-round)" }}
        fontSize="68"
        fontWeight="900"
        fill="#1F2937"
      >
        읽어드림
      </text>

      {/* 글자 로고: 어르신을 위한 똑똑한 안경 */}
      <text
        x="170"
        y="125"
        style={{ fontFamily: "var(--font-chiron-go-round)" }}
        fontSize="28"
        fontWeight="600"
        fill="#6B7280"
      >
        어르신을 위한 똑똑한 안경
      </text>
    </svg>
  );
}
