<script lang="ts">
    import { derived, writable } from "svelte/store";
    import type { PageData } from "./$types";

    export let data: PageData;

    let selectedVersion = writable(data.versions?.at(0));

    let scores = derived(selectedVersion, ($selectedVersion) => {
        const names: string[] = [];
        return data.allScores
            .filter((e) => e.version === $selectedVersion)
            .filter((e) => {
                if (!names.includes(e.name)) {
                    names.push(e.name);
                    return true;
                }
                return false;
            });
    });
</script>

{#if data.allScores && scores && data.versions}
    <main>
        <div class="version-select">
            <ol>
                {#each data.versions as version}
                    <li
                        class={version === $selectedVersion
                            ? "selected-version"
                            : ""}
                    >
                        <button on:click={() => ($selectedVersion = version)}
                            class="select-button">{version}
                        </button>
                    </li>
                {/each}
            </ol>
        </div>
        <div class="leaderboard">
            <h1>Version: {$selectedVersion}</h1>
            <ol class="lb-list">
                {#each $scores as score, index}
                    <li class="lb-item">
                        <span class="position">{index + 1}º</span>
                        <spa class="name">{score.name}</spa>
                        <span class="score">{score.score}</span>
                    </li>
                {/each}
            </ol>
        </div>
    </main>
{/if}

<style>
    :global(body) {
        background-color: black;
    }

    main {
        display: grid;
        grid-template-columns: 2fr 10fr 2fr;
        grid-template-rows: 1fr;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 1rem);
        padding-top: 1rem;
    }

    .version-select {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .selected-version button {
        background-color: black;
        color: white;
        border: 5px solid orange;
    }

    .select-button {
        border: 5px ;
        background-color: white;
        font-weight: bolder;
        padding: 0.5rem;
        margin: 0.5rem 0;
        height: 2rem;
        border-radius: 999999px;
        border: 3px solid rgb(144, 94, 0);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .leaderboard {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .leaderboard h1{
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }

    .lb-list {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .lb-item {
        color: black;
        background-color: white;
        display: grid;
        text-align: center;
        grid-template-columns: 3fr 10fr 10fr;
        justify-content: center;
        align-items: center;
        width: 100%;
        border: 5px solid gray;
        border-radius: 10px;
        height: 2rem;
    }

    .lb-item:nth-child(odd) {
        border: 2px solid blue;
    }

    .lb-item:nth-child(even) {
        border: 2px solid red;
    }

    .position {
        font-weight: bold;
    }

    .name {
    }

    .score {
        font-weight: bolder;
    }
</style>
