import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ApplicationTrackerProps {
  status: "applied" | "accepted" | "rejected";
  className?: string;
}

export default function ApplicationTracker({ status, className = "" }: ApplicationTrackerProps) {
  const steps = [
    { key: "applied", label: "Applied" },
    { key: "interview", label: "Interview" },
    { key: "decision", label: status === "rejected" ? "Rejected" : status === "accepted" ? "Accepted" : "Decision" }
  ];

  return (
    <div className={`pt-2 ${className}`}>
      <div className="flex justify-between items-start relative px-4">
        {/* Connector Line */}
        <div className="absolute left-10 right-10 top-3.5 -translate-y-1/2 h-[3px] bg-slate-100 z-0">
          <div
            className={`h-full bg-indigo-500 rounded-full transition-all duration-500`}
            style={{
              width: status === "accepted" || status === "rejected" ? "100%" : status === "interview" ? "50%" : "0%",
            }}
          />
        </div>

        {steps.map((step, stepIdx) => {
          const isFinished = status === "accepted" || status === "rejected" ? true : status === "interview" ? stepIdx <= 1 : stepIdx === 0;
          const isRejectedFinal = status === "rejected" && stepIdx === 2;
          const isAcceptedFinal = status === "accepted" && stepIdx === 2;

          return (
            <div key={step.label} className="flex flex-col items-center z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isRejectedFinal
                    ? "bg-rose-500 text-white border-2 border-rose-600 scale-105"
                    : isAcceptedFinal
                      ? "bg-emerald-500 text-white border-2 border-emerald-600 scale-105"
                      : isFinished
                        ? "bg-indigo-600 text-white border-2 border-indigo-700"
                        : "bg-white text-slate-300 border-2 border-slate-100"
                }`}
              >
                {isFinished ? (
                  isRejectedFinal ? (
                    <XCircle size={13} />
                  ) : (
                    <CheckCircle2 size={13} />
                  )
                ) : (
                  stepIdx + 1
                )}
              </div>
              <span
                className={`text-[9px] font-bold mt-1.5 ${
                  isFinished
                    ? "text-indigo-600 font-extrabold"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
