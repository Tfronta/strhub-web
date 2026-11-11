import navigation from "./navigation"
import catalog from "./catalog"
import marker from "./marker"
import tools from "./tools"
import basics from "./basics"
import blog from "./blog"
import about from "./about"
import commonProjects from "./common-projects"
import mix from "./mix"
import verified from "./verified"
import consent from "./consent"

const messages = {
  ...navigation,
  ...catalog,
  ...marker,
  ...tools,
  ...basics,
  ...blog,
  ...about,
  ...commonProjects,
  ...mix,
  ...verified,
  ...consent,
} as const

export default messages
