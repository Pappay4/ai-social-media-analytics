const kamus = {
  "id-id": () => import("./kamus/id-id.json").then((module) => module.default),
  "en-us": () => import("./kamus/en-us.json").then((module) => module.default),
};

export type Locale = keyof typeof kamus;

export const hasLocale = (locale: string): locale is Locale =>
  locale in kamus;

export const getDictionary = async (locale: Locale) => kamus[locale]();
