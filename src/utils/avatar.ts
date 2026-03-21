import { API_URL } from "../services/api";

export function resolveAvatarUrl(
  avatar: string | null | undefined,
): string | null {
  if (!avatar) {
    return null;
  }

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  if (avatar.startsWith("/")) {
    return `${API_URL}${avatar}`;
  }

  return `${API_URL}/${avatar}`;
}
