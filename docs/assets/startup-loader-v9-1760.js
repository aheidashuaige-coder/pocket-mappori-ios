window.__pocketStartupTrace = window.__pocketStartupTrace || [];
window.__pocketStartupIssues = window.__pocketStartupIssues || [];

const RUNTIME_COMMIT =
  "55ceea53afb98876addb9644b844935f66c9294b";
const CDN_BASES = [
  `https://fastly.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-runtime@${RUNTIME_COMMIT}/`,
  `https://cdn.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-runtime@${RUNTIME_COMMIT}/`,
  `https://gcore.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-runtime@${RUNTIME_COMMIT}/`,
  `https://testingcf.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-runtime@${RUNTIME_COMMIT}/`,
  `https://cdn.statically.io/gh/aheidashuaige-coder/pocket-mappori-runtime/${RUNTIME_COMMIT}/`,
];
const LOCAL_BASE = new URL("./", import.meta.url).href;

function beginStage(name) {
  window.__pocketStartupTrace.push({
    stage: name,
    started: Math.round(performance.now()),
    status: "active",
  });
}

function finishStage(name, status = "complete", code) {
  const stage = [...window.__pocketStartupTrace]
    .reverse()
    .find((item) => item.stage === name && item.status === "active");
  if (!stage) return;
  stage.ended = Math.round(performance.now());
  stage.status = status;
  if (code) stage.code = code;
}

function reportIssue(code, module, error) {
  window.__pocketStartupIssues.push({
    stage: "resources",
    module,
    code,
    errorType: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : undefined,
    stack: error instanceof Error ? error.stack?.slice(0, 5000) : undefined,
  });
}

beginStage("resources");

async function probeBase(base) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(`${base}startup-loader-v6-1760.js`, {
      cache: "no-store",
      mode: "cors",
      signal: controller.signal,
    });
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    return base;
  } finally {
    clearTimeout(timer);
  }
}

async function importFrom(base) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(Error(`模块下载超时：${base}`)),
      45000,
    );
  });
  try {
    return await Promise.race([
      import(`${base}application-BMMUDZNB-1760.js`),
      timeout,
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function importApplication() {
  const available = [];
  await Promise.all(
    CDN_BASES.map(async (base, index) => {
      try {
        await probeBase(base);
        available.push({ base, index });
      } catch (error) {
        reportIssue("CDN_PROBE", base, error);
      }
    }),
  );
  available.sort((left, right) => left.index - right.index);

  const status = document.getElementById("startup-phase");
  for (const { base } of available) {
    if (status) status.textContent = "正在连接高速资源服务器…";
    try {
      return await importFrom(base);
    } catch (error) {
      reportIssue("CDN_IMPORT", base, error);
    }
  }

  if (status) status.textContent = "正在使用本站备用资源…";
  return importFrom(LOCAL_BASE);
}

window.addEventListener("vite:preloadError", (event) => {
  const error = event.payload;
  try {
    localStorage.setItem(
      "pocket-mappori:last-module-error:v1",
      JSON.stringify({
        at: Date.now(),
        page: location.href,
        name: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.slice(0, 8000) : undefined,
      }),
    );
  } catch {}
});

function showError(label, error) {
  const status = document.getElementById("startup-phase");
  if (status) {
    status.dataset.error = error instanceof Error ? error.name : "Error";
    status.textContent = `${label}：${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

(async () => {
  try {
    const platformModule = await import("./platform-BDeA0pL1.js");
    if (platformModule.isAndroidNative()) {
      try {
        const runtimeModule = await import("./runtime-DpOt3z-7.js");
        await runtimeModule.initializeNativeRuntime();
      } catch (error) {
        reportIssue("OPTIONAL_NATIVE", "native-runtime", error);
      }
    }

    const applicationModule = await importApplication();
    finishStage("resources");
    beginStage("save");
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      await applicationModule.dO.mountApplication();
    } catch (error) {
      reportIssue(
        error instanceof Error && error.message === "SAVE_UNAVAILABLE"
          ? "SAVE_UNAVAILABLE"
          : "UI_INITIALIZATION",
        "application-mount",
        error,
      );
      showError("界面初始化失败", error);
    }
  } catch (error) {
    reportIssue(
      error instanceof Error && error.message === "SAVE_UNAVAILABLE"
        ? "SAVE_UNAVAILABLE"
        : "ENTRY_RESOURCE",
      "application",
      error,
    );
    showError("启动资源加载失败", error);
  }
})();
