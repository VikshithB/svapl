/**
 * ════════════════════════════════════════════════════════════════
 * SVAPL — Centralised Image Configuration
 * ════════════════════════════════════════════════════════════════
 *
 * Replace any URL below with your AWS S3 bucket URL.
 * Example:  "https://svapl-assets.s3.ap-south-1.amazonaws.com/hero/precision.jpg"
 *
 * Structure:  IMAGES.<page>.<section>.<slot>
 * ════════════════════════════════════════════════════════════════
 */

export const IMAGES = {

  // ──────────────────────────────────────────────────────────────
  // HOME PAGE
  // ──────────────────────────────────────────────────────────────
  home: {

    // Hero — hover images that appear when user mouses over each word
    hero: {
      /** "PRECISION" word hover → precision machining photo */
      precision:     "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/SVAPL++50.jpg?auto=format&fit=crop&q=80&w=600",
      /** "AEROSPACE" word hover → rocket motor case photo */
      aerospace:     "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600",
      /** "MANUFACTURING" word hover → CNC milling station photo */
      manufacturing: "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/Manufacturing.jpg?auto=format&fit=crop&q=80&w=600",
    },

    // Capability cards — the horizontal scroll section on homepage
    capabilityCards: {
      /** Card 01 — 6-Axis CNC Milling */
      cncMilling:        "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/6+AXIS.jpg",
      /** Card 02 — Precision Turning */
      precisionTurning:  "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/Precision+Tuning.jpg",
      /** Card 03 — Aerospace Structural Assembly */
      structuralAssembly:"https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/Aseembly.jpg",
      /** Card 04 — Welding & Joining */
      weldingJoining:    "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/Welding.jpg",
    },

    // Capability hover grid (the 5-category showcase below the hero)
    capabilityGrid: {
      /** Category: Aerostructures */
      aerostructures:      "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      /** Category: Precision Components */
      precisionComponents: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      /** Category: Welded Structures */
      weldedStructures:    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      /** Category: Integrated Assemblies */
      integratedAssemblies:"https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      /** Category: Defence Systems */
      defenceSystems:      "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },

    // How We Build — mosaic section on homepage
    howWeBuild: {
      /** Right column bottom image — NDT & Testing / CNC photo */
      ndtTesting: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },

    // News / Press ticker strip
    news: {
      /** Image 1 — Aerostructure delivery to ISRO */
      aerostructureDelivery: "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/5.jpeg",
      /** Image 2 — Precision machining facility */
      precisionFacility:     "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/6.jpeg",
      /** Image 3 — Rocket motor casing weld */
      rocketMotorWeld:       "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/3.jpeg",
      /** Image 4 — Flight hardware inspection */
      flightHardware:        "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/2.jpeg",
      /** Image 5 — Integrated system delivery */
      integratedSystem:      "https://svapl-content.s3.ap-south-1.amazonaws.com/Videos/1.jpeg",
    },
  },

  // ──────────────────────────────────────────────────────────────
  // ABOUT PAGE
  // ──────────────────────────────────────────────────────────────
  about: {

    // "Our Story" section right-side photo
    story: "https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",

    // Facilities / Plants showcase
    facilities: {
      /** Unit I — Balanagar facility */
      unitI:   "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      /** Unit II — Expansion facility */
      unitII:  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      /** Unit III — Latest facility */
      unitIII: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
    },

    // Company timeline — one image per milestone year
    timeline: {
      /** 2000 — Unit-I established */
      y2000: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
      /** 2002 — First aerostructure delivery */
      y2002: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600",
      /** 2004 — GSLV L40 structure */
      y2004: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600",
      /** 2008 — RCS & VTP integration */
      y2008: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
      /** 2010 — PSLV & GSLV lead vendor */
      y2010: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=600",
      /** 2012 — Unit-II established */
      y2012: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600",
      /** 2014 — Maraging Steel M250 capability */
      y2014: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=600",
      /** 2019 — Pralay & Crew Module programmes */
      y2019: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=600",
      /** 2023 — Metal canister facility */
      y2023: "https://images.unsplash.com/photo-1618979284981-670a5543b333?auto=format&fit=crop&q=80&w=600",
      /** 2025 — Hypersonic Glide Vehicle */
      y2025: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600",
      /** 2026 — Unit-III established */
      y2026: "https://images.unsplash.com/photo-1716643863806-989dd76ae093?auto=format&fit=crop&q=80&w=600",
    },
  },

  // ──────────────────────────────────────────────────────────────
  // WHAT WE BUILD PAGE  (full-page capabilities)
  // ──────────────────────────────────────────────────────────────
  whatWeBuild: {
    /** Capability: Aerostructures */
    aerostructures:       "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    /** Capability: Precision Machined Components */
    precisionMachining:   "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    /** Capability: Structural Fabrication & Welding */
    weldedStructures:     "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    /** Capability: Assembly & Integration */
    integratedAssemblies: "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    /** Capability: Strategic Defence Systems */
    defenceSystems:       "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },

  // ──────────────────────────────────────────────────────────────
  // HOW WE BUILD PAGE  (process + machines)
  // ──────────────────────────────────────────────────────────────
  howWeBuild: {

    // 10-step manufacturing process flow
    process: {
      /** Step 01 — Raw Material Receipt & Inspection */
      rawMaterial:      "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=500",
      /** Step 02 — Manufacturing Process & QA Plan */
      qaPlanning:       "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=500",
      /** Step 03 — Tooling & Fixturing */
      tooling:          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=500",
      /** Step 04 — Fabrication */
      fabrication:      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=500",
      /** Step 05 — CNC Machining */
      cncMachining:     "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=500",
      /** Step 06 — Assembly & Integration */
      assembly:         "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=500",
      /** Step 07 — NDT & Dimensional Inspection */
      ndtInspection:    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=500",
      /** Step 08 — Pressure Testing */
      pressureTesting:  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=500",
      /** Step 09 — Non-Conformance Review */
      nonConformance:   "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500",
      /** Step 10 — Packing & Dispatch */
      packingDispatch:  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500",
    },

    // Machine catalogue
    machines: {
      /** MAZAK INTEGREX i-200 — 5-axis multi-tasking (Milling) */
      mazakIntegrex: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=500",
      /** DECKEL MAHO DMU 80 P — 5-axis universal (Milling) */
      deckelMaho:    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=500",
      /** HAAS VF-6/50 — large-format vertical (Milling) */
      haasVf6:       "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500",
      /** TOSHIBA VTL Ø5400 — vertical turning lathe (Turning) */
      toshibaVtl:    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=500",
      /** PUMA 400L — horizontal turning (Turning) */
      puma400l:      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=500",
      /** DOOSAN VTL V8300 — large vertical lathe (Turning) */
      doosanVtl:     "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=500",
      /** HEXAGON GLOBAL CMM — coordinate measurement (Metrology) */
      hexagonCmm:    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=500",
      /** TRIMOS MEASURING ARM — portable metrology (Metrology) */
      trimosArm:     "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=500",
    },
  },

  // ──────────────────────────────────────────────────────────────
  // PROGRAMMES PAGE
  // ──────────────────────────────────────────────────────────────
  programmes: {

    /** Page hero background */
    hero: "https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",

    // ISRO Programmes
    isro: {
      /** PSLV Core Base Shroud */
      pslvBaseShroud:    "https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** GSLV L40 Strapon Structures */
      gslvStrapon:       "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** LVM3 Core Base Shroud */
      lvm3BaseShroud:    "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** Gaganyaan Crew Module Structure */
      gaganyaanCrew:     "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** L110 EGC Actuator Systems */
      l110Actuator:      "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** PSOXL Motor Case */
      psoxlMotorCase:    "https://images.unsplash.com/photo-1598302936625-6075fbd98dd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    },

    // DRDO Programmes
    drdo: {
      /** Agni Series Motor Casings */
      agniMotorCasings:  "https://images.unsplash.com/photo-1710750266544-d5b41e6847aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** Pralay Airframe & Motor Assembly */
      pralayAirframe:    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** Sagarika Series Motor Cases */
      sagarikaMotorCases:"https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** Metal Canister — A1 PRIME */
      metalCanisterA1:   "https://images.unsplash.com/photo-1455165814004-1126a7199f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** ASTRA Airframe */
      astraAirframe:     "https://images.unsplash.com/photo-1581092160607-ee22621dd758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      /** Stabiliser Fin Assembly — Titanium */
      stabilizerFin:     "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    },

    // HAL Programmes
    hal: {
      /** Maraging Steel Structural Components */
      maragingSteel:     "https://images.unsplash.com/photo-1585916788784-64aa099fec1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    },
  },

  // ──────────────────────────────────────────────────────────────
  // PRODUCTS PAGE  (used across the 24-product catalogue)
  // ──────────────────────────────────────────────────────────────
  products: {
    /** Shroud / shell structure — LVM3, PSLV base shrouds */
    shell:     "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?auto=format&fit=crop&q=80&w=900",
    /** Fin / stabiliser assemblies */
    fin:       "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?auto=format&fit=crop&q=80&w=900",
    /** Welded structures — motor casings, pressure vessels */
    weld:      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=900",
    /** Precision machined components */
    precision: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?auto=format&fit=crop&q=80&w=900",
    /** Integrated / assembled systems */
    assembly:  "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?auto=format&fit=crop&q=80&w=900",
    /** Facility / manufacturing floor */
    facility:  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=900",
  },

  // ──────────────────────────────────────────────────────────────
  // NEWSROOM PAGE
  // ──────────────────────────────────────────────────────────────
  newsroom: {
    /** Article: The economics of vertical integration */
    verticalIntegration: "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: Unit-III facility scale-up */
    unitIIIFacility:     "https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: How we hold ±5µm */
    precisionMachining:  "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: NADCAP first-article welding */
    nadcapWelding:       "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: LVM3 Core Base Shroud integration */
    lvm3Shroud:          "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: Metal canisters for strategic missiles */
    metalCanisters:      "https://images.unsplash.com/photo-1455165814004-1126a7199f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: PRALAY airframe first-article */
    pralayFirstArticle:  "https://images.unsplash.com/photo-1710750266544-d5b41e6847aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    /** Article: Maraging Steel M250 capability */
    maragingSteel:       "https://images.unsplash.com/photo-1598302936625-6075fbd98dd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },

  // ──────────────────────────────────────────────────────────────
  // CAREERS PAGE
  // ──────────────────────────────────────────────────────────────
  careers: {
    /** Hero background — manufacturing team at work */
    hero: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  },

} as const;
