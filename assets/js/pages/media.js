/* MyStore - Media Library page */
MyStorePage({
  title: "Media Library",
  singular: "Media Item",
  addLabel: "Add Media",
  subtitle: "Images, videos and documents used across your store.",
  storageKey: "mystore_media_v1",
  perPage: 8,
  emptyIcon: "bi-folder2-open",
  titleKey: "name",
  filterKey: "type",
  filterOptions: ["Image","Video","Document"],
  seed: [{"id":1,"name":"sugar-pro-max.jpg","type":"Image","size":245,"folder":"products","status":"Active"},{"id":2,"name":"hero-banner.png","type":"Image","size":812,"folder":"banners","status":"Active"},{"id":3,"name":"brand-guide.pdf","type":"Document","size":1540,"folder":"docs","status":"Active"}],
  columns: [{"key":"name","label":"File","type":"secondary"},{"key":"type","label":"Type","type":"badge","map":{"Image":"badge-success","Video":"badge-info","Document":"badge-secondary"}},{"key":"size","label":"Size (KB)"},{"key":"folder","label":"Folder"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success"}}],
  fields: [{"key":"name","label":"File Name","required":true},{"key":"type","label":"Type","type":"select","options":["Image","Video","Document"]},{"key":"size","label":"Size (KB)","type":"number"},{"key":"folder","label":"Folder","type":"select","options":["products","banners","docs","avatars"]},{"key":"status","label":"Status","type":"select","options":["Active"]}],
  stats: [
  { key: "total", label: "Total Files", icon: "bi-folder2-open", tone: "blue", calc: (r) => r.length },
  { key: "images", label: "Images", icon: "bi-image", tone: "green", calc: (r) => r.filter((x) => x.type === 'Image').length },
  { key: "videos", label: "Videos", icon: "bi-camera-video", tone: "orange", calc: (r) => r.filter((x) => x.type === 'Video').length },
  { key: "size", label: "Storage Used (KB)", icon: "bi-hdd", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.size || 0), 0) }
  ]
});
