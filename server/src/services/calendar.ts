import type { Course } from '@prisma/client';

const RECURRENCE_MAP: Record<string, string> = {
  DAILY: 'FREQ=DAILY',
  WEEKLY: 'FREQ=WEEKLY',
  BIWEEKLY: 'FREQ=WEEKLY;INTERVAL=2',
  MONTHLY: 'FREQ=MONTHLY',
};

function formatDateICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function generateICS(course: Course): string {
  const start = new Date(course.startDate);
  const end = new Date(course.endDate);

  // If sessionTime is set, use it for the event time
  if (course.sessionTime) {
    const [hours, minutes] = course.sessionTime.split(':').map(Number);
    start.setHours(hours, minutes, 0);
    end.setHours(hours, minutes, 0);
  }

  const durationMinutes = course.sessionDuration || 60;
  const eventEnd = new Date(start.getTime() + durationMinutes * 60 * 1000);

  let rrule = '';
  if (course.recurrence && course.recurrence !== 'NONE') {
    const freq = RECURRENCE_MAP[course.recurrence];
    if (freq) {
      const until = formatDateICS(end);
      rrule = `RRULE:${freq};UNTIL=${until}`;
      if (course.recurrenceDays) {
        rrule += `;BYDAY=${course.recurrenceDays}`;
      }
    }
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Guidance Zone//Course Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateICS(start)}`,
    `DTEND:${formatDateICS(eventEnd)}`,
    `SUMMARY:${course.title}`,
    `DESCRIPTION:${course.description.replace(/\n/g, '\\n')}`,
    `ORGANIZER:Acharya Navneetji`,
    ...(course.joinLink ? [`URL:${course.joinLink}`] : []),
    ...(rrule ? [rrule] : []),
    `UID:course-${course.id}@guidancezone.org`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function getGoogleCalendarUrl(course: Course): string {
  const start = new Date(course.startDate);
  if (course.sessionTime) {
    const [hours, minutes] = course.sessionTime.split(':').map(Number);
    start.setHours(hours, minutes, 0);
  }

  const durationMinutes = course.sessionDuration || 60;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: course.title,
    details: course.description,
    dates: `${formatDateICS(start)}/${formatDateICS(end)}`,
  });

  if (course.joinLink) {
    params.set('location', course.joinLink);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
