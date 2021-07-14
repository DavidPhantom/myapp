<template>
  <div class="flex no-wrap unselectable">
    <div class="statistic">
      <img :src="morning" alt="" />
    </div>
    <div class="statistic">
      <img :src="day" alt="" />
    </div>
    <div class="statistic">
      <img :src="evening" alt="" />
    </div>
    <div class="statistic">
      <img :src="night" alt="" />
    </div>
  </div>
</template>

<script>
import morning from 'assets/img/statistic/morning.png';
import day from 'assets/img/statistic/day.png';
import evening from 'assets/img/statistic/evening.png';
import night from 'assets/img/statistic/night.png';

export default {
  name: 'Home',
  data() {
    return {
      morning,
      day,
      evening,
      night,
    };
  },
};
</script>

<style lang="scss">
.statistic {
  width: 100%;
  position: relative;
  height: auto;
  z-index: 1;
}
</style>
