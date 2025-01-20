import stylelint from "stylelint";
import fs from "fs";
import path from "path";

import {
  __dirname,
  projectDirName,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
  projectReplacePaths,
} from "./paths.js";

const createRule = (ruleName, message, checkProp, checkValue, targetProp) => {
  const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: message,
  });

  return stylelint.createPlugin(ruleName, function (enabled) {
    return (root, result) => {
      if (!enabled) return;
      root.walkDecls(checkProp, (decl) => {
        if (decl.value === checkValue) {
          decl.parent.walkDecls(new RegExp(targetProp), (declChild) => {
            stylelint.utils.report({
              message: messages.expected,
              node: declChild,
              result,
              ruleName,
            });
          });
        }
      });
    };
  });
};

const createClassRule = (ruleName, message, checkType, checkValues) => {
  const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: message,
  });

  // checkValues가 배열인지 확인
  const values = Array.isArray(checkValues) ? checkValues : [];

  return stylelint.createPlugin(ruleName, function (enabled) {
    return (root, result) => {
      if (!enabled) return;
      root.walkRules((rule) => {
        rule.selectors.forEach((selector) => {
          const classNames = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
          classNames.forEach((className) => {
            className = className.slice(1); // Remove the leading dot
            // console.log(`Checking className: ${className}`); // 디버그 로그 추가
            values.forEach((checkValue) => {
              // console.log(`Against value: ${checkValue}`); // 디버그 로그 추가
              const message =
                checkType === "prefix"
                  ? `Class name should not start with "${checkValue}"`
                  : `Class name should not end with "${checkValue}"`;
              if (checkType === "prefix" && className.startsWith(checkValue)) {
                stylelint.utils.report({
                  message,
                  node: rule,
                  result,
                  ruleName,
                });
              } else if (
                checkType === "suffix" &&
                className.endsWith(checkValue)
              ) {
                stylelint.utils.report({
                  message,
                  node: rule,
                  result,
                  ruleName,
                });
              }
            });
          });
        });
      });
    };
  });
};

// scss 파일에서 HEX 코드를 찾아냄
const createHexColorRule = (ruleName, message) => {
  const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: message,
  });

  // HEX 코드 검출 정규식 확장
  const hexColorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;

  return stylelint.createPlugin(ruleName, function (enabled) {
    return (root, result) => {
      if (!enabled) return;
      const fileExt = path.extname(result.opts.from);
      if (fileExt !== ".scss") return; // SCSS 파일만 검사

      root.walkDecls((decl) => {
        // 속성 값 중 HEX 코드를 포함하는지 검사
        if (hexColorRegex.test(decl.value)) {
          const matches = decl.value.match(hexColorRegex);
          if (matches) {
            matches.forEach((match) => {
              stylelint.utils.report({
                message: `${messages.expected}: Found "${match}" in "${decl.prop}"`,
                node: decl,
                result,
                ruleName,
              });
            });
          }
        }
      });
    };
  });
};

const rulesConfigPath = path.resolve(__dirname, "stylelintRulesConfig.json");
const rulesConfig = JSON.parse(fs.readFileSync(rulesConfigPath, "utf8"));

const rules = rulesConfig.map((config) => {
  if (config.checkType) {
    return createClassRule(
      config.ruleName,
      config.message,
      config.checkType,
      config.checkValues,
    );
  } else if (config.checkValueRegex) {
    return createHexColorRule(config.ruleName, config.message);
  }
  return createRule(
    config.ruleName,
    config.message,
    config.checkProp,
    config.checkValue,
    config.targetProp,
  );
});

export default rules;
