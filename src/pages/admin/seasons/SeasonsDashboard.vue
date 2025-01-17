<template>
    <div id="seasonList" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de temporadas"/>

        <div class="block">
            <o-button variant="link" :to="{name: 'seasonCreate'}" tag="router-link">Nueva temporada</o-button>
        </div>

        <o-field>
            <o-input
                v-model="filtroSeason"
                placeholder="Buscar temporada"
                type="search"
                icon-pack="fas"
                icon="search"
            ></o-input>
        </o-field>

        <div class="block">
            <o-switch v-model="isPaginated">Paginated</o-switch>
        </div>

        <o-table :data="filteredSeasons"
                 hoverable striped
                 :paginated="isPaginated"
                 per-page="15">

            <o-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
                {{ props.row.id }}
            </o-table-column>

            <o-table-column field="competition.name" label="Competición" sortable v-slot="props">
                {{ props.row.competition.name }}
            </o-table-column>

            <o-table-column field="name" label="Name" sortable v-slot="props">
                {{ props.row.name }}
            </o-table-column>

            <o-table-column field="totalEvents" label="Total Events" sortable numeric v-slot="props">
                {{ props.row.totalEvents }}
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-warning" :to="'/admin/seasons/' + props.row.id">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteSeason(props.row)">Eliminar</span>
                    </span>
            </o-table-column>

        </o-table>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {notificationService, seasonService} from "@/_services";
import {Season} from "@/types/Season";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useProgrammatic} from "@oruga-ui/oruga-next";

export default defineComponent({
    name: "SeasonsDashboard",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();
        const oruga = useProgrammatic().oruga;

        const currentUser = authStore.loggedUser;
        return { currentUser, oruga };
    },
    data() {
        return {
            isPaginated: true,
            filtroSeason: '',

            seasons: new Array<Season>()
        }
    },
    mounted() {
        seasonService.getSeasonList().then((seasons) => {
            this.seasons = [];
            this.seasons.push(...seasons);
        })
    },
    computed: {
        filteredSeasons(): Array<Season> {
            if (!this.filtroSeason.trim()) {
                return this.seasons;
            }

            const filtroLowerCase: string = this.filtroSeason.toLowerCase().trim();

            return this.seasons.filter((season) => {
                return (
                    season.id
                        .toString()
                        .includes(filtroLowerCase) ||
                    season.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    season.competition.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    season.competition.code
                        .toLowerCase()
                        .includes(filtroLowerCase)
                );
            });
        }
    },
    methods: {
        confirmDeleteSeason(season: Season) {
            this.oruga.dialog.confirm({
                title: 'Eliminar temporada',
                message: `¿Estás seguro de que quieres <b>eliminar</b> la temporada ${season.name} (#${season.id})? <br/>Esta acción se puede deshacer.`,
                confirmText: 'Eliminar temporada',
                type: 'danger',
                hasIcon: true,
                onConfirm: () => this.deleteSeason(season),
            })
        },
        deleteSeason(season: Season) {
            seasonService.deleteSeason(season).then((ok) => {

                // Elimino de la lista y por lo tanto de la tabla
                this.seasons.splice(this.seasons.findIndex(s => s.id === season.id),1);

                notificationService.showNotification(`Se ha eliminado correctamente la temporada ${season.name} (#${season.id})`, "danger");
            }).catch((error) => {
                notificationService.showNotification(error.message, "danger");
            });
        }
    },
});
</script>