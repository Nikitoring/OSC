<script lang="ts">
  export let className: string = '';
  export let width: number = 246;
  export let height: number = 236;
</script>

<svg
  class="cat-animation"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="-10 -40 100 100"
  {width}
  {height}
>
  <!-- Тень под котом -->
  <ellipse
    cx="40"
    cy="85"
    rx="25"
    ry="8"
    fill="rgba(0,0,0,0.15)"
    filter="url(#shadowBlur)"
  />

  <defs>
    <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
    <filter id="catShadow">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.2" />
    </filter>
  </defs>

  <g filter="url(#catShadow)">
    <g class="legs-group">
      <path
        class="legs back-legs"
        fill="#973B1E"
        d="M21.707 29.609h41.771v18.984h-.042v12.105l-14.72-12.105H36.427l-14.72 12.105V29.609z"
      />
      <path
        class="legs front-legs"
        fill="#D44A1E"
        d="M16.964 29.609h41.772v18.984h-.042v12.105L43.973 48.593H31.685l-14.72 12.105V29.609z"
      />
    </g>
    <path
      class="body"
      fill="#D44A1E"
      d="M14.601 8.33l-7.844-.61-.63 14.7L17.005 29.7l-2.85-9.918L14.6 8.33z"
    />
    <path
      class="whiskers"
      fill="#fff"
      d="M2.098 0l4.56 7.576 7.843.61L2.098 0z"
    />
    <path
      class="tail"
      fill="#fff"
      d="M51.774 42.323l11.704-12.714h-23.53l11.826 12.714z"
    />
    <path
      class="head"
      fill="#D44A1E"
      d="M54.893 15.812l8.585-7.626v7.626h-8.585zM39.948 8.186l8.536 7.626h-8.536V8.186zm0 7.626h23.53V29.65l-8.49 5.365-6.676-.008-8.364-5.357v-13.84z"
    />
    <path
      class="eyes"
      fill="#fff"
      d="M45.035 19.483h3.34v2.542l-3.34-2.542zM58.232 19.483h-3.34v2.542l3.34-2.542z"
    />
    <path
      class="nose"
      fill="#973B1E"
      d="M51.713 28.413l-4.105-2.994 8.261.057-4.156 2.937z"
    />
  </g>
</svg>

<style lang="scss">
  @keyframes cat-walk {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-3px) rotate(-1deg);
    }
    50% {
      transform: translateY(-1px) rotate(0deg);
    }
    75% {
      transform: translateY(-2px) rotate(1deg);
    }
  }

  @keyframes legs-walk-left {
    0%,
    100% {
      transform: translateX(0) rotate(0deg);
    }
    50% {
      transform: translateX(-4px) rotate(-2deg);
    }
  }

  @keyframes legs-walk-right {
    0%,
    100% {
      transform: translateX(0) rotate(0deg);
    }
    50% {
      transform: translateX(3px) rotate(1deg);
    }
  }

  @keyframes tail-wag {
    0%,
    100% {
      transform: rotate(0deg);
      transform-origin: top left;
    }
    50% {
      transform: rotate(8deg);
      transform-origin: top left;
    }
  }

  .cat-animation {
    animation: cat-walk 2s ease-in-out infinite;

    .back-legs {
      animation: legs-walk-left 1.2s ease-in-out infinite;
    }

    .front-legs {
      animation: legs-walk-right 1.2s ease-in-out infinite 0.3s;
    }

    .tail {
      animation: tail-wag 3s ease-in-out infinite;
    }
  }
</style>
