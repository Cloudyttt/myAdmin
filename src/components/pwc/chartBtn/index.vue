<template>
  <div class="chartBtn" @click="showEchart(graph.graphNum)" :class="{mainGraph: graph.active}">
    <span class="graph-btn">{{graph.graphName}}</span>
  </div>
</template>

<script>
  export default {
    name: "chartBtn",
    data() {
      return {
        graph: this.graphInfo,
        showing: false,
      }
    },
    props: {
      graphInfo: {
        type: Object,
        default: function () {
          return {
            graphName: '空图表',
            graphNum: -1,
            active: false
          }
        }
      }

    },
    computed: {},
    methods: {
      showEchart(val) {
        this.graph.active = !this.graph.active;
        /*if(this.graph.active === true){*/
          this.$emit('emitGraph', val)
        /*}*/
      },
    },
    watch: {
      graph() {
        // eslint-disable-next-line no-console
        console.log(this.graph)
      }
    }
  }
</script>

<style scoped lang="stylus">
  
  .chartBtn
    position relative
    right 0
    transform: translate3d(1rem, 0, 0)
    cursor pointer
    width 10rem
    height 3rem
    margin-top 2rem
    background-color rgba(0,126,255, 0.6)
    border-top-left-radius 2rem
    border-bottom-left-radius 2rem
    display flex
    padding-left 1.5rem
    align-items center
    color #ffffff
    box-shadow -0.2em 0.2em 0.6em -0.2em rgba(0, 0, 255, 0.4);
    transition:transform  0.4s,box-shadow 0.3s,  text-shadow 0.3s;
    .graph
      font-size 1rem
      line-height 1rem
    .graph-btn
      font-size 1.2rem
    
    &:hover
      box-shadow:0 0 0 1px hsla(0,0%,100%,.3) inset,0 .5em 1em rgba(0,0,0,0.6);
      text-shadow:0 1px 1px hsla(0,0%,100%,.3);
      transform: translate3d(0, 0, 0) !important
      background-color #ffd04b
      color rgb(21, 40, 113)
      font-weight bold

</style>
