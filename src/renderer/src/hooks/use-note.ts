import { atom, useAtom, SetStateAction } from 'jotai'

type Config = {
  selected: number | null
}

const configAtom = atom<Config>({
  selected: null
})
type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result
type UseNoteReturnType = [Config, SetAtom<[SetStateAction<Config>], void>]

export function useNote(): UseNoteReturnType {
  return useAtom(configAtom)
}
