import { defineStore } from "pinia";
import { computed, ComputedRef, Ref, ref } from "vue";

export const useBlogStore = defineStore("blog", () => {
    const demoBlogPost: Ref<string> = ref<string>(
        "## 😲 md-editor-v3\n" +
            "\n" +
            "Markdown Editor for Vue3, developed in jsx and typescript, support different themes、beautify content by prettier.\n" +
            "\n" +
            "### 🤖 Base\n" +
            "\n" +
            "**bold**, <u>underline</u>, _italic_, ~~line-through~~, superscript<sup>26</sup>, subscript<sub>1</sub>, `inline code`, [link](https://imzbf.cc)\n" +
            "\n" +
            "> quote: I Have a Dream\n" +
            "\n" +
            "1. So even though we face the difficulties of today and tomorrow, I still have a dream.\n" +
            "2. It is a dream deeply rooted in the American dream.\n" +
            "3. I have a dream that one day this nation will rise up.\n" +
            "\n" +
            "- [ ] Friday\n" +
            "- [ ] Saturday\n" +
            "- [x] Sunday\n" +
            "\n" +
            "![Picture](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)\n" +
            "\n" +
            "## 🤗 Code\n" +
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
            "## 🖨 Text\n" +
            "\n" +
            "The Old Man and the Sea served to reinvigorate Hemingway's literary reputation and prompted a reexamination of his entire body of work.\n" +
            "\n" +
            "## 📈 Table\n" +
            "\n" +
            "| nickname | from             |\n" +
            "| -------- | ---------------- |\n" +
            "| zhijian  | ChongQing, China |\n" +
            "\n" +
            "## 📏 Formula\n" +
            "\n" +
            "Inline: $x+y^{2x}$\n" +
            "\n" +
            "$$\n" +
            "\\sqrt[3]{x}\n" +
            "$$\n" +
            "\n" +
            "## 🧬 Diagram\n" +
            "\n" +
            "```mermaid\n" +
            "flowchart TD\n" +
            "  Start --> Stop\n" +
            "```\n" +
            "\n" +
            "## 🪄 Alert\n" +
            "\n" +
            "!!! note Supported Types\n" +
            "\n" +
            "note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention\n" +
            "\n" +
            "!!!\n" +
            "\n" +
            "## ☘️ em...",
    );

    const fetchDemoBlog: ComputedRef<string> = computed<string>(() => {
        return demoBlogPost.value;
    });

    return { demoBlogPost, fetchDemoBlog };
});
