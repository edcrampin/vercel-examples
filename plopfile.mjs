export default function (plop) {
  const transformName = (str) => {
    return str.toLowerCase().replace(/ /g, '-')
  }

  // create your generators here
  plop.setGenerator('example', {
    description: 'new example in repo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Example name: ',
      },
      {
        type: 'list',
        name: 'exampleScopeFolder',
        message: 'Scope (Example folder): ',
        choices: [
          { name: 'Solutions', value: 'solutions' },
          { name: 'Edge Functions', value: 'edge-functions' },
        ],
      },
      {
        type: 'list',
        name: 'framework',
        when: (options) => options.exampleScopeFolder === 'edge-functions',
        message: 'What framework should the edge function use? ',
        choices: [
          { name: 'Next.js', value: 'nextjs' },
          { name: "Vercel's File System API", value: 'filesystem-api' },
        ],
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'What options do you like?',
        when: (options) =>
          options.exampleScopeFolder === 'solutions' ||
          (options.exampleScopeFolder === 'edge-functions' &&
            options.framework === 'nextjs'),
        choices: [
          {
            name: 'Next.js API Routes - Serverless Functions: Hello world',
            value: 'next-api-pages',
            checked: true,
          },
          { name: 'Next.js Middleware Function', value: 'middleware' },
        ],
      },
    ],
    actions: (data) => {
      const plopExampleName = transformName(data.name)
      const frameworkSubdirectory = data.framework ? `/${data.framework}` : ''
      const plopPath = `${data.exampleScopeFolder}${frameworkSubdirectory}/${plopExampleName}`

      const filesToAlwaysCopyOver = [
        'README.md',
        'tsconfig.json',
        '.eslintrc.json',
        'next.config.js',
        '.gitignore',
        'next-env.d.ts',
        'package.json',
        'pages/index.tsx',
        'pages/_app.tsx',
        'postcss.config.js',
        'tailwind.config.js',
        'public/favicon.ico',
      ]

      const actions = []

      // Copy over basic files
      filesToAlwaysCopyOver.forEach((file) => {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/${file}`,
          templateFile: `plop-templates/example/${file}`,
        })
      })

      // modify _app.tsx
      actions.push({
        type: 'modify',
        path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/pages/_app.tsx`,
        pattern: /(-- PLOP PATH HERE --)/gi,
        template: `${plopPath}`,
      })
      actions.push({
        type: 'modify',
        path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/pages/_app.tsx`,
        pattern: /(-- PLOP TITLE HERE --)/gi,
        template: `${data.name}`,
      })

      if (data.options && data.options.includes('next-api-pages')) {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/pages/api/hello.ts`,
          templateFile: `plop-templates/example/pages/api/hello.ts`,
        })
      }

      if (data.options && data.options.includes('middleware')) {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/pages/_middleware.ts`,
          templateFile: `plop-templates/example/pages/_middleware.ts`,
        })
      }

      return [
        ...actions,
        // README.md
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP TITLE HERE --)/gi,
          template: `${data.name}`,
        },
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP EXAMPLE NAME HERE --)/gi,
          template: `${plopExampleName}`,
        },
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP PATH HERE --)/gi,
          template: `${plopPath}`,
        },
        // package.json
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/package.json`,
          pattern: /(-- PLOP EXAMPLE NAME HERE --)/gi,
          template: `${plopExampleName}`,
        },

        // pages/index.tsx
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}${frameworkSubdirectory}/${plopExampleName}/pages/index.tsx`,
          pattern: /(-- PLOP TITLE HERE --)/gi,
          template: `${data.name}`,
        },
      ]
    },
  })
}
