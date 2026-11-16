window.__pocketStartupTrace = window.__pocketStartupTrace || [];
window.__pocketStartupIssues = window.__pocketStartupIssues || [];

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

async function importApplication() {
  const slowTimer = setTimeout(() => {
    const status = document.getElementById("startup-phase");
    if (status) {
      status.textContent =
        "正在下载首次启动资源，请保持页面打开，不要反复点重试。";
    }
  }, 12000);
  try {
    return await import("./application-BMMUDZNB-1760.js");
  } finally {
    clearTimeout(slowTimer);
  }
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
