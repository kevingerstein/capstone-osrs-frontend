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
        head: {},
        body: {},
        neck: {},
        cape: {},
        ammo: {},
        legs: {},
        hands: {},
        ring: {},
        shield: {},
        feet: {},
        weapon: {},
        "2h": {},
        slotted_items: {},
      },
    };
  },
  methods: {
    createSet: function () {
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
        .post("/equipment-sets", this.set)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/equipment-sets");
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
  <div class="container center">
    <div class="py-5 text-center">
      <div class="container">
        <h1 class="jumbotron-heading">Equipment Set Create</h1>

        <p class="lead text-muted"></p>
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
        <form class="needs-validation" v-on:submit.prevent="createSet()">
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
          <button type="submit" class="btn btn-secondary btn-lg btn-block" style="width: 100%">Create</button>
          <div class="col-md-12 order-md-2 mt-2">
            <p class="text-danger" v-for="error in errors" :key="error.id">{{ error }}</p>
          </div>
        </form>
      </div>

      <div class="col-md-12 order-md-2 mb-4">
        <hr class="mb-5" />
        <h2 class="jumbotron-heading">Equipment Stats</h2>
        <hr class="featurette-divider col-md-5 center mb-4" />
        <SetStats :set="set" v-if="Object.keys(set).length !== 0" class="small" />
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
  <!-- <div class="d-md-flex align-items-center"> -->
  <!-- First Half -->
  <!-- <div class="col-md-6 p-0 bg-secondary">
      <div class="text-white d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <form class="row g-3 m-2" v-on:submit.prevent="createSet()">
          <div class="col-md-10">
            <label for="head" class="form-label">Set Name</label>
            <input type="text" v-model="set.name" class="form-control" />
          </div>
          <div class="col-md-10">
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
          <div class="col-md-8">
            <label for="head" class="form-label">Head</label>
            <input type="text" v-model="set.slotted_items.head" list="head" class="form-select" />
            <ItemList :itemSlot="'head'" id="head" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.head" itemSlot="head" />
          </div>
          <div class="col-md-8">
            <label for="body" class="form-label">Body</label>
            <input type="text" v-model="set.slotted_items.body" list="body" class="form-select" />
            <ItemList :itemSlot="'body'" id="body" />
          </div>
          <div class="col-md-2 mt-4 ml-3">
            <ItemImage :item="set.body" itemSlot="body" />
          </div>
          <div class="col-md-8">
            <label for="neck" class="form-label">neck</label>
            <input type="text" v-model="set.slotted_items.neck" list="neck" class="form-select" />
            <ItemList :itemSlot="'neck'" id="neck" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.neck" itemSlot="neck" />
          </div>
          <div class="col-md-8">
            <label for="cape" class="form-label">cape</label>
            <input type="text" v-model="set.slotted_items.cape" list="cape" class="form-select" />
            <ItemList :itemSlot="'cape'" id="cape" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.cape" itemSlot="cape" />
          </div>
          <div class="col-md-8">
            <label for="ammo" class="form-label">ammo</label>
            <input type="text" v-model="set.slotted_items.ammo" list="ammo" class="form-select" />
            <ItemList :itemSlot="'ammo'" id="ammo" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.ammo" itemSlot="ammo" />
          </div>
          <div class="col-md-8">
            <label for="shield" class="form-label">shield</label>
            <input type="text" v-model="set.slotted_items.shield" list="shield" class="form-select" />
            <ItemList :itemSlot="'shield'" id="shield" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.shield" itemSlot="shield" />
          </div>
          <div class="col-md-8">
            <label for="legs" class="form-label">legs</label>
            <input type="text" v-model="set.slotted_items.legs" list="legs" class="form-select" />
            <ItemList :itemSlot="'legs'" id="legs" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.legs" itemSlot="legs" />
          </div>
          <div class="col-md-8">
            <label for="ring" class="form-label">ring</label>
            <input type="text" v-model="set.slotted_items.ring" list="ring" class="form-select" />
            <ItemList :itemSlot="'ring'" id="ring" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.ring" itemSlot="ring" />
          </div>
          <div class="col-md-8">
            <label for="hands" class="form-label">hands</label>
            <input type="text" v-model="set.slotted_items.hands" list="hands" class="form-select" />
            <ItemList :itemSlot="'hands'" id="hands" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.hands" itemSlot="hands" />
          </div>
          <div class="col-md-8">
            <label for="feet" class="form-label">feet</label>
            <input type="text" v-model="set.slotted_items.feet" list="feet" class="form-select" />
            <ItemList :itemSlot="'feet'" id="feet" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage :item="set.feet" itemSlot="feet" />
          </div>
          <div class="col-md-8">
            <label for="weapon" class="form-label">weapon</label>
            <input type="text" v-model="set.slotted_items.weapon" list="weapon" class="form-select" />
            <ItemList :itemSlot="'weapon'" id="weapon" />
          </div>
          <div class="col-md-2 mt-4">
            <ItemImage v-if="set['2h'].id" :item="set['2h']" itemSlot="2h" />
            <ItemImage v-else :item="set.weapon" itemSlot="weapon" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Create Set</button>
          </div>
        </form>
      </div>
    </div> -->

  <!-- Second Half -->
  <!-- <div class="col-md-6 p-0">
      <div class="d-md-flex align-items-center p-5 justify-content-center">
        <div class="center-sets center">
          <router-link v-bind:to="`/equipment-sets/${set.id}`">
            <div class="parent set">
              <div class="set-column">
                <h4 class="armor-text-center">{{ set.name }}</h4>
                <h5 class="armor-text-center">{{ set.monster.name }}</h5>
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
    </div> -->
  <!-- </div> -->
</template>

<style>
/* img {
  width: 150px;
  height: auto;
} */

.center {
  display: block;
  position: relative;
  margin: 0 auto;
}

.armor-text {
  color: white;
}
</style>
