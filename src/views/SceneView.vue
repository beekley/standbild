<template>
    <div>
        <StoryTemplate :story="story" :word-set="wordSet" />
        <img :src="`/scenes/${sceneId}.jpeg`" usemap="#image-map" />
        <div v-html="sceneHtml"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StoryTemplate from "@/components/StoryTemplate.vue";

export default defineComponent({
    name: "SceneView",
    components: { StoryTemplate },
    data() {
        return {
            sceneId: this.$route.params.id,
            sceneHtml: "",
            story: "",
            wordSet: new Set<string>(),
        };
    },
    async created() {
        // Get scene HTML.
        const htmlRes = await fetch(`/scenes/${this.sceneId}.html`);
        const html = await htmlRes.text();
        this.sceneHtml = html;

        // Get scene story.
        const storyRes = await fetch(`/scenes/${this.sceneId}.txt`);
        const story = await storyRes.text();
        this.story = story;

        // Listen for clicks no image map areas.
        this.$el.addEventListener("click", (event: MouseEvent) => {
            const t = event.target as HTMLElement;
            if (t.tagName === "AREA") {
                this.wordSet.add(t.title);
                event.preventDefault();
            }
        });
    },
});
</script>
