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
      set: {},
    };
  },
  created: function () {
    axios.get(`/equipment-sets/${this.$route.params.id}`).then((response) => {
      this.set = response.data;
      this.set.slotted_items = {};
      this.set.monster = Monsters.get(this.set.oldschooljs_monster_id);
      this.set.equipment_set_items.forEach((item) => {
        this.set[item.slot] = Items.get(item.oldschooljs_item_id);
        this.set.slotted_items[item.slot] = this.set[item.slot].name;
      });
    });
  },
};
</script>

<template>
  <h2>{{ set.name }}</h2>
  <h4 v-if="set.monster">{{ set.monster.name }}</h4>
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
  <SetStats :set="set" v-if="Object.keys(this.set).length !== 0" />
</template>
