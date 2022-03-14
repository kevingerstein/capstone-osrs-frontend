<script>
import { Items } from "oldschooljs";
export default {
  props: ["item", "itemSlot"],
  data: function () {
    return {};
  },
  methods: {
    findItemsBySlot: function () {
      if (this.itemSlot === "weapon") {
        return Items.filter((item) => {
          return item.equipment && (item.equipment.slot == "weapon" || item.equipment.slot == "2h");
        });
      } else {
        return Items.filter((item) => {
          return item.equipment && item.equipment.slot == this.itemSlot;
        });
      }
    },
  },
};
</script>

<template>
  <datalist :id="`${itemSlot}`">
    <option
      v-for="item in findItemsBySlot()"
      :key="item.id"
      :data="item[0]"
      :value="item[1].name"
      :id="item[1].name"
    ></option>
  </datalist>
</template>

<style>
.parent {
  position: relative;
  top: 0;
  left: 0;
}

.image1 {
  position: relative;
  top: 0;
  left: 0;
}

.image2 {
  position: relative;
  top: -6.5px;
  left: -33px;
  width: 27px;
  height: 27px;
}
img {
  width: 25px;
  height: 25px;
}
.background {
  width: 40px;
  height: 40px;
}
</style>
