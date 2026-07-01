import React from 'react';
import DocSidebarMobile from '@theme/DocSidebar/Mobile';
import type {Props} from '@theme/DocSidebar';

/* Swizzle do componente padrão: o original só monta `DocSidebarMobile`
   (que registra a árvore de páginas como conteúdo do menu secundário do
   drawer, via NavbarSecondaryMenuFiller) quando `windowSize === 'mobile'`
   — em telas maiores ele monta `DocSidebarDesktop` (a coluna fixa que
   este site já esconde via CSS). Resultado: o drawer nunca recebia a
   árvore de páginas em telas ≥ 996px, então abrir o menu mostrava só os
   itens da navbar (PrimaryMenu) — o mesmo conteúdo que já aparece na
   topbar.

   Aqui a versão mobile é montada sempre, em qualquer largura, e a
   desktop nunca é usada — a árvore de páginas só existe mesmo dentro do
   drawer (ver também src/theme/Navbar/MobileSidebar). */
export default function DocSidebar(props: Props): React.ReactElement {
  return <DocSidebarMobile {...props} />;
}
