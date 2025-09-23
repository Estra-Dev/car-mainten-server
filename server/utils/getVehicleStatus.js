export const getVehicleStatus = (scheduledDate, nextServiceDate) => {
  const currentDate = new Date();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const maintenanceDate = new Date(scheduledDate);
  const nextService = new Date(nextServiceDate);

  const daysUntilScheduled = Math.ceil((maintenanceDate.getTime() - currentDate.getTime()) / MS_PER_DAY);
  const daysUntilNextService = Math.ceil((nextService.getTime() - currentDate.getTime()) / MS_PER_DAY);

  if (daysUntilScheduled <= 0) return "service due";
  if (daysUntilNextService <= 30) return "in maintenance";
  return "active";
}