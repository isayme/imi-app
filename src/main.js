import { AutoComplete, Col, Input, InputGroup, Layout, message, Tooltip } from 'ant-design-vue';
import 'ant-design-vue/lib/message/style/css';
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const app = createApp(App)

app.use(AutoComplete)
app.use(Col)
app.use(Input)
app.use(Input.Password)
app.use(InputGroup)
app.use(Layout)
app.use(Layout.Header)
app.use(Layout.Content)
app.use(Layout.Footer)
app.use(Tooltip)

app.mount("#app");
app.config.globalProperties.$message = message
