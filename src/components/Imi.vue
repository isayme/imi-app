<template>
  <a-row type="flex" justify="center">
    <a-col type="flex" :span="12" :xs="22" :sm="18" :lg="12">
      <a-input-password
        size="large"
        placeholder="old password"
        v-model:value="oldpassword"
        autoFocus
      >
      </a-input-password>

      <a-auto-complete
        size="large"
        placeholder="salt domain"
        v-model:value="salt"
        :options="saltOptions"
        :filter-option="filterSaltOption"
      />

      <a-input-group>
        <a-input-password
          size="large"
          placeholder="new password"
          v-model:value="newpassword"
        >
          <template #addonAfter>
            <a-tooltip title="复制密码">
              <copy-outlined @click="doCopy"></copy-outlined>
            </a-tooltip>
          </template>
        </a-input-password>
      </a-input-group>
    </a-col>
  </a-row>
</template>

<script>
import { CopyOutlined } from "@ant-design/icons-vue";
import { writeText } from "@tauri-apps/api/clipboard";
import md5 from "blueimp-md5";

const MAX_SALT_HISTORY_COUNT = 4;
const LS_SALT_HISTORY_KEY = "saltHistory";

function generate(password, salt) {
  if (!password || !salt) {
    return;
  }

  const md5one = md5(password, salt);
  const md5two = md5(md5one, "isayme");
  const md5three = md5(md5one, "heaven");

  const rule = md5three.split("");
  const source = md5two.split("");

  let str = "";
  for (let i = 0; i <= 31; i++) {
    if (isNaN(source[i])) {
      str = "zsedcftgbhujmko13579";
      if (str.search(rule[i]) > -1) {
        source[i] = source[i].toUpperCase();
      }
    }
  }
  const code32 = source.join("");
  const code1 = code32.slice(0, 1);

  if (isNaN(code1)) {
    return code32.slice(0, 16);
  } else {
    return "H" + code32.slice(1, 16);
  }
}

export default {
  data() {
    return {
      oldpassword: "",
      saltOptions: [],
      salt: "",
    };
  },
  components: {
    CopyOutlined,
  },
  mounted: function () {
    const saltHistory = localStorage.getItem(LS_SALT_HISTORY_KEY);
    if (!!saltHistory) {
      try {
        this.saltOptions = JSON.parse(saltHistory);
        if (this.saltOptions.length > 0) {
          this.salt = this.saltOptions[0].value;
        }
      } catch (e) {
        // do nothing
      }
    }
  },
  methods: {
    doCopy: function () {
      if (!this.newpassword) {
        this.$message.warn("复制失败: 新密码为空");
        return;
      }

      writeText(this.newpassword).then(
        () => {
          this.addSaltOption(this.salt);
          this.$message.success("复制成功");
        },
        (err) => {
          this.$message.error(`复制失败: ${err}`);
        }
      );
    },
    filterSaltOption: function (input, option) {
      return option.value.indexOf(input) >= 0;
    },
    addSaltOption: function (value) {
      let saltOptions = this.saltOptions.filter((option) => {
        return option.value !== value;
      });
      saltOptions.unshift({ value });
      if (saltOptions.length > MAX_SALT_HISTORY_COUNT) {
        saltOptions = saltOptions.slice(0, MAX_SALT_HISTORY_COUNT);
      }

      this.saltOptions = saltOptions;
      localStorage.setItem(
        LS_SALT_HISTORY_KEY,
        JSON.stringify(this.saltOptions)
      );
    },
  },
  computed: {
    newpassword() {
      return generate(this.oldpassword, this.salt);
    },
  },
};
</script>

<style scoped>
span,
.ant-select {
  width: 100%;
  text-align: left;
  margin: 0.67em auto;
}
</style>