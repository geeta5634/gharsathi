const steps = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "WORKER_ASSIGNED", label: "Worker Assigned" },
  { key: "WORKER_ON_THE_WAY", label: "On The Way" },
  { key: "SERVICE_STARTED", label: "Service Started" },
  { key: "COMPLETED", label: "Completed" },
];

export default function BookingTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between w-full py-4">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                } ${isCurrent ? "ring-2 ring-green-300" : ""}`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-1 text-center ${
                  isCompleted ? "text-green-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentIndex ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
