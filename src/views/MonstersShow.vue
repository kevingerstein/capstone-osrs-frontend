<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
import ItemImage from "../components/ItemImage.vue";
import SetStats from "../components/SetStats.vue";

export default {
  components: {
    ItemImage,
    SetStats,
  },
  data: function () {
    return {
      sets: [],
      monster: {},
    };
  },
  created: function () {
    axios.get("/equipment-sets").then((response) => {
      this.sets = response.data;
      this.sets = this.sets.filter((set) => set.oldschooljs_monster_id == this.$route.params.id);
      this.sets.forEach((set) => {
        set.slotted_items = {};
        set.equipment_set_items.forEach((item) => {
          set[item.slot] = Items.get(item.oldschooljs_item_id);
          if (set[item.slot]) {
            set.slotted_items[item.slot] = set[item.slot].name;
          }
        });
      });
      this.monster = Monsters.get(this.sets[0].oldschooljs_monster_id);
    });
  },
};
</script>

<template>
  <h1>{{ monster.name }}</h1>
  <div v-for="set in sets" :key="set.id">
    <h2>{{ set.name }}</h2>

    <router-link v-bind:to="`/equipment-sets/${set.id}`">
      <ItemImage :item="set.head" itemSlot="head" />
      <ItemImage :item="set.cape" itemSlot="cape" />
      <ItemImage :item="set.neck" itemSlot="neck" />
      <ItemImage :item="set.ammo" itemSlot="ammo" />
      <ItemImage v-if="set['2h']" :item="set['2h']" itemSlot="2h" />
      <ItemImage v-else :item="set.weapon" itemSlot="weapon" />
      <ItemImage :item="set.body" itemSlot="body" />
      <ItemImage :item="set.shield" itemSlot="shield" />
      <ItemImage :item="set.legs" itemSlot="legs" />
      <ItemImage :item="set.hands" itemSlot="hands" />
      <ItemImage :item="set.feet" itemSlot="feet" />
      <ItemImage :item="set.ring" itemSlot="ring" />
    </router-link>
    <SetStats :set="set" v-if="Object.keys(set).length !== 0" />
  </div>
  <router-link to="/equipment-sets/">Back to Index</router-link>
</template>
