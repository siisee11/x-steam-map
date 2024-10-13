import L from "leaflet";

const xaiMarker = new L.Icon({
  iconUrl: "/xai-logo.svg",
  iconRetinaUrl: "/xai-logo.svg",
  iconAnchor: undefined,
  popupAnchor: undefined,
  shadowUrl: undefined,
  shadowSize: undefined,
  shadowAnchor: undefined,
  iconSize: new L.Point(32, 45),
  className: "leaflet-div-icon",
});

export { xaiMarker };
