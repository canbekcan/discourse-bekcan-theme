import { withPluginApi } from "discourse/lib/plugin-api";
import Component from "@glimmer/component";
import { modifier } from "ember-modifier";

// 1. Arka planı uygulayan Modifier (Hata yakalama eklendi)
const applyDynamicBackground = modifier((element, [group]) => {
  if (!group || !group.bio_cooked) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(group.bio_cooked, "text/html");
    const firstImage = doc.querySelector("img:not(.emoji)");

    if (firstImage && firstImage.src) {
      // Ana kartı bul
      const groupBox = element.closest(".group-box");
      
      if (groupBox) {
        groupBox.style.setProperty("--custom-group-bg", `url('${firstImage.src}')`);
        groupBox.classList.add("has-dynamic-bg");
      }
    }
  } catch (error) {
    console.error("Bekcan Theme: Grup arkaplanı uygulanırken hata oluştu", error);
  }
});

// 2. Özel Component Sınıfı (Derleyici hatalarını önler)
class GroupBackgroundComponent extends Component {
  <template>
    <div 
      {{applyDynamicBackground @outletArgs.group}} 
      class="bekcan-bg-applier" 
      style="display: none;">
    </div>
  </template>
}

// 3. Eklenti Başlatıcı
export default {
  name: "bekcan-group-card-backgrounds",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      // Component sınıfını güvenli bir şekilde Outlet'e aktarıyoruz
      api.renderInOutlet("group-box-above-name", GroupBackgroundComponent);
    });
  }
};