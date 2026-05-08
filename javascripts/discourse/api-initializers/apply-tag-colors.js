import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bekcan-tag-colors",
  initialize() {
    withPluginApi("1.3.0", (api) => {
      const tagColorsSetting = settings.tag_colors;
      if (!tagColorsSetting) return;

      // HATA DÜZELTMESİ: Gelen veri Array mi String mi kontrol et (Modern Discourse Uyumluluğu)
      let colorList = [];
      if (Array.isArray(tagColorsSetting)) {
        colorList = tagColorsSetting;
      } else if (typeof tagColorsSetting === "string") {
        colorList = tagColorsSetting.split("|");
      }

      if (colorList.length === 0) return;

      let cssRules = "";

      colorList.forEach((item) => {
        const parts = typeof item === "string" ? item.split(",") : [];
        
        if (parts.length >= 3) {
          const tagName = parts[0].trim().toLowerCase();
          const bgColor = parts[1].trim();
          const textColor = parts[2].trim();
          const icon = parts[3] ? parts[3].trim() : "";

          // 1. Ana Etiket Kuralları
          cssRules += `
            .discourse-tag.box[data-tag-name="${tagName}"],
            .discourse-tag.simple[data-tag-name="${tagName}"] {
              background-color: ${bgColor} !important;
              color: ${textColor} !important;
              border: 1px solid ${bgColor} !important;
              padding: 0.15em 0.45em !important;
              border-radius: 4px !important;
            }

            .discourse-tag.bullet[data-tag-name="${tagName}"]::before {
              background-color: ${bgColor} !important;
            }

            /* 2. Sidebar (Sol Menü) HTML Yapısına Uygun Renklendirme */
            li.sidebar-section-link-wrapper[data-tag-name="${tagName}"] .sidebar-section-link-content-text,
            li.sidebar-section-link-wrapper[data-tag-name="${tagName}"] .sidebar-section-link-prefix svg {
              color: ${bgColor} !important;
            }
          `;

          // 3. İkon Kuralları
          if (icon !== "") {
            cssRules += `
              .discourse-tag.box[data-tag-name="${tagName}"]::before,
              .discourse-tag.simple[data-tag-name="${tagName}"]::before {
                content: "${icon}";
                margin-right: 4px;
                font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
              }
              
              li.sidebar-section-link-wrapper[data-tag-name="${tagName}"] .sidebar-section-link-content-text::before {
                content: "${icon}";
                margin-right: 6px;
                font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
              }
              
              li.sidebar-section-link-wrapper[data-tag-name="${tagName}"] .sidebar-section-link-prefix {
                display: none !important;
              }
            `;
          }
        }
      });

      if (cssRules !== "") {
        // PERFORMANS DÜZELTMESİ: <style> etiketi zaten varsa üzerine yaz, yoksa yarat
        let style = document.getElementById("bekcan-tag-colors-style");
        if (!style) {
          style = document.createElement("style");
          style.type = "text/css";
          style.id = "bekcan-tag-colors-style";
          document.head.appendChild(style);
        }
        style.innerHTML = cssRules;
      }
    });
  }
};