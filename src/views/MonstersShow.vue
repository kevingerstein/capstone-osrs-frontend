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
      monster: {
        data: {},
      },
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
  methods: {
    retrieveMonsterImage: function (monster) {
      let image_url = monster.data.wikiURL.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      console.log(image_url);
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
        // image_url = image_url.replace("#", "_(");
        // image_url = image_url + ").png";
      }
      image_url = image_url + ".png";

      // console.log(image_url);
      return image_url;
    },
  },
};
</script>

<template>
  <h1>{{ monster.name }}</h1>
  <div class="row">
    <div class="monster-column">
      <img class="monster-img" v-if="monster.id" :src="retrieveMonsterImage(monster)" />
    </div>
    <div class="monster-column">
      <h4>General Information</h4>
      <p class="monster-stat">Combat Level: {{ monster.data.combatLevel }}</p>
      <p class="monster-stat">Hitpoints: {{ monster.data.hitpoints }}</p>
      <p class="monster-stat">Max Hit: {{ monster.data.maxHit }}</p>
      <p class="monster-stat">Attack Type(s): {{ monster.data.attackType }}</p>
      <p class="monster-stat">Poisonous: {{ monster.data.poisonous }}</p>
      <h4>Attack Bonus</h4>
      <p class="monster-stat">Stab: {{ monster.data.attackStab }}</p>
      <p class="monster-stat">Slash: {{ monster.data.attackSlash }}</p>
      <p class="monster-stat">Crush: {{ monster.data.attackCrush }}</p>
      <p class="monster-stat">Magic: {{ monster.data.attackMagic }}</p>
      <p class="monster-stat">Ranged: {{ monster.data.attackRanged }}</p>
      <h4>Defense Bonus</h4>
      <p class="monster-stat">Stab: {{ monster.data.defenceStab }}</p>
      <p class="monster-stat">Slash: {{ monster.data.defenceSlash }}</p>
      <p class="monster-stat">Crush: {{ monster.data.defenceCrush }}</p>
      <p class="monster-stat">Magic: {{ monster.data.defenceMagic }}</p>
      <p class="monster-stat">Ranged: {{ monster.data.defenceRanged }}</p>
    </div>
  </div>
  <div class="center-sets center">
    <div v-for="set in sets" :key="set.id" class="center-sets">
      <router-link v-bind:to="`/equipment-sets/${set.id}`">
        <div class="parent set">
          <div class="set-column">
            <h4 class="armor-text-center">{{ set.name }}</h4>
            <h5 class="armor-text-center">{{ monster.name }}</h5>
            <div class="row justify-content-center">
              <ItemImage :item="set.head" itemSlot="head" />
            </div>
            <div class="row justify-content-center">
              <ItemImage :item="set.cape" itemSlot="cape" />
              <ItemImage :item="set.neck" itemSlot="neck" />
              <ItemImage :item="set.ammo" itemSlot="ammo" />
            </div>
            <div class="row justify-content-center">
              <ItemImage v-if="set['2h'] && set['2h'].id" :item="set['2h']" itemSlot="2h" />
              <ItemImage v-else :item="set.weapon" itemSlot="weapon" />
              <ItemImage :item="set.body" itemSlot="body" />
              <ItemImage :item="set.shield" itemSlot="shield" />
            </div>
            <div class="row justify-content-center">
              <ItemImage :item="set.legs" itemSlot="legs" />
            </div>
            <div class="row justify-content-center">
              <ItemImage :item="set.hands" itemSlot="hands" />
              <ItemImage :item="set.feet" itemSlot="feet" />
              <ItemImage :item="set.ring" itemSlot="ring" />
            </div>
          </div>
          <SetStats :set="set" v-if="Object.keys(set).length !== 0" class="small" />
        </div>
      </router-link>
    </div>
  </div>
  <br />

  <router-link to="/equipment-sets/">Back to Index</router-link>
</template>

<style>
.small {
  width: 100%;
}

.monster-img {
  height: 400px;
  width: auto;
}
.monster-column {
  float: left;
  text-align: left;
  width: auto;
  margin: auto;
  padding: 5px;
}

.set-column {
  float: left;
  text-align: left;
  width: 50%;
  margin: auto;
  padding-left: 10px;
  padding-right: 10px;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}
.monster-stat {
  margin: 5px;
  margin-right: 0;
}

.center-sets {
  justify-content: center;
  text-align: center;
  align-items: center;
  float: center;
}

.armor-text-center {
  text-align: center;
  color: rgb(172, 172, 172);
}
</style>
