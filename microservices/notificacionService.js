/**
 * Servicio para generar la notificación*/
const webpush = require("web-push");
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;

webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
);

module.exports = webpush;
