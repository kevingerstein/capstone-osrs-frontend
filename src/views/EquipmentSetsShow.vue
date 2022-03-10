<script>
import axios from "axios";
import { Items } from "oldschooljs";

export default {
  data: function () {
    return {
      set: {},
    };
  },
  created: function () {
    axios.get(`/equipment-sets/${this.$route.params.id}`).then((response) => {
      console.log(response.data);
      this.set = response.data;
      this.set.slotted_items = {};
      this.set.equipment_set_items.forEach((item) => {
        this.set.slotted_items[item.slot] = Items.get(item.oldschooljs_item_id);
      });
    });
    console.log(this.set.slotted_items);
  },
};
</script>

<template>
  <div v-for="item in set.slotted_items" :key="item.id">
    <p>{{ item.name }}</p>
  </div>
</template>
