<template>
    <section class="section">
        <div class="container">
            <div class="columns is-vcentered">
                <div class="column has-text-centered">
                    <h1 class="title">404 Página no encontrada</h1>
                    <p class="subtitle">Esta página no ha sido encontrada. Vuelve a inicio o inténtalo de nuevo.</p>

                    <o-button @click="back()" class="mr-2" variant="danger" outlined>Atrás</o-button>
                    <o-button tag="router-link" variant="primary" to="/">Inicio</o-button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ErrorNotFound",
    methods: {
        back() {
            this.$router.go(-1);
        }
    }
});
</script>