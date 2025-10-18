<template>
  <div class="row wrap justify-start items-start content-start" style="height: 100vh; width: 100vw">
    <LMap
      ref="mapRef"
      class="osc-map"
      v-model:zoom="zoom"
      v-model:center="mapCenter"
      :use-global-leaflet="false"
      @ready="onMapReady"
      @click="addCat"
    >
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Lmarker
        v-for="(marker, index) in markers"
        :key="index"
        :lat-lng="marker.location || []"
        :ref="
          (el) => {
            if (el) markertsRef[index] = el
          }
        "
      >
        <LIcon :icon-size="iconSize">
          <q-icon name="fa-shield-cat"></q-icon>
        </LIcon>
        <Lpopup ref="popup"> CatInfo </Lpopup>
      </Lmarker>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import type { ICat } from '@/domains'
import {
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { ref } from 'vue'
const { cats } = useApi()
// Основные элементы карты
const mapRef = ref(null)
const mapCenter = ref<string | number[]>([37.61556, 55.75222])
const zoom = ref(13)
// const staticAnchor = [16, 37]
const iconSize = 64
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

const onMapReady = async (leafletMap: any) => {
  const { data, error } = await cats.getAll()
  console.log(`output->`, data, error)
}
const addCat = (event) => {
  const { lat, lng } = event.latlng
  markers.value.push({ location: [lat, lng] })
  setTimeout(() => {
    console.log('markertsRef.value', markertsRef.value)
    // if (markertsRef.value && markertsRef.value[markertsRef.value.length - 1])
    //   markertsRef.value[markertsRef.value.length - 1].leafletObject.openPopup()
  }, 100)
}
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

/* Убираем цветные элементы */
.leaflet-marker-icon:not(.monochrome-marker) {
  filter: grayscale(100%) brightness(80%);
}
</style>
