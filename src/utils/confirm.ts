import { Alert, Platform } from "react-native";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export async function confirmAction({
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === "web") {
    const webGlobal = globalThis as typeof globalThis & {
      window?: {
        confirm?: (message?: string) => boolean;
      };
    };
    const confirmFn = webGlobal.window?.confirm?.bind(webGlobal.window);
    if (typeof confirmFn === "function") {
      return confirmFn(`${title}\n\n${message}`);
    }
    return true;
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: confirmText,
          style: destructive ? "destructive" : "default",
          onPress: () => resolve(true),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}
