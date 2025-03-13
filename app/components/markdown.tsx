import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeRaw from "rehype-raw";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, RefObject, useEffect, useMemo } from "react";
import { copyToClipboard, useWindowSize } from "../utils";
import mermaid from "mermaid";
import Locale from "../locales";
import LoadingIcon from "../icons/three-dots.svg";
import ReloadButtonIcon from "../icons/reload.svg";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { showImageModal, FullScreen, showToast } from "./ui-lib";
import {
  ArtifactsShareButton,
  HTMLPreview,
  HTMLPreviewHander,
} from "./artifacts";
import { useChatStore } from "../store";
import { IconButton } from "./button";

import { useAppConfig } from "../store/config";
import { FileAttachment } from "./file-attachment";

function Details(props: { children: React.ReactNode }) {
  return <details open>{props.children}</details>;
}
function Summary(props: { children: React.ReactNode }) {
  return <summary>{props.children}</summary>;
}

import clsx from "clsx";

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], { type: "image/svg+xml" });
    showImageModal(URL.createObjectURL(blob));
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className={clsx("no-dark", "mermaid")}
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const previewRef = useRef<HTMLPreviewHander>(null);
  const [mermaidCode, setMermaidCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const { height } = useWindowSize();
  const chatStore = useChatStore();
  const session = chatStore.currentSession();

  const renderArtifacts = useDebouncedCallback(() => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector("code.language-mermaid");
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
    const htmlDom = ref.current.querySelector("code.language-html");
    const refText = ref.current.querySelector("code")?.innerText;
    if (htmlDom) {
      setHtmlCode((htmlDom as HTMLElement).innerText);
    } else if (
      refText?.startsWith("<!DOCTYPE") ||
      refText?.startsWith("<svg") ||
      refText?.startsWith("<?xml")
    ) {
      setHtmlCode(refText);
    }
  }, 600);

  const config = useAppConfig();
  const enableArtifacts =
    session.mask?.enableArtifacts !== false && config.enableArtifacts;

  //Wrap the paragraph for plain-text
  useEffect(() => {
    if (ref.current) {
      const codeElements = ref.current.querySelectorAll(
        "code",
      ) as NodeListOf<HTMLElement>;
      const wrapLanguages = [
        "",
        "md",
        "markdown",
        "text",
        "txt",
        "plaintext",
        "tex",
        "latex",
      ];
      codeElements.forEach((codeElement) => {
        let languageClass = codeElement.className.match(/language-(\w+)/);
        let name = languageClass ? languageClass[1] : "";
        if (wrapLanguages.includes(name)) {
          codeElement.style.whiteSpace = "pre-wrap";
        }
      });
      setTimeout(renderArtifacts, 1);
    }
  }, []);

  return (
    <>
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              copyToClipboard(
                ref.current.querySelector("code")?.innerText ?? "",
              );
            }
          }}
        ></span>
        {props.children}
      </pre>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      {htmlCode.length > 0 && enableArtifacts && (
        <FullScreen className="no-dark html" right={70}>
          <ArtifactsShareButton
            style={{ position: "absolute", right: 20, top: 10 }}
            getCode={() => htmlCode}
          />
          <IconButton
            style={{ position: "absolute", right: 120, top: 10 }}
            bordered
            icon={<ReloadButtonIcon />}
            shadow
            onClick={() => previewRef.current?.reload()}
          />
          <HTMLPreview
            ref={previewRef}
            code={htmlCode}
            autoHeight={!document.fullscreenElement}
            height={!document.fullscreenElement ? 600 : height}
          />
        </FullScreen>
      )}
    </>
  );
}

function CustomCode(props: { children: any; className?: string }) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();
  const enableCodeFold =
    session.mask?.enableCodeFold !== false && config.enableCodeFold;

  const ref = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const codeHeight = ref.current.scrollHeight;
      setShowToggle(codeHeight > 400);
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.children]);

  const toggleCollapsed = () => {
    setCollapsed((collapsed) => !collapsed);
  };
  const renderShowMoreButton = () => {
    if (showToggle && enableCodeFold && collapsed) {
      return (
        <div
          className={clsx("show-hide-button", {
            collapsed,
            expanded: !collapsed,
          })}
        >
          <button onClick={toggleCollapsed}>{Locale.NewChat.More}</button>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <code
        className={clsx(props?.className)}
        ref={ref}
        style={{
          maxHeight: enableCodeFold && collapsed ? "400px" : "none",
          overflowY: "hidden",
        }}
      >
        {props.children}
      </code>

      {renderShowMoreButton()}
    </>
  );
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function tryWrapHtmlCode(text: string) {
  // try add wrap html code (fixed: html codeblock include 2 newline)
  // ignore embed codeblock
  if (text.includes("```")) {
    return text;
  }
  return text
    .replace(
      /([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g,
      (match, quoteStart, lang, newLine, doctype) => {
        return !quoteStart ? "\n```html\n" + doctype : match;
      },
    )
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, newLine, quoteEnd) => {
        return !quoteEnd ? bodyEnd + space + htmlEnd + "\n```\n" : match;
      },
    );
}

function formatThinkText(text: string): string {
  // 检查是否以 <think> 开头但没有结束标签
  if (text.startsWith("<think>") && !text.includes("</think>")) {
    // 获取 <think> 后的所有内容
    const thinkContent = text.slice("<think>".length);
    // 给每一行添加引用符号
    const quotedContent = thinkContent
      .split("\n")
      .map((line: string) => (line.trim() ? `> ${line}` : ">"))
      .join("\n");

    return `<details open>
<summary>${Locale.NewChat.Thinking} <span class="thinking-loader"></span></summary>

${quotedContent}

</details>`;
  }

  // 处理完整的 think 标签
  const pattern = /^<think>([\s\S]*?)<\/think>/;
  return text.replace(pattern, (match, thinkContent) => {
    // 给每一行添加引用符号
    const quotedContent = thinkContent
      .split("\n")
      .map((line: string) => (line.trim() ? `> ${line}` : ">"))
      .join("\n");

    return `<details open>
<summary>${Locale.NewChat.Think}</summary>

${quotedContent}

</details>`;
  });
}

function _MarkDownContent(props: { content: string }) {
  // 检测文件附件格式
  const detectFileAttachments = (content: string) => {
    const fileRegex =
      /文件名: (.+?)\n类型: (.+?)\n大小: (.+?) KB\n\n([\s\S]+?)(?=\n\n---|$)/g;
    let match;
    const files = [];

    while ((match = fileRegex.exec(content)) !== null) {
      files.push({
        fileName: match[1],
        fileType: match[2],
        fileSize: parseFloat(match[3]) * 1024, // 转换为字节
        content: match[4],
      });
    }

    return files;
  };

  // 替换文件内容为文件附件组件
  const replaceFileAttachments = (content: string) => {
    const files = detectFileAttachments(content);

    if (files.length === 0) {
      return content;
    }

    let newContent = content;

    // 使用更友好的链接文本
    files.forEach((file, index) => {
      // 创建一个安全的替换模式
      const fileMarker = `文件名: ${file.fileName}\n类型: ${
        file.fileType
      }\n大小: ${(file.fileSize / 1024).toFixed(2)} KB\n\n`;
      const replacement = `[📄 ${file.fileName}](file://${encodeURIComponent(
        file.fileName,
      )}?type=${encodeURIComponent(file.fileType)}&size=${file.fileSize})`;
      const startIndex = newContent.indexOf(fileMarker);

      if (startIndex >= 0) {
        // 找到文件内容的结束位置
        const contentStart = startIndex + fileMarker.length;
        let contentEnd = newContent.indexOf("\n\n---\n\n", contentStart);
        if (contentEnd < 0) contentEnd = newContent.length;

        // 使用特殊格式的 Markdown 链接，可以被 ReactMarkdown 正确处理
        newContent =
          newContent.substring(0, startIndex) +
          replacement +
          newContent.substring(contentEnd);
      }
    });

    return newContent;
  };

  const escapedContent = useMemo(() => {
    const processedContent = replaceFileAttachments(props.content);
    return tryWrapHtmlCode(formatThinkText(escapeBrackets(processedContent)));
  }, [props.content]);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeRaw,
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        // 添加自定义组件处理
        a: (aProps) => {
          const href = aProps.href || "";

          // 处理文件附件链接
          if (href.startsWith("file://")) {
            try {
              const url = new URL(href);
              const fileName = decodeURIComponent(url.pathname.substring(2)); // 去掉 '//'
              const fileType = url.searchParams.get("type") || "未知类型";
              const fileSize = parseFloat(url.searchParams.get("size") || "0");

              // 忽略链接文本，直接使用 FileAttachment 组件
              return (
                <FileAttachment
                  fileName={fileName}
                  fileType={fileType}
                  fileSize={fileSize}
                  onClick={() => {
                    try {
                      // 点击时显示文件内容
                      showToast("文件内容已复制到剪贴板");
                      // 使用更安全的方式查找文件内容
                      const fileMarker = `文件名: ${fileName}\n类型: ${fileType}\n大小: ${(
                        fileSize / 1024
                      ).toFixed(2)} KB\n\n`;
                      const startIndex = props.content.indexOf(fileMarker);

                      if (startIndex >= 0) {
                        const contentStart =
                          props.content.indexOf("\n\n", startIndex) + 2;
                        let contentEnd = props.content.indexOf(
                          "\n\n---\n\n",
                          contentStart,
                        );
                        if (contentEnd < 0) contentEnd = props.content.length;

                        const fileContent = props.content.substring(
                          contentStart,
                          contentEnd,
                        );
                        copyToClipboard(fileContent);
                      } else {
                        copyToClipboard("无法找到文件内容");
                      }
                    } catch (error) {
                      console.error("复制文件内容时出错:", error);
                      showToast("复制文件内容失败");
                    }
                  }}
                />
              );
            } catch (error) {
              console.error("解析文件附件链接出错:", error);
              return <span>文件附件加载失败</span>;
            }
          }

          // 处理音频链接
          if (/\.(aac|mp3|opus|wav)$/.test(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }

          // 处理视频链接
          if (/\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }

          // 处理普通链接
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
        pre: PreCode,
        code: CustomCode,
        p: (pProps) => <p {...pProps} dir="auto" />,
        details: Details,
        summary: Summary,
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    fontFamily?: string;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastContentRef = useRef(props.content);
  const lastScrollTopRef = useRef(0);

  // 检测是否滚动到底部
  const checkIfAtBottom = (target: HTMLDivElement) => {
    const threshold = 20;
    const bottomPosition =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    return bottomPosition <= threshold;
  };

  // 处理滚动事件
  useEffect(() => {
    const parent = props.parentRef?.current;
    if (!parent) return;

    const handleScroll = () => {
      lastScrollTopRef.current = parent.scrollTop;
      const isAtBottom = checkIfAtBottom(parent);
      setAutoScroll(isAtBottom);
    };

    parent.addEventListener("scroll", handleScroll);
    return () => parent.removeEventListener("scroll", handleScroll);
  }, [props.parentRef]);

  // 自动滚动效果
  useEffect(() => {
    const parent = props.parentRef?.current;
    if (!parent || props.content === lastContentRef.current) return;

    // 只有当之前开启了自动滚动，且内容发生变化时才滚动
    if (autoScroll) {
      parent.scrollTop = parent.scrollHeight;
    }

    lastContentRef.current = props.content;
  }, [props.content, props.parentRef, autoScroll]);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        fontFamily: props.fontFamily || "inherit",
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      {props.loading ? (
        <LoadingIcon />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
