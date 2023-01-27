<script lang="ts">
    import LinkButton from "$lib/LinkButton.svelte";
    import SectionCard from "$lib/SectionCard.svelte";
    import Title from "$lib/Title.svelte";
    import type IEndpointData from "$lib/interfaces/i_endpoint_data";
    import endpoints from "./endpoints.json";

    endpoints as IEndpointData[][];
</script>

<header>
    <img src="/Logo.png" alt="aluraflix logo" class="logo-img" />
</header>
<main>
    <div class="intro-wrapper">
        <SectionCard>
            <div class="intro-content">
                <Title>O que é o AluraFlix</Title>
                <p>
                    O AluraFlix é uma API REST de vídeos criada como parte do
                    Alura Challenge Back-End 1 e desenvolvido por mim, Marco
                    Antonio (Chufretalas).
                </p>
                <LinkButton url="https://github.com/Chufretalas/aluraflix"
                    >Github</LinkButton
                >
            </div>
        </SectionCard>
    </div>
    <div class="endpoints-wrapper">
        <SectionCard>
            <Title>Endpoints</Title>
            <p id="login-warning">
                Para utilizar qualquer endpoint, excluindo os de autenticação e
                /api/videos/free, é necessário fazer login para gerar um token
                JWT
            </p>
            <div class="endpoints-list-wrapper">
                {#each endpoints as endpointGroup}
                    <ul class="endpoints-list__column">
                        {#each endpointGroup as endpoint (endpoint.url)}
                            <li class="endpoint-item">
                                <div class="endpoint-item__main">
                                    <span>{endpoint.url}</span>
                                </div>
                                <p>{endpoint.description}</p>
                                {#if endpoint.params}
                                    <h4 class="search-params__title">
                                        Search params:
                                    </h4>
                                    <ul class="search-params__list">
                                        {#each endpoint.params as param (param.url)}
                                            <li class="search-params__item">
                                                <span>{param.url}</span>
                                                <p>{param.description}</p>
                                            </li>
                                        {/each}
                                    </ul>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/each}
            </div>
        </SectionCard>
    </div>
</main>

<style>
    header {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 0.5rem 0;
    }

    .logo-img {
        max-width: 35%;
        max-height: 15vh;
    }

    main {
        width: 80%;
        margin: 6vh auto 0 auto;
        display: flex;
        flex-direction: column;
        row-gap: 8vh;
    }

    .intro-wrapper {
        margin: 0 15vw;
    }

    .intro-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
    }

    #login-warning {
        color: rgb(249, 99, 99);
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .endpoints-list-wrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        column-gap: 15px;
    }

    .endpoints-list__column {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        margin: 1rem 0;
    }

    .endpoint-item {
        width: 320px;
        box-shadow: 0 0 3px white;
        border-radius: 5px;
        padding: 3px;
    }

    .endpoint-item span {
        color: #f5ff9f;
    }

    .endpoint-item p {
        margin-top: 0.3rem;
        font-size: 0.95rem;
    }

    .endpoint-item__main {
        display: flex;
        justify-content: space-between;
    }

    .search-params__title {
        margin-top: 1rem;
        margin-bottom: 0.2rem;
        font-weight: bold;
        color: rgb(233, 176, 71);
    }

    .search-params__item {
        margin-bottom: 0.6rem;
    }
</style>
