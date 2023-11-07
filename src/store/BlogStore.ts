import { defineStore } from "pinia";
import { computed, ComputedRef, Ref, ref } from "vue";

export const useBlogStore = defineStore("blog", () => {
    const demoBlogPost: Ref<string> = ref<string>(
        "# 😲 Build your own blogs!\n" +
            "\n" +
            "Built using [markdown-editor-v3](https://imzbf.github.io/md-editor-v3/en-US/index), Vue 3, Vuetify 3,  TypeScript and Python.\n" +
            "\n" +
            "### 🤖 Markup Examples\n" +
            "\n" +
            "**bold**, <u>underline</u>, _italic_, ~~line-through~~, superscript<sup>26</sup>, subscript<sub>1</sub>, `inline code`, [link](https://imzbf.cc)\n" +
            "\n" +
            "### Quotes\n" +
            "\n" +
            "> Real G's move in silence like lasagna.\n" +
            "    - Lil Wayne\n" +
            "\n" +
            "### Numbered Lists\n" +
            "\n" +
            "1. You can write numbered lists!\n" +
            "2. This item isn't very useful.\n" +
            "3. Neither is this one!\n" +
            "\n" +
            "### Check Lists\n" +
            "\n" +
            "- [ ] Friday\n" +
            "- [ ] Saturday\n" +
            "- [x] Sunday\n" +
            "\n" +
            "\n" +
            "## 🤗 Code Highlighting & Prettier\n" +
            "\n" +
            "```vue\n" +
            "<template>\n" +
            '  <MdEditor v-model="text" />\n' +
            "</template>\n" +
            "\n" +
            "<script setup>\n" +
            "import { ref } from 'vue';\n" +
            "import { MdEditor } from 'md-editor-v3';\n" +
            "import 'md-editor-v3/lib/style.css';\n" +
            "\n" +
            "const text = ref('Hello Editor!');\n" +
            "</script>\n" +
            "```\n" +
            "\n" +
            "## 🖨 Plain Text\n" +
            "\n" +
            "A lot of a blog will be made up of just plain text, which you write just like you see here!\n" +
            "\n" +
            "## 📈 Tables!\n" +
            "\n" +
            "| Name | Age | DOB |\n" +
            "| - | - | - |\n" +
            "| MetalFace | 577 | July 6th, 1446 |\n" +
            "| cmyui | N/A | N/A |\n" +
            "\n" +
            "\n" +
            "\n" +
            "## 🧬 Mermaid.js Diagrams\n" +
            "\n" +
            "[Mermaid.js](https://mermaid.js.org/) support was added. This allows you to leverage the power of this library within this editor, to build really nice charts.\n" +
            "\n" +
            "```mermaid\n" +
            "flowchart TD\n" +
            "  Start --> Stop\n" +
            "```\n" +
            "\n" +
            "```mermaid\n" +
            "sequenceDiagram\n" +
            "  A->>B: hello!\n" +
            "  B-->>A: hi!\n" +
            "  A-)B: bye!\n" +
            "```\n" +
            "\n" +
            "```mermaid\n" +
            "pie title Pets adopted by volunteers\n" +
            '  "Dogs" : 386\n' +
            '  "Cats" : 85\n' +
            '  "Rats" : 15\n' +
            "```\n" +
            "\n" +
            "\n" +
            "\n" +
            "## 🪄 Alerts\n" +
            "\n" +
            "!!! note Supported Types\n" +
            "\n" +
            "note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention\n" +
            "\n" +
            "!!!",
    );

    const fetchDemoBlog: ComputedRef<string> = computed<string>(() => {
        return demoBlogPost.value;
    });

    return { demoBlogPost, fetchDemoBlog };
});
