import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-group-colors",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      // Ayarlardan girilen metni okuyoruz
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
            /* a.group-BEKCAN gibi sınıfların içindeki resmi hedefliyoruz */
            .group-${groupName} .avatar {
              /* MİMARİ HACK: Resmi ezmeden 2px'lik sahte bir çerçeve (inset/outset gölge) ve dış parlama veriyoruz */
              box-shadow: 0 0 0 2px ${color}, 0 4px 8px color-mix(in srgb, ${color} 40%, transparent) !important;
              transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important; 
            }
            
            /* Üzerine gelindiğinde avatar hafifçe büyüsün ve parlaması artsın */
            .group-${groupName}:hover .avatar {
              box-shadow: 0 0 0 2px ${color}, 0 6px 15px color-mix(in srgb, ${color} 80%, transparent) !important;
              transform: scale(1.15) !important;
              z-index: 5 !important;
            }
          `;
        }
      });

      // Oluşturulan dinamik CSS'i sisteme enjekte ediyoruz
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