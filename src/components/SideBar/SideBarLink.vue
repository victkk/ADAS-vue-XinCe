<template>
  <component
    :is="tag"
    @click="hideSidebar"
    class="nav-item"
    v-bind="$attrs"
    tag="li"
  >
    <a class="nav-link">
      <slot>
        <i v-if="icon" :class="icon"></i>
        <p>{{ name }}</p>
      </slot>
    </a>
  </component>
</template>

<script setup>
import { inject, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  name: String,
  icon: String,
  tag: {
    type: String,
    default: "router-link",
  },
});

const emit = defineEmits(["click"]);

const autoClose = inject("autoClose", true);
const addLink = inject("addLink", () => {});
const removeLink = inject("removeLink", () => {});

const hideSidebar = () => {
  if (autoClose) {
    // Assume there is a global sidebar control method
    // This will likely need to be adjusted based on your actual sidebar implementation
    this.$sidebar.displaySidebar(false);
  }
};

const isActive = () => {
  return context.refs.link && context.refs.link.classList.contains("active");
};

onMounted(() => {
  addLink(context.refs.link);
});

onBeforeUnmount(() => {
  removeLink(context.refs.link);
});
</script>

<style scoped></style>
