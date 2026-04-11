import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-group-colors",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      // Ayarlardan girilen metni (Örn: "BEKCAN, #FFD700 | ARASTIRMACI, red") alıyoruz
      const settingString = settings.group_colors;
      if (!settingString) return;

      const colorList = settingString.split("|");
      let cssRules = "";

      colorList.forEach((item) => {
        const parts = item.split(",");
        
        if (parts.length >= 2) {
          // Boşlukları temizle
          const groupName = parts[0].trim(); 
          const color = parts[1].trim();

          // MİMARİ SİHİR: 'color-mix' motoru sayesinde, girilen rengin (hex, red, rgb fark etmez)
          // %30'luk saydam versiyonunu otomatik hesaplatıp parlama (glow) gölgesine veriyoruz.
          cssRules += `
            .directory .directory-table__row:has(.avatar-flair-${groupName}) {
              border-color: ${color} !important;
              box-shadow: 0 4px 15px color-mix(in srgb, ${color} 30%, transparent) !important;
            }

            .directory .directory-table__row:has(.avatar-flair-${groupName}):hover {
              box-shadow: 0 8px 25px color-mix(in srgb, ${color} 60%, transparent) !important;
            }
          `;
        }
      });

      // Oluşturulan CSS kodlarını sayfanın <head> kısmına enjekte ediyoruz
      if (cssRules !== "") {
        const style = document.createElement("style");
        style.type = "text/css";
        style.id = "bekcan-group-colors-style";
        style.innerHTML = cssRules;
        document.head.appendChild(style);
      }
    });
  }
};