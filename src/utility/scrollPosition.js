export default function() {
  let doc = document.documentElement;
  let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  return {top, left};
}