import type { DetailResponse } from "@/types";

const profileModules = import.meta.glob<DetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<DetailResponse | null> {
  const targetPath = `../assets/data/profiles/${username.toLowerCase()}.json`;
  const matchingKey = Object.keys(profileModules).find(
    (key) => key.toLowerCase() === targetPath
  );

  if (!matchingKey) {
    return null;
  }

  const loader = profileModules[matchingKey];
  const result = await loader();
  const data =
    (result as { default?: DetailResponse }).default ?? result;
  return data as DetailResponse;
}
