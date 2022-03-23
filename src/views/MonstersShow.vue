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
      console.log(this.monster);
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
    goToEdit: function (id) {
      this.$router.push(`/equipment-sets/${id}/edit`);
    },
  },
};
</script>

<template>
  <main role="main" class="center">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">{{ monster.name }}</h1>

        <p class="lead text-muted">
          {{ monster.data.examineText }}
        </p>
        <img class="monster-img" v-if="monster.id" :src="retrieveMonsterImage(monster)" />
      </div>

      <!-- Three columns of text below the carousel -->
      <div class="row center mt-5">
        <div class="col-lg-3">
          <img src="/images/dragon-solid.svg" alt="" class="icon mb-2" />
          <h4 class="font-weight-normal">General Information</h4>
          <p class="monster-stat">Combat Level: {{ monster.data.combatLevel }}</p>
          <p class="monster-stat">Hitpoints: {{ monster.data.hitpoints }}</p>
          <p class="monster-stat">Max Hit: {{ monster.data.maxHit }}</p>
          <p class="monster-stat">Poisonous: {{ monster.data.poisonous }}</p>
          <p class="monster-stat">Slayer Requirement: {{ monster.data.slayerLevelRequired }}</p>
        </div>
        <!-- /.col-lg-4 -->
        <div class="col-lg-3">
          <img src="/images/skull-solid.svg" alt="" class="icon mb-2" />

          <h4>Attack Bonus</h4>
          <p class="monster-stat">Attack Level: {{ monster.data.attackLevel }}</p>
          <p class="monster-stat">Strength Level: {{ monster.data.strengthLevel }}</p>
          <p class="monster-stat">Attack Speed: {{ monster.data.attackSpeed }}</p>
          <p class="monster-stat">Magic: {{ monster.data.attackMagic }}</p>
          <p class="monster-stat">Ranged: {{ monster.data.attackRanged }}</p>
        </div>
        <!-- /.col-lg-4 -->
        <div class="col-lg-3">
          <img src="/images/shield-shaded.svg" alt="" class="icon mb-2" />

          <h4>Defense Bonus</h4>
          <p class="monster-stat">Stab: {{ monster.data.defenceStab }}</p>
          <p class="monster-stat">Slash: {{ monster.data.defenceSlash }}</p>
          <p class="monster-stat">Crush: {{ monster.data.defenceCrush }}</p>
          <p class="monster-stat">Magic: {{ monster.data.defenceMagic }}</p>
          <p class="monster-stat">Ranged: {{ monster.data.defenceRanged }}</p>
        </div>
        <!-- /.col-lg-4 -->
      </div>
      <!-- /.row -->
    </section>
  </main>
  <div class="container marketing center">
    <!-- START THE FEATURETTES -->
    <hr class="featurette-divider" />
    <div v-for="set in sets" :key="set.id">
      <div class="row featurette">
        <div class="col-md-9">
          <h1 class="jumbotron-heading">{{ set.name }}</h1>
          <hr class="featurette-divider col-md-9 center mb-4" />
          <!-- Three columns of text below the carousel -->
          <div class="row center mt-2">
            <SetStats :set="set" v-if="Object.keys(set).length !== 0" />
            <button class="btn btn-secondary btn-m btn-block mt-3" v-on:click="goToEdit(set.id)" style="width: 80%">
              Edit Set
            </button>
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

  <footer class="text-muted">
    <div class="container">
      <p class="float-right">
        <a href="#">Back to top</a>
      </p>
      <p>Album example is &copy; Bootstrap, but please download and customize it for yourself!</p>
      <p>
        New to Bootstrap?
        <a href="https://getbootstrap.com/">Visit the homepage</a>
        or read our
        <a href="/docs/4.3/getting-started/introduction/">getting started guide</a>
        .
      </p>
    </div>
  </footer>
  <br />
</template>

<style>
.monster-img {
  height: 250px;
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

.armor-background {
  background-color: #a9a9a9;
  width: 100%;
}
.armor-text-center {
  text-align: center;
  color: rgb(172, 172, 172);
}
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
.jumbotron {
  padding-top: 3rem;
  padding-bottom: 3rem;
  margin-bottom: 0;
  background-color: #fff;
}
@media (min-width: 768px) {
  .jumbotron {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
}

.jumbotron p:last-child {
  margin-bottom: 0;
}

.jumbotron-heading {
  font-weight: 300;
}

.jumbotron .container {
  max-width: 40rem;
}

footer {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

footer p {
  margin-bottom: 0.25rem;
}

.album {
  width: 100%;
}
/* MARKETING CONTENT
-------------------------------------------------- */

/* Center align the text within the three columns below the carousel */
.marketing .col-lg-4 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.marketing h2 {
  font-weight: 300;
}
.marketing .col-lg-4 p {
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}

.icon {
  width: 50px;
  height: 50px;
}

h4 {
  font-weight: 400;
}
</style>
