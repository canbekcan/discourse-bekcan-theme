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
          let value = parts[1].trim();

          // MİMARİ SİHİR: Girilen değer bir resim linki mi yoksa renk mi kontrol ediyoruz
          const isImage = value.startsWith("http") || value.startsWith("/") || value.startsWith("url(");

          if (isImage) {
            // Eğer URL ile girilmediyse url() içine alıyoruz
            const imageUrl = value.startsWith("url(") ? value : `url('${value}')`;

            cssRules += `
              /* ==========================================
                 RESİM ÇERÇEVESİ (AVATAR FRAME) MİMARİSİ
                 ========================================== */
                 
              /* 1. KULLANICILAR (/u) SAYFASI */
              .directory .directory-table__row:has(.avatar-flair-${groupName}) .user-image {
                 position: relative !important;
              }
              .directory .directory-table__row:has(.avatar-flair-${groupName}) .user-image::after {
                 content: "" !important;
                 position: absolute !important;
                 /* Çerçevenin avatardan biraz daha geniş/dışarıda olması için -4px (resminize göre ayarlayabilirsiniz) */
                 inset: -6px !important; 
                 background-image: ${imageUrl} !important;
                 background-size: contain !important;
                 background-position: center !important;
                 background-repeat: no-repeat !important;
                 z-index: 10 !important;
                 pointer-events: none !important; /* Tıklamaları engellemesin diye hayalet yapıyoruz */
                 transition: transform 0.3s ease !important;
              }
              
              /* Hover Efekti (Çerçeve hafifçe döner/büyür) */
              .directory .directory-table__row:has(.avatar-flair-${groupName}):hover .user-image::after {
                 transform: scale(1.1) rotate(3deg) !important;
              }

              /* 2. ANASAYFA VE KONU İÇİ MİNİ AVATARLAR */
              .group-${groupName} {
                 position: relative !important;
                 display: inline-block !important;
              }
              .group-${groupName}::after {
                 content: "" !important;
                 position: absolute !important;
                 inset: -4px !important;
                 background-image: ${imageUrl} !important;
                 background-size: contain !important;
                 background-position: center !important;
                 background-repeat: no-repeat !important;
                 z-index: 10 !important;
                 pointer-events: none !important;
                 transition: transform 0.2s ease !important;
              }
              .group-${groupName}:hover::after {
                 transform: scale(1.15) !important;
              }
            `;
          } else {
            // ==========================================
            // KLASİK RENK / PARLAMA (GLOW) MİMARİSİ
            // ==========================================
            const color = value;
            cssRules += `
              .directory .directory-table__row:has(.avatar-flair-${groupName}) {
                border-color: ${color} !important;
                box-shadow: 0 4px 15px color-mix(in srgb, ${color} 30%, transparent) !important;
              }
              .directory .directory-table__row:has(.avatar-flair-${groupName}):hover {
                box-shadow: 0 8px 25px color-mix(in srgb, ${color} 60%, transparent) !important;
              }

              .group-${groupName} .avatar {
                box-shadow: 0 0 0 2px ${color}, 0 4px 8px color-mix(in srgb, ${color} 40%, transparent) !important;
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important; 
              }
              .group-${groupName}:hover .avatar {
                box-shadow: 0 0 0 2px ${color}, 0 6px 15px color-mix(in srgb, ${color} 80%, transparent) !important;
                transform: scale(1.15) !important;
                z-index: 5 !important;
              }
            `;
          }
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