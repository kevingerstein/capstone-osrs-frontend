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
  methods: {
    goToMonster: function (monsterId) {
      console.log(monsterId);
      this.$router.push(`/monsters/${monsterId}`);
    },
    goToSet: function (setId) {
      console.log(setId);
      this.$router.push(`/equipment-sets/${setId}`);
    },
  },
};
</script>

<template>
  <main role="main" class="center">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">View All Equipment Sets</h1>
        <hr class="featurette-divider" />

        <div class="col-md-6 center">
          <label for="head" class="form-label">Filter by Monster</label>
          <input type="text" v-model="monsterFilter" list="monsters" class="form-control" />
        </div>
      </div>
    </section>
  </main>
  <div class="container marketing center">
    <!-- START THE FEATURETTES -->
    <hr class="featurette-divider" />
    <div v-for="set in filteredByMonster" :key="set.id">
      <div class="row featurette">
        <div class="col-md-9">
          <!-- <h1 class="jumbotron-heading">{{ set.name }}</h1>
          <hr class="featurette-divider col-md-7 center mb-4" />
          <h1 class="jumbotron-heading">{{ set.monster.name }}</h1>
          <hr class="featurette-divider col-md-7 center mb-4" /> -->
          <!-- Three columns of text below the carousel -->
          <div class="row center mt-5" style="width: 100%">
            <div class="col-lg-6">
              <img src="/images/hat-wizard-solid.svg" alt="" class="icon mb-3 mt-3" />
              <h2 class="jumbotron-heading">{{ set.name }}</h2>
              <button
                class="btn btn-secondary btn-m btn-block mt-4 mb-3"
                v-on:click="goToSet(set.id)"
                style="width: 320px"
              >
                View Set
              </button>
              <br />
            </div>
            <!-- /.col-lg-4 -->
            <div class="col-lg-6">
              <img src="/images/dragon-solid.svg" alt="" class="icon mb-2 mt-3" />
              <h2 class="jumbotron-heading">{{ set.monster.name }}</h2>
              <button
                class="btn btn-secondary btn-m btn-block mt-4 mb-3"
                v-on:click="goToMonster(set.monster.id)"
                style="width: 320px"
              >
                View Monster
              </button>
            </div>
            <!-- /.col-lg-4 -->
          </div>

          <!-- /.row -->
        </div>
        <div class="col-md-3">
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
      </div>
      <hr class="featurette-divider" />
    </div>

    <!-- /END THE FEATURETTES -->
  </div>

  <hr class="mb-4 mt-5 col-md-8 center" />
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
  <!-- <div class="parent">
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
  </div> -->
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
/* 
.card {
  width: 320px;
  min-width: 320px;
} */
</style>
