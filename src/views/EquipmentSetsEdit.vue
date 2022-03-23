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
      errors: [],
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
      console.log("UPDATING");
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
          this.errors = error.response.data.errors;
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
      console.log(name);
      console.log("~~~~~~~");
      var element = document.getElementById(name);
      console.log(element);
      if (element) {
        console.log("update: " + name);
        console.log("item id: " + element.getAttribute("data"));
        let itemId = parseInt(element.getAttribute("data"));
        let item = Items.get(itemId);
        if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
          console.log("HANDLE WEAPONS");
          this.handleWeapon(item);
          this.set[item.equipment.slot] = item;
        }
      }
    },
    handleWeapon: function (item) {
      console.log("~~~~~~~");
      console.log(item);
      console.log("~~~~~~~");

      if (item.equipment.slot === "2h") {
        console.log("2222222");
        console.log(item);
        console.log("~~~~~~~");
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
  <div class="container center">
    <div class="py-5 text-center">
      <div class="container">
        <h1 class="jumbotron-heading">Equipment Set Edit</h1>

        <p class="lead text-muted">{{ set.name }}</p>
      </div>
    </div>

    <div class="row">
      <hr class="mb-5" />
      <div class="col-md-4 order-md-2 mb-4">
        <h4 class="d-flex justify-content-between align-items-center mb-3"></h4>
        <div class="set">
          <div class="row justify-content-center mt-3">
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
      <div class="col-md-8 order-md-1">
        <form class="needs-validation" v-on:submit.prevent="updateSet()">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="monster">Set Name</label>
              <input type="text" class="form-control" required v-model="set.name" />
              <div class="invalid-feedback">Valid set name is required.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="monster">Monster</label>
              <input type="text" class="form-control" required list="monster" v-model="set.monsterName" />
              <div class="invalid-feedback">Valid monster name is required.</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="head">Head</label>
              <input type="text" class="form-control" list="head" v-model="set.slotted_items.head" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="cape">Cape</label>
              <input type="text" class="form-control" list="cape" v-model="set.slotted_items.cape" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="neck">Neck</label>
              <input type="text" class="form-control" list="neck" v-model="set.slotted_items.neck" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="ammo">Ammo</label>
              <input type="text" class="form-control" list="ammo" v-model="set.slotted_items.ammo" />
            </div>

            <div class="col-md-4 mb-3">
              <label for="body">Body</label>
              <input type="text" class="form-control" list="body" v-model="set.slotted_items.body" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="shield">Shield</label>
              <input
                type="text"
                class="form-control"
                list="shield"
                v-model="set.slotted_items.shield"
                :disabled="set['2h'] && Object.keys(set['2h']).length !== 0"
              />
            </div>
            <div class="col-md-4 mb-3">
              <label for="legs">Legs</label>
              <input type="text" class="form-control" list="legs" v-model="set.slotted_items.legs" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="hands">Hands</label>
              <input type="text" class="form-control" list="hands" v-model="set.slotted_items.hands" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="feet">Feet</label>
              <input type="text" class="form-control" list="feet" v-model="set.slotted_items.feet" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="ring">Ring</label>
              <input type="text" class="form-control" list="ring" v-model="set.slotted_items.ring" />
            </div>
            <div class="col-md-4 mb-3">
              <label for="weapon">Weapon</label>
              <input type="text" class="form-control" list="weapon" v-model="set.slotted_items.weapon" />
            </div>
            <div class="col-md-4 mb-3 mt-4">
              <p class="text-muted">2h will unequip shield!</p>
            </div>
          </div>

          <div class="row"></div>
          <button type="submit" class="btn btn-secondary btn-lg btn-block" style="width: 100%">Update</button>
          <div class="col-md-12 order-md-2 mt-2">
            <p class="text-danger" v-for="error in errors" :key="error.id">{{ error }}</p>
          </div>
        </form>
      </div>

      <div class="col-md-12 order-md-2 mb-4">
        <hr class="mb-5 mt-5" />
        <h2 class="jumbotron-heading">Equipment Stats</h2>
        <hr class="featurette-divider col-md-5 center mb-4" />
        <SetStats :set="set" v-if="Object.keys(set).length !== 0" />
      </div>
    </div>
  </div>

  <datalist id="monster">
    <option
      v-for="monster in rsMonsters()"
      :key="monster.id"
      :data="monster[0]"
      :value="monster[1].name"
      :id="monster[1].name"
    ></option>
  </datalist>
  <ItemList :itemSlot="'head'" id="head" />
  <ItemList :itemSlot="'body'" id="body" />
  <ItemList :itemSlot="'neck'" id="neck" />
  <ItemList :itemSlot="'cape'" id="cape" />
  <ItemList :itemSlot="'ammo'" id="ammo" />
  <ItemList :itemSlot="'shield'" id="shield" />
  <ItemList :itemSlot="'legs'" id="legs" />
  <ItemList :itemSlot="'ring'" id="ring" />
  <ItemList :itemSlot="'hands'" id="hands" />
  <ItemList :itemSlot="'feet'" id="feet" />
  <ItemList :itemSlot="'weapon'" id="weapon" />

  <router-link v-bind:to="`/equipment-sets/${set.id}`">Back</router-link>
</template>

<style>
/* img {
  width: 150px;
  height: auto;
} */
</style>
