<template>
    <div>
        {{ sceneId }}
        <img :src="`/scenes/${sceneId}.JPG`" usemap="#image-map" />
        <div v-html="sceneHtml"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "SceneView",
    components: {},
    data() {
        return {
            sceneId: this.$route.params.id,
            sceneHtml: "",
        };
    },
    // Get scene HTML.
    async created() {
        const resp = await fetch(`/scenes/${this.sceneId}.html`);
        const html = await resp.text();
        console.log(html);
        this.sceneHtml = html;
    },
});
</script>
