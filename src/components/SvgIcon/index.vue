<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  import '@/assets/iconfont/iconfont.js'
  export default {
    name: 'icon-svg',
    props: {
      iconClass: {
        type: String,
        required: true
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.iconClass}`
      }
    }
  }
</script>

<style>
  .svg-icon {
    width: 20px;
    height: 20px;
    /*vertical-align: -0.15em;*/
    fill: currentColor;
    overflow: hidden;
  }
</style>

