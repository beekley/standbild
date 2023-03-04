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
    name: "Scene",
    props: {
        sceneId: {
            type: String,
            required: true,
        },
        chapterId: {
            type: String,
            required: true,
        },
    },
    emits: {
        clickedWord: String,
        clickedLink: String,
    },
    data() {
        return {
            sceneHtml: "",
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
                event.preventDefault();
                // Add word to library.
                if (t.title) this.$emit("clickedWord", t.title);
                // Follow link to next scene.
                else
                    this.$emit(
                        "clickedLink",
                        // Only get the last part of the URL.
                        t.href.substring(t.href.lastIndexOf("/") + 1)
                    );
            }
        });
    },
});
</script>
