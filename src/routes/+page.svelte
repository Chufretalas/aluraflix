<script lang="ts">
    import LinkButton from "$lib/LinkButton.svelte";
    import SectionCard from "$lib/SectionCard.svelte";
    import Title from "$lib/Title.svelte";

    let inputVideosSlug: number;
</script>

<header>
    <img src="/Logo.png" alt="aluraflix logo" class="logo-img" />
</header>
<main>
    <div class="intro-wrapper">
        <SectionCard>
            <Title>O que é o AluraFlix</Title>
            <p>
                O AluraFlix é uma API REST de vídeos fictícios criada como parte
                do Alura Challenge Back-End 1 e desenvolvido por mim, Marco
                Antonio (Chufretalas).
            </p>
        </SectionCard>
    </div>
    <div class="endpoints-wrapper">
        <SectionCard>
            <Title>Endpoints</Title>
            <p>Para interagir com API, use as URLs indicadas abaixo:</p>
            <div class="endpoints-list-wrapper">
                <ul class="endpoints-list__get">
                    <li class="endpoint-item">
                        <div class="endpoint-item__main">
                            <span>http://localhost:5173/videos</span>
                            <LinkButton url="http://localhost:5173/videos"
                                >Ir</LinkButton
                            >
                        </div>
                        <p>Retorna TODOS os filmes na base de dados</p>
                    </li>
                    <li class="endpoint-item">
                        <div class="endpoint-item__main">
                            <span>http://localhost:5173/videos/</span>
                            <input
                                type="number"
                                name="inputVideosSlug"
                                placeholder="2..."
                                id="inputVideoSlug"
                                bind:value={inputVideosSlug}
                            />
                            <LinkButton
                                url={`http://localhost:5173/videos/${inputVideosSlug}`}
                                >Ir</LinkButton
                            >
                        </div>
                        <p>{"Retorna o filme indicado pela id /video/<id>"}</p>
                    </li>
                </ul>
                <ul />
                <ul />
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
        margin-right: 40vw;
    }

    .endpoints-list-wrapper {
        display: flex;
        justify-content: center;
    }

    .endpoints-list__get {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .endpoint-item {
        width: 320px;
        box-shadow: 0 0 1px white;
        border-radius: 5px;
        padding: 3px;
    }

    .endpoint-item span {
        color: #f5ff9f;
    }

    .endpoint-item p {
        margin-top: 0.3rem;
        font-size: 0.85rem;
    }

    .endpoint-item__main {
        display: flex;
        justify-content: space-between;
    }

    #inputVideoSlug {
        background-color: #030012;
        border: 1px solid #f5ff9f;
        border-radius: 3px;
        width: 3rem;
        color: #f5ff9f;
        font-weight: bold;
    }
</style>
