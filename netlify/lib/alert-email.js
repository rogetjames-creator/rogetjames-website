// Who alert emails come from and go to. Same sender and recipients as the
// pricing alert in functions/track-event.js — keep the two in step.
export const alertFrom = () => process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";
export const alertTo = () => [...new Set([
    process.env.NOTIFY_EMAIL || "james@rogetjames.com",
    "rogetjames@gmail.com",
])];
