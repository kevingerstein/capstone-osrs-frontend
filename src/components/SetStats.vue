<script>
export default {
  props: ["set"],
  data: function () {
    return {
      stats: {},
    };
  },
  created: function () {
    this.baseStats();
  },
  methods: {
    baseStats: function () {
      this.stats = {
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
      };
      console.log(this.set.slotted_items);
      for (const item in this.set.slotted_items) {
        if (this.set[item] && Object.prototype.hasOwnProperty.call(this.set[item], "equipment")) {
          for (const stat in this.stats) {
            this.stats[stat] += this.set[item].equipment[stat];
          }
        } else if (item === "weapon") {
          if (
            this.set["2h"] &&
            Object.prototype.hasOwnProperty.call(this.set["2h"], "equipment") &&
            !this.set.slotted_items["2h"]
          ) {
            for (const stat in this.stats) {
              this.stats[stat] += this.set["2h"].equipment[stat];
            }
          }
        }
      }
      this.$emit("stats", this.set.stats);
    },
  },
  watch: {
    set: {
      handler() {
        this.baseStats();
      },
      deep: true,
    },
  },
};
</script>

<template>
  <div class="col-lg-4">
    <img src="/images/skull-solid.svg" alt="" class="icon mb-2" />
    <h4 style="font-weight: 200">Attack Bonus</h4>
    <p class="stat">Stab: {{ stats.attack_stab }}</p>
    <p class="stat">Slash: {{ stats.attack_slash }}</p>
    <p class="stat">Crush: {{ stats.attack_crush }}</p>
    <p class="stat">Magic: {{ stats.attack_magic }}</p>
    <p class="stat">Range: {{ stats.attack_ranged }}</p>
  </div>
  <div class="col-lg-4">
    <img src="/images/shield-shaded.svg" alt="" class="icon mb-2" />

    <h4 style="font-weight: 200">Defense Bonus</h4>
    <p class="stat">Stab: {{ stats.defence_stab }}</p>
    <p class="stat">Slash: {{ stats.defence_slash }}</p>
    <p class="stat">Crush: {{ stats.defence_crush }}</p>
    <p class="stat">Magic: {{ stats.defence_magic }}</p>
    <p class="stat">Range: {{ stats.defence_ranged }}</p>
  </div>
  <div class="col-lg-4">
    <img src="/images/plus-solid.svg" alt="" class="icon mb-2" />
    <h4 style="font-weight: 200">Other Bonuses</h4>
    <p class="stat">Melee Strength: {{ stats.melee_strength }}</p>
    <p class="stat">Ranged Strength: {{ stats.ranged_strength }}</p>
    <p class="stat">Magic Damage: {{ stats.magic_damage }}</p>
    <p class="stat">Prayer: {{ stats.prayer }}</p>
    <br />
  </div>
</template>

<style>
.stats {
  display: inline-block;
}
.stat-attack {
  justify-content: center;
  text-align: center;
  width: 33%;
}
.stat {
  margin-right: 0;
  margin-bottom: 0px;
  margin-left: 5px;
  color: rgb(50, 50, 50);
}

.stat-header {
  margin-top: 3px;
  margin-bottom: 0;
  color: rgb(177, 177, 177);
  border-bottom: 1px solid yellow;
  border-spacing: 15px;
}

.column {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row:after {
  justify-content: center;
  text-align: center;
  content: "";
  display: table;
  clear: both;
}
</style>
