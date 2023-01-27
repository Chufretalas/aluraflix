<script lang="ts">
    import "../reset.css";
    import "../app.css";

    import { inject } from "@vercel/analytics";

    inject();
</script>

<slot />
