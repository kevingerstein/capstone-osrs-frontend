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
        });
    },
    //NEEDS WORK --- MONSTER PARSING IS MORE TRICKY
    retrieveMonsterImage: function (monster) {
      let image_url = monster.data.wikiURL.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + ".png";
      return image_url;
    },
    updateItem: function (name) {
      console.log("update: " + name);
      var element = document.getElementById(name);
      if (element) {
        console.log(element.getAttribute("data"));
        let itemId = parseInt(element.getAttribute("data"));
        let item = Items.get(itemId);
        if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
          if (item.equipment.slot === "2h") {
            this.set.weapon = {};
            this.set.shield = {};
            this.set.slotted_items.shield = "";
          } else if (item.equipment.slot === "weapon") {
            this.set["2h"] = {};
          }
          this.set[item.equipment.slot] = item;
        }
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
  <form v-on:submit.prevent="createSet()">
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
      <img v-if="set.monster.id" class="image1 background" :src="retrieveMonsterImage(set.monster)" />
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
        :disabled="Object.keys(set['2h']).length !== 0"
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
      <ItemImage v-if="set.weapon.id" :item="set.weapon" itemSlot="weapon" />
      <ItemImage v-else-if="set['2h'].id" :item="set['2h']" itemSlot="2h" />
      <img v-else class="image1 background" src="/images/weapon_slot.png" />
    </div>
    <SetStats :set="set" v-if="Object.keys(this.set).length !== 0" />

    <button type="submit" class="btn btn-lg bg-outline-dark">Create Set</button>
  </form>
</template>
