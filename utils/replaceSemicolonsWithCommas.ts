export function replaceSemicolonsWithCommas(input: string): string {
  // Replace any semicolon (optionally surrounded by whitespace) with a comma and a space
  return input.replace(/\s*;\s*/g, ', ')
}
