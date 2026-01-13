/**
 * WebView Bridge Utility
 *
 * Provides safe communication between React web app and React Native WebView.
 * Sends authentication tokens to the native layer for secure API calls.
 */

type WebViewMessageType = 'AUTH_TOKEN' | 'LOGOUT';

interface WebViewMessage {
  type: WebViewMessageType;
  token?: string;
}

/**
 * Checks if the app is running inside a React Native WebView
 */
export function isRunningInWebView(): boolean {
  return typeof window !== 'undefined' &&
         typeof (window as any).ReactNativeWebView !== 'undefined' &&
         typeof (window as any).ReactNativeWebView.postMessage === 'function';
}

/**
 * Sends a message to React Native WebView
 * @param message - The message object to send
 */
function postMessageToNative(message: WebViewMessage): void {
  if (!isRunningInWebView()) {
    // Silent return - we're in a browser, not a WebView
    return;
  }

  try {
    const messageString = JSON.stringify(message);
    (window as any).ReactNativeWebView.postMessage(messageString);
    console.log('[WebView Bridge] Message sent to native:', message.type);
  } catch (error) {
    console.error('[WebView Bridge] Failed to send message to native:', error);
  }
}

/**
 * Sends the current access token to React Native
 * @param token - The JWT access token
 */
export function sendTokenToNative(token: string): void {
  if (!token) {
    console.warn('[WebView Bridge] Attempted to send empty token');
    return;
  }

  postMessageToNative({
    type: 'AUTH_TOKEN',
    token,
  });
}

/**
 * Notifies React Native that the user has logged out
 */
export function sendLogoutToNative(): void {
  postMessageToNative({
    type: 'LOGOUT',
  });
}

/**
 * Re-emits the current token if one exists in localStorage
 * Useful for page reloads when user session persists
 */
export function reEmitTokenIfExists(): void {
  if (!isRunningInWebView()) {
    return;
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    sendTokenToNative(accessToken);
  }
}

// Track the last sent token to avoid redundant messages
let lastSentToken: string | null = null;

/**
 * Sends token to native only if it has changed
 * @param token - The JWT access token
 */
export function sendTokenIfChanged(token: string): void {
  if (token && token !== lastSentToken) {
    sendTokenToNative(token);
    lastSentToken = token;
  }
}

/**
 * Clears the last sent token tracking
 * Should be called on logout
 */
export function clearLastSentToken(): void {
  lastSentToken = null;
}
