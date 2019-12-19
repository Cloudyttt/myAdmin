<template>
  <div class="homepage">
    <transition name="fade-transform" mode="out-in">
      <el-container class="container">
        <div class="sidebar" :class="{fadein:isVisibal, fadeout:!isVisibal}">
          <div class="sidebar-left">
            <el-container class="s-box">
              <el-main class="s-box-option">
                <el-container class="s-box-option-detail">
                  <el-main class="s-box-option-tools">
                    <el-tabs
                        v-model="activeTab"
                        @tab-click="tagChangeHandler">
                      <!--路由-->
                      <el-tab-pane class="brushs" name="tab-1">
                      <span slot="label" class="brush-icon"><i class="el-icon-office-building"
                                                               style="font-size: 1.2rem"/>建筑</span>
                        <el-footer class="s-box-option-others">
                          <div class="sidebar-navBar">
                            <el-menu :default-active="activeRouter"
                                     class="el-menu-demo"
                                     mode="horizontal"
                                     text-color="rgb(0,204,255)"
                                     active-text-color="#FFFFFF"
                                     @select="handleSelect">
                              <el-menu-item index="/developers" class="nav-dev"><span>开发商</span></el-menu-item>
                              <el-menu-item index="/government" class="nav-gov"><span>政府</span></el-menu-item>
                            </el-menu>
                            <!--#b9b2ff-->
                          </div>
                          
                          <div class="sidebar-navBar">
                            <el-menu :default-active="layerType"
                                     class="el-menu-demo"
                                     mode="horizontal"
                                     text-color="rgb(0,204,255)"
                                     active-text-color="#FFFFFF"
                                     @select="layerChange">
                              <el-menu-item index="normalLayer" class="nav-dev"><span>普通层</span></el-menu-item>
                              <el-menu-item index="typeLayer" class="nav-gov"><span>类型层</span></el-menu-item>
                            </el-menu>
                          </div>
                          <div class="sidebar-thermodynamic">
                            <span style="color:#fff; font-size: 1rem">热力图</span>
                            <el-switch
                                v-model="thermodynamic"
                                @change="openThermodynamicChart">
                            </el-switch>
                          </div>
                          
                          <div class="sidebar-thermodynamic">
                            <span style="color:#fff; font-size: 1rem">输入框</span>
                            <el-switch
                                v-model="modifyInput"
                                @change="openModifyInput">
                            </el-switch>
                          </div>
                        
                        </el-footer>
                      </el-tab-pane>
                      <!--类型-->
                      <el-tab-pane class="brushs" name="tab-2">
                        <span slot="label" class="brush-icon"><i class="el-icon-edit"
                                                                 style="font-size: 1.2rem"/>笔刷</span>
                        <transition name="fade">
                          <div class="block" v-show="pencilSize">
                            <el-slider
                                v-model="value2"
                                :step="50"
                                show-stops
                                :show-tooltip="false"
                                @change="handleChange"
                                :marks="marks">
                            </el-slider>
                          </div>
                        </transition>
                        <el-footer class="s-box-option-others">
                          <el-row>
                            <el-col :span="24" style="background-color:transparent">
                              <el-menu
                                  default-active="1"
                                  class="el-menu-vertical-demo"
                                  @open="handleOpen"
                                  @close="handleClose"
                                  background-color="transparent"
                                  text-color="#fff"
                                  active-text-color="#ffd04b">
                                <el-submenu index="1">
                                  <template slot="title">
                                    <div class="title-left">
                                      <i class="iconfont icon-yingyong"></i>
                                      <span style="font-size:1rem">类型</span>
                                    </div>
                                  </template>
                                  <el-menu-item-group v-if="isDev">
                                    <el-menu-item class="building-item" index="1-1" @click="talentApartment">人才公寓
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-2" @click="officeDevelopment">研发办公
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-3" @click="communityCenter">社群中心
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-4" @click="servicedApartments">服务式公寓
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-5" @click="retailBusiness">零售商业
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-6" @click="multiStorey">多层
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-7" @click="smallHighRise">小高层
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-8" @click="highRise">高层</el-menu-item>
                                    <el-menu-item class="building-item" index="1-9" @click="school">学校、医院等
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1-9" @click="shop">商铺</el-menu-item>
                                  </el-menu-item-group>
                                  <el-menu-item-group v-if="!isDev">
                                    <el-menu-item class="building-item" index="2" @click="retailBusiness_g">
                                      <span slot="title">商业零售</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="1" @click="talentApartment_g">
                                      <span slot="title">人才公寓</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="4" @click="servicedApartments_g">
                                      <span slot="title">服务式公寓</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="5" @click="RDOffice_smartCar_g">
                                      <span slot="title">研发办公-智能汽车</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="6" @click="RDOffice_highEndEquipment_g">
                                      <span slot="title">研发办公-高端装备</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="7"
                                                  @click="RDOffice_intelligentHardware_g">
                                      <span slot="title">研发办公-智能硬件</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="8"
                                                  @click="RDOffice_biologicalMedicine_g">
                                      <span slot="title">研发办公-生物医药</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="9"
                                                  @click="RDOffice_innovativeMedicalDevices_g">
                                      <span slot="title">研发办公-医疗器械</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="3" @click="communityCenter_g">
                                      <span slot="title">社群中心-健康服务</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="10" @click="multiStorey_g">
                                      <span slot="title">多层</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="11" @click="smallHighRise_g">
                                      <span slot="title">小高层</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="12" @click="highRise_g">
                                      <span slot="title">高层</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="13" @click="school_g">
                                      <span slot="title">学校医院等</span>
                                    </el-menu-item>
                                    <el-menu-item class="building-item" index="14" @click="shop_g">
                                      <span slot="title">商铺</span>
                                    </el-menu-item>
                                  </el-menu-item-group>
                                </el-submenu>
                                <el-menu-item index="1" @click="rise">
                                  &nbsp;
                                  <span class="svg-container">
                                  <svg-icon icon-class="arrow-up"/>
                                </span>
                                  <span slot="title" style="font-size: 1rem">  &nbsp;升高</span>
                                </el-menu-item>
                                <el-menu-item index="2" @click="lower">
                                  &nbsp;
                                  <span class="svg-container">
                                  <svg-icon icon-class="arrow-down"/>
                                </span>
                                  <span slot="title" style="font-size: 1rem">  &nbsp;降低</span>
                                </el-menu-item>
                                <el-menu-item index="3" @click="_delete">
                                  &nbsp;
                                  <span class="svg-container">
                                  <svg-icon icon-class="close"/>
                                </span>
                                  <span slot="title" style="font-size: 1rem">  &nbsp;删除</span>
                                </el-menu-item>
                                <el-menu-item index="4" @click="resume">
                                  &nbsp;
                                  <span class="svg-container">
                                  <svg-icon icon-class="history"/>
                                </span>
                                  <span slot="title" style="font-size: 1rem">  &nbsp;恢复</span>
                                </el-menu-item>
                              </el-menu>
                            </el-col>
                          </el-row>
                        </el-footer>
                      </el-tab-pane>
                    </el-tabs>
                  </el-main>
                </el-container>
              </el-main>
            </el-container>
          </div>
          <div class="sidebar-button" @click="showSiderbar">
            <div class="fade-button">
              <i class="el-icon-d-arrow-left" v-show="isVisibal"/>
              <i class="el-icon-d-arrow-right" v-show="!isVisibal"/>
            </div>
          </div>
        </div>
        <el-main class="container-el-main">
          <!--<iframe
              class="my-iframe"
              frameborder="0"
              scrolling="no"
              src="static/PWCD_Web/index.html">
          </iframe>-->
          <iframe
              class="my-iframe"
              frameborder="0"
              scrolling="no"
              src="static/aaa.html">
          </iframe>
          <div class="container-main">
            <developers v-if="this.isDev"/>
            <government v-if="!this.isDev"/>
          </div>
        </el-main>
      </el-container>
    </transition>
    <el-button icon="el-icon-back" circle plain class="backBtn" @click="$router.push({path:'/'})"/>
  </div>
</template>

<script>
  import developers from 'components/pwc/Developers/index'
  import government from 'components/pwc/Government/index'

  export default {
    name: 'HomePage',
    data() {
      return {
        pwcData: '',
        activeTab: 'tab-1',
        thermodynamic: false, //热力图
        modifyInput: false, // 输入框
        isDev: true,  // 政府/开发商
        layerType: 'normalLayer',  //图层
        brushSize: 1, // 笔刷大小
        activeRole: 'dev',
        activeActivity: 'brush',
        value1: 0,
        value2: 0,
        pencilSize: true,
        isCollapse: true,
        isSelected: true,
        activeNames: ['1'],
        activeRouter: '/developers',  //活跃路由
        activeIndex: '1',
        activeIndex2: '1',
        activeName: 'second',
        show: true,
        isVisibal: true, // 左侧侧边栏伸缩
        showHistogram: false,
        showLinerChart: false,
        showPieChart: false,
        classObject: {
          fadeIn: true,
          fadeOut: false
        },
        isShowUl: true,
        marks: {
          0: {
            style: {
              color: '#ffd04b',
              'font-size': '1rem'
            },
            label: this.$createElement('strong', '1')
          },
          50: {
            style: {
              color: '#ffd04b',
              'font-size': '1rem'
            },
            label: this.$createElement('strong', '2')
          },
          100: {
            style: {
              color: '#ffd04b',
              'font-size': '1rem'
            },
            label: this.$createElement('strong', '3')
          },
        },
        isGraphSelected: false
      }
    },
    components: {developers, government},
    mounted() {
      this.$root.$on('hideBar', val => {
        // console.log(val)
        if (val) {
          this.isVisibal = false;
        }
      })

    },
    created() {
      this.pwcData = this.$route.params
      console.log('this.pwcData', this.pwcData)
    },
    watch: {},
    methods: {
      //输入框
      openModifyInput(val) {
        console.log('openModifyInput' + '-' + val)
      },
      //热力图
      openThermodynamicChart(val) {
        console.log('openThermodynamicChart' + '-' + val)
      },
      //隐藏侧边栏
      hideSidebar(val) {
        this.isVisibal = false
        console.log('hideSidebar' + '-' + val)
      },
      // 左侧侧边栏伸缩按钮
      showSiderbar() {

        this.isVisibal = !this.isVisibal;
        this.fadeIn = !this.fadeIn;
        this.fadeOut = !this.fadeOut;
        this.show = !this.show;
        if (this.isVisibal === true) {
          this.$root.$emit('hideChart', this.isVisibal);
        }
        console.log('showSiderbar' + '-' + this.isVisibal);
      },
      handleOpen(key, keyPath) {
        // eslint-disable-next-line no-console
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // eslint-disable-next-line no-console
        console.log(key, keyPath);
      },
      layerChange(key) {
        console.log('layerChange' + '-' + key);
      },
      // 路由
      // eslint-disable-next-line no-unused-vars
      handleSelect(key, keyPath) {
        this.activeRole = key;
        console.log('handleSelect' + key);
        this.isDev = this.activeRole === '/developers';
        this.thermodynamic = false;
        this.modifyInput = false;
        this.layerType = 'normalLayer';
      },
      handleChange(key) {
        this.brushSize = (key / 25 + 1);
        // eslint-disable-next-line no-console
        console.log('handleChange' + (key / 25 + 1));
        window.handleChange = {
          fun: this.handleChange,
          param: this.brushSize
        };
      },

      // 人才公寓
      talentApartment() {
        // eslint-disable-next-line no-console
        console.log('talentApartment')
      },
      // 研发办公
      officeDevelopment() {
        // eslint-disable-next-line no-console
        console.log('officeDevelopment')
      },
      // 社群中心
      communityCenter() {
        // eslint-disable-next-line no-console
        console.log('communityCenter')
      },
      servicedApartments() {
        // eslint-disable-next-line no-console
        console.log('servicedApartments')
      },
      retailBusiness() {
        // eslint-disable-next-line no-console
        console.log('retailBusiness')
      },
      multiStorey() {
        // eslint-disable-next-line no-console
        console.log('multiStorey')
      },
      smallHighRise() {
        // eslint-disable-next-line no-console
        console.log('smallHighRise')
      },
      highRise() {
        // eslint-disable-next-line no-console
        console.log('highRise')
      },
      school() {
        // eslint-disable-next-line no-console
        console.log('school')
      },
      shop() {
        // eslint-disable-next-line no-console
        console.log('shop')
      },


      // _g后缀为政府
      talentApartment_g() {
        // eslint-disable-next-line no-console
        console.log('talentApartment_g')
      },
      retailBusiness_g() {
        // eslint-disable-next-line no-console
        console.log('retailBusiness_g')
      },
      communityCenter_g() {
        // eslint-disable-next-line no-console
        console.log('communityCenter_g')
      },

      servicedApartments_g() {
        // eslint-disable-next-line no-console
        console.log('servicedApartments_g')
      },
      RDOffice_smartCar_g() {
        // eslint-disable-next-line no-console
        console.log('RDOffice_smartCar_g')
      },
      RDOffice_highEndEquipment_g() {
        // eslint-disable-next-line no-console
        console.log('RDOffice_highEndEquipment_g')
      },
      RDOffice_intelligentHardware_g() {
        // eslint-disable-next-line no-console
        console.log('RDOffice_intelligentHardware_g')
      },
      RDOffice_biologicalMedicine_g() {
        // eslint-disable-next-line no-console
        console.log('RDOffice_biologicalMedicine_g')
      },
      RDOffice_innovativeMedicalDevices_g() {
        // eslint-disable-next-line no-console
        console.log('RDOffice_innovativeMedicalDevices_g')
      },
      multiStorey_g() {
        // eslint-disable-next-line no-console
        console.log('multiStorey_g')
      },
      smallHighRise_g() {
        // eslint-disable-next-line no-console
        console.log('smallHighRise_g')
      },
      highRise_g() {
        // eslint-disable-next-line no-console
        console.log('highRise_g')
      },
      school_g() {
        // eslint-disable-next-line no-console
        console.log('school_g')
      },
      shop_g() {
        // eslint-disable-next-line no-console
        console.log('shop_g')
      },
      trainStation_g() {
        // eslint-disable-next-line no-console
        console.log('trainStation_g')
      },

      rise() {
        // eslint-disable-next-line no-console
        console.log('rise')
      },
      lower() {
        // eslint-disable-next-line no-console
        console.log('lower')
      },
      _delete() {
        // eslint-disable-next-line no-console
        console.log('_delete')
      },
      resume() {
        // eslint-disable-next-line no-console
        console.log('resume')
      },
      radar() {
        console.log('radar')
      },
      edit() {
        console.log('edit')
      },
      brush() {
        console.log('brush')
      },
      tagChangeHandler(key) {
        this.modifyInput = false;
        this.thermodynamic = false;
        console.log('tagChangeHandler' + '-' + this.activeTab);
        this.activeActivity = key;
      },
      asd() {
        alert('123')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  h3
    margin 40px 0 0
  
  ul
    list-style-type none
    padding 0
  
  li
    display inline-block
    margin 0 10px
  
  a
    color #42b983
  
  
  //  动画/过渡
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
  
  .down-enter-active, .down-leave-active {
    height auto
    transition: all .2s ease;
  }
  
  .down-enter, .down-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    height 0
  }
  
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  
  .slide-fade-leave-active {
    transition: all .5s ease;
  }
  
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-100px);
    opacity: 1;
  }
  
  .button-fade-enter-active {
    animation: bounce-in .5s;
  }
  
  .button-fade-leave-active {
    animation: bounce-in .5s reverse;
  }
  
  @keyframes bounce-in {
    0% {
      /*left -390px*/
      transform: translate3d(-18rem, 0, 0)
    }
    100% {
      /*left 0*/
      transform: translate3d(0, 0, 0)
    }
  }
  
  @-webkit-keyframes bounce-in {
    0% {
      /*left -390px*/
      -webkit-transform: translate3d(-18rem, 0, 0)
    }
    100% {
      /*left 0*/
      -webkit-transform: translate3d(0, 0, 0)
    }
  }
  
  @keyframes bounce-leave {
    0% {
      /*left 0*/
      transform: translate3d(0, 0, 0)
    }
    100% {
      /*left -390px*/
      transform: translate3d(-18rem, 0, 0)
    }
  }
  
  @-webkit-keyframes bounce-leave {
    0% {
      /*left 0*/
      -webkit-transform: translate3d(0, 0, 0)
    }
    100% {
      /*left -390px*/
      -webkit-transform: translate3d(-18rem, 0, 0)
    }
  }
  
  @keyframes fade-up {
    0% {
      height auto
    }
    100% {
      height 0
    }
  }
  
  @keyframes fade-down {
    0% {
      height 0
    }
    100% {
      height auto
    }
  }
  
  // 普通样式
  .homepage
    height 100%
    overflow hidden
    
    .container
      width 100%
      height 100%
      overflow hidden
      position absolute
      margin 0
      padding 0
      
      .sidebar
        position absolute
        /*width 185px;*/
        z-index 999 !important
        width 20rem
        height 100%
        display flex
        flex-direction row
        
        .sidebar-left
          background-color rgba(0, 126, 255, 0.8)
          width 100%
          height 100%
          /*box-shadow 0.4em 0.4em 1em -0.2em rgba(0, 0, 255, 0.6);*/
          /*开发商-政府*/
          
          .s-box
            height 100%
            overflow-x hidden
            
            .s-box-option
              padding 0
              height 100%
              width 100%
              overflow-x hidden
              
              &::-webkit-scrollbar
                display none
              
              .s-box-option-detail
                /*max-height 600px*/
                height 100%
                overflow hidden
                
                .s-box-option-tools
                  padding 0 !important
                  /*height 150px !important*/
                  background-color transparent !important
                  
                  .el-menu-demo
                  .el-menu--horizontal
                  .el-menu
                    border none !important
                    display flex
                    align-items center
                    justify-content space-around
                    background-color transparent !important
                  
                  .is-active
                    background-color transparent !important
                  
                  .el-menu-item
                    flex-grow 1
                    font-size 1rem !important
                    
                    &:hover
                      background-color rgb(21, 40, 113) !important
                      
                      .iconfont
                        color #ffd04b
                    
                    .iconfont
                      font-size 1rem !important
                  
                  .el-tabs
                    background-color transparent !important
                    border none !important
                    box-shadow none
                    height 100%
                    overflow hidden !important
                    /*max-height 600px!important*/
                    
                    .block
                      margin-bottom 1rem
                      padding 1rem 3rem !important
                      
                      .el-slider__bar
                        color #ffd04b !important
                        height 2rem !important
                        
                        .el-slider__button-wrapper
                          height 3rem !important
                          width 3rem !important
                    
                    .el-tabs__header
                      background-color transparent !important
                      border none !important
                      box-shadow none
                      height 4rem !important
                      font-size 1rem
                      margin-top 2rem !important
                      
                      .el-tabs__nav-wrap
                        background-color transparent !important
                        
                        .el-tabs__nav-scroll
                          background-color transparent !important
                          
                          .el-tabs__nav
                            background-color transparent !important
                    
                    .el-tabs__content
                      /*max-height 600px!important*/
                      /*height: 600px !important*/
                      /*overflow hidden!important*/
                      
                      .s-box-option-others
                        padding 1rem 3rem 3rem 3rem
                        background-color transparent !important
                        width 100% !important
                        height 100% !important
                        overflow hidden
                        
                        .sidebar-thermodynamic
                          box-sizing border-box
                          border-radius 1rem
                          width 100%
                          height 2rem !important
                          display: flex
                          justify-content space-between
                          align-items center
                          flex-direction row
                          flex-wrap nowrap
                          padding 0 1rem
                          margin-top 2rem !important
                          background-color rgb(21, 40, 113)
                        
                        .sidebar-navBar
                          width 100%
                          display: flex
                          justify-content center
                          flex-direction row
                          flex-wrap nowrap
                          margin-top 2rem !important
                          
                          .el-menu
                            width 100%
                            display flex
                            flex-wrap nowrap
                            flex-direction row
                          
                          .el-menu--horizontal
                            border none
                            height 2rem !important
                          
                          .el-menu-item
                            font-size 1rem !important
                            border: none !important
                            background-color #FFFFFF !important
                            padding 0
                            width 3rem !important
                            height 2rem !important
                            line-height 2rem !important
                            text-align center !important
                          
                          .is-active
                            background-color rgb(21, 40, 113) !important
                          
                          .nav-dev
                            display flex
                            justify-content center
                            border-bottom-left-radius 1rem
                            border-top-left-radius 1rem
                            
                            &:hover
                              box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.4);
                              text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
                          
                          .nav-gov
                            display flex
                            justify-content center
                            border-bottom-right-radius 1rem
                            border-top-right-radius 1rem
                            
                            &:hover
                              box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.4);
                              text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3)
                        
                        
                        .el-menu
                          padding-top 0
                          padding-right 0
                          font-size 1rem
                          display flex
                          flex-direction column
                          align-items stretch
                          background-color transparent !important
                          border-left solid 1px #ffd04b;
                          border-right none
                          
                          .iconfont
                            margin-right 1rem
                            font-size 1rem
                            color #ffffff
                          
                          .el-submenu
                            display flex
                            flex-grow 1 !important
                            flex-direction column
                            align-items stretch
                            box-sizing border-box
                            font-size 1rem
                            margin 0
                            
                            
                            .title-left
                              display flex
                              flex-direction row
                              justify-content flex-start
                            
                            /*&:hover*/
                            /*  background-color #152871 !important*/
                            
                            .el-submenu__title
                              text-align left !important
                              display flex !important
                              justify-content flex-start !important
                              padding 0 !important
                              height 2rem !important
                              background-color rgba(255, 0, 0, 0.3) !important
                              
                              &:hover
                                background-color transparent !important
                              
                              .el-submenu__title:focus, .el-submenu__title:hover {
                                outline: 0;
                                background-color: #ff0000 !important;
                              }
                            
                            .el-menu
                            .el-menu-item-group
                              max-height 25rem !important
                              overflow scroll
                              display flex
                              flex-direction column
                              
                              &::-webkit-scrollbar
                                display: none;
                              height: auto
                              
                              .el-menu-item
                                overflow-x hidden !important
                                min-width 5rem !important
                                display flex
                                /*justify-content stretch*/
                                font-size 1rem !important
                                font-family: Arial, Helvetica, sans-serif;
                                margin-left 0 !important
                                padding 0 0 0 1rem !important
                                line-height 2rem !important
                          
                          
                          .el-submenu > div
                            &:hover
                              background-color transparent !important
                          
                          .el-menu-item
                            flex-grow 1 !important
                            box-sizing border-box
                            font-size 1rem !important
                            margin 0
                            text-align center
                            display flex
                            height 2rem !important
                            line-height 2rem
            
            .other-btn
              margin-top 2rem
              color white
              text-align right
              position relative
              bottom 1rem
              cursor pointer
              
              .other-btn-row
                .mybtn
                  cursor pointer
                
                .iconfont
                  font-size 1rem !important
                  cursor pointer
                  
                  &:hover
                    color #ffd04b !important
        
        .sidebar-button
          cursor pointer
          display flex
          position relative
          align-items center
          background-color transparent
          
          .fade-button
            position relative
            cursor pointer
            display flex
            align-items center
            justify-content center
            background-color rgba(0, 126, 255, 0.8)
            height 4rem
            width 1.5rem
            border-top-right-radius 0.8rem
            border-bottom-right-radius 0.8rem
            color #FFF
      
      .container-el-main
        display flex
        justify-content center
        align-items center
        
        .container-main
          height auto
          width 100%
          overflow-x hidden
      
      
      .fadein
        transform: translate3d(0, 0, 0)
        animation bounce-in .5s;
        -webkit-animation bounce-in .5s;
      
      .fadeout
        transform: translate3d(-18rem, 0, 0)
        animation bounce-leave .5s;
        -webkit-animation bounce-leave .5s;
  
  .brushs
    background-color transparent !important
    height 100% !important
    overflow hidden
    
    .brush-icon
      margin-top 2rem !important
      margin-left 1rem !important
      width 100% !important
      display flex !important
      align-items center !important
  
  .my-iframe
    background-color: transparent;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
  
  .backBtn {
    position: fixed;
    bottom: 30px;
    right: 30px;
  }

</style>
