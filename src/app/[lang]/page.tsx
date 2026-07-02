import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../kamus";
import InteractivePortfolio from "./home";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return <InteractivePortfolio dict={dict} lang={lang} />;
}
