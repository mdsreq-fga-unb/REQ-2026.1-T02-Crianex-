import React, {type ReactNode} from 'react';

type Member = {
  name: string;
  gh: string;
  roles: string[];
  avail: string;
  resp: string[];
};

const MEMBERS: Member[] = [
  {
    name: 'Lucas Andrade Zanetti', gh: 'Bappoz', avail: '9 h/sem',
    roles: ['Project Manager', 'Chief Architect', 'Dev. Manager (backup)'],
    resp: [
      'PM/DM: gerenciar roadmap, prazos e interface com cliente/professor; conduzir Replenishment.',
      'Chief Architect: liderar a modelagem de domínio e decisões estruturais da arquitetura.',
      'DM backup: desbloquear issues críticas.',
    ],
  },
  {
    name: 'Heitor Macedo Ricardo', gh: 'HeitorM50', avail: '5–8 h/sem',
    roles: ['Development Manager', 'Class Owner'],
    resp: [
      'DM: coordenar o progresso técnico diário (Kanban), WIP limits e a consolidação final do Build.',
      'Class Owner: desenvolver e testar classes/features específicas.',
    ],
  },
  {
    name: 'Leonardo Fachinello Bonetti', gh: 'LeoFacB', avail: '5–8 h/sem',
    roles: ['Chief Programmer', 'Class Owner'],
    resp: [
      'Chief Programmer: conduzir o Technical Design Review (Backend/Infra/K8s); aprovar PRs estruturais.',
      'Class Owner: desenvolver o código das responsabilidades assumidas no design.',
    ],
  },
  {
    name: 'Philipe Amancio Reis Caetano', gh: 'Phill-Chill', avail: 'até 4 h/sem',
    roles: ['Chief Programmer', 'Class Owner'],
    resp: [
      'Chief Programmer: decisões técnicas e revisões de PR focadas em Frontend e QA; design detalhado.',
      'Class Owner: implementar de ponta a ponta as partes da interface sob sua responsabilidade.',
    ],
  },
  {
    name: 'Hugo Freitas Silva', gh: 'HugoFreitass', avail: 'até 4 h/sem',
    roles: ['Class Owner'],
    resp: [
      'Implementação primária de código, garantindo regras de negócio e critérios de aceite codificados e testados.',
      'Atualização do board em tempo real e code review entre pares.',
    ],
  },
  {
    name: 'Camile Barbosa Gonzaga de Oliveira', gh: 'Camile0318', avail: 'até 4 h/sem',
    roles: ['Class Owner', 'Documentation Lead', 'Requirements Custodian'],
    resp: [
      'Requirements/Docs: gestão dos artefatos (feature cards, rastreabilidade, critérios) e do Documento de Visão.',
      'Class Owner: desenvolver e testar features alocadas.',
    ],
  },
];

export default function TeamMembers(): ReactNode {
  return (
    <div className="crianex-team">
      {MEMBERS.map((m) => (
        <div className="crianex-team__card" key={m.gh} tabIndex={0}>
          <img src={`https://github.com/${m.gh}.png?size=200`} alt={m.name} loading="lazy" />
          <div className="crianex-team__name">{m.name.split(' ')[0]} {m.name.split(' ').slice(-1)}</div>
          <div className="crianex-team__role-main">{m.roles[0]}</div>
          <div className="crianex-team__pop" role="tooltip">
            <div className="crianex-team__pop-name">{m.name}</div>
            <div className="crianex-team__chips">
              {m.roles.map((r) => (
                <span className="crianex-team__chip" key={r}>{r}</span>
              ))}
            </div>
            <div className="crianex-team__avail">⏱ Disponibilidade: <strong>{m.avail}</strong></div>
            <ul className="crianex-team__resp">
              {m.resp.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
