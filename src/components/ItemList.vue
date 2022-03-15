<script>
import { Items } from "oldschooljs";
export default {
  props: ["item", "itemSlot"],
  data: function () {
    return {};
  },
  methods: {
    findItemsBySlot: function () {
      let items = [];
      if (this.itemSlot === "weapon") {
        // return Items.filter((item) => {
        //   return item.equipment && (item.equipment.slot == "weapon" || item.equipment.slot == "2h");
        // });
        Items.filter((item) => {
          if (item.equipment && (item.equipment.slot == "weapon" || item.equipment.slot == "2h")) {
            items.push(item);
          }
        });
      } else {
        Items.filter((item) => {
          if (item.equipment && item.equipment.slot == this.itemSlot) {
            items.push(item);
          }
        });
        // return Items.filter((item) => {
        //   return item.equipment && item.equipment.slot == this.itemSlot;
        // });
      }
      let unique_items_map = [...new Map(items.map((item) => [item.name, item])).values()];
      return unique_items_map;
    },
  },
};
</script>

<template>
  <datalist :id="`${itemSlot}`">
    <!-- <option
      v-for="item in findItemsBySlot()"
      :key="item.id"
      :data="item[0]"
      :value="item[1].name"
      :id="item[1].name"
    ></option> -->
    <option
      v-for="item in findItemsBySlot()"
      :key="item.id"
      :data="item.id"
      :value="item.name"
      :id="item.name"
    ></option>
  </datalist>
</template>
