<template>
  <div class="container">
    <video
      id="video"
      :poster="episode.thumbnail_path"
      @timeupdate="progress = Math.floor($event.target.currentTime)"
      crossOrigin="anonymous"
      controls
    ></video>
    <div class="card">
      <div class="card-text">
        <div class="card-title">{{ episode.title }}</div>
        <div class="description">{{ episode.description }}</div>
        <div>Hinzugefügt am {{ formatDate(episode.published_at) }}</div>
        <div style="height: 3rem">
          <span id="size">{{ Math.ceil(episode.size / 1048576) + "mb" }}</span>
          <a id="download-btn" :href="episode.video_path">
            <button>Download</button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Episode from "~/models/Episode";
import dateFormatting from "~/mixins/dateFormattingMixin";

export default {
  name: "watch",
  data: function() {
    return {
      videoId: this.$route.query.w,
      lastUpdate: undefined,
      progress: 0
    };
  },
  mixins: [dateFormatting],
  computed: {
    episode: function() {
      return Episode.find(this.videoId);
    }
  },
  methods: {
    updateDB(progress, timeout) {
      const videoId = this.videoId;

      function updateVuex(progress, synced) {
        Episode.update({
          where: videoId,
          data: { progress, synced }
        });
      }

      this.$axios.put(`/api/episodes/${this.videoId}/viewing_progress`,
          { progress },
          { timeout: timeout || 0 }
        ).then(() => updateVuex(progress, true))
        .catch(err => updateVuex(progress, false));
    }
  },
  mounted: function() {
    this.$nextTick(async function() {
      this.lastUpdate = this.episode.progress || 1;
      const response = await caches.match(this.episode.video_path);
      document.getElementById("video").src =
        (response === undefined
          ? this.episode.video_path
          : URL.createObjectURL(await response.blob())) +
        `#t=${this.episode.progress || 1}`;
    });
  },
  watch: {
    progress(progress) {
      if (Math.abs(this.lastUpdate - progress) > 10) {
        this.lastUpdate = progress;
        this.updateDB(progress);
      }
    }
  },
  destroyed() {
    document.getElementById("video").pause();
    this.updateDB(this.progress, 100);
  },
  validate({ query }) {
    return Episode.find(query.w) !== null;
  }
};
</script>

<style scoped>
@media only screen and (min-width: 1200px) {
  .container {
    display: grid;
    grid-template-columns: auto 30%;
    grid-column-gap: 1rem;
  }
}

.container {
  margin: 10px;
}

#video {
  width: 100%;
}

a button {
  cursor: pointer;
}

#download-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

#size {
  position: absolute;
  bottom: 1.3rem;
  right: 9rem;
}

.card {
  padding: 1rem;
  box-sizing: border-box;
}

.card-title {
  color: var(--heading-color);
  font-size: 1.5rem;
  font-weight: 300;
}

.description {
  margin: 0.3rem 0 0.3rem;
}
</style>
