<template>
  <div class="fit row wrap justify-start items-start content-start">
    <q-timeline color="secondary" style="max-width: 300px">
      <q-timeline-entry heading> <h5 class="q-ma-none">Latest changes</h5> </q-timeline-entry>

      <q-timeline-entry title="Create App" subtitle="February 22, 1986">
        <div>First Register</div>
      </q-timeline-entry>
      <q-timeline-entry title="Create App" subtitle="February 22, 1986">
        <div>First Register</div>
      </q-timeline-entry>
    </q-timeline>
    <div class="main-container">
      <div class="text-container">
        <p class="outline-text">If you found a cat in the street, add this cat to CatMaps</p>
      </div>
      <div class="fit column no-wrap justify-center items-center content-start">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  background: transparent;
  flex: 1;
}

.text-container {
  display: flex;
  justify-content: start;
  align-items: flex-start;
  padding: 40px 20px;
  flex-shrink: 0;
}

.outline-text {
  font-size: 3rem;
  font-weight: 900;
  color: transparent;
  text-align: left;
  margin: 0;
  line-height: 1.3;

  /* Создаем контур текста */
  -webkit-text-stroke: 2px $accent;
  text-stroke: 2px $accent;

  /* Добавляем легкую тень для лучшей читаемости */
  text-shadow:
    0 0 10px rgba(#f7d0c6, 0.3),
    0 0 20px rgba(#f7d0c6, 0.2);
}

.my-card {
  width: 100%;
  max-width: 800px;
}
/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .outline-text {
    font-size: 1.8rem;
    padding: 0 10px;
    -webkit-text-stroke: 1.5px $accent;
    text-stroke: 1.5px $accent;
  }

  .text-container {
    padding: 20px 10px;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 480px) {
  .outline-text {
    font-size: 1.5rem;
    -webkit-text-stroke: 1px $accent;
    text-stroke: 1px $accent;
  }
}
</style>
