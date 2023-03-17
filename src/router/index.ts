import { createRouter, createWebHistory } from "vue-router";
import ChapterView from "@/views/ChapterView.vue";
import MenuView from "@/views/MenuView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: MenuView,
        },
        {
            path: "/chapter/:chapterId",
            name: "chapter - main",
            component: ChapterView,
        },
        {
            path: "/chapter/:chapterId/:sceneId",
            name: "chapter",
            component: ChapterView,
        },
    ],
});

export default router;
