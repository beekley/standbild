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
            wordSet: new Set<string>(),
        };
    },
    async created() {
        // Get scene HTML.
        const resp = await fetch(`/scenes/${this.sceneId}.html`);
        const html = await resp.text();
        this.sceneHtml = html;

        // Listen for clicks no image map areas.
        this.$el.addEventListener("click", (event: MouseEvent) => {
            const t = event.target as HTMLElement;
            if (t.tagName === "AREA") {
                this.wordSet.add(t.title);
                console.log(t.title, this.wordSet.size);
                event.preventDefault();
            }
        });
    },
});
</script>
