<template>
    <div>
        <div id="content">
            <div class="showCol">
                <Show-card :show="show">
                    <div class="btn-container">
                        <button @click="subscribe" :class="[show.wantsPushNotifications ? 'Unsubscribe' : '']">
                            {{show.wantsPushNotifications ? "Subscribe" : "Unsubscribe"}}
                        </button>
                    </div>
                </Show-card>
            </div>
            <Episode-card v-for="episode in episodes" :episode="episode" :key="episode.id"/>
        </div>
        <Pagination :current-page=page :totalPages=totalPages v-on:changePage="page = $event"></Pagination>
    </div>
</template>

<script>
    import Show from "~/models/Show";

    import ShowCard from "~/components/show-card"
    import EpisodeCard from "~/components/episode-card";
    import Pagination from "~/components/pagination";

    export default {
        name: "show",
        components: {Pagination, ShowCard, EpisodeCard},
        data: function () {
            return {
                showID: this.$route.params.id,
                page: parseInt(this.$route.query.page) || 1,
                episodesPerPage: 10,
            }
        },
        computed: {
            show: function () {
                return Show.query().with('episodes').whereId(this.showID).first();
            },
            episodes: function () {
                const start = this.episodesPerPage * this.page;
                return this.show.episodes.slice(start, start + this.episodesPerPage);
            },
            totalPages: function () {
                return Math.floor(this.show.episodes.length / this.episodesPerPage);
            }
        },
        methods: {
            subscribe: function () {

            }
        },
        watch: {
            page: async function () {
                this.$router.push({
                    name: 'show-id',
                    query: {page: this.page},
                    params: {id: this.showID}
                });
            }
        },
        watchQuery(newQuery) {
            this.page = parseInt(newQuery.page) || 1;
        },
        validate ({params}) {
            return Show.find(params.id) !== null;
        }
    }
</script>

<style scoped lang="scss">
    @media only screen and (min-width: 992px) {
        #content {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 1fr;
            grid-gap: 10px;
            margin: 10px;
        }
    }

    @media only screen and (max-width: 992px) {
        .card {
            margin: .5rem;
        }
        .btn-container {
            height: 2.5rem;
        }
    }

    .showCol {
        grid-row: span 2;
    }

    .Unsubscribe {
        background-color: red;
    }

    .specials-btn {
        button {
            border-radius: 0 0 4px 4px;
        }

        margin-left: 0.5rem;
    }

    .btn-container {
        button {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
        }

        min-height: 3rem;
    }
</style>