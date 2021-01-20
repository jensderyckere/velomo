export const SlugText = (slug) => {
  return slug.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};
