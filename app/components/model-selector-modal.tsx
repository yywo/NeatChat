import { useState, useEffect, useMemo } from "react";
import { Modal, List, ListItem, showToast } from "./ui-lib";
import { IconButton } from "./button";
import LoadingIcon from "../icons/three-dots.svg";
import ConfirmIcon from "../icons/confirm.svg";
import CancelIcon from "../icons/cancel.svg";
import Locale from "../locales";
import { useAccessStore } from "../store";
import CloseIcon from "../icons/close.svg";
import EditIcon from "../icons/edit.svg";
import ResetIcon from "../icons/reload.svg";
import { getModelCategory } from "./emoji";
import ClaudeIcon from "../icons/claude-color.svg";
import DallEIcon from "../icons/dalle-color.svg";
import WenXinIcon from "../icons/wenxin-color.svg";
import DouBaoIcon from "../icons/doubao-color.svg";
import HunYuanIcon from "../icons/hunyuan-color.svg";
import GeminiIcon from "../icons/gemini-color.svg";
import MetaIcon from "../icons/meta-color.svg";
import OpenAIIcon from "../icons/openai.svg";
import CohereIcon from "../icons/cohere-color.svg";
import DeepseekIcon from "../icons/deepseek-color.svg";
import MoonShotIcon from "../icons/moonshot.svg";
import GlmIcon from "../icons/qingyan-color.svg";
import GrokIcon from "../icons/grok.svg";
import QwenIcon from "../icons/qwen-color.svg";
import NeatIcon from "../icons/neat.svg";

interface ModelInfo {
  id: string;
  selected: boolean;
  isCustom?: boolean;
}

export function ModelSelectorModal(props: {
  onClose: () => void;
  onSelect: (models: string) => void;
  currentModels: string;
}) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [customModelInput, setCustomModelInput] = useState("");
  const accessStore = useAccessStore();

  // 解析当前已选模型，忽略@及其后面的类别信息
  const currentModelList = useMemo(() => {
    if (!props.currentModels) return [];

    return props.currentModels.split(",").map((m) => {
      const trimmed = m.trim();
      // 如果包含@，则只取@前面的部分
      const atIndex = trimmed.indexOf("@");
      return atIndex >= 0 ? trimmed.substring(0, atIndex) : trimmed;
    });
  }, [props.currentModels]);

  // 添加一个状态来跟踪正在编辑的模型索引
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // 添加一个状态存储编辑中的值
  const [editingValue, setEditingValue] = useState("");

  // 在组件顶部添加搜索状态
  const [searchKeyword, setSearchKeyword] = useState("");

  // 添加模型类别状态
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 添加自定义类别状态
  const [customCategories, setCustomCategories] = useState<
    Record<string, string>
  >({});
  // 添加编辑类别模态框状态
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  // 添加新类别输入状态
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPattern, setNewCategoryPattern] = useState("");

  // 添加一个本地存储键，用于保存模型列表
  const MODELS_STORAGE_KEY = "chat-next-web-models";

  // 添加默认系统类别匹配规则常量
  const DEFAULT_SYSTEM_CATEGORY_PATTERNS: Record<string, string> = {
    Claude: "claude",
    "DALL-E": "dall",
    DeepSeek: "deepseek",
    Grok: "grok",
    Gemini: "gemini",
    MoonShot: "moonshot|kimi",
    WenXin: "wenxin|ernie",
    DouBao: "doubao",
    HunYuan: "hunyuan",
    Cohere: "command",
    GLM: "glm",
    Llama: "llama",
    Qwen: "qwen|qwq|qvq",
    ChatGPT: "gpt|o1|o3",
  };

  // 添加一个状态来存储修改后的系统类别匹配规则
  const [systemCategoryPatterns, setSystemCategoryPatterns] = useState<
    Record<string, string>
  >(DEFAULT_SYSTEM_CATEGORY_PATTERNS);

  // 添加一个本地存储键，用于保存系统类别匹配规则
  const SYSTEM_CATEGORIES_STORAGE_KEY = "chat-next-web-system-categories";

  // 在组件初始化时，尝试从本地存储加载系统类别匹配规则
  useEffect(() => {
    try {
      const storedPatterns = localStorage.getItem(
        SYSTEM_CATEGORIES_STORAGE_KEY,
      );
      if (storedPatterns) {
        const parsedPatterns = JSON.parse(storedPatterns);
        setSystemCategoryPatterns(parsedPatterns);
      }
    } catch (error) {
      console.error("从本地存储加载系统类别匹配规则失败:", error);
    }
  }, []);

  // 修改保存编辑的函数，同时保存到本地存储
  const saveSystemCategoryPattern = (category: string, pattern: string) => {
    const newPatterns = {
      ...systemCategoryPatterns,
      [category]: pattern,
    };
    setSystemCategoryPatterns(newPatterns);

    // 保存到本地存储
    try {
      localStorage.setItem(
        SYSTEM_CATEGORIES_STORAGE_KEY,
        JSON.stringify(newPatterns),
      );
    } catch (error) {
      console.error("保存系统类别匹配规则到本地存储失败:", error);
    }

    setEditingIndex(null);
  };

  // 添加恢复默认规则的函数
  const resetToDefaultPatterns = () => {
    setSystemCategoryPatterns(DEFAULT_SYSTEM_CATEGORY_PATTERNS);

    // 保存到本地存储
    try {
      localStorage.setItem(
        SYSTEM_CATEGORIES_STORAGE_KEY,
        JSON.stringify(DEFAULT_SYSTEM_CATEGORY_PATTERNS),
      );
      showToast("已恢复默认匹配规则");
    } catch (error) {
      console.error("保存系统类别匹配规则到本地存储失败:", error);
    }
  };

  // 获取可用的模型类别，按字母顺序排序，但"all"在最前，"Other"在最后
  const getAvailableCategories = useMemo(() => {
    const categories = new Set<string>();

    // 收集所有类别
    models.forEach((model) => {
      const category = getModelCategory(model.id);
      categories.add(category);
    });

    // 转换为数组
    const categoriesArray = Array.from(categories);

    // 移除"all"和"Other"（如果存在）
    const filteredCategories = categoriesArray.filter(
      (category) => category !== "all" && category !== "Other",
    );

    // 按字母顺序排序其他类别
    filteredCategories.sort((a, b) => a.localeCompare(b));

    // 构建最终数组：all在最前，排序后的类别在中间，Other在最后
    const result = ["all"];

    // 添加排序后的类别
    result.push(...filteredCategories);

    // 如果有"Other"类别，添加到最后
    if (categoriesArray.includes("Other")) {
      result.push("Other");
    }

    return result;
  }, [models, systemCategoryPatterns]);

  // 修改初始化函数，确保加载自定义模型
  const fetchModels = async (forceRefresh = false) => {
    // 检查用户是否已输入访问密码
    if (!accessStore.isAuthorized()) {
      showToast("请先在设置中输入访问密码");
      setLoading(false);
      return;
    }

    // 获取自定义模型列表
    const customModelIds = currentModelList.filter((id) => id !== "-all");

    // 如果不是强制刷新，先尝试从本地存储中获取
    if (!forceRefresh) {
      try {
        const storedModels = localStorage.getItem(MODELS_STORAGE_KEY);
        if (storedModels) {
          const parsedModels = JSON.parse(storedModels);

          // 确保模型列表格式正确
          if (Array.isArray(parsedModels) && parsedModels.length > 0) {
            // 获取已存储的模型ID列表
            const storedModelIds = parsedModels.map((model) => model.id);

            // 找出自定义模型名中有但不在存储列表中的模型
            const missingCustomModels = customModelIds
              .filter((id) => !storedModelIds.includes(id))
              .map((id) => ({
                id,
                selected: true,
                isCustom: true,
              }));

            // 更新选中状态并添加缺失的自定义模型
            const modelsWithSelectedStatus = parsedModels.map((model) => ({
              ...model,
              selected: currentModelList.includes(model.id),
            }));

            // 合并存储的模型和缺失的自定义模型
            const allModels = [
              ...modelsWithSelectedStatus,
              ...missingCustomModels,
            ];

            setModels(allModels);
            console.log("从本地存储加载了模型列表，并添加了自定义模型");

            // 如果有新添加的自定义模型，更新本地存储
            if (missingCustomModels.length > 0) {
              localStorage.setItem(
                MODELS_STORAGE_KEY,
                JSON.stringify(allModels),
              );
            }

            return;
          }
        }
      } catch (error) {
        console.error("从本地存储加载模型列表失败:", error);
      }
    }

    // 没有本地存储或需要强制刷新时，从远程获取
    setLoading(true);
    try {
      // 先从服务端获取配置
      const configResponse = await fetch("/api/config");
      const configData = await configResponse.json();

      // 检查是否启用了自定义接口
      const useCustomApi = accessStore.useCustomConfig;

      console.log("自定义接口状态:", useCustomApi);
      console.log(
        "客户端API密钥:",
        accessStore.openaiApiKey ? "已设置" : "未设置",
      );

      let apiModelList = [];

      if (useCustomApi) {
        // 使用客户端配置
        const baseUrl = accessStore.openaiUrl || "https://api.openai.com";
        const apiKey = accessStore.openaiApiKey;

        if (!apiKey) {
          showToast(Locale.Settings.Access.CustomModel.ApiKeyRequired);
          setLoading(false);
          return;
        }

        try {
          // 使用客户端密钥直接请求
          const url = `${baseUrl}/v1/models`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              Locale.Settings.Access.CustomModel.RequestFailed(response.status),
            );
          }

          const data = await response.json();

          if (data.data && Array.isArray(data.data)) {
            // 处理模型数据
            apiModelList = data.data.map((model: any) => ({
              id: model.id,
              selected: currentModelList.includes(model.id),
            }));

            // 按字母顺序排序
            apiModelList.sort((a: ModelInfo, b: ModelInfo) =>
              a.id.localeCompare(b.id),
            );

            // 找出自定义模型名中已有的但不在API返回列表中的模型
            const apiModelIds = apiModelList.map((m: ModelInfo) => m.id);
            const customModels = currentModelList
              .filter(
                (modelId) =>
                  !apiModelIds.includes(modelId) && modelId !== "-all",
              )
              .map((modelId) => ({
                id: modelId,
                selected: true,
                isCustom: true,
              }));

            // 合并API模型和自定义模型
            const allModels = [...apiModelList, ...customModels];
            setModels(allModels);

            // 保存到本地存储
            localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(allModels));

            // 显示获取到的模型数量，指明是从客户端获取的
            showToast(
              Locale.Settings.Access.CustomModel.FetchSuccessFromClient(
                apiModelList.length,
              ),
            );
          } else {
            throw new Error(Locale.Settings.Access.CustomModel.InvalidResponse);
          }
        } catch (error) {
          // 客户端错误
          console.error("从客户端获取模型列表失败:", error);
          showToast(
            Locale.Settings.Access.CustomModel.FetchFailedFromClient(
              error instanceof Error ? error.message : String(error),
            ),
          );
          setLoading(false);
          return;
        }
      } else {
        // 使用服务端配置
        const baseUrl = configData.baseUrl || "https://api.openai.com";

        // 检查服务端是否设置了API密钥
        if (configData.apiKey !== "已设置") {
          showToast(Locale.Settings.Access.CustomModel.ApiKeyRequired);
          setLoading(false);
          return;
        }

        try {
          // 通过服务端代理请求
          const response = await fetch("/api/proxy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: `${baseUrl}/v1/models`,
            }),
          });

          if (!response.ok) {
            throw new Error(
              Locale.Settings.Access.CustomModel.RequestFailed(response.status),
            );
          }

          const data = await response.json();

          if (data.data && Array.isArray(data.data)) {
            // 处理模型数据
            apiModelList = data.data.map((model: any) => ({
              id: model.id,
              selected: currentModelList.includes(model.id),
            }));

            // 按字母顺序排序
            apiModelList.sort((a: ModelInfo, b: ModelInfo) =>
              a.id.localeCompare(b.id),
            );

            // 找出自定义模型名中已有的但不在API返回列表中的模型
            const apiModelIds = apiModelList.map((m: ModelInfo) => m.id);
            const customModels = currentModelList
              .filter(
                (modelId) =>
                  !apiModelIds.includes(modelId) && modelId !== "-all",
              )
              .map((modelId) => ({
                id: modelId,
                selected: true,
                isCustom: true,
              }));

            // 合并API模型和自定义模型
            const allModels = [...apiModelList, ...customModels];
            setModels(allModels);

            // 保存到本地存储
            localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(allModels));

            // 显示获取到的模型数量，指明是从服务端获取的
            showToast(
              Locale.Settings.Access.CustomModel.FetchSuccessFromServer(
                apiModelList.length,
              ),
            );
          } else {
            throw new Error(Locale.Settings.Access.CustomModel.InvalidResponse);
          }
        } catch (error) {
          // 服务端错误
          console.error("从服务端获取模型列表失败:", error);
          showToast(
            Locale.Settings.Access.CustomModel.FetchFailedFromServer(
              error instanceof Error ? error.message : String(error),
            ),
          );
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      // 通用错误（如配置获取失败等）
      console.error("获取模型列表失败:", error);
      showToast(
        `获取模型列表失败: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels(false); // 传入false表示优先从本地加载
  }, [accessStore.useCustomConfig]);

  const toggleModelSelection = (originalIndex: number) => {
    const updatedModels = [...models];
    updatedModels[originalIndex] = {
      ...updatedModels[originalIndex],
      selected: !updatedModels[originalIndex].selected,
    };
    setModels(updatedModels);

    // 更新本地存储
    try {
      localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(updatedModels));
    } catch (error) {
      console.error("更新本地存储失败:", error);
    }
  };

  const handleConfirm = () => {
    const selectedModels = models
      .filter((model) => model.selected)
      .map((model) => {
        // 获取模型类别
        const category = getModelCategory(model.id);
        // 返回格式为 modelId@Category 的字符串
        return `${model.id}@${category}`;
      })
      .join(",");

    props.onSelect(selectedModels);
    props.onClose();
  };

  // 修改全选函数，同时考虑搜索关键字和类别过滤
  const selectAll = () => {
    const filteredModelIds = models
      .filter((model) => {
        // 同时考虑搜索关键字和类别过滤
        const matchesSearch = model.id
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          getModelCategory(model.id) === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .map((model) => model.id);

    setModels((prevModels) =>
      prevModels.map((model) => ({
        ...model,
        selected: filteredModelIds.includes(model.id) ? true : model.selected,
      })),
    );
  };

  // 修改全不选函数，同时考虑搜索关键字和类别过滤
  const selectNone = () => {
    const filteredModelIds = models
      .filter((model) => {
        // 同时考虑搜索关键字和类别过滤
        const matchesSearch = model.id
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          getModelCategory(model.id) === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .map((model) => model.id);

    setModels((prevModels) =>
      prevModels.map((model) => ({
        ...model,
        selected: filteredModelIds.includes(model.id) ? false : model.selected,
      })),
    );
  };

  // 修改添加自定义模型的函数
  const addCustomModel = () => {
    if (!customModelInput.trim()) return;

    // 检查是否已存在相同ID的模型
    const exists = models.some(
      (m) => m.id.toLowerCase() === customModelInput.toLowerCase(),
    );

    if (exists) {
      showToast(Locale.Settings.Access.CustomModel.ModelExists);
      return;
    }

    // 添加新模型
    const newModel: ModelInfo = {
      id: customModelInput,
      selected: true,
      isCustom: true,
    };

    const updatedModels = [...models, newModel];
    setModels(updatedModels);
    setCustomModelInput("");

    // 更新本地存储
    try {
      localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(updatedModels));
      console.log(`已添加自定义模型到本地存储: ${newModel.id}`);
    } catch (error) {
      console.error("更新本地存储失败:", error);
    }
  };

  // 修改编辑自定义模型函数
  const startEditing = (index: number) => {
    // 获取当前显示的模型列表（考虑搜索过滤和类别过滤）
    const visibleModels = models.filter(
      (model) =>
        model.id.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        (selectedCategory === "all" ||
          getModelCategory(model.id) === selectedCategory),
    );

    // 获取要编辑的模型
    const modelToEdit = visibleModels[index];

    if (!modelToEdit) {
      console.error("找不到要编辑的模型");
      return;
    }

    // 在完整模型列表中找到对应的索引
    const originalIndex = models.findIndex((m) => m.id === modelToEdit.id);

    if (originalIndex >= 0) {
      // 设置编辑索引和初始值
      setEditingIndex(originalIndex);
      setEditingValue(modelToEdit.id);
    } else {
      console.error("在完整模型列表中找不到要编辑的模型");
    }
  };

  const saveEditing = () => {
    if (editingIndex === null) return;

    const newId = editingValue.trim();
    if (!newId) {
      // 如果输入为空，则删除该模型
      deleteCustomModel(editingIndex);
    } else if (newId !== models[editingIndex].id) {
      // 检查是否与其他模型重名
      const exists = models.some(
        (m, i) => i !== editingIndex && m.id === newId,
      );
      if (exists) {
        showToast(Locale.Settings.Access.CustomModel.ModelExists);
      } else {
        // 保存修改
        setModels((prevModels) => {
          const newModels = [...prevModels];
          newModels[editingIndex] = {
            ...newModels[editingIndex],
            id: newId,
          };
          return newModels;
        });
      }
    }

    // 退出编辑模式
    setEditingIndex(null);
  };

  // 修改删除自定义模型的函数，使其能够在搜索过滤后正确删除模型
  const deleteCustomModel = (index: number) => {
    // 获取当前显示的模型列表（考虑搜索过滤和类别过滤）
    const visibleModels = models.filter(
      (model) =>
        model.id.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        (selectedCategory === "all" ||
          getModelCategory(model.id) === selectedCategory),
    );

    // 获取要删除的模型
    const modelToDelete = visibleModels[index];

    if (!modelToDelete) {
      console.error("找不到要删除的模型");
      return;
    }

    // 在完整模型列表中找到对应的索引
    const originalIndex = models.findIndex((m) => m.id === modelToDelete.id);

    if (originalIndex >= 0) {
      // 从模型列表中删除
      const updatedModels = [...models];
      updatedModels.splice(originalIndex, 1);
      setModels(updatedModels);

      // 更新本地存储
      try {
        localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(updatedModels));
        console.log(`已从本地存储中删除模型: ${modelToDelete.id}`);
      } catch (error) {
        console.error("更新本地存储失败:", error);
      }
    } else {
      console.error("在完整模型列表中找不到要删除的模型");
    }
  };

  // 修改类别编辑器模态框的实现
  const addCategory = () => {
    if (!newCategoryName.trim() || !newCategoryPattern.trim()) return;

    setCustomCategories((prev) => ({
      ...prev,
      [newCategoryPattern.trim()]: newCategoryName.trim(),
    }));

    setNewCategoryName("");
    setNewCategoryPattern("");
  };

  const removeCategory = (pattern: string) => {
    setCustomCategories((prev) => {
      const newCategories = { ...prev };
      delete newCategories[pattern];
      return newCategories;
    });
  };

  // 修改"重新获取模型"按钮的处理函数
  const handleRefreshModels = () => {
    // 检查用户是否已输入访问密码
    if (!accessStore.isAuthorized()) {
      showToast("请先在设置中输入访问密码");
      return;
    }
    fetchModels(true); // 传入true表示强制从远程获取
  };

  // 在组件内部添加一个过滤后的模型列表计算
  const filteredModels = useMemo(() => {
    return models.filter(
      (model) =>
        model.id.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        (selectedCategory === "all" ||
          getModelCategory(model.id) === selectedCategory),
    );
  }, [models, searchKeyword, selectedCategory, getModelCategory]);

  // 在类别编辑器模态框中，我们需要使用固定的头像映射
  function getFixedCategoryAvatar(category: string) {
    // 这个函数只在类别编辑器中使用，确保类别头像不会随着匹配规则变化
    switch (category) {
      case "Claude":
        return <ClaudeIcon className="user-avatar model-avatar" alt="Claude" />;
      case "DALL-E":
        return <DallEIcon className="user-avatar model-avatar" alt="DALL-E" />;
      case "WenXin":
        return <WenXinIcon className="user-avatar model-avatar" alt="WenXin" />;
      case "DouBao":
        return <DouBaoIcon className="user-avatar model-avatar" alt="DouBao" />;
      case "HunYuan":
        return (
          <HunYuanIcon className="user-avatar model-avatar" alt="HunYuan" />
        );
      case "Gemini":
        return <GeminiIcon className="user-avatar model-avatar" alt="Gemini" />;
      case "Llama":
        return <MetaIcon className="user-avatar model-avatar" alt="Meta" />;
      case "ChatGPT":
        return <OpenAIIcon className="user-avatar model-avatar" alt="OpenAI" />;
      case "Cohere":
        return <CohereIcon className="user-avatar model-avatar" alt="Cohere" />;
      case "DeepSeek":
        return <DeepseekIcon className="user-avatar model-avatar" />;
      case "MoonShot":
        return (
          <MoonShotIcon className="user-avatar model-avatar" alt="MoonShot" />
        );
      case "GLM":
        return <GlmIcon className="user-avatar model-avatar" alt="GLM" />;
      case "Grok":
        return <GrokIcon className="user-avatar model-avatar" alt="Grok" />;
      case "Qwen":
        return <QwenIcon className="user-avatar model-avatar" alt="Qwen" />;
      default:
        return <NeatIcon className="user-avatar model-avatar" alt="Logo" />;
    }
  }

  return (
    <div className="modal-mask">
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                whiteSpace: "nowrap", // 防止标题换行
              }}
            >
              {Locale.Settings.Access.CustomModel.ModelSelector}
            </div>
            <div
              style={{
                display: "flex",
                flex: 1,
                gap: "8px",
                alignItems: "center",
                justifyContent: "space-between", // 使元素分散对齐
              }}
            >
              {/* 搜索框和下拉框放在一起 */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flex: 1, // 占据大部分空间
                }}
              >
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={Locale.UI.Search}
                  style={{
                    width: "100%",
                    padding: "4px 10px",
                    border: "var(--border-in-light)",
                    borderRadius: "10px",
                    background: "var(--white)",
                    boxShadow: "var(--input-shadow)",
                    fontSize: "14px",
                    lineHeight: "1.2",
                    height: "32px",
                    color: "var(--black)",
                  }}
                />

                {/* 添加模型类别下拉框 */}
                {getAvailableCategories.length > 1 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: "4px 8px",
                      border: "var(--border-in-light)",
                      borderRadius: "10px",
                      background: "var(--white)",
                      boxShadow: "var(--input-shadow)",
                      fontSize: "14px",
                      height: "32px",
                      lineHeight: "1.2",
                      color: "var(--black)",
                      width: "auto",
                      appearance: "auto",
                      cursor: "pointer",
                      flexShrink: 0, // 防止被压缩
                    }}
                  >
                    {getAvailableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? Locale.UI.All : category}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 全选和全不选按钮放在最右侧 */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexShrink: 0, // 防止被压缩
                }}
              >
                <IconButton
                  text={Locale.Settings.Access.CustomModel.SelectAll}
                  onClick={selectAll}
                  bordered
                />
                <IconButton
                  text={Locale.Settings.Access.CustomModel.SelectNone}
                  onClick={selectNone}
                  bordered
                />
              </div>
            </div>
          </div>
        }
        onClose={props.onClose}
        actions={[
          <IconButton
            key="refresh-models"
            icon={<ResetIcon />}
            text="重新获取模型"
            onClick={handleRefreshModels}
            bordered
          />,
          <IconButton
            key="edit-categories"
            icon={<EditIcon />}
            text="编辑类别"
            onClick={() => setShowCategoryEditor(true)}
            bordered
          />,
          <div key="spacer" style={{ flex: 1 }}></div>,
          <IconButton
            key="cancel"
            icon={<CancelIcon />}
            bordered
            text={Locale.UI.Cancel}
            onClick={props.onClose}
          />,
          <IconButton
            key="confirm"
            icon={<ConfirmIcon />}
            bordered
            text={Locale.UI.Confirm}
            onClick={handleConfirm}
          />,
        ]}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <LoadingIcon />
          </div>
        ) : (
          <>
            <List>
              {/* 过滤并显示模型列表 */}
              {filteredModels.map((model, index) => {
                // 获取在完整列表中的索引，用于编辑和删除操作
                const originalIndex = models.findIndex(
                  (m) => m.id === model.id,
                );
                const isEditing = editingIndex === originalIndex;

                // 获取模型类别
                const modelCategory = getModelCategory(model.id);

                // 根据类别构造头像标识符
                let avatarId = getFixedCategoryAvatar(modelCategory);

                return (
                  <ListItem
                    key={model.id}
                    title=""
                    icon={avatarId}
                    onClick={undefined}
                  >
                    {model.isCustom && isEditing ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          width: "100%",
                          padding: "0 20px", // 添加左右内边距
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            maxWidth: "90%", // 限制最大宽度
                            margin: "0 auto", // 水平居中
                          }}
                        >
                          <span
                            style={{
                              width: "80px",
                              whiteSpace: "nowrap",
                              marginRight: "8px",
                            }}
                          >
                            模型名称:
                          </span>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            style={{
                              padding: "4px 8px",
                              border: "var(--border-in-light)",
                              borderRadius: "8px",
                              flex: 1,
                            }}
                            autoFocus
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                            marginTop: "8px",
                            maxWidth: "90%", // 与上面的输入区域保持一致
                            margin: "8px auto 0", // 水平居中，顶部间距8px
                          }}
                        >
                          <IconButton
                            icon={<ConfirmIcon />}
                            onClick={() => {
                              // 保存编辑的模型名称
                              const updatedModels = [...models];
                              updatedModels[originalIndex] = {
                                ...updatedModels[originalIndex],
                                id: editingValue,
                              };
                              setModels(updatedModels);

                              // 更新本地存储
                              try {
                                localStorage.setItem(
                                  MODELS_STORAGE_KEY,
                                  JSON.stringify(updatedModels),
                                );
                              } catch (error) {
                                console.error("更新本地存储失败:", error);
                              }

                              setEditingIndex(null);
                            }}
                            style={{ padding: "8px" }}
                          />
                          <IconButton
                            icon={<CancelIcon />}
                            onClick={() => setEditingIndex(null)}
                            style={{ padding: "8px" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ flex: 1 }}>
                        {/* 移除点击编辑功能，只显示模型名称 */}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "var(--text-color)",
                            padding: "2px 4px",
                            borderRadius: "8px",
                            display: "inline-block",
                          }}
                        >
                          {model.id}
                        </span>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center" }}>
                      {model.isCustom && !isEditing && (
                        <>
                          <IconButton
                            icon={<EditIcon />}
                            onClick={() => startEditing(index)}
                            style={{
                              marginRight: "8px",
                              padding: "8px",
                            }}
                          />
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={() => deleteCustomModel(index)}
                            style={{
                              marginRight: "8px",
                              padding: "8px",
                            }}
                          />
                        </>
                      )}
                      <input
                        type="checkbox"
                        checked={model.selected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleModelSelection(originalIndex);
                        }}
                      />
                    </div>
                  </ListItem>
                );
              })}

              {/* 修改添加新模型的输入行 */}
              <ListItem key="new-model-input" icon={undefined} title="">
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="text"
                    value={customModelInput}
                    onChange={(e) => setCustomModelInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addCustomModel();
                      }
                    }}
                    placeholder={
                      Locale.Settings.Access.CustomModel
                        .InputPlaceholderEnter ||
                      "输入自定义模型名称并按回车添加"
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "14px",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "0 10px",
                    }}
                  />
                </div>
              </ListItem>
            </List>
          </>
        )}
      </Modal>

      {/* 添加类别编辑器模态框 */}
      {showCategoryEditor && (
        <div className="modal-mask">
          <Modal
            title={
              Locale.Settings.Access.CustomModel.EditCategories ||
              "编辑模型类别"
            }
            onClose={() => setShowCategoryEditor(false)}
            actions={[
              <IconButton
                key="reset"
                icon={<ResetIcon />}
                text="恢复默认"
                onClick={resetToDefaultPatterns}
                bordered
              />,
              <IconButton
                key="close"
                icon={<ConfirmIcon />}
                text={Locale.UI.Close}
                onClick={() => setShowCategoryEditor(false)}
                bordered
              />,
            ]}
          >
            <div className="model-category-editor">
              {/* 显示所有类别（按字母顺序排序） */}
              <List>
                {Object.entries(systemCategoryPatterns)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([category, pattern], index) => {
                    const isEditing = editingIndex === -index - 1;

                    return (
                      <ListItem
                        key={category}
                        title={isEditing ? "" : category}
                        subTitle={isEditing ? "" : `匹配: ${pattern}`}
                        icon={getFixedCategoryAvatar(category)}
                      >
                        {isEditing ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              width: "100%",
                              padding: "0 20px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                maxWidth: "90%", // 限制最大宽度
                                margin: "0 auto", // 水平居中
                              }}
                            >
                              <span
                                style={{
                                  width: "80px",
                                  whiteSpace: "nowrap",
                                  marginRight: "8px",
                                }}
                              >
                                匹配规则:
                              </span>
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                style={{
                                  padding: "4px 8px",
                                  border: "var(--border-in-light)",
                                  borderRadius: "8px",
                                  flex: 1,
                                }}
                                autoFocus
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                                marginTop: "8px",
                                maxWidth: "90%", // 与上面的输入区域保持一致
                                margin: "8px auto 0", // 水平居中，顶部间距8px
                              }}
                            >
                              <IconButton
                                icon={<ConfirmIcon />}
                                onClick={() =>
                                  saveSystemCategoryPattern(
                                    category,
                                    editingValue,
                                  )
                                }
                                style={{ padding: "8px" }}
                              />
                              <IconButton
                                icon={<CancelIcon />}
                                onClick={() => setEditingIndex(null)}
                                style={{ padding: "8px" }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <IconButton
                              icon={<EditIcon />}
                              onClick={() => {
                                setEditingIndex(-index - 1);
                                setEditingValue(pattern);
                              }}
                              style={{ padding: "8px" }}
                            />
                          </div>
                        )}
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
