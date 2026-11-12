# Anotações

1. O que é um layout?
```
Um layout é um componente reutilizável que todas as páginas podem usá-lo. Por exemplo pode ser utilizado para definir um header ou uma navbar e footer para todas as páginas
```

2. O que é um layout persistente e para que serve?
```
Permite persistir um layout durante a navegação. Por exemplo manter a posição do scroll na sidebar
Ex:
Index.layout = (page: Page<{ title: string }>) => (
    <Layout
        title={page.props.title}
        children={page as unknown as React.ReactNode}
    />
);
```

3. O que é um layout predefinido e para que serve?
```
Definido no início da aplicação. Por exemplo, se estiver numa página pública mostra um layout se estiver numa página com proteção aparece outro layout.

import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = page.default.layout || (page => <Layout children={page} />)
        return page
    },
    // ...
})
```