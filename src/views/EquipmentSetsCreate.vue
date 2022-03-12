<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";

export default {
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
        items: [],
      },
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
    findItemsBySlot: function (slot) {
      if (slot === "weapon") {
        return Items.filter((item) => {
          return item.equipment && (item.equipment.slot == "weapon" || item.equipment.slot == "2h");
        });
      } else {
        return Items.filter((item) => {
          return item.equipment && item.equipment.slot == slot;
        });
      }
    },
    retrieveImage: function (item) {
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + "_detail.png";
      return image_url;
    },
    retrieveAltImage: function (item) {
      console.log("retrieving alt image for: " + item.name);
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + ".png";
      return image_url;
    },
    retrieveMonsterImage: function (monster) {
      console.log("retrieving alt image for: " + monster.name);
      console.log(monster);
      console.log(monster);
      console.log(monster.data.wikiURL);
      let image_url = monster.data.wikiURL.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      console.log(image_url);
      image_url = image_url + ".png";
      return image_url;
    },
    adjustStats: function (oldItem, newItem) {
      if (Object.keys(oldItem).length !== 0) {
        for (const stat in this.stats) {
          this.stats[stat] -= oldItem.equipment[stat];
        }
      }
      if (Object.keys(newItem).length !== 0) {
        for (const stat in this.stats) {
          this.stats[stat] += newItem.equipment[stat];
        }
      }
    },
    updateItem: function (name) {
      console.log("update: " + name);
      var element = document.getElementById(name);
      if (element) {
        console.log("data: ");
        console.log(element.getAttribute("data"));
        let itemId = parseInt(element.getAttribute("data"));
        console.log(typeof itemId);

        let item = Items.get(itemId);
        if (item && Object.prototype.hasOwnProperty.call(item, "equipment")) {
          if (item.equipment.slot === "2h") {
            this.adjustStats(this.set.shield, {});
            this.adjustStats(this.set.weapon, {});
            this.set.weapon = {};
            this.set.shield = {};
            this.set.slotted_items.shield = "";
          } else if (item.equipment.slot === "weapon") {
            this.adjustStats(this.set["2h"], {});
            this.set["2h"] = {};
          }
          this.adjustStats(this.set[item.equipment.slot], item);
          this.set[item.equipment.slot] = item;
        }
        console.log(this.set);
      }
    },
    //NEEDS WORK --- MONSTER PARSING IS MORE TRICKY
    getMonster: function (monster) {
      let element = document.getElementById(monster);
      if (element) {
        this.set.oldschooljs_monster_id = parseInt(element.getAttribute("data"));
        console.log((this.set.monster = Monsters.get(this.set.oldschooljs_monster_id)));
        console.log(this.set.oldschooljs_monster_id);
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
      <datalist id="head">
        <option
          v-for="head in findItemsBySlot('head')"
          :key="head.id"
          :data="head[0]"
          :value="head[1].name"
          :id="head[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/head_slot.png" />
      <img v-if="set.head.id" class="image1 background" :src="retrieveImage(set.head)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.body" list="body" />
      <datalist id="body">
        <option
          v-for="body in findItemsBySlot('body')"
          :key="body.id"
          :data="body[0]"
          :value="body[1].name"
          :id="body[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/body_slot.png" />
      <img v-if="set.body.id" class="image1 background" :src="retrieveImage(set.body)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.neck" list="neck" />
      <datalist id="neck">
        <option
          v-for="neck in findItemsBySlot('neck')"
          :key="neck.id"
          :data="neck[0]"
          :value="neck[1].name"
          :id="neck[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/neck_slot.png" />
      <img v-if="set.neck.id" class="image1 background" :src="retrieveImage(set.neck)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.cape" list="cape" />
      <datalist id="cape">
        <option
          v-for="cape in findItemsBySlot('cape')"
          :key="cape.id"
          :data="cape[0]"
          :value="cape[1].name"
          :id="cape[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/cape_slot.png" />
      <img
        v-if="set.cape.id"
        class="image1 background"
        :src="retrieveImage(set.cape)"
        :alt="retrieveAltImage(set.cape)"
      />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.ammo" list="ammo" />
      <datalist id="ammo">
        <option
          v-for="ammo in findItemsBySlot('ammo')"
          :key="ammo.id"
          :data="ammo[0]"
          :value="ammo[1].name"
          :id="ammo[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/ammo_slot.png" />
      <img v-if="set.ammo.id" class="image1 background" :src="retrieveImage(set.ammo)" />
    </div>
    <div>
      <input
        type="text"
        v-model="set.slotted_items.shield"
        list="shield"
        :disabled="Object.keys(set['2h']).length !== 0"
      />
      <datalist id="shield">
        <option
          v-for="shield in findItemsBySlot('shield')"
          :key="shield.id"
          :data="shield[0]"
          :value="shield[1].name"
          :id="shield[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/shield_slot.png" />
      <img v-if="set.shield.id" class="image1 background" :src="retrieveImage(set.shield)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.legs" list="legs" />
      <datalist id="legs">
        <option
          v-for="legs in findItemsBySlot('legs')"
          :key="legs.id"
          :data="legs[0]"
          :value="legs[1].name"
          :id="legs[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/legs_slot.png" />
      <img v-if="set.legs.id" class="image1 background" :src="retrieveImage(set.legs)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.hands" list="hands" />
      <datalist id="hands">
        <option
          v-for="hands in findItemsBySlot('hands')"
          :key="hands.id"
          :data="hands[0]"
          :value="hands[1].name"
          :id="hands[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/hands_slot.png" />
      <img v-if="set.hands.id" class="image1 background" :src="retrieveImage(set.hands)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.feet" list="feet" />
      <datalist id="feet">
        <option
          v-for="feet in findItemsBySlot('feet')"
          :key="feet.id"
          :data="feet[0]"
          :value="feet[1].name"
          :id="feet[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/feet_slot.png" />
      <img v-if="set.feet.id" class="image1 background" :src="retrieveImage(set.feet)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.ring" list="ring" />
      <datalist id="ring">
        <option
          v-for="ring in findItemsBySlot('ring')"
          :key="ring.id"
          :data="ring[0]"
          :value="ring[1].name"
          :id="ring[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/ring_slot.png" />
      <img v-if="set.ring.id" class="image1 background" :src="retrieveImage(set.ring)" />
    </div>
    <div>
      <input type="text" v-model="set.slotted_items.weapon" list="weapon" />
      <datalist id="weapon">
        <option
          v-for="weapon in findItemsBySlot('weapon')"
          :key="weapon.id"
          :data="weapon[0]"
          :value="weapon[1].name"
          :id="weapon[1].name"
        ></option>
      </datalist>
      <img class="image1 background" src="/images/weapon_slot.png" />
      <img v-if="set.weapon.id" class="image1 background" :src="retrieveImage(set.weapon)" />
      <img v-if="set['2h'].id" class="image1 background" :src="retrieveImage(set['2h'])" />
    </div>
    <p>{{ stats }}</p>
    <button type="submit" class="btn btn-lg bg-outline-dark">Create Set</button>
  </form>
</template>

<style>
img {
  width: 40px;
  height: 40px;
}
</style>
