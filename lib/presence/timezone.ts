const DEFAULT_TIMEZONE =
  "Europe/Paris";

export function normalizeTimeZone(
  value: string | null | undefined,
) {
  const candidate =
    value?.trim() ||
    DEFAULT_TIMEZONE;

  try {
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: candidate,
      },
    ).format(new Date());

    return candidate;
  }
  catch {
    return DEFAULT_TIMEZONE;
  }
}

export function dateKeyInTimeZone(
  value: Date,
  timeZone: string,
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          normalizeTimeZone(
            timeZone,
          ),
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ).formatToParts(value);

  const year =
    parts.find(
      (part) =>
        part.type === "year",
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type === "month",
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type === "day",
    )?.value;

  if (!year || !month || !day) {
    throw new Error(
      "Impossible de calculer la date locale.",
    );
  }

  return `${year}-${month}-${day}`;
}

export function businessDateFromKey(
  value: string,
) {
  return new Date(
    `${value}T00:00:00.000Z`,
  );
}

export function businessDateKey(
  value: Date,
) {
  return value
    .toISOString()
    .slice(0, 10);
}

export function businessDayOfWeek(
  value: Date,
) {
  const day =
    value.getUTCDay();

  return day === 0
    ? 7
    : day;
}

function offsetMinutesAt(
  value: Date,
  timeZone: string,
) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          normalizeTimeZone(
            timeZone,
          ),
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      },
    );

  const parts =
    formatter.formatToParts(
      value,
    );

  const read =
    (type: Intl.DateTimeFormatPartTypes) =>
      Number(
        parts.find(
          (part) =>
            part.type === type,
        )?.value,
      );

  const representedAsUtc =
    Date.UTC(
      read("year"),
      read("month") - 1,
      read("day"),
      read("hour"),
      read("minute"),
      read("second"),
    );

  return (
    representedAsUtc -
    value.getTime()
  ) / 60000;
}

export function zonedDateTimeToUtc(
  dateKey: string,
  time: string,
  timeZone: string,
) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      dateKey,
    );

  const timeMatch =
    /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
      time,
    );

  if (!match || !timeMatch) {
    throw new Error(
      "Date ou heure locale invalide.",
    );
  }

  const desiredUtc =
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(timeMatch[1]),
      Number(timeMatch[2]),
      Number(timeMatch[3] ?? "0"),
    );

  let result =
    new Date(desiredUtc);

  for (
    let attempt = 0;
    attempt < 3;
    attempt += 1
  ) {
    const offset =
      offsetMinutesAt(
        result,
        timeZone,
      );

    result =
      new Date(
        desiredUtc -
          offset * 60000,
      );
  }

  return result;
}
