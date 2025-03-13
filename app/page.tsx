import dynamic from "next/dynamic";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

// 禁用 SSR，只在客户端渲染
const ClientHome = dynamic(() => import("./page-client"), { ssr: false });

export default function Page() {
  return <ClientHome />;
}
