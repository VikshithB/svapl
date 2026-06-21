import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

const PROJECT_CLASSES = ["Orbital System", "Sub-Orbital Launch", "Defence Subsystem", "R&D Prototype"];

interface FormState {
  name: string;
  company: string;
  classification: string;
  email: string;
  specifications: string;
}

function UnderlineInput({
  label,
  id,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
  spellCheck
}: {
  label: string;
  id: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  spellCheck?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative flex flex-col gap-2 w-full text-left">
      <label htmlFor={id} className="font-tech text-blueprint-dim text-[10px] tracking-[1.5px] uppercase select-none">
        {label} {required && <span className="text-blueprint">*</span>}
      </label>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        spellCheck={spellCheck}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-[#0D0F12]/60 border border-white/[0.08] border-b-white/[0.16] px-4 py-3 font-tech text-[#FFFFFF] text-sm placeholder:text-blueprint-dim/60 focus:outline-none transition-all duration-300 focus:bg-[#0D0F12]"
      />
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blueprint origin-center shadow-[0_0_8px_rgba(255,119,0,0.4)]"
      />
    </div>
  );
}

function UnderlineSelect({
  label,
  id,
  required = false,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative flex flex-col gap-2 w-full text-left">
      <label htmlFor={id} className="font-tech text-blueprint-dim text-[10px] tracking-[1.5px] uppercase select-none">
        {label} {required && <span className="text-blueprint">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-[#0D0F12]/60 border border-white/[0.08] border-b-white/[0.16] px-4 py-3 font-tech text-[#FFFFFF] text-sm focus:outline-none appearance-none cursor-pointer focus:bg-[#0D0F12] transition-all duration-300"
        >
          <option value="" disabled className="bg-[#050505] text-white/60">Select project classification</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#050505] text-[#FFFFFF]">
              {opt}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-tech text-blueprint-dim text-[10px] select-none">
          ▼
        </div>
      </div>
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blueprint origin-center shadow-[0_0_8px_rgba(255,119,0,0.4)]"
      />
    </div>
  );
}

function UnderlineTextarea({
  label,
  id,
  required = false,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative flex flex-col gap-2 w-full text-left">
      <label htmlFor={id} className="font-tech text-blueprint-dim text-[10px] tracking-[1.5px] uppercase select-none">
        {label} {required && <span className="text-blueprint">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-[#0D0F12]/60 border border-white/[0.08] border-b-white/[0.16] px-4 py-3 font-tech text-[#FFFFFF] text-sm placeholder:text-blueprint-dim/60 focus:outline-none resize-none transition-all duration-300 focus:bg-[#0D0F12]"
      />
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blueprint origin-center shadow-[0_0_8px_rgba(255,119,0,0.4)]"
      />
    </div>
  );
}

function RadarUploadArea({ onFileChange }: { onFileChange: (file: File | null) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setScanning(true);
    setFile(null);
    onFileChange(null);

    // Simulate cryptographic scanning sequence
    setTimeout(() => {
      setScanning(false);
      setFile(selectedFile);
      onFileChange(selectedFile);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left select-none">
      <span className="font-tech text-blueprint-dim text-[10px] tracking-[1.5px] uppercase mb-1">
        TECHNICAL BLUEPRINT UPLOAD
      </span>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerClick}
        className={`relative aspect-[16/6] w-full border border-dashed flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden transition-colors duration-500 ${
          dragActive
            ? "border-blueprint bg-blueprint/5"
            : "border-white/[0.12] bg-[#0d0f12]/20 hover:border-blueprint/40 hover:bg-[#0d0f12]/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.step,.stp,.igs,.iges,.dxf"
          className="hidden"
          onChange={handleChange}
        />

        {/* Decorative Radar Sweep Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: scanning ? 1 : dragActive ? 2 : 5, ease: "linear" }}
          className="absolute w-[140px] h-[140px] rounded-full border border-white/[0.03] flex items-center justify-center pointer-events-none"
        >
          {/* Radar Sweep Line */}
          <div className="absolute top-0 bottom-1/2 left-1/2 w-[1px] bg-gradient-to-t from-blueprint via-blueprint/30 to-transparent origin-bottom" />
        </motion.div>

        {/* Sonar concentric boundary circles */}
        <div className="absolute w-[90px] h-[90px] rounded-full border border-white/[0.02] pointer-events-none" />
        <div className="absolute w-[40px] h-[40px] rounded-full border border-white/[0.01] pointer-events-none" />

        {/* Radar crosshairs ticks */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/[0.02] pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/[0.02] pointer-events-none" />

        {/* Corner blueprint notch indicators */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/10" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/10" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/10" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/10" />

        <div className="relative z-10 flex flex-col items-center gap-2 font-tech text-center">
          {scanning ? (
            <>
              <span className="text-blueprint animate-pulse font-bold tracking-widest text-[10px]">
                [ SCANNING BLUEPRINT COMPLIANCE ]
              </span>
              <span className="text-white/70 text-[9px] uppercase tracking-wider">
                COMPILING VECTOR ENVELOPES...
              </span>
            </>
          ) : file ? (
            <>
              <span className="text-verified font-bold tracking-widest text-[10px]">
                [ SECURE SCAN COMPLETED ]
              </span>
              <span className="text-white text-xs max-w-[280px] truncate block font-medium uppercase mt-0.5">
                {file.name}
              </span>
              <span className="text-white/70 text-[9px] tracking-wider">
                SIZE: {(file.size / 1024 / 1024).toFixed(2)} MB // SYSTEM COMPLIANT
              </span>
            </>
          ) : (
            <>
              <span className={`tracking-widest font-bold text-[10px] transition-colors ${dragActive ? "text-blueprint" : "text-white/80"}`}>
                {dragActive ? "[ RELEASE TO SCAN CAD BLUEPRINT ]" : "[ DRAG SECURE CAD BLUEPRINT ]"}
              </span>
              <span className="text-white/50 text-[9px] uppercase tracking-wider mt-0.5">
                OR
              </span>
              <div className="mt-2 px-4 py-2 border border-blueprint text-blueprint hover:bg-blueprint hover:text-black transition-all duration-300 text-[10px] font-bold tracking-widest uppercase rounded-[3px]">
                SELECT FILE FROM COMPUTER
              </div>
              <span className="text-white/70 text-[9px] uppercase tracking-wider mt-1.5">
                PDF, STEP, IGES, DXF // MAX 50MB
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MagneticSubmitButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    // Magnetic pull radius of 60px
    if (distance < 70) {
      setPosition({ x: dx * 0.35, y: dy * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-start py-4 select-none cursor-pointer"
    >
      <motion.button
        type="submit"
        disabled={disabled}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={`font-tech text-xs tracking-[0.25em] uppercase font-bold py-4 px-8 border flex items-center gap-3 relative overflow-hidden transition-all duration-300 ${
          isHovered
            ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            : "bg-blueprint text-black border-blueprint shadow-[0_0_15px_rgba(255,119,0,0.2)]"
        }`}
      >
        <span>{children}</span>
        <motion.span
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
          className={isHovered ? "text-blueprint font-bold" : "text-black font-bold"}
        >
          →
        </motion.span>
      </motion.button>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    classification: "",
    email: "",
    specifications: "",
  });
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFileChange = (file: File | null) => {
    setBlueprintFile(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate secure compliance verification submit sequence
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="bg-[#050505] pt-24 min-h-screen text-white relative bp-grid overflow-hidden">
      {/* Blueprint background grid fade-out masking */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,5,0.2)_10%,#050505_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505] pointer-events-none" />

      {/* Hairline structural frame */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
      <div className="absolute left-0 right-0 top-20 h-[1px] bg-white/[0.03] pointer-events-none" />

      {/* ── Page header ── */}
      <section className="relative max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] pt-16 pb-12 border-b border-white/[0.05]">
        <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
          CONTACT SECURE PORTAL
        </p>
        <h1 className="font-sans font-bold text-[#FFFFFF] text-4xl sm:text-5xl lg:text-[68px] leading-[1] tracking-[-0.03em] uppercase mb-5">
          START A PROJECT.
        </h1>
        <p className="font-tech text-xs tracking-wider text-blueprint-dim max-w-xl leading-relaxed uppercase border-l-2 border-blueprint/30 pl-4 py-1">
          "ESTABLISH A MANUFACTURING DIALOGUE. SUBMIT AN RFQ QUESTIONNAIRE TO ROUTE SCHEMATICS TO IN-HOUSE QUALITY AND MACHINING TEAMS."
        </p>
      </section>

      {/* ── Main Two Column Grid ── */}
      <section className="relative max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Secure System Specifications and Address */}
          <div className="lg:col-span-4 flex flex-col gap-10 text-left select-none">
            
            {/* Encryption specifications panel */}
            <div className="border border-white/[0.06] bg-[#0d0f12]/30 p-6 relative font-tech">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-blueprint/30" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-blueprint/30" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-blueprint/30" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-blueprint/30" />

              <span className="text-[10px] text-blueprint tracking-widest font-bold block mb-4 uppercase">
                SECURITY COMPLIANCE
              </span>
              <div className="flex flex-col gap-3.5 text-[9px] text-blueprint-dim tracking-wider uppercase">
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span>TRANSFER CODE:</span>
                  <span className="text-white font-medium">SSL-AES256</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span>BLUEPRINT SCANNER:</span>
                  <span className="text-white font-medium">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span>NDA PROTOCOL:</span>
                  <span className="text-white font-medium">ITAR LEVEL-I</span>
                </div>
                <div className="flex justify-between">
                  <span>DISPOSITION TIME:</span>
                  <span className="text-blueprint font-bold">&lt; 48 HOURS</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="font-tech">
              <span className="text-[10px] text-blueprint-dim tracking-widest uppercase block mb-4">
                FACILITY COORDINATES
              </span>
              <address className="not-italic text-xs text-white/80 tracking-widest uppercase leading-relaxed">
                SVAPL AEROSPACE LTD.<br />
                Sy.No. 1/1, Imarat Kancha,<br />
                Opp. RCI Main Gate, Ravirala,<br />
                Hyderabad — 501510, India
              </address>
              <div className="mt-4 flex flex-col gap-1 text-[9px] text-blueprint-dim tracking-wider">
                <span>LAT: 17.2185° N // LNG: 78.5392° E</span>
                <span>ELEVATION: 540M // SITE: SECURE</span>
              </div>
            </div>

            {/* Direct Communications links */}
            <div className="font-tech flex flex-col gap-4">
              <div>
                <span className="text-[10px] text-blueprint-dim tracking-widest uppercase block mb-1">
                  SECURE SEC_LINE
                </span>
                <span className="text-xs text-white tracking-widest block font-medium">
                  +91-40-23026683
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blueprint-dim tracking-widest uppercase block mb-1">
                  ENQUIRY INBOX
                </span>
                <a
                  href="mailto:contracts@svapl.in"
                  className="text-xs text-blueprint hover:text-white tracking-widest block font-medium transition-colors"
                >
                  contracts@svapl.in
                </a>
              </div>
            </div>

            {/* Certifications badges tag strip */}
            <div className="border border-white/[0.06] p-5 font-tech">
              <span className="text-[10px] text-blueprint-dim tracking-widest uppercase block mb-3">
                SYSTEM AUDIT RATING
              </span>
              <div className="flex flex-wrap gap-2.5">
                {["AS9100D", "ISO9001", "ISO14001", "ISO45001"].map((c) => (
                  <span
                    key={c}
                    className="border border-blueprint/15 bg-[#0d0f12]/30 text-blueprint font-bold text-[9px] px-2.5 py-1 tracking-widest uppercase"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Secure RFQ / Inquiry portal form */}
          <div className="lg:col-span-8 border border-blueprint/35 bg-[#07080a] p-6 md:p-10 relative shadow-[0_0_40px_rgba(255,119,0,0.08)]">
            {/* Glowing borders */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blueprint/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blueprint/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blueprint/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blueprint/60" />

            {/* Form Header */}
            <div className="mb-8 pb-4 border-b border-white/[0.06] text-left">
              <span className="font-tech text-blueprint text-[10px] tracking-[2.5px] uppercase font-bold block mb-1">
                [ RFQ PORTAL & PROJECT INQUIRY ]
              </span>
              <p className="font-['Space_Grotesk',sans-serif] font-bold text-white text-lg sm:text-xl uppercase">
                Submit Specifications to Engineering
              </p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start text-left gap-6 py-10 font-tech"
              >
                <div className="w-12 h-12 rounded-full bg-verified/10 border border-verified/30 flex items-center justify-center select-none">
                  <span className="text-verified text-xl font-bold">✓</span>
                </div>
                <h3 className="font-sans font-bold text-white text-2xl uppercase tracking-tight">
                  RFQ TRANSMISSION COMPLETED
                </h3>
                <p className="text-xs text-blueprint-dim tracking-wider uppercase leading-relaxed max-w-lg">
                  "YOUR PROGRAMME SCHEMATICS AND INFORMATION LOG HAVE BEEN SECURELY RECEIVED. THE QUALITY ASSURANCE DIVISION WILL REVIEW COMPLIANCE RECORDS AND TRANSMIT RESPONSE WITHIN 48 HOURS."
                </p>
                <div className="w-full border-t border-white/[0.05] pt-6 mt-4">
                  <button
                    onClick={() => setSent(false)}
                    className="border border-white/[0.08] hover:border-blueprint/30 text-blueprint hover:text-white font-tech text-[10px] tracking-widest uppercase py-3 px-6 transition-all duration-300"
                  >
                    [ INITIATE NEW RFQ TRANSMISSION ]
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <UnderlineInput
                    label="Full Name"
                    id="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Enter full name"
                  />
                  <UnderlineInput
                    label="Space Agency / Company"
                    id="company"
                    required
                    value={form.company}
                    onChange={update("company")}
                    placeholder="Enter organisation name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <UnderlineSelect
                    label="Project Classification"
                    id="classification"
                    required
                    value={form.classification}
                    onChange={update("classification")}
                    options={PROJECT_CLASSES}
                  />
                  <UnderlineInput
                    label="Secure Email Address"
                    id="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="name@agency.in"
                  />
                </div>

                <UnderlineTextarea
                  label="Project Specifications & Tolerance Requirements"
                  id="specifications"
                  required
                  value={form.specifications}
                  onChange={update("specifications")}
                  placeholder="Outline spatial dimensions, tolerances, materials (e.g. Inconel 718, Titanium Gr5), and required certifications..."
                />

                <RadarUploadArea onFileChange={handleFileChange} />

                <div className="flex flex-col gap-4 border-t border-white/[0.05] pt-6 mt-2">
                  <div className="flex items-center gap-2 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-blueprint animate-pulse" />
                    <span className="font-tech text-[8px] text-blueprint-dim tracking-widest uppercase">
                      SECURE AES-256 CONNECTION ACTIVE
                    </span>
                  </div>

                  <MagneticSubmitButton disabled={submitting}>
                    {submitting ? "TRANSMITTING DATA..." : "TRANSMIT SECURE RFQ"}
                  </MagneticSubmitButton>

                  <p className="font-tech text-[9px] text-blueprint-dim/75 tracking-wider uppercase leading-relaxed text-left">
                    * CONFIDENTIALITY WARNING: SVAPL TREATS ALL ATTACHED SCHEMATICS AND BLUEPRINTS WITH MAXIMUM INTELLECTUAL PROPERTY RESTRAINT. EXPORT CONTROL RESTRICTIONS (ITAR/EAR) ARE RECOGNIZED AND LOGGED.
                  </p>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
