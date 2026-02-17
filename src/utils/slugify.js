export function slugify(text){
    return text
    .toLowerCase()
    .trim()
    .replace(/\./g, "-")      // replace dots
    .replace(/\s+/g, "-")     // spaces → dash
    .replace(/[^\w-]+/g, "");
}