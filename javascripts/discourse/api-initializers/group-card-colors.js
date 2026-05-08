import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-group-colors",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      const groupColorsSetting = settings.group_colors;
      if (!groupColorsSetting) return;

      // HATA DÜZELTMESİ: Type Check
      let colorList = [];
      if (Array.isArray(groupColorsSetting)) {
        colorList = groupColorsSetting;
      } else if (typeof groupColorsSetting === "string") {
        colorList = groupColorsSetting.split("|");
      }

      if (colorList.length === 0) return;

      let cssRules = "";

      colorList.forEach((item) => {
        const parts = typeof item === "string" ? item.split(",") : [];
        
        if (parts.length >= 2) {
          const groupName = parts[0].trim(); 
          const color = parts[1].trim();

          cssRules += `
            /* 1. KULLANICILAR (/u) SAYFASI EFEKTLERİ */
            .directory .directory-table__row:has(.avatar-flair-${groupName}) {
              border-color: ${color} !important;
              box-shadow: 0 4px 15px color-mix(in srgb, ${color} 30%, transparent) !important;
            }

            .directory .directory-table__row:has(.avatar-flair-${groupName}):hover {
              border-color: ${color} !important;
              box-shadow: 0 8px 25px color-mix(in srgb, ${color} 60%, transparent) !important;
            }

            /* 2. ANASAYFA VE KONU İÇİ MİNİ AVATARLAR */
            .group-${groupName} .avatar {
              border-radius: 50% !important; 
              box-shadow: 0 0 0 1px ${color}, 0 4px 8px color-mix(in srgb, ${color} 30%, transparent) !important;
              transition: box-shadow 0.2s ease-in-out !important; 
            }
            
            .group-${groupName}:hover .avatar {
              box-shadow: 0 0 0 1px ${color}, 0 6px 15px color-mix(in srgb, ${color} 70%, transparent) !important;
              z-index: 5 !important;
            }
          `;
        }
      });

      if (cssRules !== "") {
        // PERFORMANS DÜZELTMESİ: Memory leak engelleme
        let style = document.getElementById("bekcan-group-colors-style");
        if (!style) {
          style = document.createElement("style");
          style.type = "text/css";
          style.id = "bekcan-group-colors-style";
          document.head.appendChild(style);
        }
        style.innerHTML = cssRules;
      }
    });
  }
};