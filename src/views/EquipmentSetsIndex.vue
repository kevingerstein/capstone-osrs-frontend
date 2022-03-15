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
      monsterFilter: "",
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
  computed: {
    filteredByMonster() {
      let sets = this.sets.filter((set) => {
        return set.monster.name.toLowerCase().includes(this.monsterFilter.toLowerCase());
      });
      return sets;
    },
    uniqueMonstersList() {
      let sets = this.sets.filter((set) => {
        return set.monster.name.toLowerCase().includes(this.monsterFilter.toLowerCase());
      });
      let set = [...new Set(sets.map((set) => set.monster.name))];
      console.log(set);
      return set;
    },
  },
};
</script>

<template>
  <input type="text" v-model="monsterFilter" list="monsters" />
  <datalist id="monsters">
    <option v-for="monster in uniqueMonstersList" v-bind:key="monster.id">
      {{ monster }}
    </option>
  </datalist>
  <div v-for="set in filteredByMonster" :key="set.id">
    <h2>{{ set.name }}</h2>
    <router-link :to="`/monsters/${set.monster.id}`">
      <h3>{{ set.monster.name }}</h3>
    </router-link>
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
  </div>
</template>
