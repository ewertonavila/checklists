
import { ChecklistSection, ItemStatus } from './types';

const createItems = (labels: string[]): any[] => 
  labels.map(label => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    status: 'PENDING' as ItemStatus
  }));

export const INITIAL_SECTIONS: ChecklistSection[] = [
  {
    id: 'pre-forma',
    title: 'Pré-Forma',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'pre-pilares',
        title: 'Pilares',
        items: createItems(['Dimensão', 'Numeração', 'Variação de seção', 'Nasce/Segue/Morre', 'Simetria nos pilares', 'Interferência na arquitetura'])
      },
      {
        id: 'pre-vigas',
        title: 'Vigas',
        items: createItems(['Dimensão', 'Numeração', 'Encontros', 'Padronização de alturas'])
      },
      {
        id: 'pre-lajes',
        title: 'Lajes',
        items: createItems(['Altura', 'Numeração', 'Rebaixos', 'Maciça/Nervurada'])
      },
      {
        id: 'pre-reservatorios',
        title: 'Reservatórios',
        items: createItems(['Altura das lajes - tampa e fundo', 'Alçapões', 'Mísulas', 'Capacidade e lamina d’água', 'Altura das paredes', 'Níveis'])
      },
      {
        id: 'pre-pendencias',
        title: 'Pendências',
        items: createItems(['Vigas dos elevadores', 'Furação com markup', 'Dúvidas de compatibilização', 'Balancim', 'Nível água reservatórios'])
      },
      {
        id: 'pre-checagem',
        title: 'Checagem',
        items: createItems(['Arquitetura', 'Paisagismo', 'Cortes ARQ/PAI', 'Relatórios/Atas/Bimcollab/E-mails'])
      },
      {
        id: 'pre-diversos',
        title: 'Diversos',
        items: createItems(['Eixos', 'Cortes localizados', 'Cortes completos', 'Legenda das hachuras', 'Platibanda', 'Balancim (Repetido)', 'Carga de varanda', 'Empenas'])
      },
      {
        id: 'pre-subsolos',
        title: 'Subsolos/Térreos',
        items: createItems(['Desnível de periferia', 'Vazios de ventilação', 'Detalhe laje nervurada', 'Junta de dilatação', 'Mureta de estacionamento ou virada concreto'])
      },
      {
        id: 'pre-observacoes',
        title: 'Observações',
        items: createItems(['Vigas dos pavimentos', 'Concretos', 'Cargas', 'Jardim', 'Sistema de escoramento', 'Tipo de alvenaria'])
      },
      {
        id: 'pre-esquema-alturas',
        title: 'Esquema de Alturas',
        items: createItems(['P.D.', 'Níveis', 'Nome dos pavimentos', 'Concretos (Repetido)'])
      },
      {
        id: 'pre-detalhes',
        title: 'Detalhes',
        items: createItems(['Emplacamento', 'Variação de concreto'])
      },
      {
        id: 'pre-atp',
        title: 'ATP',
        items: createItems(['Verificar ATP do estudo', 'Verificar ATP externo'])
      }
    ]
  },
  {
    id: 'furacao',
    title: 'Furação',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'furos',
        title: 'Furos',
        items: createItems(['Dimensão', 'H', 'Cotas', 'Detalhes ampliados', 'Detalhe de diretriz', 'Checagem da viabilidade da furação'])
      },
      {
        id: 'diversos-furacao',
        title: 'Diversos',
        items: createItems(['Medidas inteiras', 'Sem cotas sobrepostas', 'Sem cotas editadas', 'Modelo'])
      }
    ]
  },
  {
    id: 'fundacao-contencao',
    title: 'Fundação e Contenção',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'fund-pilares',
        title: 'Pilares',
        items: createItems(['Dimensão', 'Numeração', 'Detalhe', 'Blocos/Sapatas', 'Estacas/Tubulão/Perfil', 'Fretagem', 'Alturas', 'Folga', 'Cotas nos detalhes', 'Numeração dos detalhes'])
      },
      {
        id: 'fund-elevador',
        title: 'Elevador',
        items: createItems(['Altura do poço', 'Altura das vigas de contorno'])
      },
      {
        id: 'fund-cortes',
        title: 'Cortes',
        items: createItems(['Vigas', 'Pilares', 'Altura do poço', 'Sapatas representadas abaixo', 'Blocos e estacas', 'Escada'])
      },
      {
        id: 'fund-vigas-baldrames',
        title: 'Vigas Baldrames',
        items: createItems(['Numeração', 'Dimensão', 'Caixilho'])
      },
      {
        id: 'fund-vigas-alavancas',
        title: 'Vigas Alavancas',
        items: createItems(['Posição da estaca', 'Cotas', 'PS (sapata)'])
      },
      {
        id: 'fund-tabela-niveis',
        title: 'Tabela de Níveis',
        items: createItems(['Pilares', 'Nível de arrasamento', 'Face Superior Máxima', 'Altura blocos/sapatas', 'Chegagem arquitetura', 'Chegagem paisagismo'])
      },
      {
        id: 'fund-vigas-travamento',
        title: 'Vigas de Travamento',
        items: createItems(['Sapatas', 'Pilares de elevadores'])
      },
      {
        id: 'fund-detalhes',
        title: 'Detalhes',
        items: createItems(['Seção genérica de blocos', 'Detalhe genérico das sapatas', 'Detalhe de ligação perfil bloco'])
      },
      {
        id: 'fund-contencao',
        title: 'Contenção',
        items: createItems(['Tipo de contenção verificado', 'Representação/numeração dos perfis', 'Representação das estacas', 'Representação das paredes de diafragma', 'VTRs', 'Vigas de coroamento'])
      },
      {
        id: 'fund-vistas',
        title: 'Vistas',
        items: createItems(['Vistas Gerais'])
      },
      {
        id: 'fund-arrasamento',
        title: 'Arrasamento',
        items: createItems(['Arquitetura', 'Paisagismo', 'Projeto de Contenção', 'Planialtimétrico'])
      }
    ]
  },
  {
    id: 'locacao',
    title: 'Locação',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'loc-pilares',
        title: 'Pilares',
        items: createItems(['Dimensão', 'Numeração', 'Detalhe', 'CG', 'Pontos de carga', 'Pilares na contenção'])
      },
      {
        id: 'loc-terreno',
        title: 'Terreno',
        items: createItems(['Perímetro', 'Divisa', 'Amarração', 'Ponto de referência', 'RN', 'Diagrama de empuxo', 'Contenção tracejada'])
      },
      {
        id: 'loc-pendencias',
        title: 'Pendências',
        items: createItems(['Confirmar amarração e RN', 'Divisas', 'Limite de terreno'])
      },
      {
        id: 'loc-diversos',
        title: 'Diversos',
        items: createItems(['Eixos', 'Caixa de elevador tracejada', 'Cotas', 'Cotas acumuladas', 'Cota 90º', 'Detalhe de cotas', 'Quadro de cargas', 'Implantação geral', 'Planta chave', 'Carga de muro', 'Observações', 'Folha', 'Representação de reservatórios'])
      }
    ]
  },
  {
    id: 'escada',
    title: 'Escada',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'esc-diversos',
        title: 'Diversos',
        items: createItems(['Convencional/Pré', 'Esquema de alturas', 'Observações', 'Folha', 'Bocel e detalhe', 'Pé direito', 'Checar Blondel', 'Pendências'])
      },
      {
        id: 'esc-plantas',
        title: 'Plantas',
        items: createItems(['Cotas', 'Degraus enumerados', 'Representação do pavimento'])
      },
      {
        id: 'esc-cortes',
        title: 'Cortes',
        items: createItems(['Esquema de alturas', 'Degraus enumerados', 'Espessura das lajes', 'Representação da estrutura', 'Alturas de espelhos differentes', 'Cotas', 'Indicação de revestimento'])
      },
      {
        id: 'esc-arquitetura',
        title: 'Arquitetura',
        items: createItems(['Saída do lance', 'Chegada do lance', 'Número de degraus', 'Revestimento do pavimento', 'Revestimento piso/espelho'])
      }
    ]
  },
  {
    id: 'rampa',
    title: 'Rampa',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'rampa-diversos',
        title: 'Diversos',
        items: createItems(['Saída', 'Chegada', 'Inclinação', 'Adoçamento', 'Revestimento', 'Grelha', 'Vigas de apoio e VRs', 'Enchimento', 'Grelha (Repetido)'])
      }
    ]
  },
  {
    id: 'desenvolvimento-da-forma',
    title: 'Desenvolvimento da Forma',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'dev-diversos-1',
        title: 'Diversos (Coluna 1)',
        items: createItems(['Cotas', 'Cotas acumuladas', 'Cotas de nervuras', 'Cotas furos', 'Ver na obra', 'Detalhes de vigas', 'Detalhes de blocos de transição', 'Detalhes de pilares', 'Detalhe diretriz de furação', 'Checar quadro de quantitativo', 'Checar vigas das rampas', 'Encontros de vigas', 'Retirar "m" dos níveis'])
      },
      {
        id: 'dev-diversos-2',
        title: 'Diversos (Coluna 2)',
        items: createItems(['Cortes completos', 'Cortes localizados', 'Cotas dos cortes localizados', 'Variação de pilares', 'Compatibilização da escada (apoios)', 'Representação da escada', 'Checar pendências', 'Checar detalhes específicos', 'Checar detalhes de fundação', 'Checar nas observações nº vigas', 'Checar observações', 'Checar hachuras e tabela', 'Planta chave', 'Junta de dilatação'])
      }
    ]
  },
  {
    id: 'acertos-de-formas',
    title: 'Acertos de Formas',
    projectCode: '',
    designer: '',
    reviewer: '',
    categories: [
      {
        id: 'comentarios-atendidos',
        title: 'Comentários Atendidos',
        items: createItems(['Arquitetura', 'Paisagismo', 'Relatório/Ata', 'E-mails', 'Bimcollab, construflow...'])
      },
      {
        id: 'desenho-desenvolvimento',
        title: 'Desenho e Desenvolvimento',
        items: createItems(['Modelo ajustado', 'Cotas ajustadas', 'Cortes ajustados'])
      }
    ]
  }
];
