<script>
import axios from "axios";
import { Items } from "oldschooljs";
import { Monsters } from "oldschooljs";
import ItemImage from "../components/ItemImage";

export default {
  components: {
    ItemImage,
  },
  data: function () {
    return {
      sets: [],
      monsterFilter: "",
    };
  },
  created: function () {
    axios.get("/equipment-sets").then((response) => {
      this.sets = response.data;
      this.sets.forEach((set) => {
        set.monster = Monsters.get(set.oldschooljs_monster_id);
        set.equipment_set_items.forEach((item) => {
          set[item.slot] = Items.get(item.oldschooljs_item_id);
        });
      });
    });
  },
  computed: {
    filteredByMonster() {
      let sets = this.sets.filter((set) => {
        return set.monster.name.toLowerCase().includes(this.monsterFilter.toLowerCase());
      });
      return sets;
    },
    uniqueMonstersList() {
      let sets = this.sets.filter((set) => {
        return set.monster.name.toLowerCase().includes(this.monsterFilter.toLowerCase());
      });
      let set = [...new Set(sets.map((set) => set.monster.name))];
      console.log(set);
      return set;
    },
  },
};
</script>

<template>
  <div class="col-md-6 center">
    <label for="head" class="form-label">Filter by Monster</label>
    <input type="text" v-model="monsterFilter" list="monsters" class="form-control" />
  </div>
  <datalist id="monsters">
    <option v-for="monster in uniqueMonstersList" v-bind:key="monster.id">
      {{ monster }}
    </option>
  </datalist>
  <br />
  <!-- <div class="card-group">
    <div class="card" style="width: 18rem">
      <img
        src="https://mdbcdn.b-cdn.net/img/new/standard/city/041.webp"
        class="card-img-top"
        alt="Hollywood Sign on The Hill"
      />
      <div class="card-body" style="width: 320px">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">
          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
          little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card">
      <img src="https://mdbcdn.b-cdn.net/img/new/standard/city/042.webp" class="card-img-top" alt="Palm Springs Road" />
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card" style="width: 18rem" v-for="set in filteredByMonster" :key="set.id">
      <router-link v-bind:to="`/equipment-sets/${set.id}`"></router-link>
      <div class="card-img-top">
        <div class="row justify-content-center">
          <ItemImage :item="set.head" itemSlot="head" />
        </div>
        <div class="row justify-content-center">
          <ItemImage :item="set.cape" itemSlot="cape" />
          <ItemImage :item="set.neck" itemSlot="neck" />
          <ItemImage :item="set.ammo" itemSlot="ammo" />
        </div>
        <div class="row justify-content-center">
          <ItemImage v-if="set['2h']" :item="set['2h']" itemSlot="2h" />
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
      <div class="card-body">
        <h5 class="card-title">{{ set.name }}</h5>
        <p class="card-text">
          <router-link :to="`/monsters/${set.monster.id}`">
            {{ set.monster.name }}
          </router-link>
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
  </div> -->
  <div class="parent">
    <div v-for="set in filteredByMonster" :key="set.id" class="set-index">
      <h2>{{ set.name }}</h2>
      <router-link :to="`/monsters/${set.monster.id}`">
        <h3>{{ set.monster.name }}</h3>
      </router-link>
      <router-link v-bind:to="`/equipment-sets/${set.id}`">
        <div class="row justify-content-center">
          <ItemImage :item="set.head" itemSlot="head" />
        </div>
        <div class="row justify-content-center">
          <ItemImage :item="set.cape" itemSlot="cape" />
          <ItemImage :item="set.neck" itemSlot="neck" />
          <ItemImage :item="set.ammo" itemSlot="ammo" />
        </div>
        <div class="row justify-content-center">
          <ItemImage v-if="set['2h']" :item="set['2h']" itemSlot="2h" />
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
      </router-link>
    </div>
  </div>
</template>

<style>
/* Three image containers (use 25% for four, and 50% for two, etc) */
.column {
  float: mid;
  width: 60px;
  column-fill: balance;
}

/* Clear floats after image containers */
.row::after {
  content: "";
  clear: both;
  display: table;
}
.set-index {
  width: 300px;
  height: 420px;
  padding: 10px;
  margin: 10px;
  position: relative;
  align-items: center;
  vertical-align: middle;
  text-align: center;

  justify-content: center;
  background-image: url("/images/Inventory_tab.png");
  background-size: 300px 420px;
}
.parent {
  text-align: center;
}
h2 {
  color: whitesmoke;
}
/* 
.card {
  width: 320px;
  min-width: 320px;
} */
</style>
