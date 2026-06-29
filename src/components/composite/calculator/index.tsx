"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type CalculatorProps = {
  className?: string;
};

export const Calculator = ({ className }: CalculatorProps) => {
  const [display, setDisplay] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");
  const [memory, setMemory] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Procedural physical click sound generator using Web Audio API
  const playClickSound = useCallback((isOperator = false) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Different physical click frequencies for numbers vs operators
      if (isOperator) {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
        
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1500, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (e) {
      // Audio context blocked or unsupported
    }
  }, []);

  // Handle number input
  const handleNumber = useCallback((num: string) => {
    playClickSound(false);
    setDisplay((prev) => {
      if (prev === "0" || isFinished) {
        setIsFinished(false);
        return num;
      }
      // Limit length to fit LCD screen nicely
      if (prev.replace(".", "").length >= 10) return prev;
      return prev + num;
    });
  }, [isFinished, playClickSound]);

  // Handle decimal point
  const handleDecimal = useCallback(() => {
    playClickSound(false);
    setDisplay((prev) => {
      if (isFinished) {
        setIsFinished(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  }, [isFinished, playClickSound]);

  // Handle operators (+, -, ×, ÷)
  const handleOperator = useCallback((op: string) => {
    playClickSound(true);
    setEquation((prev) => {
      const lastChar = prev.trim().slice(-1);
      if (["+", "-", "*", "/"].includes(lastChar) && display === "0") {
        return prev.slice(0, -2) + ` ${op} `;
      }
      return prev + ` ${display} ${op} `;
    });
    setDisplay("0");
    setIsFinished(false);
  }, [display, playClickSound]);

  // Handle calculation (=)
  const handleCalculate = useCallback(() => {
    playClickSound(true);
    if (!equation) return;

    try {
      const finalExpression = equation + display;
      // Safe evaluation using Function constructor instead of eval
      // Replace × with * and ÷ with /
      const sanitizedExpression = finalExpression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/[^0-9. +\-*/()]/g, ""); // Security sanitization

      const result = new Function(`return (${sanitizedExpression})`)();
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
      } else {
        // Format result to fit screen
        const resultStr = result.toString();
        if (resultStr.length > 10) {
          setDisplay(result.toPrecision(8).toString());
        } else {
          setDisplay(resultStr);
        }
      }
    } catch (e) {
      setDisplay("Error");
    }
    setEquation("");
    setIsFinished(true);
  }, [equation, display, playClickSound]);

  // Handle Clear / Delete
  const handleClear = useCallback(() => {
    playClickSound(true);
    setDisplay("0");
    setEquation("");
    setIsFinished(false);
  }, [playClickSound]);

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    playClickSound(false);
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === "Error") return "0";
      return prev.slice(0, -1);
    });
  }, [playClickSound]);

  // Handle +/- sign toggle
  const handleToggleSign = useCallback(() => {
    playClickSound(false);
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      if (prev.startsWith("-")) return prev.slice(1);
      return "-" + prev;
    });
  }, [playClickSound]);

  // Memory functions
  const handleMemoryClear = useCallback(() => {
    playClickSound(true);
    setMemory(0);
    setHasMemory(false);
  }, [playClickSound]);

  const handleMemoryAdd = useCallback(() => {
    playClickSound(true);
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setMemory((prev) => prev + val);
      setHasMemory(true);
      setIsFinished(true);
    }
  }, [display, playClickSound]);

  const handleMemorySubtract = useCallback(() => {
    playClickSound(true);
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setMemory((prev) => prev - val);
      setHasMemory(true);
      setIsFinished(true);
    }
  }, [display, playClickSound]);

  const handleMemoryRecall = useCallback(() => {
    playClickSound(true);
    setDisplay(memory.toString());
    setIsFinished(true);
  }, [memory, playClickSound]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumber(e.key);
      } else if (e.key === ".") {
        handleDecimal();
      } else if (e.key === "+") {
        handleOperator("+");
      } else if (e.key === "-") {
        handleOperator("-");
      } else if (e.key === "*" || e.key === "x") {
        handleOperator("*");
      } else if (e.key === "/") {
        handleOperator("/");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        handleClear();
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNumber, handleDecimal, handleOperator, handleCalculate, handleClear, handleBackspace]);

  return (
    <div
      className={cn(
        "relative w-[340px] rounded-[24px] border border-neutral-300 bg-linear-to-b from-[#e8e8e8] to-[#d4d4d4] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] select-none",
        className
      )}
    >
      {/* Top Metallic Bevel for Screen */}
      <div className="relative mb-5 rounded-[12px] border border-[#a8a8a8] bg-linear-to-b from-[#b5b5b5] to-[#cfcfcc] p-[3px] shadow-[0_1px_2px_rgba(255,255,255,0.6),inset_0_1.5px_3px_rgba(0,0,0,0.15)]">
        {/* Recessed LCD Screen */}
        <div className="relative h-[76px] overflow-hidden rounded-[9px] border border-[#9c9c9c] bg-[#c2c5b4] px-4 py-2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(0,0,0,0.15)]">
          {/* Faint LCD background grid "8888888888" */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[42px] font-bold tracking-widest text-black/[0.03] select-none text-right w-full pr-1">
            8888888888
          </div>

          {/* Memory Indicator */}
          {hasMemory && (
            <div className="absolute top-1.5 left-3 font-mono text-[10px] font-bold text-neutral-700/80 tracking-wider">
              M
            </div>
          )}

          {/* Equation preview */}
          <div className="absolute top-1.5 right-4 font-mono text-[11px] text-neutral-600/70 truncate max-w-[90%] text-right">
            {equation}
          </div>

          {/* Active display value */}
          <div className="absolute bottom-1 right-4 font-mono text-[42px] font-bold tracking-widest text-neutral-800 text-right drop-shadow-[0.5px_1px_0.5px_rgba(255,255,255,0.4)] truncate max-w-[95%]">
            {display}
          </div>

          {/* Glass glare effect overlay */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3.5">
        {/* Row 1: Memory keys (Dark charcoal gray) */}
        <button
          onClick={handleMemoryClear}
          className="h-[52px] rounded-[8px] border border-[#2d2d2d] bg-linear-to-b from-[#4d4d4d] to-[#383838] font-mono text-xs font-bold text-neutral-200 shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          mc
        </button>
        <button
          onClick={handleMemoryAdd}
          className="h-[52px] rounded-[8px] border border-[#2d2d2d] bg-linear-to-b from-[#4d4d4d] to-[#383838] font-mono text-xs font-bold text-neutral-200 shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          m+
        </button>
        <button
          onClick={handleMemorySubtract}
          className="h-[52px] rounded-[8px] border border-[#2d2d2d] bg-linear-to-b from-[#4d4d4d] to-[#383838] font-mono text-xs font-bold text-neutral-200 shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          m-
        </button>
        <button
          onClick={handleMemoryRecall}
          className="h-[52px] rounded-[8px] border border-[#2d2d2d] bg-linear-to-b from-[#4d4d4d] to-[#383838] font-mono text-xs font-bold text-neutral-200 shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          mr
        </button>

        {/* Row 2: Del, +/-, ÷, × (Medium gray) */}
        <button
          onClick={handleClear}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-sm font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          Del
        </button>
        <button
          onClick={handleToggleSign}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-lg font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          +/-
        </button>
        <button
          onClick={() => handleOperator("/")}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-xl font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          ÷
        </button>
        <button
          onClick={() => handleOperator("*")}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-xl font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          ×
        </button>

        {/* Row 3: 7, 8, 9, - */}
        <button
          onClick={() => handleNumber("7")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleNumber("8")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleNumber("9")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleOperator("-")}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-2xl font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          −
        </button>

        {/* Row 4: 4, 5, 6, + */}
        <button
          onClick={() => handleNumber("4")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleNumber("5")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleNumber("6")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleOperator("+")}
          className="h-[52px] rounded-[8px] border border-[#4c4c4c] bg-linear-to-b from-[#6e6e6e] to-[#595959] font-sans text-xl font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          +
        </button>

        {/* Row 5 & 6 Column Spans */}
        <button
          onClick={() => handleNumber("1")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleNumber("2")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleNumber("3")}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          3
        </button>

        {/* Orange Equal (=) Button - Spans Row 5 and 6 vertically */}
        <button
          onClick={handleCalculate}
          className="row-span-2 h-full rounded-[8px] border border-[#c54a1b] bg-linear-to-b from-[#f28244] to-[#e05d26] font-sans text-2xl font-bold text-white shadow-[0_2.5px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.5)] cursor-pointer flex items-center justify-center"
          style={{ minHeight: "118px" }}
        >
          =
        </button>

        {/* Row 6: 0 (Spans 2 columns horizontally), . */}
        <button
          onClick={() => handleNumber("0")}
          className="col-span-2 h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer text-left pl-6"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-[52px] rounded-[8px] border border-[#d4d4d4] bg-linear-to-b from-[#fbfbfb] to-[#ececec] font-sans text-2xl font-bold text-[#404040] shadow-[0_2px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all active:translate-y-[1px] active:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          .
        </button>
      </div>
    </div>
  );
};
