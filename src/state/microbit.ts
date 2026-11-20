import { useEffect, useRef, useState } from 'react'
import { pressDetector } from './press'

// Minimal Web Serial typings (Chromium only; needs HTTPS or localhost).
type Port = {
  readable: ReadableStream<BufferSource> | null
  open(options: { baudRate: number }): Promise<void>
  getInfo(): { usbVendorId?: number }
}
type Serial = {
  getPorts(): Promise<Port[]>
  requestPort(options: { filters: { usbVendorId: number }[] }): Promise<Port>
}

const MICROBIT = 0x0d28 // USB vendor id
const serial = (navigator as unknown as { serial?: Serial }).serial

export function useMicrobit(onPress: () => void) {
  const [connected, setConnected] = useState(false)
  const latest = useRef(onPress)
  useEffect(() => {
    latest.current = onPress
  })

  async function listen(port: Port) {
    await port.open({ baudRate: 115200 })
    setConnected(true)
    const isPress = pressDetector()
    const reader = port.readable!.pipeThrough(new TextDecoderStream()).getReader()
    let buffer = ''
    try {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        const lines = (buffer + value).split('\n')
        buffer = lines.pop()! // keep the partial last line
        for (const line of lines) if (isPress(line)) latest.current()
      }
    } finally {
      setConnected(false) // unplugged
    }
  }

  // Reconnect to a micro:bit the user already allowed, without another prompt.
  useEffect(() => {
    serial
      ?.getPorts()
      .then((ports) => ports.find((p) => p.getInfo().usbVendorId === MICROBIT))
      .then((port) => port && listen(port))
      .catch(() => {})
  }, [])

  const connect = () =>
    serial
      ?.requestPort({ filters: [{ usbVendorId: MICROBIT }] })
      .then(listen)
      .catch(() => {}) // the user closed the picker, or the port is already open

  return { supported: serial !== undefined, connected, connect }
}
