export const getDocumentStatus = (expiryDate, reminderDayBeforeExpiry) => {
  const currentDate = new Date();
  const expiry = new Date(expiryDate);
  const reminderDays = reminderDayBeforeExpiry;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - currentDate.getTime()) / MS_PER_DAY
  );
  const daysUntilReminder = daysUntilExpiry - reminderDays;

  if (daysUntilExpiry <= 0) return "expired";
  if (daysUntilReminder <= 0) return "expiring";
  return "active";
};