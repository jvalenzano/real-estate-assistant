// Polyfill for PlatformConstants in Expo SDK 53
// Only apply if not already defined
if (typeof global !== 'undefined' && !global.PlatformConstants) {
  global.PlatformConstants = {
    reactNativeVersion: {
      major: 0,
      minor: 79,
      patch: 4,
      prerelease: null
    }
  };
}