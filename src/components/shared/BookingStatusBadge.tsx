import { getStatusColor, getStatusLabel } from "@/lib/utils";

export default function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
