import navigation from "./navigation"
import catalog from "./catalog"
import marker from "./marker"
import tools from "./tools"
import strbase from "./strbase"
import basics from "./basics"
import blog from "./blog"
import about from "./about"
import commonProjects from "./common-projects"
import mix from "./mix"
import verified from "./verified"

const messages = {
  ...navigation,
  ...catalog,
  ...marker,
  ...tools,
  ...strbase,
  ...basics,
  ...blog,
  ...about,
  ...commonProjects,
  ...mix,
  ...verified,
} as const

export default messages
