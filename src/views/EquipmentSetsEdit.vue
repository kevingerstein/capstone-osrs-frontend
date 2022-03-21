<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
import ItemImage from "../components/ItemImage.vue";
import ItemList from "../components/ItemList.vue";
import SetStats from "../components/SetStats.vue";

export default {
  components: {
    ItemImage,
    ItemList,
    SetStats,
  },
  data: function () {
    return {
      set: {
        name: "",
        oldschooljs_monster_id: null,
        monster: {},
        monsterName: "",
        slotted_items: {},
      },
    };
  },
  created: function () {
    axios.get(`/equipment-sets/${this.$route.params.id}`).then((response) => {
      this.set = response.data;
      this.set.slotted_items = {};
      this.set.monster = Monsters.get(this.set.oldschooljs_monster_id);
      this.set.monsterName = this.set.monster.name;
      this.set.equipment_set_items.forEach((item) => {
        this.set[item.slot] = Items.get(item.oldschooljs_item_id);
        if (this.set[item.slot]) {
          this.set.slotted_items[item.slot] = this.set[item.slot].name;
        }
        if (item.slot == "2h") {
          this.set.slotted_items.weapon = this.set[item.slot].name;
        }
      });
    });
  },
  methods: {
    updateSet: function () {
      this.set.items = [];
      for (const key in this.set.slotted_items) {
        if (key == "weapon") {
          if (Object.keys(this.set[key]).length === 0) {
            this.set.items.push({
              oldschooljs_item_id: this.set["2h"].id,
              slot: this.set["2h"].equipment.slot,
            });
          }
        }
        if (Object.keys(this.set[key]).length !== 0) {
          this.set.items.push({
            oldschooljs_item_id: this.set[key].id,
            slot: this.set[key].equipment.slot,
          });
        }
      }
      axios
        .patch(`/equipment-sets/${this.$route.params.id}`, this.set)
        .then((response) => {
          console.log(response.data);
          this.$router.push(`/equipment-sets/${this.$route.params.id}`);
        })
        .catch((error) => {
          console.log(error.response.data.errors);
        });
    },
    //NEEDS WORK --- MONSTER PARSING IS MORE TRICKY
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
    updateItem: function (name) {
      var element = document.getElementById(name);
      if (element) {
        console.log("update: " + name);
        console.log("item id: " + element.getAttribute("data"));
        let itemId = parseInt(element.getAttribute("data"));
        let item = Items.get(itemId);
        if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
          this.handleWeapon(item);
          this.set[item.equipment.slot] = item;
        }
      }
    },
    handleWeapon: function (item) {
      if (item.equipment.slot === "2h") {
        this.set.weapon = {};
        this.set.shield = {};
        this.set.slotted_items.shield = "";
      } else if (item.equipment.slot === "weapon") {
        this.set["2h"] = {};
      }
    },
    getMonster: function (monster) {
      let element = document.getElementById(monster);
      if (element) {
        this.set.oldschooljs_monster_id = parseInt(element.getAttribute("data"));
        this.set.monster = Monsters.get(this.set.oldschooljs_monster_id);
      }
    },
    rsMonsters: function () {
      return Monsters;
    },
  },
  watch: {
    "set.slotted_items.head"(head) {
      this.updateItem(head);
    },
    "set.slotted_items.body"(body) {
      this.updateItem(body);
    },
    "set.slotted_items.neck"(neck) {
      this.updateItem(neck);
    },
    "set.slotted_items.cape"(cape) {
      this.updateItem(cape);
    },
    "set.slotted_items.ammo"(ammo) {
      this.updateItem(ammo);
    },
    "set.slotted_items.weapon"(weapon) {
      this.updateItem(weapon);
    },
    "set.slotted_items.shield"(shield) {
      this.updateItem(shield);
    },
    "set.slotted_items.legs"(legs) {
      this.updateItem(legs);
    },
    "set.slotted_items.hands"(hands) {
      this.updateItem(hands);
    },
    "set.slotted_items.feet"(feet) {
      this.updateItem(feet);
    },
    "set.slotted_items.ring"(ring) {
      this.updateItem(ring);
    },
    "set.monsterName"(monster) {
      this.getMonster(monster);
    },
  },
};
</script>

<template>
  <!-- <form v-on:submit.prevent="updateSet()">
    Set Name:
    <input type="text" v-model="set.name" />
    <div>
      Monster:
      <input type="text" v-model="set.monsterName" list="monster" />
      <datalist id="monster">
        <option
          v-for="monster in rsMonsters()"
          :key="monster.id"
          :data="monster[0]"
          :value="monster[1].name"
          :id="monster[1].name"
        ></option>
      </datalist>
      <img v-if="set.monster.id" :src="retrieveMonsterImage(set.monster)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.head" list="head" />
      <ItemList :itemSlot="'head'" id="head" />
      <ItemImage :item="set.head" itemSlot="head" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.body" list="body" />
      <ItemList :itemSlot="'body'" id="body" />
      <ItemImage :item="set.body" itemSlot="body" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.neck" list="neck" />
      <ItemList :itemSlot="'neck'" id="neck" />
      <ItemImage :item="set.neck" itemSlot="neck" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.cape" list="cape" />
      <ItemList :itemSlot="'cape'" id="cape" />
      <ItemImage :item="set.cape" itemSlot="cape" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.ammo" list="ammo" />
      <ItemList :itemSlot="'ammo'" id="ammo" />
      <ItemImage :item="set.ammo" itemSlot="ammo" />
    </div>
    <div>
      <input
        type="text"
        v-model="set.slotted_items.shield"
        list="shield"
        :disabled="set['2h'] && Object.keys(set['2h']).length !== 0"
      />
      <ItemList :itemSlot="'shield'" id="shield" />
      <ItemImage :item="set.shield" itemSlot="shield" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.legs" list="legs" />
      <ItemList :itemSlot="'legs'" id="legs" />
      <ItemImage :item="set.legs" itemSlot="legs" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.ring" list="ring" />
      <ItemList :itemSlot="'ring'" id="ring" />
      <ItemImage :item="set.ring" itemSlot="ring" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.hands" list="hands" />
      <ItemList :itemSlot="'hands'" id="hands" />
      <ItemImage :item="set.hands" itemSlot="hands" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.feet" list="feet" />
      <ItemList :itemSlot="'feet'" id="feet" />
      <ItemImage :item="set.feet" itemSlot="feet" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.weapon" list="weapon" />
      <ItemList :itemSlot="'weapon'" id="weapon" />
      <ItemImage v-if="set['2h'] && set['2h'].id" :item="set['2h']" itemSlot="2h" />
      <ItemImage v-else :item="set.weapon" itemSlot="weapon" />
    </div>
    <SetStats :set="set" v-if="Object.keys(this.set).length !== 0" />

    <button type="submit" class="btn btn-lg bg-outline-dark">Update Set</button>
  </form> -->
  <form class="row g-3" v-on:submit.prevent="updateSet()">
    <div class="col-md-6">
      <label for="head" class="form-label">Set Name</label>
      <input type="text" v-model="set.name" class="form-control" />
    </div>
    <div class="col-md-6">
      <label for="monster" class="form-label">Monster</label>
      <input type="text" v-model="set.monsterName" list="monster" class="form-select" />
      <datalist id="monster">
        <option
          v-for="monster in rsMonsters()"
          :key="monster.id"
          :data="monster[0]"
          :value="monster[1].name"
          :id="monster[1].name"
        ></option>
      </datalist>
    </div>
    <div class="col-md-3">
      <label for="head" class="form-label">Head</label>
      <input type="text" v-model="set.slotted_items.head" list="head" class="form-select" />
      <ItemList :itemSlot="'head'" id="head" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.head" itemSlot="head" />
    </div>
    <div class="col-md-3">
      <label for="body" class="form-label">Body</label>
      <input type="text" v-model="set.slotted_items.body" list="body" class="form-select" />
      <ItemList :itemSlot="'body'" id="body" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.body" itemSlot="body" />
    </div>
    <div class="col-md-3">
      <label for="neck" class="form-label">neck</label>
      <input type="text" v-model="set.slotted_items.neck" list="neck" class="form-select" />
      <ItemList :itemSlot="'neck'" id="neck" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.neck" itemSlot="neck" />
    </div>
    <div class="col-md-3">
      <label for="cape" class="form-label">cape</label>
      <input type="text" v-model="set.slotted_items.cape" list="cape" class="form-select" />
      <ItemList :itemSlot="'cape'" id="cape" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.cape" itemSlot="cape" />
    </div>
    <div class="col-md-3">
      <label for="ammo" class="form-label">ammo</label>
      <input type="text" v-model="set.slotted_items.ammo" list="ammo" class="form-select" />
      <ItemList :itemSlot="'ammo'" id="ammo" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.ammo" itemSlot="ammo" />
    </div>
    <div class="col-md-3">
      <label for="shield" class="form-label">shield</label>
      <input type="text" v-model="set.slotted_items.shield" list="shield" class="form-select" />
      <ItemList :itemSlot="'shield'" id="shield" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.shield" itemSlot="shield" />
    </div>
    <div class="col-md-3">
      <label for="legs" class="form-label">legs</label>
      <input type="text" v-model="set.slotted_items.legs" list="legs" class="form-select" />
      <ItemList :itemSlot="'legs'" id="legs" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.legs" itemSlot="legs" />
    </div>
    <div class="col-md-3">
      <label for="ring" class="form-label">ring</label>
      <input type="text" v-model="set.slotted_items.ring" list="ring" class="form-select" />
      <ItemList :itemSlot="'ring'" id="ring" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.ring" itemSlot="ring" />
    </div>
    <div class="col-md-3">
      <label for="hands" class="form-label">hands</label>
      <input type="text" v-model="set.slotted_items.hands" list="hands" class="form-select" />
      <ItemList :itemSlot="'hands'" id="hands" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.hands" itemSlot="hands" />
    </div>
    <div class="col-md-3">
      <label for="feet" class="form-label">feet</label>
      <input type="text" v-model="set.slotted_items.feet" list="feet" class="form-select" />
      <ItemList :itemSlot="'feet'" id="feet" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage :item="set.feet" itemSlot="feet" />
    </div>
    <div class="col-md-3">
      <label for="weapon" class="form-label">weapon</label>
      <input type="text" v-model="set.slotted_items.weapon" list="weapon" class="form-select" />
      <ItemList :itemSlot="'weapon'" id="weapon" />
    </div>
    <div class="col-md-1 mt-4">
      <ItemImage v-if="set['2h'] && set['2h'].id" :item="set['2h']" itemSlot="2h" />
      <ItemImage v-else :item="set.weapon" itemSlot="weapon" />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-primary">Update Set</button>
    </div>
  </form>
  <div class="center">
    <div class="parent set">
      <h4 class="armor-text">{{ set.name }}</h4>
      <h5 class="armor-text" v-if="set.monster">{{ set.monster.name }}</h5>
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
  </div>
  <SetStats :set="set" v-if="Object.keys(this.set).length !== 0" />

  <router-link v-bind:to="`/equipment-sets/${set.id}`">Back</router-link>
</template>

<style>
img {
  width: 150px;
  height: auto;
}
</style>
