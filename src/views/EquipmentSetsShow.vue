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
      set: {
        monster: {
          data: {},
        },
      },
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
    goToMonster: function (monsterId) {
      console.log(monsterId);
      this.$router.push(`/monsters/${monsterId}`);
    },
  },
};
</script>

<template>
  <section class="jumbotron text-center">
    <div class="container">
      <h1 class="jumbotron-heading">{{ set.name }}</h1>

      <hr class="featurette-divider col-md-5 center mb-3 mt-3" />

      <div class="col-md-12">
        <div class="set">
          <div class="row justify-content-center mt-4">
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

          <!-- <SetStats :set="set" v-if="Object.keys(set).length !== 0" class="small" /> -->
        </div>
      </div>
      <h2 class="jumbotron-heading mt-5">Set Stats</h2>
      <hr class="featurette-divider col-md-5 center mb-5 mt-3" />
    </div>
    <br />
    <SetStats :set="set" v-if="Object.keys(set).length !== 0" />
    <div class="container">
      <hr class="featurette-divider col-md-5 center mb-5 mt-5" />

      <button class="btn btn-secondary btn-m btn-block mt-3" v-on:click="goToEdit(set.id)" style="width: 40%">
        Edit Set
      </button>
      <br />
      <button class="btn btn-secondary btn-m btn-block mt-3 mb-5" v-on:click="destroySet()" style="width: 40%">
        Destroy Set
      </button>
    </div>
    <hr class="featurette-divider col-md-10 center mb-5 mt-5" />
    <div class="container">
      <h2 class="jumbotron-heading">{{ set.monster.name }}</h2>

      <p class="lead text-muted">
        {{ set.monster.data.examineText }}
      </p>

      <img class="monster-img" v-if="set.monster.id" :src="retrieveMonsterImage(set.monster)" />
      <hr class="featurette-divider col-md-10 center mb-4 mt-5" />

      <button
        class="btn btn-secondary btn-m btn-block mt-5"
        v-on:click="goToMonster(set.monster.id)"
        style="width: 40%"
      >
        View Monster
      </button>
    </div>
  </section>
</template>

<style>
.column {
  float: mid;
  width: 60px;
  column-fill: balance;
}

/* Clear floats after image containers */
/* .row::after {
  content: "";
  clear: both;
  display: table;
} */
.set {
  width: 290px;
  height: 370px;
  padding: 10px;
  margin: 10px;
  position: relative;
  align-items: center;
  vertical-align: middle;
  text-align: center;
  justify-content: center;
  background-image: url("/images/Inventory_tab.png");
  background-size: 290px 370px;
}
.parent {
  text-align: center;
}
/* h2 {
  color: whitesmoke;
} */

.center {
  justify-content: center;
  text-align: center;
  align-items: center;
  float: center;
}
.vert-center {
  vertical-align: center;
}
/*
.card {
  width: 320px;
  min-width: 320px;
} */
</style>
