import { useState } from "react";

const INQUIRY_TYPES = [
  "Manufacturing Partnership",
  "Defence Collaboration",
  "Strategic Briefing Request",
  "Supplier Registration",
  "Media Enquiry",
  "General Enquiry",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", designation: "", email: "", phone: "", inquiry: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputCls = `w-full bg-white/[0.04] border border-white/[0.1] rounded-[4px] px-4 py-3 font-['Archivo',sans-serif] text-[#eaf2fb] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#f70]/50 transition-colors`;

  return (
    <div className="bg-[#0a0a0a] pt-24 min-h-screen">

      {/* ── Page header ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] pt-16 pb-12 border-b border-rule">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">CONTACT</p>
        <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[54px] leading-[1.05] tracking-[-2px] mb-4">
          Start a conversation.
        </h1>
        <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-base lg:text-lg max-w-xl">
          For manufacturing partnerships, defence collaborations, or strategic briefings — reach the SVAPL team directly.
        </p>
      </section>

      {/* ── Two columns ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">

          {/* Left: contact info */}
          <div className="flex flex-col gap-10">

            {/* Primary contacts */}
            <div>
              <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-xs tracking-[2px] uppercase mb-5">REACH US</p>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-['Space_Grotesk',sans-serif] text-blueprint text-[10px] tracking-[1.5px] uppercase mb-1">Phone</p>
                  <p className="font-['Archivo',sans-serif] text-[#eaf2fb] text-base">+91-40-23026683</p>
                  <p className="font-['Archivo',sans-serif] text-[#eaf2fb] text-base">+91-93909 78255</p>
                </div>
                <div>
                  <p className="font-['Space_Grotesk',sans-serif] text-blueprint text-[10px] tracking-[1.5px] uppercase mb-1">Email</p>
                  <p className="font-['Archivo',sans-serif] text-[#eaf2fb] text-base">contracts@svapl.in</p>
                  <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.5)] text-sm">svapl1@yahoo.com</p>
                </div>
                <div>
                  <p className="font-['Space_Grotesk',sans-serif] text-blueprint text-[10px] tracking-[1.5px] uppercase mb-1">Web</p>
                  <p className="font-['Archivo',sans-serif] text-[#eaf2fb] text-base">www.svapl.in</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-xs tracking-[2px] uppercase mb-5">FACILITY ADDRESS</p>
              <address className="not-italic font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-sm leading-relaxed">
                Sy.No. 1/1, Imarat Kancha,<br />
                Ravirala Village, Maheshwaram Mandal,<br />
                Opp. RCI Gate,<br />
                Hyderabad — 501510<br />
                Telangana, India
              </address>
            </div>

            {/* Certifications strip */}
            <div className="border border-rule rounded-[6px] p-5">
              <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[2px] uppercase mb-3">CERTIFICATIONS</p>
              <div className="flex flex-wrap gap-2">
                {["AS 9100D", "ISO 9001", "ISO 14001", "ISO 45001"].map((c) => (
                  <span key={c} className="bg-blueprint/10 border border-[#f70]/30 text-blueprint font-['Space_Grotesk',sans-serif] font-bold text-[10px] px-2 py-[3px] rounded-[3px] tracking-wide">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative h-[200px] rounded-[6px] overflow-hidden border border-rule bg-panel flex items-center justify-center">
              <div className="text-center">
                <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-xs tracking-[1px] mb-1">MAHESHWARAM, HYDERABAD</p>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.4)] text-xs">Opp. RCI Gate · 501510</p>
              </div>
              {/* Subtle grid lines */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "linear-gradient(rgba(255,119,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,119,0,0.4) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
            </div>

          </div>

          {/* Right: contact form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <div className="w-12 h-12 rounded-full bg-blueprint/15 flex items-center justify-center">
                  <span className="text-blueprint text-xl font-bold">✓</span>
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl">Message received.</h3>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-base max-w-sm">
                  Our team will review your enquiry and respond within 2 business days. For urgent matters, call us directly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 border border-white/20 text-[#eaf2fb] font-['Archivo',sans-serif] font-semibold text-sm px-6 py-3 rounded-[4px] hover:bg-white/5 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Full Name *</label>
                    <input required value={form.name} onChange={update("name")} placeholder="Rajesh Kumar" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Company *</label>
                    <input required value={form.company} onChange={update("company")} placeholder="HAL / ISRO / BEL" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Designation</label>
                  <input value={form.designation} onChange={update("designation")} placeholder="Programme Manager" className={inputCls} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Email *</label>
                    <input required type="email" value={form.email} onChange={update("email")} placeholder="name@organisation.in" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Phone</label>
                    <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Nature of Enquiry *</label>
                  <select required value={form.inquiry} onChange={update("inquiry")} className={inputCls + " appearance-none"}>
                    <option value="" disabled className="bg-[#0a0a0a]">Select enquiry type</option>
                    {INQUIRY_TYPES.map((t) => <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Describe your programme requirements, component specifications, or collaboration scope..."
                    className={inputCls + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-sm px-8 py-4 rounded-[4px] self-start hover:bg-safety transition-colors"
                >
                  Send Message
                </button>

                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.3)] text-xs leading-relaxed">
                  By submitting this form you agree to SVAPL's privacy policy. All enquiries are subject to internal
                  compliance review before response.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
