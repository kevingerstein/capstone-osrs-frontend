<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
export default {
  data: function () {
    return {
      sets: [],
    };
  },
  created: function () {
    axios.get("/equipment-sets").then((response) => {
      this.sets = response.data;
      this.sets.forEach((set) => {
        console.log(set.oldschooljs_monster_id);
        console.log((set.monster = Monsters.get(set.oldschooljs_monster_id)));
        set.js_items = [];
        set.slotted_items = {};
        set.equipment_set_items.forEach((item) => {
          console.log(set.js_items.push(Items.get(item.oldschooljs_item_id)));
          set.slotted_items[item.slot] = Items.get(item.oldschooljs_item_id);
        });
      });
    });
  },
  methods: {
    retrieveImage: function (item) {
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + "_detail.png";
      console.log(image_url);
      return image_url;
    },
  },
};
</script>

<template>
  <!-- alt for images can be no _detail -->
  <div v-for="set in sets" :key="set.id">
    <h2>{{ set.name }}</h2>
    <h3>{{ set.monster.name }}</h3>
    <router-link v-bind:to="`/equipment-sets/${set.id}`">
      <div>
        <img class="image1 background" src="/images/head_slot.png" v-if="!set.slotted_items['head']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['head'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/weapon_slot.png" v-if="!set.slotted_items['2h']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['2h'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/cape_slot.png" v-if="!set.slotted_items['cape']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['cape'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/neck_slot.png" v-if="!set.slotted_items['neck']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['neck'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/ammo_slot.png" v-if="!set.slotted_items['ammo']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['ammo'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/body_slot.png" v-if="!set.slotted_items['body']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['body'])" />
        </div>
      </div>
      <div>
        <img class="background" src="/images/shield_slot.png" v-if="!set.slotted_items['shield']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['shield'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/legs_slot.png" v-if="!set.slotted_items['legs']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['legs'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/hands_slot.png" v-if="!set.slotted_items['hands']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['hands'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/feet_slot.png" v-if="!set.slotted_items['feet']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['feet'])" />
        </div>
      </div>
      <div>
        <img class="image1 background" src="/images/ring_slot.png" v-if="!set.slotted_items['ring']" />
        <div v-else>
          <img class="image1 background" src="/images/empty_slot.png" />
          <img class="image2" :src="retrieveImage(set.slotted_items['ring'])" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<style>
.parent {
  position: relative;
  top: 0;
  left: 0;
}

.image1 {
  position: relative;
  top: 0;
  left: 0;
}

.image2 {
  position: relative;
  top: -7.5px;
  left: -32.5px;
  width: 25px;
  height: 25px;
}
img {
  width: 25px;
  height: 25px;
}
.background {
  width: 40px;
  height: 40px;
}
</style>
