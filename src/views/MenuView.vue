<template>
    <div class="container has-text-centered">
        <p class="title is-1 is-italic has-text-danger">Standbild</p>
        <p class="subtitle is-4 has-text-danger-dark">a mystery game</p>
        <div class="columns is-centered">
            <div class="column is-one-quarter">
                <!-- Main Menu -->
                <div v-if="state == State.Main">
                    <!-- New Game Button -->
                    <button
                        @click="newGame"
                        class="button is-fullwidth is-large is-dark m-2"
                    >
                        New Game
                    </button>
                    <!-- Saved games -->
                    <button
                        @click="state = State.LoadGame"
                        class="button is-fullwidth is-large is-dark m-2"
                        v-if="savedGamesArray.length > 0"
                    >
                        Load Game
                    </button>
                </div>
                <!-- Load Game Menu -->
                <ul v-if="state == State.LoadGame">
                    <li
                        v-for="savedGame in savedGamesArray"
                        :key="savedGame.id"
                    >
                        <button
                            @click="loadGame(savedGame.id)"
                            class="button is-text is-inverted"
                        >
                            {{ savedGame.id }}</button
                        ><br />
                        <span class="">
                            {{ savedGame.chapters.size }} chapters started
                        </span>
                    </li>
                </ul>
                <!-- Select Chapter Menu -->
                <div v-if="state == State.SelectChapter">
                    <button
                        v-for="chapterId in chapterIds"
                        @click="openChapter(chapterId)"
                        class="button is-fullwidth is-large is-dark m-2"
                    >
                        {{ chapterId }}
                    </button>
                </div>
            </div>
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

// TODO: use the router so the back button works.
enum State {
    Main,
    LoadGame,
    SelectChapter,
}

export default defineComponent({
    name: "MenuView",
    data() {
        return {
            // TODO: make this list dynamic.
            chapterIds: ["goldenidol", "hotel"],
            selectedSavedGameId: "",
            savedGamesArray: loadAll(),
            state: State.Main,
            // Add the enum as a variable so the template can use it.
            State,
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
            this.loadGame(newGame.id);
        },
        loadGame(savedGameId: string): void {
            this.selectedSavedGameId = savedGameId;
            this.state = State.SelectChapter;
        },
        openChapter(chapterId: string): void {
            router.push({
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
