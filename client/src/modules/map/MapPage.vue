<template>
  <div class="row wrap justify-start items-start content-start" style="height: 100vh; width: 100vw">
    <LMap
      ref="mapRef"
      class="osc-map"
      v-model:zoom="zoom"
      v-model:center="mapCenter"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker
        v-for="marker in markers"
        :key="marker.id"
        :lat-lng="marker?.location"
        :icon="customIcon"
      >
        <LPopup>
          <CatPopup :cat="marker" />
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import type { ICat } from '@/domains'
import { useCatsStore } from '@/stores/useCatsStore'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import CatPopup from './components/CatPopup.vue'

const { cats } = storeToRefs(useCatsStore())
const { getAllCats } = useCatsStore()
// Основные элементы карты
const mapRef = ref(null)
const mapCenter = ref<string | number[]>([37.61556, 55.75222])
const zoom = ref(13)
const customIcon = L.icon({
  iconUrl: '/mapPin.png',
  iconSize: [48, 64],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
// -----
const markertsRef = ref([])
const markers = ref<ICat[]>([])

const successPosition = (position: GeolocationPosition) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  mapCenter.value = [latitude, longitude]
}
if (navigator?.geolocation) {
  navigator?.geolocation.getCurrentPosition(
    successPosition,
    (err) => {
      console.error(err.message)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  )
} else {
  console.error('Geolocation is not supported by this browser.')
}
onBeforeMount(async () => {
  await getAllCats()
  if (cats.value) {
    markers.value = cats.value.map((cat) => ({
      ...cat,
      location:
        Object.prototype.hasOwnProperty.call(cat, 'lat') &&
        Object.prototype.hasOwnProperty.call(cat, 'long')
          ? [Number(cat.lat), Number(cat.long)]
          : [],
    }))
  }
  console.log(markers.value)
})

// const addCat = (event) => {
//   const { lat, lng } = event.latlng
//   markers.value.push({ location: [lat, lng] })
//   setTimeout(() => {
//     console.log('markertsRef.value', markertsRef.value)
//     // if (markertsRef.value && markertsRef.value[markertsRef.value.length - 1])
//     //   markertsRef.value[markertsRef.value.length - 1].leafletObject.openPopup()
//   }, 100)
// }
</script>

<style lang="scss">
/* Монохромная тема для карты */
.osc-map {
  background: $light;
}

.osc-map .leaflet-tile-pane {
  filter: grayscale(100%) contrast(85%) brightness(115%);
}

.osc-map .leaflet-control-layers {
  background: $light;
  border: 1px solid $primary;
}

.osc-map .leaflet-control-layers-toggle {
  background-color: $light;
  border: 1px solid $primary;
}

.osc-map .leaflet-control-scale-line {
  background: rgba(255, 248, 238, 0.9);
  color: #333333;
  border: 1px solid $primary;
  border-top: none;
}

/* Убираем цветные элементы
.leaflet-marker-icon:not(.monochrome-marker) {
  filter: grayscale(100%) brightness(80%);
}*/
</style>
