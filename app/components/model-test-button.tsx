import { useState, useRef, useEffect } from "react";
import { IconButton } from "./button";
import { testModels, ModelTestResult } from "../utils/model-test";
import { useAccessStore } from "../store";
import { showToast } from "./ui-lib";
import Locale from "../locales";

export function ModelTestButton(props: {
  models: string[];
  onTestComplete?: (results: Record<string, ModelTestResult>) => void;
  onModelTested?: (modelId: string, result: ModelTestResult) => void;
  onTimeoutChange?: (timeout: number) => void;
  initialTimeout?: number;
}) {
  const [testing, setTesting] = useState(false);
  const [timeout, setTimeout] = useState(props.initialTimeout || 5);
  const accessStore = useAccessStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (props.onTimeoutChange) {
      props.onTimeoutChange(timeout);
    }
  }, [timeout, props.onTimeoutChange]);

  const handleTest = async () => {
    // 如果正在测试中，则停止测试
    if (testing) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setTesting(false);
      showToast("已停止测试");
      return;
    }

    // 检查是否有API密钥
    if (!accessStore.openaiApiKey) {
      showToast(Locale.Settings.Access.CustomModel.ApiKeyRequired);
      return;
    }

    setTesting(true);
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 获取要测试的模型列表
      const modelsToTest = props.models;

      if (modelsToTest.length === 0) {
        showToast(Locale.Settings.Access.CustomModel.NoModelsToTest);
        setTesting(false);
        return;
      }

      // 获取API基础URL
      const baseUrl = accessStore.openaiUrl || "https://api.openai.com";

      // 测试模型，传入超时时间（秒）、AbortSignal和单个模型测试回调
      const results = await testModels(
        modelsToTest,
        accessStore.openaiApiKey,
        baseUrl,
        timeout,
        true,
        abortControllerRef.current.signal,
        props.onModelTested,
      );

      // 调用回调函数
      if (
        props.onTestComplete &&
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        props.onTestComplete(results);
      }

      // 显示测试完成提示
      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        const successCount = Object.values(results).filter(
          (r) => r.success,
        ).length;
        showToast(
          `测试完成: ${successCount}/${modelsToTest.length} 个模型可用`,
        );
      }
    } catch (error) {
      // 忽略 AbortError
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("测试模型时出错:", error);
        showToast(
          `测试出错: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } finally {
      setTesting(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <select
        value={timeout}
        onChange={(e) => setTimeout(Number(e.target.value))}
        style={{
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "12px",
          height: "28px",
        }}
      >
        <option value="5">5秒</option>
        <option value="6">6秒</option>
        <option value="7">7秒</option>
        <option value="8">8秒</option>
        <option value="9">9秒</option>
        <option value="10">10秒</option>
      </select>
      <IconButton
        icon={undefined}
        text={testing ? "停止测试" : "全部测试"}
        onClick={handleTest}
        bordered
        disabled={false}
      />
    </div>
  );
}
