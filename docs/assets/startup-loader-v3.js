const CDN_BASES = [
  "https://gcore.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
  "https://fastly.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
  "https://cdn.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
];

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
  });
}

beginStage("resources");

async function canUseCdn(base) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(`${base}platform-BDeA0pL1.js`, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok && response.headers.get("content-type")?.includes("javascript");
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function importApplication() {
  const reachableBases = await Promise.all(
    CDN_BASES.map(async (base) => ((await canUseCdn(base)) ? base : null)),
  );
  for (const base of reachableBases.filter(Boolean)) {
    try {
      return await import(`${base}application-BAdagfOj-fix2.js`);
    } catch {
      // Try the next CDN before falling back to the GitHub Pages copy.
    }
  }
  return import("./application-BAdagfOj-fix2.js");
}

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
        const runtimeModule = await import("./runtime-BDT5TZCR.js");
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
      await applicationModule.dz.mountApplication();
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
