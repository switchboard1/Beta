<template>
  <client-only>
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide v-for="(state, index) in states" :key="index">
        <EachState
          :state="state" 
          :addState="addState"
          :removeState="removeState"
        />
      </swiper-slide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </client-only>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import EachState from "./EachState";

export default {
  name: "State",
  components: {
    Swiper,
    SwiperSlide,
    EachState
  },
  directives: {
    swiper: directive
  },
  props: ["states", "addState", "removeState"],
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        slidesPerColumn: 2,
        breakpoints: {
          600: {
            slidesPerView: 5,
            slidesPerColumn: 2
          }
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        observer: true,
        observeParents: true
      }
    };
  }
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 430px;
  margin-left: auto;
  margin-right: auto;
}
.swiper .swiper-slide {
  transform: scale(0.8);
  height: 200px;
  box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, 0.2);
}
</style>
