// Suppress wallet extension conflicts in console
if (typeof window !== 'undefined') {
  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress wallet extension conflicts and RPC errors
    if (
      message.includes('Cannot redefine property: ethereum') ||
      message.includes('Cannot set property ethereum') ||
      message.includes('evmAsk.js') ||
      message.includes('requestProvider.js') ||
      message.includes('Could not establish connection') ||
      message.includes('exceeded maximum retry limit') ||
      message.includes('JsonRpcProvider failed to detect network') ||
      message.includes('CORS policy') ||
      message.includes('net::ERR_FAILED')
    ) {
      // Silently ignore wallet extension conflicts and RPC errors
      return
    }
    
    // Log other errors normally
    originalError.apply(console, args)
  }

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress wallet extension warnings
    if (
      message.includes('Module not found: Can\'t resolve \'@react-native-async-storage/async-storage\'') ||
      message.includes('metamask-sdk') ||
      message.includes('pino-pretty') ||
      message.includes('Download the React DevTools') ||
      message.includes('Failed to decode downloaded font')
    ) {
      // Silently ignore these warnings
      return
    }
    
    // Log other warnings normally
    originalWarn.apply(console, args)
  }
}
