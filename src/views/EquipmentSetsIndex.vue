<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
import ItemImage from "../components/ItemImage";

export default {
  components: {
    ItemImage,
  },
  data: function () {
    return {
      sets: [],
    };
  },
  created: function () {
    axios.get("/equipment-sets").then((response) => {
      this.sets = response.data;
      this.sets.forEach((set) => {
        set.monster = Monsters.get(set.oldschooljs_monster_id);
        set.equipment_set_items.forEach((item) => {
          set[item.slot] = Items.get(item.oldschooljs_item_id);
        });
      });
    });
  },
};
</script>

<template>
  <div v-for="set in sets" :key="set.id">
    <h2>{{ set.name }}</h2>
    <h3>{{ set.monster.name }}</h3>
    <router-link v-bind:to="`/equipment-sets/${set.id}`">
      <ItemImage :item="set.head" itemSlot="head" />
      <ItemImage :item="set.cape" itemSlot="cape" />
      <ItemImage :item="set.neck" itemSlot="neck" />
      <ItemImage :item="set.ammo" itemSlot="ammo" />
      <ItemImage v-if="set.weapon" :item="set.weapon" itemSlot="weapon" />
      <ItemImage v-if="set['2h']" :item="set['2h']" itemSlot="2h" />
      <ItemImage :item="set.body" itemSlot="body" />
      <ItemImage :item="set.shield" itemSlot="shield" />
      <ItemImage :item="set.legs" itemSlot="legs" />
      <ItemImage :item="set.hands" itemSlot="hands" />
      <ItemImage :item="set.feet" itemSlot="feet" />
      <ItemImage :item="set.ring" itemSlot="ring" />
    </router-link>
  </div>
</template>
