import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-group-card-backgrounds",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      // Discourse'un standart 'group-box' bileşenini genişletiyoruz (override)
      api.modifyClass("component:group-box", {
        pluginId: "bekcan-group-card-backgrounds",

        didInsertElement() {
          this._super(...arguments);
          this._extractAndApplyBackground();
        },

        _extractAndApplyBackground() {
          const group = this.group || this.get("group");
          
          // Grubun açıklaması yoksa işlemi durdur
          if (!group || !group.bio_cooked) return;

          // HTML verisini tarayıcı belleğinde sanal olarak oluştur (Güvenli Ayrıştırma)
          const parser = new DOMParser();
          const doc = parser.parseFromString(group.bio_cooked, "text/html");
          
          // Emojiler de bir <img> tagı olduğu için '.emoji' sınıfına sahip olmayan İLK resmi seçiyoruz
          const firstImage = doc.querySelector('img:not(.emoji)');

          if (firstImage && firstImage.src) {
            // Resmi karta CSS Custom Property (Değişken) olarak enjekte et
            this.element.style.setProperty("--custom-group-bg", `url('${firstImage.src}')`);
            
            // Karta özel bir class ekle ki CSS'te bunu yakalayabilelim
            this.element.classList.add("has-dynamic-bg");
          }
        }
      });
    });
  }
};