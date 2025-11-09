
import { useEffect, useState } from "react";
import logoImage from "@assets/generated_images/Hero_manufacturing_facility_Algeria_45cb30d8.png";

export default function LoadingPage() {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 3 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 transition-opacity duration-500 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        {/* Main logo container with split animation */}
        <div className="logo-container relative w-64 h-64">
          {/* Logo split into pieces */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top Left piece */}
            <div className="logo-piece logo-piece-1 absolute overflow-hidden">
              <img
                src={logoImage}
                alt="Loading"
                className="w-64 h-64 object-contain"
                style={{ transform: "translate(-0%, -0%)" }}
              />
            </div>

            {/* Top Right piece */}
            <div className="logo-piece logo-piece-2 absolute overflow-hidden">
              <img
                src={logoImage}
                alt="Loading"
                className="w-64 h-64 object-contain"
                style={{ transform: "translate(-50%, -0%)" }}
              />
            </div>

            {/* Bottom Left piece */}
            <div className="logo-piece logo-piece-3 absolute overflow-hidden">
              <img
                src={logoImage}
                alt="Loading"
                className="w-64 h-64 object-contain"
                style={{ transform: "translate(-0%, -50%)" }}
              />
            </div>

            {/* Bottom Right piece */}
            <div className="logo-piece logo-piece-4 absolute overflow-hidden">
              <img
                src={logoImage}
                alt="Loading"
                className="w-64 h-64 object-contain"
                style={{ transform: "translate(-50%, -50%)" }}
              />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="mt-4 text-muted-foreground font-medium">جاري التحميل...</p>
        </div>
      </div>

      <style>{`
        .logo-piece {
          width: 128px;
          height: 128px;
          transition: all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .logo-piece-1 {
          clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
          animation: splitPiece1 3s ease-in-out infinite;
        }

        .logo-piece-2 {
          clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
          left: 128px;
          animation: splitPiece2 3s ease-in-out infinite;
        }

        .logo-piece-3 {
          clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%);
          top: 128px;
          animation: splitPiece3 3s ease-in-out infinite;
        }

        .logo-piece-4 {
          clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
          left: 128px;
          top: 128px;
          animation: splitPiece4 3s ease-in-out infinite;
        }

        @keyframes splitPiece1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(-30px, -30px) rotate(-15deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(-40px, -40px) rotate(-20deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(-30px, -30px) rotate(-15deg);
            opacity: 0.7;
          }
        }

        @keyframes splitPiece2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(30px, -30px) rotate(15deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(40px, -40px) rotate(20deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(30px, -30px) rotate(15deg);
            opacity: 0.7;
          }
        }

        @keyframes splitPiece3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(-30px, 30px) rotate(15deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(-40px, 40px) rotate(20deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(-30px, 30px) rotate(15deg);
            opacity: 0.7;
          }
        }

        @keyframes splitPiece4 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(30px, 30px) rotate(-15deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(40px, 40px) rotate(-20deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(30px, 30px) rotate(-15deg);
            opacity: 0.7;
          }
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: hsl(var(--primary));
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
