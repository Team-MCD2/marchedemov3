import './supabase_DGRgIA0P.mjs';

function logActivity(args) {
  return;
}
async function recentActivity(limit = 20) {
  return [];
}
async function activityTableStatus() {
  return { available: false, reason: "unknown", detail: "service_role key missing" };
}
async function dailyActivityCounts(days = 14) {
  return null;
}

export { activityTableStatus as a, dailyActivityCounts as d, logActivity as l, recentActivity as r };
