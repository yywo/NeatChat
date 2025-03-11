// 模型测试服务

import { showToast } from "../components/ui-lib";

// 测试结果接口
export interface ModelTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  error?: any;
  timeout?: boolean;
}

// 测试模型可用性
export async function testModel(
  model: string,
  apiKey: string,
  baseUrl: string = "https://api.openai.com",
  timeoutSeconds: number = 5,
): Promise<ModelTestResult> {
  const startTime = Date.now();

  try {
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeoutSeconds * 1000,
    );

    // 构建请求URL
    const url = `${baseUrl}/v1/chat/completions`;

    // 构建请求体
    const requestBody = {
      model: model,
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
      ],
      max_tokens: 1,
      stream: false,
    };

    // 发送请求
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    // 清除超时计时器
    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;

    // 检查响应
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: `测试失败: ${errorData.error?.message || response.statusText}`,
        responseTime,
        error: errorData,
        timeout: false,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: `测试成功! 响应时间: ${(responseTime / 1000).toFixed(2)}s`,
      responseTime,
      timeout: false,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const isTimeout = error.name === "AbortError";

    return {
      success: false,
      message: isTimeout ? "请求超时" : `测试出错: ${error.message}`,
      responseTime,
      error,
      timeout: isTimeout,
    };
  }
}

// 批量测试多个模型
export async function testModels(
  models: string[],
  apiKey: string,
  baseUrl: string = "https://api.openai.com",
  timeoutSeconds: number = 5,
  showStartToast: boolean = true,
): Promise<Record<string, ModelTestResult>> {
  const results: Record<string, ModelTestResult> = {};

  // 仅在showStartToast为true时显示开始测试的提示
  if (showStartToast) {
    showToast(`开始测试 ${models.length} 个模型...`);
  }

  // 逐个测试模型
  for (const model of models) {
    results[model] = await testModel(model, apiKey, baseUrl, timeoutSeconds);

    // 显示每个模型的测试结果
    if (results[model].success) {
      showToast(
        `${model}: 测试成功 (${(
          (results[model].responseTime || 0) / 1000
        ).toFixed(2)}s)`,
      );
    } else if (results[model].timeout) {
      showToast(`${model}: 超时`);
    } else {
      showToast(`${model}: 测试失败`);
    }
  }

  return results;
}
