'use client';

import { useRouter } from 'next/navigation';

// Simple date chooser. Changing it reloads the page for that day's marks.
export default function DatePicker({ date }: { date: string }) {
  const router = useRouter();
  return (
    <label className="att-date">
      <span>Date</span>
      <input
        type="date"
        defaultValue={date}
        onChange={(e) => {
          const v = e.target.value;
          if (v) router.push(`/teacher/attendance?date=${v}`);
        }}
      />
    </label>
  );
}
