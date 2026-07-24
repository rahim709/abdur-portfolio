import DevIcon from "@/components/DevIcon"
import { normalizeTechName } from "@/lib/utils"

const iconExceptions: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  react: "reactjs",
  "react-js": "reactjs",
  "react-native": "reactjs",
  reactnative: "reactjs",
  next: "nextjs",
  "next-js": "nextjs",
  nuxt: "nuxtjs",
  node: "nodejs",
  "node-js": "nodejs",
  tailwind: "tailwindcss",
  "tailwind-css": "tailwindcss",
  springboot: "spring",
  "spring-boot": "spring",
  c: "c",
  csharp: "c-sharp",
  flask: "flask-dark",
  "vs-code": "vscode",
  github: "github-dark",
  gcp: "google-cloud",
  "aws-iot": "aws",
  awsiot: "aws",
  vue: "vuejs",
  go: "golang",
  html: "html5",
  postgres: "postgresql",
  "robot-operating-system": "ros",
  "ros-robot-operating-system": "ros",
  "web3-js": "web3js",
  "oculus-sdk": "oculus",
}

const rawIconExceptions: Record<string, string> = {
  c: "c",
  "c++": "c-plus-plus",
}

export function techToIcon(techName: string, iconClassName?: string) {
  const rawKey = techName.toLowerCase().trim()
  if (rawIconExceptions[rawKey]) {
    return <DevIcon name={rawIconExceptions[rawKey]} iconClassName={iconClassName} />
  }

  const normalized = normalizeTechName(techName)
  const iconName = iconExceptions[normalized] ?? normalized
  return <DevIcon name={iconName} iconClassName={iconClassName} />
}
