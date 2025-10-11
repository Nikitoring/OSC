<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // Определяем основные компоненты карты
  let center = $state([51.505, -0.09]); // По умолчанию коррдинаты лондона
  let zoom = $state(13);
  let markers = $state([]);
  let interactive = $state(true);

  // Исправление для иконок Leaflet в Vite
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  let mapContainer: HTMLDivElement;
  let map: L.Map;
  let currentMarkers: L.Marker[] = [];

  onMount(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        center = [position.coords.latitude, position.coords.longitude];
      });
    } else {
      console.error(`Location isn't acailable`);
    }
    map = L.map(mapContainer, {
      center,
      zoom,
      dragging: interactive,
      zoomControl: interactive,
      scrollWheelZoom: interactive,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    updateMarkers();

    if (interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        console.log('Clicked at:', lat, lng);
      });
    }
  });

  function updateMarkers() {
    currentMarkers.forEach((marker) => map.removeLayer(marker));
    currentMarkers = [];

    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(map);
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }
      currentMarkers.push(leafletMarker);
    });
  }

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  // Реактивное обновление при изменении пропсов
  $effect(() => {
    if (map) {
      map.setView(center, zoom);
      updateMarkers();
    }
  });

  // Публичные методы
  function flyTo(lat: number, lng: number, zoomLevel: number = zoom) {
    if (map) {
      map.flyTo([lat, lng], zoomLevel);
    }
  }

  function getBounds(): L.LatLngBounds | null {
    return map ? map.getBounds() : null;
  }
</script>

<div class="map-wrapper">
  <div bind:this={mapContainer} class="map" />
</div>
