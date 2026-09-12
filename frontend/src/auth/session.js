const SESSION_KEY = "totemAccessToken";

export function salvarSessao(accessToken) {
  sessionStorage.setItem(SESSION_KEY, accessToken);
}

export function obterToken() {
  return sessionStorage.getItem(SESSION_KEY);
}

export function encerrarSessao() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function sessaoValida() {
  const token = obterToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    encerrarSessao();
    return false;
  }
}
