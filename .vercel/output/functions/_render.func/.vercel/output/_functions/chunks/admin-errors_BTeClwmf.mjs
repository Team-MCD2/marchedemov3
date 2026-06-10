function humanizeError(err) {
  if (err && typeof err === "object" && err.name === "AbortError") {
    return "Requête annulée.";
  }
  const raw = err && typeof err === "object" && typeof err.message === "string" ? err.message : String(err ?? "");
  if (/fetch failed|Failed to fetch|NetworkError|ECONNRESET|ETIMEDOUT|UND_ERR/i.test(raw)) {
    return "Réseau indisponible — vérifiez votre connexion et réessayez.";
  }
  if (/Unexpected token .* in JSON|Unexpected end of JSON input/i.test(raw)) {
    return "Réponse serveur invalide — réessayez dans un instant.";
  }
  if (/Unauthorized|Forbidden|401|403/i.test(raw)) {
    return "Session expirée — reconnectez-vous (Déconnexion → Login).";
  }
  return raw.length > 240 ? raw.slice(0, 237) + "…" : raw || "Erreur inconnue.";
}

export { humanizeError as h };
