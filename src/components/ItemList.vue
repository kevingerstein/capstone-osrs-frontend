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
