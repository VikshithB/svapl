import { useState } from "react";
import { IMAGES } from "@/config/images";
import { useSanity } from "@/lib/useSanity";
import { NEWS_ARTICLES_QUERY } from "@/lib/queries";
import type { SanityNewsArticle } from "@/lib/types";

const FALLBACK_ARTICLES: SanityNewsArticle[] = [
  {
    _id: "1", slug: "", readTime: "5 min",
    date: "JUN 2026", tag: "Engineering", featured: true,
    title: "The economics of vertical integration in aerostructures",
    desc: "Why owning the full process chain — from raw material receipt through final integration — de-risks delivery timelines for tier-1 programmes.",
    image: IMAGES.newsroom.verticalIntegration,
  },
  {
    _id: "2", slug: "", readTime: "4 min",
    date: "MAY 2026", tag: "Facility", featured: false,
    title: "Unit-III: Scaling to meet global defence requirements",
    desc: "Our third manufacturing facility — 45,000 sq.ft on a 3-acre site in Shamshabad — is now operational and accepting new programmes.",
    image: IMAGES.newsroom.unitIIIFacility,
  },
  {
    _id: "3", slug: "", readTime: "6 min",
    date: "APR 2026", tag: "Precision", featured: false,
    title: "How we hold ±5µm across a 1.2m envelope",
    desc: "Thermal control protocols, custom fixturing strategies and closed-loop CMM verification behind our repeatable machining accuracy.",
    image: IMAGES.newsroom.precisionMachining,
  },
  {
    _id: "4", slug: "", readTime: "5 min",
    date: "MAR 2026", tag: "Quality", featured: false,
    title: "NADCAP welding: what first-article qualification really proves",
    desc: "The accreditation discipline, operator certification cycles, and in-process inspection protocols that keep our special processes flight-safe.",
    image: IMAGES.newsroom.nadcapWelding,
  },
  {
    _id: "5", slug: "", readTime: "7 min",
    date: "FEB 2026", tag: "Programme", featured: false,
    title: "LVM3's Core Base Shroud: an integration story",
    desc: "From isogrid panel machining and sheet metal forming to final structural riveting — the manufacturing narrative behind LVM3's CBS assembly.",
    image: IMAGES.newsroom.lvm3Shroud,
  },
  {
    _id: "6", slug: "", readTime: "6 min",
    date: "JAN 2026", tag: "Defence", featured: false,
    title: "Metal canisters for strategic missiles: a manufacturing deep-dive",
    desc: "How SVAPL designed India's first private-sector metallic canister facility — welding SA516 to 15CDV6, pressure-tested to 10 Bar.",
    image: IMAGES.newsroom.metalCanisters,
  },
  {
    _id: "7", slug: "", readTime: "5 min",
    date: "DEC 2025", tag: "Programme", featured: false,
    title: "First article qualification on PRALAY airframes",
    desc: "Process control, dimensional verification and fatigue-cycle validation — the qualification route for Ø740mm airframes in 15CDV6.",
    image: IMAGES.newsroom.pralayFirstArticle,
  },
  {
    _id: "8", slug: "", readTime: "8 min",
    date: "NOV 2025", tag: "Materials", featured: false,
    title: "Maraging Steel M250: why we invested in the capability",
    desc: "The case for in-house Maraging Steel flow-forming, welding and heat treatment — and what it unlocked for India's strategic missile programmes.",
    image: IMAGES.newsroom.maragingSteel,
  },
];

const TAGS = ["All", "Engineering", "Facility", "Precision", "Quality", "Programme", "Defence", "Materials"];

const TAG_COLORS: Record<string, string> = {
  Engineering: "text-blue-400 border-blue-700/40 bg-blue-900/20",
  Facility: "text-emerald-400 border-emerald-700/40 bg-emerald-900/20",
  Precision: "text-purple-400 border-purple-700/40 bg-purple-900/20",
  Quality: "text-yellow-400 border-yellow-700/40 bg-yellow-900/20",
  Programme: "text-blueprint border-[#f70]/40 bg-blueprint/10",
  Defence: "text-red-400 border-red-700/40 bg-red-900/20",
  Materials: "text-gray-400 border-gray-600/40 bg-gray-800/20",
};

export default function NewsroomPage() {
  const { data } = useSanity<SanityNewsArticle[]>(NEWS_ARTICLES_QUERY);
  const ARTICLES = data?.length ? data : FALLBACK_ARTICLES;
  const [tag, setTag] = useState("All");
  const featured = ARTICLES[0] ?? null;
  const rest = ARTICLES.slice(1).filter((a) => tag === "All" || a.tag === tag);

  return (
    <div className="bg-[#0a0a0a] pt-24">

      {/* ── Page header ── */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] pt-14 pb-10">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">NEWSROOM</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="font-sans font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[52px] leading-[1.05] tracking-[-2px]">
            Insights from the shop floor.
          </h1>
          <p className="font-body text-[rgba(234,242,251,0.78)] text-sm max-w-xs">
            Engineering notes, programme updates and manufacturing depth from the SVAPL team.
          </p>
        </div>
      </section>

      {/* ── Featured article ── */}
      {featured && (tag === "All" || tag === featured.tag) && (
        <section className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] border border-rule overflow-hidden rounded-[4px] group cursor-pointer">
            {/* Image */}
            <div className="relative h-[300px] lg:h-[460px] overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent lg:hidden" />
            </div>
            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-panel">
              <div className="flex items-center gap-3 mb-5">
                <span className={`border text-[10px] font-sans font-bold px-2 py-[3px] rounded-[3px] tracking-wide ${TAG_COLORS[featured.tag]}`}>
                  {featured.tag}
                </span>
                <span className="font-sans text-blueprint-dim text-xs tracking-[1.5px]">{featured.date}</span>
                <span className="font-body text-blueprint text-xs ml-auto">Featured</span>
              </div>
              <h2 className="font-sans font-bold text-[#eaf2fb] text-2xl lg:text-[30px] leading-snug tracking-[-0.5px] mb-4">
                {featured.title}
              </h2>
              <p className="font-body text-[rgba(234,242,251,0.82)] text-sm lg:text-base leading-relaxed mb-8">
                {featured.desc}
              </p>
              <button className="self-start border-[0.5px] border-white/30 text-[#eaf2fb] font-body font-semibold text-sm px-6 py-[10px] rounded-[4px] hover:bg-white/5 transition-colors">
                Read article
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Filter ── */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] pb-8">
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`font-sans font-bold text-xs px-4 py-2 rounded-[4px] border transition-all ${
                tag === t
                  ? "bg-blueprint text-black border-[#f70]"
                  : "border-rule text-blueprint-dim hover:text-white hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Article grid ── */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {rest.map((a) => (
            <article key={a._id} className="bg-[#0a0a0a] flex flex-col group cursor-pointer hover:bg-[#141414] transition-colors">
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/10 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`border text-[10px] font-sans font-bold px-2 py-[2px] rounded-[3px] tracking-wide ${TAG_COLORS[a.tag] || ""}`}>
                    {a.tag}
                  </span>
                  <span className="font-sans text-blueprint-dim text-[10px] tracking-[1px]">{a.date}</span>
                </div>
                <h3 className="font-sans font-bold text-[#eaf2fb] text-[17px] leading-snug mb-3 flex-1">
                  {a.title}
                </h3>
                <p className="font-body text-[rgba(234,242,251,0.78)] text-[13px] leading-relaxed mb-5">
                  {a.desc}
                </p>
                <span className="font-body text-blueprint text-xs font-semibold group-hover:underline">
                  Read article →
                </span>
              </div>
            </article>
          ))}
        </div>

        {rest.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-sans text-blueprint-dim text-sm">No articles in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
