<script>
import axios from "axios";
import { Items } from "oldschooljs";

export default {
  data: function () {
    return {
      set: {},
      head: {},
      body: {},
      stats: {
        attack_stab: 0,
        attack_slash: 0,
        attack_crush: 0,
        attack_magic: 0,
        attack_ranged: 0,
        defence_stab: 0,
        defence_slash: 0,
        defence_crush: 0,
        defence_magic: 0,
        defence_ranged: 0,
        melee_strength: 0,
        ranged_strength: 0,
        magic_damage: 0,
        prayer: 0,
      },
    };
  },
  created: function () {
    console.log(this.set.slotted_items);
    this.set.slotted_items = {};
  },
  methods: {
    createSet: function () {
      console.log(this.set.slotted_items.head);
      axios.post().then((response) => {
        console.log(response.data);
      });
    },
    findItemsBySlot: function (slot) {
      return Items.filter((item) => {
        return item.equipment && item.equipment.slot == slot;
      });
    },
    retrieveImage: function (item) {
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      image_url = image_url + ".png";
      return image_url;
    },
    adjustStats: function (oldItem, newItem) {
      if (Object.keys(oldItem).length !== 0) {
        for (const stat in this.stats) {
          this.stats[stat] -= oldItem.equipment[stat];
        }
      }
      for (const stat in this.stats) {
        this.stats[stat] += newItem.equipment[stat];
      }
    },
  },
  watch: {
    "set.slotted_items.head"(head) {
      let item = Items.get(head);
      if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
        this.adjustStats(this.head, item);
        this.head = item;
      }
    },
    "set.slotted_items.body"(body) {
      let item = Items.get(body);
      if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
        this.adjustStats(this.body, item);
        this.body = item;
      }
    },
  },
};
</script>

<template>
  <form v-on:submit.prevent="createSet()">
    Set Name:
    <input type="text" v-model="set.name" />
    <div>
      <input type="text" v-model="set.slotted_items.head" list="head" />
      <datalist id="head">
        <option v-for="head in findItemsBySlot('head')" :key="head.id">
          {{ head[1].name }}
        </option>
      </datalist>
      <img class="image1 background" src="/images/head_slot.png" />
      <img v-if="head.id" class="image1 background" :src="retrieveImage(head)" />
      <!-- <p>{{ head }}</p> -->
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.body" list="body" />
      <datalist id="body">
        <option v-for="body in findItemsBySlot('body')" :key="body.id">
          <p>{{ body[1].name }}</p>
        </option>
      </datalist>
      <img class="image1 background" src="/images/body_slot.png" />
      <img v-if="body.id" class="image1 background" :src="retrieveImage(body)" />
      <!-- <p>{{ body }}</p> -->
    </div>
    <p>{{ stats }}</p>
    <button type="submit" class="btn btn-lg bg-outline-dark">Create Set</button>
  </form>
</template>
