<template>
    <div>
        <img
            :src="`/scenes/${chapterId}/${sceneId}.jpeg`"
            usemap="#image-map"
        />
        <div v-html="sceneHtml"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "SceneView",
    props: {
        wordSet: Set<string>,
    },
    emits: {
        clickedWord: String,
        clickedLink: String,
    },
    data() {
        return {
            sceneHtml: "",
            sceneId: this.$route.params.sceneId,
            chapterId: this.$route.params.chapterId,
        };
    },
    async created() {
        // Get scene HTML.
        const htmlRes = await fetch(
            `/scenes/${this.chapterId}/${this.sceneId}.html`
        );
        const html = await htmlRes.text();
        this.sceneHtml = html;

        // Listen for clicks no image map areas.
        this.$el.addEventListener("click", (event: MouseEvent) => {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area
            const t = event.target as HTMLAreaElement;
            if (t.tagName === "AREA") {
                // Add word to library.
                if (t.title) this.$emit("clickedWord", t.title);
                // Follow link to next scene.
                else this.$emit("clickedLink", t.href);
                event.preventDefault();
            }
        });
    },
});
</script>
