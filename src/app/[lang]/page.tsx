import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../kamus";
import InteractivePortfolio from "./home";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang as any);

  return <InteractivePortfolio dict={dict} lang={lang} />;
}
