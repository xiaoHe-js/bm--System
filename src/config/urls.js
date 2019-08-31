import { getEnv } from '../utils/index'

let medialibs, // 素材库
  admin, // admin账号
  backend, // 总后台
  henshihuiMall, // 很实惠商城
  launch

if (/^localhost/.test(location.host)) {
  medialibs = 'http://medialibs-dev.idouzi.com'
  backend = 'http://mini-wallet-dev.henshihui.com'
  henshihuiMall = 'http://mall-dev.henshihui.com'
  admin = 'http://admin-dev.idouzi.com'
  launch = 'http://launch-dev.henshihui.com'
} else {
  switch (getEnv()) {
  case 'dev':
    medialibs = 'http://medialibs-dev.idouzi.com'
    backend = 'http://mini-wallet-dev.henshihui.com'
    henshihuiMall = 'http://mall-dev.henshihui.com'
    admin = 'http://admin-dev.idouzi.com'
    launch = 'http://launch-dev.henshihui.com'

    break
  case 'test':
    medialibs = 'http://medialibs-test.idouzi.com'
    backend = 'http://mini-wallet-test.henshihui.com'
    henshihuiMall = 'http://mall-test.henshihui.com'
    admin = 'http://admin-test.idouzi.com'
    launch = 'http://launch-test.henshihui.com'

    break
  case 'prod':
    medialibs = 'http://medialibs.idouzi.com'
    backend = 'http://mini-wallet.henshihui.com'
    henshihuiMall = 'http://mall.henshihui.com'
    admin = 'http://admin.idouzi.com'
    launch = 'http://launch.henshihui.com'

    break

  default:
    medialibs = 'http://medialibs.idouzi.com'
    backend = 'http://mini-wallet.henshihui.com'
    henshihuiMall = 'http://mall.henshihui.com'
    admin = 'http://admin.idouzi.com'
    launch = 'http://launch.henshihui.com'

    break
  }
}

export default {
  medialibs,
  admin,
  backend,
  henshihuiMall,
  launch
}
