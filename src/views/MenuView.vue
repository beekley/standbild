<template>
    <div class="menu">
        <!-- New Game Button -->
        <p @click="newGame" class="bigButton">New Game</p>
        <!-- Saved games -->
        <div v-if="savedGamesArray.length > 0">
            <p @click="showSavedGames = !showSavedGames" class="bigButton">
                Load Game
            </p>
            <ul v-if="showSavedGames">
                <li v-for="savedGame in savedGamesArray" :key="savedGame.id">
                    <button @click="loadGame(savedGame.id, $event)">
                        {{ savedGame.id }}
                    </button>
                    <span>
                        {{ savedGame.chapters.size }} chapters started
                    </span>
                </li>
            </ul>
        </div>
        <!-- Chapters -->
        <div v-if="selectedSaveGame">
            <button
                v-for="chapterId in chapterIds"
                @click="openChapter(chapterId)"
            >
                {{ chapterId }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {
    loadAll,
    type SavedChapter,
    type SavedGame,
    save,
} from "@/SavedGame.js";
import router from "@/router";
import { defineComponent } from "vue";

export default defineComponent({
    name: "MenuView",
    data() {
        return {
            // TODO: make this list dynamic.
            chapterIds: ["goldenidol", "hotel"],
            selectedSavedGameId: "",
            savedGamesArray: loadAll(),
            showSavedGames: false,
        };
    },
    computed: {
        savedGames(): Map<string, SavedGame> {
            const map = new Map<string, SavedGame>();
            this.savedGamesArray.forEach((g) => map.set(g.id, g));
            return map;
        },
        selectedSaveGame(): SavedGame | undefined {
            if (this.selectedSavedGameId == "") return undefined;
            return this.savedGames.get(this.selectedSavedGameId);
        },
    },
    methods: {
        newGame(): void {
            const newGame: SavedGame = {
                id: new Date().toLocaleString("en-US"),
                chapters: new Map<string, SavedChapter>(),
            };
            save(newGame);
            // Vue caches the saved games even with a computed prop, so force refresh it.
            this.reloadSavedGames();
        },
        loadGame(savedGameId: string, event: MouseEvent): void {
            const button = event.target as HTMLButtonElement;
            this.selectedSavedGameId = savedGameId;
        },
        openChapter(chapterId: string): void {
            router.replace({
                path: `/chapter/${chapterId}`,
                query: { savedGameId: this.selectedSavedGameId },
            });
        },
        reloadSavedGames(): void {
            this.savedGamesArray = loadAll();
        },
    },
});
</script>

<style>
.bigButton {
    /* color */
}
.menu {
}
</style>
