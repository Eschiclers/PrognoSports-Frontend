<template>
    <div id="communityDetails" class="box">
        <PrognoPageTitle class="mb-5" :name="communityName" />
        <loading v-if="isLoading" />

        <p v-if="!thereIsCommunity">La comunidad con nombre <i>{{ this.$route.params.community }}</i> no ha sido encontrada</p>
        <div v-else class="columns">
            <div class='column is-3'>
                <div class="card">
                    <div class="card-image">
                        <figure class="image">
                            <img :src="community.communityImage()" alt="Community logo">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">{{ community.name }}</p>
                                <p class="subtitle is-6">{{ community.description }}</p>
                            </div>
                        </div>

                        <div class="content">
                            <p class="card-text"><b>Fecha de creación: </b>{{ humanDateTime(community.created) }}</p>
                            <p class="card-text">
                                <b>Creador: </b>
                                <router-link :to="{name: 'user', params: { user: community.owner.id }}">
                                    {{ community.owner.username }}
                                </router-link>
                            </p>
                            <p v-if="community.open" class="card-text has-text-success">Comunidad abierta/pública</p>
                            <p v-else class="card-text has-text-danger">Comunidad cerrada/privada</p>

                            <o-field
                                v-if="!community.open && isUserInCommunity"
                                grouped
                                label="URL de Invitación:"
                                variant="rounded is-info">

                                <input class="input is-rounded is-small" type="text" :value="community.invitation">
                                <p class="control">
                                    <o-button class="button is-primary is-small is-rounded" @click="clickInvitation">Copiar</o-button>
                                </p>
                            </o-field>

                            <p class="card-text"><b>Usuarios apuntados: </b> {{ community.members_amount }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div v-if="!community.open && !isUserInCommunity" class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">Comunidad cerrada</p>
                                <p class="subtitle is-6">
                                    Esta comunidad tiene la privacidad cerrada y
                                    por lo tanto no puedes ver su lista de participantes si tú no eres miembro
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!members.length" class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">Comunidad sin participantes</p>
                                <p class="subtitle is-6">
                                    Esta comunidad no tiene participantes en este momento
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">Usuarios participando</p>
                            </div>
                        </div>

                        <div class="busqueda-ordenada">
                            <o-button label="Ordenar" variant="primary" aria-controls="opcionesOrdenado" @click="opcionesOrdenadoOpen = !opcionesOrdenadoOpen"/>

                            <o-field class="is-fullwidth">
                                <o-input v-model="searchInput" placeholder="Buscar miembro..." type="search" icon-pack="fas" icon="search"></o-input>
                            </o-field>
                        </div>

                        <o-collapse :open="opcionesOrdenadoOpen" class="mb-2">
                            <template #trigger>
                            </template>

                            <div class="box">
                                <o-field label="Orderar lista de miembros">
                                    <o-radio v-model='orderType' :native-value='0'>Por nombre de usuario</o-radio>
                                    <o-radio v-model='orderType' :native-value='1'>Por rango</o-radio>
                                    <o-radio v-model='orderType' :native-value='2'>Por conexión reciente</o-radio>
                                    <o-radio v-model='orderType' :native-value='3'>Por fecha de registro</o-radio>
                                </o-field>
                                <o-field>
                                    <o-switch v-model="orderAscendent">
                                        Orden {{ orderAscendent ? "ascendente" : "descendente" }}
                                    </o-switch>
                                </o-field>
                            </div>
                        </o-collapse>

                        <div class="mt-5 columns is-multiline is-4">
                            <div class="column is-half" v-for="cu in filteredMembers">
                                <div class="box">
                                    <article class="media">
                                        <div class="media-left">
                                            <figure class="image is-64x64">
                                                <img :src="cu.user.profileImage()" alt="User image">
                                            </figure>
                                        </div>
                                        <div class="media-content">
                                            <div class="content">
                                                <p class="is-flex is-justify-content-space-between">
                                                    <span>
                                                        <strong>
                                                            <router-link :to="{name: 'user', params: { user: cu.user.id }}">
                                                                {{ cu.user.username }}
                                                            </router-link>
                                                        </strong>
                                                        <small class="ml-2" :style="{ color : '#' + cu.user.rank.color }">{{ cu.user.rank.name }}</small>
                                                    </span>
                                                    <small>
                                                            <span class="icon-text" v-if="cu.user.last_activity">
                                                                <span class="icon">
                                                                    <i class="fas fa-clock"></i>
                                                                </span>
                                                                <span>
                                                                    <o-tooltip label="Última conexión">
                                                                        {{ dateDiff(cu.user.last_activity) }}
                                                                    </o-tooltip>
                                                                </span>
                                                            </span>
                                                    </small>
                                                </p>
                                                <p>{{ cu.user.bio }}</p>
                                                <p>
                                                    <span class="icon-text">
                                                        <span class="icon">
                                                            <i class="fas fa-calendar"></i>
                                                        </span>
                                                        <span>Se unió el {{ humanDateTime(cu.user.created) }}</span>
                                                    </span>
                                                </p>
                                            </div>

                                            <span class="icon-text" v-if="cu.can_kick_users">
                                                <span class="icon">
                                                    <i class="fas fa-ban"></i>
                                                </span>
                                                <span>Puede expulsar usuarios</span>
                                            </span>

                                            <span class="icon-text ml-1" v-if="cu.can_modify_permissions">
                                                <span class="icon">
                                                    <i class="fas fa-user-edit"></i>
                                                </span>
                                                <span>Puede modificar permisos</span>
                                            </span>

                                            <span class="icon-text" v-if="cu.can_recreate_invitation">
                                                <span class="icon">
                                                    <i class="fas fa-envelope"></i>
                                                </span>
                                                <span>Puede recrear invitaciones</span>
                                            </span>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {communityService, notificationService} from "@/_services";

import {Community} from "@/types/Community";
import {CommunityUser} from "@/types/CommunityUser";
import dayjs from "dayjs";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useDayjs} from "@/composables/useDayjs";
import {useClipboard} from "@/composables/clipboard";
import Loading from "@/components/lib/Loading.vue";

export default defineComponent({
    name: "OneCommunity",
    components: {
        Loading,
        PrognoPageTitle
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();
        const clipboard = useClipboard();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDateTime, clipboard };
    },
    data() {
        return {
            community: {} as Community,
            isLoading: true,
            thereIsCommunity: false,
            members: new Array<CommunityUser>(),
            isUserInCommunity: false,

            searchInput: '',
            orderType: 2,
            orderAscendent: false,
            opcionesOrdenadoOpen: false
        }
    },
    created() {
        let communityId = this.$route.params.community;

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            this.isUserInCommunity = community.user_is_member;
            communityService.getMembers(community).then(list => {
                this.members.push(...list);
            }).catch(() => {}); // Ignorar si no tiene permisos, simplemente no se rellena
        }).catch((reason) => {
            this.thereIsCommunity = false;
        }).finally(() => {
            this.isLoading = false;
        })
    },
    methods: {
        clickInvitation() {
            let invitation = "https://prognosports.com/invitation/" + this.community.name + "/" + this.community.invitation;
            this.clipboard.writeText(invitation).then(() => {
                notificationService.showNotification("Se te ha copiado la invitación al portapapeles");
            });
        },
    },
    computed: {
        communityName() {
            if (this.thereIsCommunity) {
                return this.community.name;
            } else {
                return "Comunidad no encontrada";
            }
        },
        filteredMembers(): Array<CommunityUser> {
            const sortUsername = (m1: CommunityUser, m2: CommunityUser) => (m1.user.username < m2.user.username ? -1 : 1);
            const sortRank = (m1: CommunityUser, m2: CommunityUser) => (m1.user.rank.name < m2.user.rank.name ? -1 : 1);
            const sortRegisterDate = (m1: CommunityUser, m2: CommunityUser) => (dayjs(m1.user.created).isBefore(m2.user.created) ? -1 : 1);

            const sortLastConnect = (m1: CommunityUser, m2: CommunityUser) => {
                if (m1.user.last_activity === undefined) return 1;
                if (m2.user.last_activity === undefined) return -1;
                const d1 = new Date(m1.user.last_activity);
                const d2 = new Date(m2.user.last_activity);
                return (d1 < d2 ? 10 : -10);
            }

            let pickedSort: (m1: CommunityUser, m2: CommunityUser) => (number);
            switch (this.orderType) {
                case 1: pickedSort = sortRank; break;
                case 2: pickedSort = sortLastConnect; break;
                case 3: pickedSort = sortRegisterDate; break;
                default: pickedSort = sortUsername;
            }
            let listaOrdenada = this.members.sort(pickedSort);

            if (this.orderAscendent) {
                listaOrdenada = listaOrdenada.reverse();
            }

            if (!this.searchInput.trim()) {
                return listaOrdenada;
            }

            const filtroLowerCase: string = this.searchInput.toLowerCase().trim();

            return listaOrdenada.filter((member) => {
                return (
                    member.user.username
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    (member.user.bio ?? "")
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    member.user.rank.name
                        .toLowerCase()
                        .includes(filtroLowerCase)
                );
            });
        }
    }
});
</script>