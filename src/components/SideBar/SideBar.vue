<template>
  <div
    class="sidebar"
    :data-background-color="backgroundColor"
    :data-active-color="activeColor"
  >
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <a href="#" class="simple-text">
          <div class="logo-img">
            <img src="@/assets/images/20240514152616.png" alt="" />
          </div>
          {{ title }}
        </a>
      </div>
      <slot> </slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="index"
            :to="link.path"
            :name="link.name"
            :icon="link.icon"
          ></sidebar-link>
        </slot>
      </ul>
      <moving-arrow :move-y="arrowMovePx"> </moving-arrow>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, provide } from "vue";
import MovingArrow from "@/components/SideBar/MovingArrow.vue";
import SideBarLink from "@/components/SideBar/SideBarLink.vue";
const props = defineProps({
  title: {
    type: String,
    default: "Paper Dashboard",
  },
  backgroundColor: {
    type: String,
    default: "black",
    validator: (value) => ["white", "black", "darkblue"].includes(value),
  },
  activeColor: {
    type: String,
    default: "success",
    validator: (value) =>
      ["primary", "info", "success", "warning", "danger"].includes(value),
  },
  sidebarLinks: {
    type: Array,
    default: () => [],
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});

const linkHeight = ref(65);
const activeLinkIndex = ref(0);
const links = ref([]);

provide("autoClose", props.autoClose);
provide("addLink", (link) => {
  const index = links.value.indexOf(link);
  links.value.splice(index, 0, link);
});
provide("removeLink", (link) => {
  const index = links.value.indexOf(link);
  if (index > -1) {
    links.value.splice(index, 1);
  }
});

const arrowMovePx = computed(() => linkHeight.value * activeLinkIndex.value);

function findActiveLink() {
  links.value.forEach((link, index) => {
    if (link.isActive()) {
      activeLinkIndex.value = index;
    }
  });
}

onMounted(() => {
  watch(() => $route, findActiveLink, {
    immediate: true,
  });
});
</script>

<style scoped></style>
