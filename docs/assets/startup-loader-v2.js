import {
  s as beginStage,
  f as finishStage,
  a as reportIssue,
} from "./trace-Cz_0O3Cz.js";

beginStage("resources");

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

    const applicationModule = await import("./application-BAdagfOj.js");
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
