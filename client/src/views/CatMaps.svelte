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

<style>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: $shadow2;
    border: 1px solid $map-light-4;
    background-color: $map-light-base;
  }

  .map {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background-color: $map-light-base;
  }

  /* Монохромные стили для тайлов OpenStreetMap */
  :global(.leaflet-tile-pane) {
    filter: grayscale(100%) brightness(0.95) contrast(0.9) opacity(0.9);
  }

  /* Контейнер карты */
  :global(.leaflet-container) {
    background-color: $map-light-base;
    font-family: inherit;
  }

  /* Контролы карты в монохромной теме */
  :global(.leaflet-control-zoom a) {
    background-color: $map-light-1;
    color: $map-light-8;
    border: 1px solid $map-light-4;
    transition: all 0.3s ease;
    font-weight: bold;
  }

  :global(.leaflet-control-zoom a:hover) {
    background-color: $map-light-3;
    color: $map-light-9;
    border-color: $map-light-6;
  }

  :global(.leaflet-control-attribution) {
    background-color: rgba($map-light-1, 0.9) !important;
    color: $map-light-7 !important;
    font-size: 0.8rem;
    border-top: 1px solid $map-light-3;
    border-right: 1px solid $map-light-3;
  }

  :global(.leaflet-control-attribution a) {
    color: $map-light-8 !important;
    text-decoration: underline;
  }

  :global(.leaflet-control-attribution a:hover) {
    color: $map-light-9 !important;
  }

  /* Монохромные маркеры */
  :global(.custom-marker) {
    background-color: $map-light-6;
    border: 2px solid $map-light-1;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    box-shadow: $shadow1;
    transition: all 0.3s ease;
  }

  :global(.custom-marker:hover) {
    background-color: $map-light-8;
    transform: scale(1.3);
    border-color: $map-light-3;
    box-shadow: $shadow2;
  }

  :global(.custom-marker-active) {
    background-color: $map-light-9;
    border: 3px solid $map-light-2;
    animation: pulse-marker 2s infinite;
  }

  @keyframes pulse-marker {
    0% {
      box-shadow: 0 0 0 0 rgba($map-light-6, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba($map-light-6, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba($map-light-6, 0);
    }
  }

  /* Монохромные popup */
  :global(.leaflet-popup-content-wrapper) {
    background: linear-gradient(135deg, $map-light-1, $map-light-2);
    color: $map-light-9;
    border-radius: 6px;
    box-shadow: $shadow2;
    border: 1px solid $map-light-4;
    backdrop-filter: blur(10px);
  }

  :global(.leaflet-popup-content) {
    font-size: $font-size-base;
    margin: 12px 16px;
    font-family: inherit;
    color: $map-light-9;
    line-height: 1.4;
  }

  :global(.leaflet-popup-tip) {
    background: $map-light-2;
    border: 1px solid $map-light-4;
  }

  :global(.leaflet-container a.leaflet-popup-close-button) {
    color: $map-light-7;
    background-color: $map-light-1;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 18px;
    font-size: $font-size-lg;
    transition: all 0.3s ease;
    border: 1px solid $map-light-4;
  }

  :global(.leaflet-container a.leaflet-popup-close-button:hover) {
    color: $map-light-9;
    background-color: $map-light-3;
  }

  /* Сетка/грид поверх карты для лучшей читаемости */
  .map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
        90deg,
        transparent 99%,
        rgba($map-light-4, 0.1) 99%
      ),
      linear-gradient(0deg, transparent 99%, rgba($map-light-4, 0.1) 99%);
    background-size: 50px 50px;
    z-index: 100;
    opacity: 0.3;
  }

  /* Легенда в монохромном стиле */
  .map-legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, $map-light-1, $map-light-2);
    padding: 15px;
    border-radius: 6px;
    box-shadow: $shadow2;
    border: 1px solid $map-light-4;
    z-index: 1000;
    min-width: 180px;
    backdrop-filter: blur(5px);
  }

  .legend-title {
    font-size: $font-size-base;
    color: $map-light-9;
    margin-bottom: 12px;
    font-weight: bold;
    border-bottom: 1px solid $map-light-4;
    padding-bottom: 6px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: $map-light-8;
  }

  .legend-color {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid $map-light-1;
    box-shadow: $shadow1;
  }

  .legend-color-light {
    background-color: $map-light-4;
  }

  .legend-color-medium {
    background-color: $map-light-6;
  }

  .legend-color-dark {
    background-color: $map-light-8;
  }

  .legend-color-active {
    background-color: $map-light-9;
    animation: pulse-legend 2s infinite;
  }

  @keyframes pulse-legend {
    0% {
      box-shadow: 0 0 0 0 rgba($map-light-6, 0.4);
    }
    70% {
      box-shadow: 0 0 0 4px rgba($map-light-6, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba($map-light-6, 0);
    }
  }

  /* Индикатор загрузки в монохромной гамме */
  .map-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, $map-light-1, $map-light-3);
    color: $map-light-8;
    font-size: $font-size-lg;
    flex-direction: column;
    gap: 15px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $map-light-4;
    border-top: 3px solid $map-light-8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Кастомный курсор для интерактивной карты */
  :global(.leaflet-container) {
    cursor: default;
  }

  :global(.leaflet-container.leaflet-interactive) {
    cursor: crosshair;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .map {
      min-height: 300px;
    }

    .map-legend {
      bottom: 10px;
      right: 10px;
      left: 10px;
      min-width: auto;
    }

    .map-overlay {
      background-size: 30px 30px;
    }
  }

  /* Улучшенная читаемость текста на карте */
  :global(.leaflet-container .leaflet-control) {
    font-family: inherit;
    font-size: $font-size-base;
  }

  /* Плавные переходы для всех элементов карты */
  :global(.leaflet-container *) {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
</style>
