/**
 * 文件上传和处理工具
 */

/**
 * 读取文件为文本
 * @param file 要读取的文件
 * @returns 文件内容的Promise
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  name: string;
  type: string;
  size: number;
  content: string;
  originalFile: File;
}

/**
 * 上传并处理多个文本文件
 * @param onStart 开始上传时的回调
 * @param onSuccess 上传成功的回调，接收文件信息对象数组
 * @param onError 上传失败的回调
 * @param onFinish 上传完成的回调（无论成功失败）
 */
export function uploadMultipleTextFiles(
  onStart: () => void,
  onSuccess: (fileInfos: FileInfo[]) => void,
  onError: (error: any) => void,
  onFinish: () => void,
): void {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,.md,.js,.py,.html,.css,.json,.csv,.xml,.log"; // 可接受的文件类型
  fileInput.multiple = true; // 允许多文件选择

  fileInput.onchange = async (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      onFinish();
      return;
    }

    onStart();
    try {
      const fileInfos: FileInfo[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const text = await readFileAsText(file);
          // 限制文件大小，防止过大
          const maxLength = 100000;
          const truncatedText =
            text.length > maxLength
              ? text.substring(0, maxLength) +
                `\n\n[文件过大，已截断。原文件大小: ${text.length} 字符]`
              : text;

          // 构建文件信息对象
          fileInfos.push({
            name: file.name,
            type: file.type || "文本文件",
            size: file.size,
            content: truncatedText,
            originalFile: file,
          });
        } catch (error) {
          console.error(`读取文件 ${file.name} 失败:`, error);
        }
      }

      if (fileInfos.length > 0) {
        onSuccess(fileInfos);
      } else {
        onError(new Error("没有成功读取任何文件"));
      }
    } catch (error) {
      console.error("处理文件失败:", error);
      onError(error);
    } finally {
      onFinish();
    }
  };

  fileInput.click();
}

/**
 * 上传并处理单个文本文件
 */
export function uploadTextFile(
  onStart: () => void,
  onSuccess: (fileInfo: FileInfo) => void,
  onError: (error: any) => void,
  onFinish: () => void,
): void {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,.md,.js,.py,.html,.css,.json,.csv,.xml,.log";

  fileInput.onchange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      onFinish();
      return;
    }

    onStart();
    try {
      const text = await readFileAsText(file);
      const maxLength = 5000;
      const truncatedText =
        text.length > maxLength
          ? text.substring(0, maxLength) +
            `\n\n[文件过大，已截断。原文件大小: ${text.length} 字符]`
          : text;

      onSuccess({
        name: file.name,
        type: file.type || "文本文件",
        size: file.size,
        content: truncatedText,
        originalFile: file,
      });
    } catch (error) {
      console.error("读取文件失败:", error);
      onError(error);
    } finally {
      onFinish();
    }
  };

  fileInput.click();
}

/**
 * 获取文件图标
 * 根据文件类型返回对应的图标类名
 */
export function getFileIconClass(fileType: string): string {
  const type = fileType.toLowerCase();

  if (type.includes("text/plain")) return "file-text";
  if (type.includes("text/html") || type.includes("html")) return "file-html";
  if (type.includes("javascript") || type.includes("js")) return "file-js";
  if (type.includes("css")) return "file-css";
  if (type.includes("json")) return "file-json";
  if (type.includes("markdown") || type.includes("md")) return "file-md";
  if (type.includes("python") || type.includes("py")) return "file-py";
  if (type.includes("csv")) return "file-csv";
  if (type.includes("xml")) return "file-xml";

  return "file-document";
}
