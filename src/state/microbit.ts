import { useEffect, useRef, useState } from 'react'
import { DAPLink, WebUSB } from 'dapjs'
import { drinkOz } from './press'

// Minimal WebUSB typings (Chromium only; needs HTTPS or localhost).
type UsbDevice = { vendorId: number }
type Usb = {
  getDevices(): Promise<UsbDevice[]>
  requestDevice(options: { filters: { vendorId: number }[] }): Promise<UsbDevice>
  addEventListener(type: 'disconnect', listener: (e: { device: UsbDevice }) => void): void
  removeEventListener(type: 'disconnect', listener: (e: { device: UsbDevice }) => void): void
}

const MICROBIT = 0x0d28 // USB vendor id
const usb = (navigator as unknown as { usb?: Usb }).usb

// Reads the micro:bit's serial output through its DAPLink interface (the same route
// the micro:bit Python editor uses), so the OS never has to hand over a serial port.
export function useMicrobit(onDrink: (oz: number) => void) {
  const [connected, setConnected] = useState(false)
  const latest = useRef(onDrink)
  useEffect(() => {
    latest.current = onDrink
  })

  async function listen(device: UsbDevice) {
    const link = new DAPLink(new WebUSB(device as unknown as USBDevice))
    await link.connect()
    await link.setSerialBaudrate(115200)
    setConnected(true)

    let buffer = ''
    const onData = (chunk: string) => {
      const lines = (buffer + chunk).split('\n')
      buffer = lines.pop()! // keep the partial last line
      for (const line of lines) {
        const oz = drinkOz(line)
        if (oz !== null) latest.current(oz)
      }
    }
    const onUnplug = (e: { device: UsbDevice }) => {
      if (e.device !== device) return
      link.stopSerialRead()
      setConnected(false)
      usb?.removeEventListener('disconnect', onUnplug)
    }
    usb?.addEventListener('disconnect', onUnplug)
    link.on(DAPLink.EVENT_SERIAL_DATA, onData)
    await link.startSerialRead(50, false) // runs until stopSerialRead()
  }

  // Reconnect to a micro:bit the user already allowed, without another prompt.
  useEffect(() => {
    usb
      ?.getDevices()
      .then((devices) => devices.find((d) => d.vendorId === MICROBIT))
      .then((device) => device && listen(device))
      .catch(() => {})
  }, [])

  const connect = () =>
    usb
      ?.requestDevice({ filters: [{ vendorId: MICROBIT }] })
      .then(listen)
      .catch(() => {}) // the user closed the picker, or another tab holds the device

  return { supported: usb !== undefined, connected, connect }
}
