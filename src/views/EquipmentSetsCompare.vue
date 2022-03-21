<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
import SetStats from "../components/SetStats.vue";

export default {
  components: { SetStats },
  data: function () {
    return {
      setsCompare: [],
      sets: [],
      set1: {},
      set2: {},
    };
  },
  created: function () {
    axios.get("/equipment-sets").then((response) => {
      this.sets = response.data;

      this.sets.forEach((set) => {
        set.slotted_items = {};
        set.monster = Monsters.get(set.oldschooljs_monster_id);
        set.equipment_set_items.forEach((item) => {
          set[item.slot] = Items.get(item.oldschooljs_item_id);
          set.slotted_items[item.slot] = set[item.slot].name;
        });
      });
    });
  },
};
</script>

<template>
  <select id="sets" v-model="set1">
    <option v-for="set in sets" v-bind:key="set.id" :value="set">
      {{ set.name }}
    </option>
  </select>
  <SetStats :set="set1" v-if="Object.keys(this.set1).length !== 0" />
  <select id="sets" v-model="set2">
    <option v-for="set in sets" v-bind:key="set.id" :value="set">
      {{ set.name }}
    </option>
  </select>
  <SetStats :set="set2" v-if="Object.keys(this.set2).length !== 0" />
</template>
