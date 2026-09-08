import { translate, localizeTree, useLocale } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { locations } from "@/content/locations";
import "leaflet/dist/leaflet.css";
import "./locations-map.css";

export function LocationsMap() {
  const locale = useLocale();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let resize: ResizeObserver | undefined;
    let tileLoaded = false;
    const markerCollection = markers.current;

    void import("leaflet")
      .then((L) => {
        if (cancelled || !container.current) return;
        const instance = L.map(container.current, {
          scrollWheelZoom: false,
          zoomControl: false,
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false,
        });
        L.control
          .zoom({
            zoomInTitle: locale === "es" ? "Acercar" : "Zoom in",
            zoomOutTitle: locale === "es" ? "Alejar" : "Zoom out",
          })
          .addTo(instance);
        map.current = instance;
        const bounds = L.latLngBounds(
          locations.map((location) => L.latLng(location.coordinates[0], location.coordinates[1])),
        );
        instance.fitBounds(bounds, { padding: [35, 35], maxZoom: 9 });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
          .on("tileload", () => {
            tileLoaded = true;
            if (!cancelled) setFailed(false);
          })
          .on("tileerror", () => {
            if (!cancelled && !tileLoaded) setFailed(true);
          })
          .addTo(instance);

        locations.forEach((location, index) => {
          const popup = document.createElement("div");
          popup.className = "roots-map-popup";
          const name = document.createElement("strong");
          name.textContent = location.name;
          const address = document.createElement("p");
          address.textContent = `${location.address}, ${location.zip}`;
          const directions = document.createElement("a");
          directions.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address} ${location.zip}`)}`;
          directions.textContent = translate("Get directions", locale);
          const details = document.createElement("a");
          details.href = `#${location.name.toLowerCase()}`;
          details.textContent = translate("Hours & booking", locale);
          popup.append(name, address, directions, details);
          const marker = L.marker(L.latLng(location.coordinates[0], location.coordinates[1]), {
            title: translate(`${location.name} implant center`, locale),
            keyboard: true,
            icon: L.divIcon({
              className: "roots-map-marker",
              html: `<span aria-hidden="true">${index + 1}</span>`,
              iconSize: [56, 56],
              iconAnchor: [28, 28],
              popupAnchor: [0, -30],
            }),
          })
            .addTo(instance)
            .bindPopup(popup, { maxWidth: 250 });
          marker.getElement()?.setAttribute("aria-label", translate(`${location.name} implant center`, locale));
          marker.on("popupopen", () => {
            marker.getElement()?.classList.add("is-selected");
            setSelected(location.name);
          });
          marker.on("popupclose", () => marker.getElement()?.classList.remove("is-selected"));
          markerCollection.set(location.name, marker);
        });
        instance.on("popupclose", () => setSelected(null));
        resize = new ResizeObserver(() => instance.invalidateSize({ pan: false }));
        resize.observe(container.current);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      resize?.disconnect();
      map.current?.remove();
      map.current = null;
      markerCollection.clear();
    };
  }, [locale]);

  function showAll() {
    if (!map.current) return;
    map.current.closePopup();
    map.current.fitBounds(
      locations.map((location) => [...location.coordinates] as [number, number]),
      { padding: [35, 35], maxZoom: 9, animate: false },
    );
    setSelected(null);
  }

  return localizeTree(
    <section className="inner-section locations-map-section" aria-labelledby="map-title">
      <div className="map-heading">
        <div>
          <p className="eyebrow">FIND YOUR WAY</p>
          <h2 id="map-title">
            Five places.
            <br />
            <em>A little closer to you.</em>
          </h2>
        </div>
        <p id="map-instructions">
          Choose a location to explore the map. Drag to move, or use the zoom controls. Addresses, hours and booking are
          listed below.
        </p>
      </div>
      <div className="map-location-controls" aria-label="Choose a location on the map">
        <button type="button" onClick={showAll} disabled={!ready} aria-pressed={selected === null}>
          Show all locations
        </button>
        {locations.map((location, index) => (
          <button
            key={location.name}
            type="button"
            disabled={!ready}
            aria-pressed={selected === location.name}
            onClick={() => {
              map.current?.setView([...location.coordinates], 14, { animate: false });
              markers.current.get(location.name)?.openPopup();
            }}
          >
            <span aria-hidden="true">{index + 1}</span>
            {location.name}
          </button>
        ))}
      </div>
      <div
        ref={container}
        className="roots-locations-map"
        role="region"
        aria-label="Interactive map of five Roots Implant Centers"
        aria-describedby="map-instructions"
      />
      {!ready && !failed && (
        <p className="map-status" role="status">
          Loading map. You can also use the location directory below.
        </p>
      )}
      {failed && (
        <p className="map-status" role="status">
          The map background could not load. Use the location details and directions below.
        </p>
      )}
      <noscript>
        <p className="map-status">Enable JavaScript to explore the map, or use the location directory below.</p>
      </noscript>
    </section>,
    locale,
  );
}
