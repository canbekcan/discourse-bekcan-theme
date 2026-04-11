import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-group-colors",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      const settingString = settings.group_colors;
      if (!settingString) return;

      const colorList = settingString.split("|");
      let cssRules = "";

      colorList.forEach((item) => {
        const parts = item.split(",");
        
        if (parts.length >= 2) {
          const groupName = parts[0].trim(); 
          const color = parts[1].trim();

          cssRules += `
            /* ==========================================
               1. KULLANICILAR (/u) SAYFASI EFEKTLERİ
               ========================================== */
            .directory .directory-table__row:has(.avatar-flair-${groupName}) {
              border-color: ${color} !important;
              box-shadow: 0 4px 15px color-mix(in srgb, ${color} 30%, transparent) !important;
            }

            .directory .directory-table__row:has(.avatar-flair-${groupName}):hover {
              box-shadow: 0 8px 25px color-mix(in srgb, ${color} 60%, transparent) !important;
            }

            /* ==========================================
               2. ANASAYFA VE KONU İÇİ MİNİ AVATARLAR
               ========================================== */
            .group-${groupName} .avatar {
              /* Her Discourse boyutunda (24px, 48px vs.) kusursuz çember kalmasını garantiler */
              border-radius: 50% !important; 
              
              /* 1px'lik ince renk çemberi ve dışa doğru yumuşak parlama */
              box-shadow: 0 0 0 1px ${color}, 0 4px 8px color-mix(in srgb, ${color} 30%, transparent) !important;
              transition: box-shadow 0.2s ease-in-out !important; 
            }
            
            /* Üzerine gelindiğinde avatar büyümez, sadece parlaması artar (Daha profesyonel UX) */
            .group-${groupName}:hover .avatar {
              box-shadow: 0 0 0 1px ${color}, 0 6px 15px color-mix(in srgb, ${color} 70%, transparent) !important;
              z-index: 5 !important;
            }
          `;
        }
      });

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