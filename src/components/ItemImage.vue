<script>
export default {
  props: ["item", "itemSlot"],
  data: function () {
    return {
      error: false,
    };
  },
  methods: {
    retrieveImage: function (item) {
      let image_url = item.wiki_url.replace(" ", "_");
      image_url = image_url.replace("/w/", "/images/");
      if (image_url.includes("#")) {
        image_url = image_url.substring(0, image_url.indexOf("#"));
      }
      image_url = image_url + "_detail.png";
      // console.log(image_url);
      return image_url;
    },
  },
};
</script>

<template>
  <span>
    <img
      class="image1 background"
      :src="`/images/${itemSlot}_slot.png`"
      v-if="!item || Object.keys(item).length == 0"
    />
    <span class="parent" v-else>
      <img class="image1" src="/images/empty_slot.png" />
      <img class="image2" :src="retrieveImage(item)" alt="nope" id="itemImage" />
    </span>
  </span>
</template>

<style>
.parent {
  position: relative;
  top: 0;
  left: 0;
}

.image1 {
  position: relative;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
}

.image2 {
  position: relative;
  top: -7.5px;
  left: -55px;
  height: 45px;
  width: auto;
}
.background {
  width: 60px;
  height: 60px;
}
</style>
