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
        this.set[item.slot] = Items.get(item.oldschooljs_item_id);
        this.set.slotted_items[item.slot] = this.set[item.slot].name;
        console.log("???");
        console.log(this.set.slotted_items);
      });
    });
    console.log(this.set.slotted_items);
    console.log(this.set.slotted_items);
  },
  methods: {
    retrieveImage: function (item) {
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + "_detail.png";
      return image_url;
    },
  },
};
</script>

<template>
  <h2>{{ set.name }}</h2>
  <!-- <div v-for="item in set.slotted_items" :key="item.id">
    <p>{{ item }}</p>
  </div> -->
  <img v-if="set.neck" class="image1 background" :src="retrieveImage(set.neck)" />
  <img v-if="set.head" class="image1 background" :src="retrieveImage(set.head)" />
  <img v-if="set.cape" class="image1 background" :src="retrieveImage(set.cape)" />
  <img v-if="set.ammo" class="image1 background" :src="retrieveImage(set.ammo)" />
  <img v-if="set.body" class="image1 background" :src="retrieveImage(set.body)" />
  <img v-if="set.weapon" class="image1 background" :src="retrieveImage(set.weapon)" />
  <img v-if="set['2h']" class="image1 background" :src="retrieveImage(set['2h'])" />
  <img v-if="set.shield" class="image1 background" :src="retrieveImage(set.shield)" />
  <img v-if="set.legs" class="image1 background" :src="retrieveImage(set.neck)" />
  <img v-if="set.hands" class="image1 background" :src="retrieveImage(set.hands)" />
  <img v-if="set.feet" class="image1 background" :src="retrieveImage(set.feet)" />
  <img v-if="set.ring" class="image1 background" :src="retrieveImage(set.ring)" />
</template>
