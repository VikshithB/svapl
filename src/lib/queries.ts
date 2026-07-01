// GROQ queries — one per content type

export const STATS_QUERY = `*[_type == "stat"] | order(order asc) {
  _id, value, label, code
}`;

export const CAPABILITY_SLIDES_QUERY = `*[_type == "capabilitySlide"] | order(order asc) {
  _id, "id": id.current, order, code, title, image, imageAlt,
  specs[]{ key, value }
}`;

export const INSIGHTS_QUERY = `*[_type == "insight"] | order(order asc) {
  _id, date, title, desc
}`;

export const NEWS_ARTICLES_QUERY = `*[_type == "newsArticle"] | order(date desc) {
  _id, title, "slug": slug.current, "tag": category, date, readTime, "desc": excerpt, image, featured
}`;

export const PRODUCTS_3D_QUERY = `*[_type == "product3D"] | order(order asc) {
  _id, id, order, label, title, desc,
  specs[]{ key, val }
}`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc) {
  _id, "id": slug.current, num, "title": name, programme, "img": image, "desc": description,
  specs[]{ "k": key, "v": val }
}`;

export const PROGRAMMES_QUERY = `*[_type == "programme"] | order(order asc) {
  _id, "name": title, client, "tag": coalesce(tag, tags[0]), size, material, "desc": description, image
}`;

export const JOB_POSITIONS_QUERY = `*[_type == "jobPosition"][active != false] {
  _id, title, dept, type, exp, location, desc, skills
}`;

export const CAPABILITIES_QUERY = `*[_type == "capability"] | order(order asc) {
  _id, "id": slug.current, "label": title, tag, image, headline, "desc": description,
  specs[]{ label, value },
  materials,
  products
}`;

export const INFRASTRUCTURE_QUERY = `*[_type == "infrastructure"] | order(order asc) {
  _id, title, category, description, image,
  specs[]{ key, value }
}`;

export const ABOUT_STATS_QUERY = `*[_type == "aboutStat"] | order(order asc) { _id, value, label }`;

export const TIMELINE_QUERY = `*[_type == "timelineEntry"] | order(order asc) { _id, year, text, image }`;

export const PLANTS_QUERY = `*[_type == "plant"] | order(order asc) { _id, name, area, plot, highlights, image }`;

export const PROCESS_STEPS_QUERY = `*[_type == "processStep"] | order(order asc) {
  _id, step, title, desc, detail, image
}`;

export const MACHINES_QUERY = `*[_type == "machine"] | order(order asc) {
  _id, name, category, image,
  specs[]{ label, value },
  schematics{ origin, travelRatio, laserCalib, axisEngaged }
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  companyName, tagline, heroSubtext, contactEmail, contractsEmail, phone,
  address, capabilitiesTicker
}`;
