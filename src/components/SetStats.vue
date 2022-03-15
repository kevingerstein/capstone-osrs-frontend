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
  <div>
    {{ stats }}
  </div>
</template>
