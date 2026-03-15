import { IoHeartSharp } from "react-icons/io5";

export default function Heart() {
  return (
    <div className="flex items-center gap-1">
      <svg width="0" height="0">
        <defs>
          <radialGradient id="heart-gradient" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffa8ca" />
            <stop offset="40%" stopColor="#eb6ca5" />
            <stop offset="100%" stopColor="#910625" />
          </radialGradient>
        </defs>
      </svg>

      <IoHeartSharp
        className="fill-[url(#heart-gradient)] drop-shadow-sm"
        size={20}
      />
    </div>
  );
}
