import React from 'react';
import {useLockBodyScroll, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

/* Swizzle do componente padrão: o original só monta este drawer quando
   `shouldRender` é true, e isso só acontece em viewport "mobile"
   (< 996px, ver useWindowSize do Docusaurus). Aqui a sidebar convencional
   de desktop fica sempre oculta (ver custom.css) e o drawer mobile é
   reaproveitado como ÚNICA sidebar em qualquer largura — então o gate por
   `shouldRender` tem que sumir, senão o botão de 3 barras só acende o
   backdrop (sempre renderizado em Navbar/Layout, fora deste componente)
   sem nunca montar o conteúdo, deixando a tela cinza sem nada dentro. */
export default function NavbarMobileSidebar(): React.ReactElement {
  const mobileSidebar = useNavbarMobileSidebar();
  useLockBodyScroll(mobileSidebar.shown);

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}
