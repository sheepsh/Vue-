import pathToRegexp from 'path-to-regexp';

export default {
data() {
return {
levelList: null
};
},
watch: {
$route() {
this.getBreadcrumb();
}
},
created() {
this.getBreadcrumb();
},
methods: {
getBreadcrumb() {
// only show routes with meta.title
let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
const first = matched[0];

if (!this.isDashboard(first)) {
matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
}

this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
},
isDashboard(route) {
const name = route && route.name;
if (!name) {
return false;
}
return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
},
pathCompile(path) {
// To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
const { params } = this.$route;
var toPath = pathToRegexp.compile(path);
return toPath(params);
},
handleLink(item) {
const { redirect, path } = item;
if (redirect) {
this.$router.push(redirect);
return;
}
this.$router.push(this.pathCompile(path));
}
}
};
