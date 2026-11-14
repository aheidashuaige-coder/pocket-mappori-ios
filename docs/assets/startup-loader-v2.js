import {
  s as beginStage,
  f as finishStage,
  a as reportIssue,
  _ as preload,
} from "./trace-Cz_0O3Cz-fix2.js";

const CDN_BASES = [
  "https://gcore.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
  "https://fastly.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
  "https://cdn.jsdelivr.net/gh/aheidashuaige-coder/pocket-mappori-ios@main/docs/assets/",
];

const APPLICATION_DEPENDENCIES = [
  "./application-BAdagfOj-fix2.js",
  "./saveDocument-1KD8mP7n-fix2.js",
  "./trace-Cz_0O3Cz-fix2.js",
  "./giftDevice-B_3HqteC.js",
  "./index-BHc6ulPh.js",
  "./platform-BDeA0pL1.js",
  "./navigationBridge-BBgDOON_.js",
  "./files-5weKg9MD.js",
  "./application-q9Nymd1y.css",
];

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
      return await preload(
        () => import(`${base}application-BAdagfOj-fix2.js`),
        APPLICATION_DEPENDENCIES.map((dependency) =>
          dependency.startsWith("./") ? `${base}${dependency.slice(2)}` : dependency,
        ),
        import.meta.url,
      );
    } catch {
      // Try the next CDN before falling back to the GitHub Pages copy.
    }
  }
  return preload(
    () => import("./application-BAdagfOj-fix2.js"),
    APPLICATION_DEPENDENCIES,
    import.meta.url,
  );
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
