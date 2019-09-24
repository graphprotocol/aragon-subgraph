import { Bytes } from '@graphprotocol/graph-ts'

export function fromString(value: String): Bytes {
  let len = value.lengthUTF8 - 1 // AssemblyScript counts a null terminator, we don't want that
  let utf8 = value.toUTF8()
  let bytes = new Bytes(len)

  for (let i: i32 = 0; i < len; i++) {
    bytes[i] = load<u8>(utf8 + i)
  }

  return bytes
}
