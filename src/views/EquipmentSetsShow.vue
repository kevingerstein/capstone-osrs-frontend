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
        if (this.set[item.slot]) {
          this.set.slotted_items[item.slot] = this.set[item.slot].name;
        }
      });
    });
  },
  methods: {
    destroySet: function () {
      axios.delete(`/equipment-sets/${this.$route.params.id}`).then((response) => {
        console.log(response.data);
        this.$router.push("/equipment-sets/");
      });
    },
  },
};
</script>

<template>
  <h2>{{ set.name }}</h2>
  <router-link v-if="set.monster" :to="`/monsters/${set.monster.id}`">
    <h4>{{ set.monster.name }}</h4>
  </router-link>
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
  <SetStats :set="set" v-if="Object.keys(this.set).length !== 0" />
  <router-link :to="`/equipment-sets/${set.id}/edit`">Edit Set</router-link>
  <br />
  <router-link to="/equipment-sets/">Back to Index</router-link>
  <br />
  <button v-on:click="destroySet()">Delete</button>
</template>
