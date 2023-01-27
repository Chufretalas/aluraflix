<script lang="ts">
    export let url: string
</script>

<a href="{url}" target="_blank" rel="noreferrer"><slot/></a>

<style>
    a {
        color: white;
        font-weight: bold;
        background-color: #216bc5;
        padding: 0.1rem 0.8rem;
        border-radius: 5px;
    }
</style>