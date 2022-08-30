import { isArray } from '@vue/shared'
import { useRouter } from 'vue-router'
import { useSongsData } from '../store/songs'
import { useUser } from '../store/user'

let isFirstInit = true

const setupRouter = () => {
  const user = useUser()
  const songsData = useSongsData()
  const router = useRouter()
  router.beforeEach(async (to, from, next) => {
    isFirstInit && (await user.refreshUser())
    isFirstInit = false

    if (to.meta.auth && to.name !== 'Login' && !user.isAuth()) {
      user.reset()
      songsData.reset()
      next({ name: 'Login', replace: true })
    } else {
      if (to.meta.roles && isArray(to.meta.roles) && to.meta.roles.includes(user.user?.role)) {
        next()
      } else if (to.meta.roles && isArray(to.meta.roles) && !to.meta.roles.includes(user.user?.role)) {
        next(from)
      } else {
        next()
      }
    }
  })
}

export default setupRouter
