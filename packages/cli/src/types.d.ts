declare module 'npm-profile' {
  export function loginWeb(
    opener: (url: string) => Promise<void> | void,
    opts: { registry?: string },
  ): Promise<{ token: string }>
}
