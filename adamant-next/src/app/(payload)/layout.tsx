import "@payloadcms/next/css";

import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import config from "../../../payload.config";

import { importMap } from "./admin/importMap.js";
import "./custom.css";

type Props = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Props) => (
  <RootLayout
    config={config}
    htmlProps={{
      suppressHydrationWarning: true,
    }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
);

export default Layout;
