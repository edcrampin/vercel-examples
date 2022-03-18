function isAsset(url) {
  return /\.(png|jpe?g|gif|css|js|svg|ico|map|json)$/i.test(url.pathname)
}

export default function middleware(req: Request) {
  const url = new URL(req.url)

  // If the request is requesting an asset file, do not run our
  // middleware function.
  if (isAsset(url)) {
    // Continue with Vercel's default asset handler
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    })
  }

  const basicAuth = req.headers['authorization']

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const decodedAuth = atob(auth).split(':')
    const user = decodedAuth[0]
    const pwd = decodedAuth[1]

    if (user === '4dmin' && pwd === 'testpwd123') {
      return new Response(null, {
        headers: {
          'x-middleware-next': '1',
        },
      })
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
