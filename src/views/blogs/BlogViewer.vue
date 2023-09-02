<script setup lang="ts">
import BlogServices from "@/services/BlogServices";
import MarkdownEditor from "@/components/blogs/MarkdownEditor.vue";
import { reactive, Ref, ref, onMounted, computed } from "vue";
import { Router, useRouter } from "vue-router";
import { useTheme, ThemeInstance } from "vuetify";
import { MdPreview } from "md-editor-v3";

const router: Router = useRouter();
const theme: ThemeInstance = useTheme();

interface Blog {
    blogPostTitle: Ref<string>;
    blogPostBody: Ref<string>;
}

interface Props {
    blogId?: string;
    readonly?: string;
}

const blog = reactive<Blog>({
    blogPostTitle: ref<string>(""),
    blogPostBody: ref<string>(""),
});

const darkState = computed<string>(() => {
    return theme.global.name.value;
});
const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});

const props = withDefaults(defineProps<Props>(), {
    blogId: "",
    readonly: "true",
});

async function fetchBlogById() {
    BlogServices.fetchBlogById(props.blogId)
        .then((res) => {
            console.log(res);
            blog.blogPostTitle = res.data.data.blog_title;
            blog.blogPostBody = res.data.data.blog_post;
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(async () => {
    if (!props.blogId) return;
    await fetchBlogById();
});
</script>

<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-card :color="isDark ? 'black' : 'white'" variant="elevated" width="100%">
                <MdPreview
                    class="editor"
                    id="mdEditor"
                    :modelValue="blog.blogPostBody"
                    :theme="isDark ? 'dark' : 'light'" />
                <v-card-actions class="ma-0 pa-0">
                    <v-btn
                        @click="router.push({ name: 'BlogPosts' })"
                        :color="isDark ? 'accent' : 'black'"
                        block
                        variant="elevated"
                        rounded="1"
                        size="x-large">
                        Go Back
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.editor {
    font-family: "Prata", "serif";
}
h1 {
}
</style>
