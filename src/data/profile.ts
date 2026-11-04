export type Lang = 'en' | 'vi';
export type L = { en: string; vi: string };

export const site = {
  url: 'https://channghiep.io.vn',
  name: 'Nghiep Nguyen',
  fullName: 'Nguyễn Chấn Nghiệp',
  email: 'nghiepnguyen2112@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nghiep-nguyen-028187194/',
  location: { en: 'Ho Chi Minh City, Vietnam', vi: 'TP. Hồ Chí Minh, Việt Nam' } as L,
  role: { en: 'Senior Application Engineer @ Akselos', vi: 'Senior Application Engineer @ Akselos' } as L,
  tagline: {
    en: 'Simulation engineer turning physics into products.',
    vi: 'Kỹ sư mô phỏng biến bài toán vật lý thành sản phẩm số.',
  } as L,
  intro: {
    en: '6+ years in CAE/CFD, connecting the physical world, simulation and digital twins into one ecosystem — and building the software and AI agents that automate it.',
    vi: 'Hơn 6 năm làm CAE/CFD, kết nối thế giới vật lý, mô phỏng và digital twin thành một hệ sinh thái — và xây phần mềm, AI agent để tự động hoá nó.',
  } as L,
  description: {
    en: 'Nghiep Nguyen — Senior Application Engineer at Akselos. CFD, digital twins, simulation-driven design and AI automation for engineering.',
    vi: 'Nghiep Nguyen — Senior Application Engineer tại Akselos. CFD, digital twin, thiết kế dựa trên mô phỏng và tự động hoá kỹ thuật bằng AI.',
  } as L,
};

export const stats: { value: string; label: L }[] = [
  { value: '6+', label: { en: 'years in CAE / CFD', vi: 'năm kinh nghiệm CAE / CFD' } },
  { value: '8+', label: { en: 'industrial R&D projects', vi: 'dự án R&D công nghiệp' } },
  { value: '40–60%', label: { en: 'faster simulation turnaround', vi: 'rút ngắn thời gian mô phỏng' } },
  { value: '12–18%', label: { en: 'aerodynamic drag reduction', vi: 'giảm lực cản khí động' } },
  { value: '±5%', label: { en: 'vs. experiment, thermal validation', vi: 'sai lệch so với thực nghiệm' } },
  { value: '3%', label: { en: 'ship energy savings (up to)', vi: 'tiết kiệm năng lượng tàu (tối đa)' } },
];

export const pillars: { key: string; title: L; body: L; tags: string[] }[] = [
  {
    key: 'sim',
    title: { en: 'Simulation', vi: 'Mô phỏng' },
    body: {
      en: 'CFD across marine, automotive and energy — from turbulence and multiphase flow to heat transfer — cross-validated across solvers and against experiment.',
      vi: 'CFD cho hàng hải, ô tô và năng lượng — từ rối, dòng đa pha đến truyền nhiệt — kiểm chứng chéo giữa các solver và với thực nghiệm.',
    },
    tags: ['OpenFOAM', 'ANSYS Fluent', 'STAR-CCM+', 'FEM', 'Slurm / HPC'],
  },
  {
    key: 'product',
    title: { en: 'Product', vi: 'Sản phẩm' },
    body: {
      en: 'Led product vision and roadmap for a CFD software, translating engineering needs into solver features, workflow integrations and faster turnaround.',
      vi: 'Định hướng tầm nhìn và lộ trình cho một phần mềm CFD, biến nhu cầu kỹ thuật thành tính năng solver, tích hợp quy trình và tốc độ xử lý.',
    },
    tags: ['Product Management', 'Roadmapping', 'Scrum', 'QA'],
  },
  {
    key: 'ai',
    title: { en: 'Automation & AI', vi: 'Tự động hoá & AI' },
    body: {
      en: 'Building intelligent tools that take the repetitive work out of simulation — from scripted HPC pipelines to AI agents that automate meshing.',
      vi: 'Xây công cụ thông minh loại bỏ việc lặp lại trong mô phỏng — từ pipeline HPC tự động đến AI agent tự động hoá chia lưới.',
    },
    tags: ['Python', 'AI Agents', 'Surrogate models', 'Bash', 'Linux'],
  },
];

export type Industry = 'maritime' | 'automotive' | 'energy' | 'oilgas' | 'software';
export const industries: Record<Industry, L> = {
  maritime: { en: 'Maritime', vi: 'Hàng hải' },
  automotive: { en: 'Automotive', vi: 'Ô tô' },
  energy: { en: 'Energy', vi: 'Năng lượng' },
  oilgas: { en: 'Oil & Gas', vi: 'Dầu khí' },
  software: { en: 'Software & AI', vi: 'Phần mềm & AI' },
};

export type Project = {
  slug: string;
  art: 'tank' | 'hull' | 'body' | 'exchanger' | 'roadmap' | 'mesh' | 'pipe' | 'cargo' | 'exhaust';
  industry: Industry;
  featured?: boolean;
  highlight?: L;
  metric?: { value: string; label: L };
  org: string;
  period: string;
  title: L;
  summary: L;
  context: L;
  approach: L[];
  outcome: L[];
  tools: string[];
};

export const projects: Project[] = [
  {
    slug: 'sloshing-baffle-optimization',
    art: 'tank',
    industry: 'maritime',
    featured: true,
    highlight: { en: 'Presented at COMPSAFE 2025, Japan', vi: 'Báo cáo tại COMPSAFE 2025, Nhật Bản' },
    org: 'TechnoStar',
    period: '2025',
    title: {
      en: 'Baffle optimization for sloshing tanks with surrogate models',
      vi: 'Tối ưu vách chắn bồn chống sóng sánh bằng surrogate model',
    },
    summary: {
      en: 'Optimizing baffle characteristics of rectangular and prismatic tanks by coupling CFD simulation with surrogate modeling.',
      vi: 'Tối ưu đặc tính vách chắn cho bồn chữ nhật và lăng trụ bằng cách kết hợp mô phỏng CFD với surrogate model.',
    },
    context: {
      en: 'Liquid sloshing in partially filled tanks creates large dynamic loads on the structure. Baffles damp the motion, but every geometry candidate needs an expensive transient CFD run — making a brute-force design search impractical.',
      vi: 'Chất lỏng sóng sánh trong bồn chứa không đầy tạo tải trọng động lớn lên kết cấu. Vách chắn giúp giảm dao động, nhưng mỗi phương án hình học đều cần một lần chạy CFD transient tốn kém — dò tìm kiểu vét cạn là không khả thi.',
    },
    approach: [
      { en: 'Parameterized baffle characteristics for rectangular and prismatic tank shapes.', vi: 'Tham số hoá đặc tính vách chắn cho bồn dạng chữ nhật và lăng trụ.' },
      { en: 'Ran CFD sloshing simulations on a sampled set of designs.', vi: 'Chạy mô phỏng CFD sóng sánh trên tập thiết kế được lấy mẫu.' },
      { en: 'Trained a surrogate model on the results to explore the design space and locate optimal configurations at a fraction of the cost.', vi: 'Huấn luyện surrogate model từ kết quả để khám phá không gian thiết kế và tìm cấu hình tối ưu với chi phí thấp hơn nhiều.' },
    ],
    outcome: [
      { en: 'Oral presentation at COMPSAFE 2025, the International Conference on Computational Engineering and Science for Safety and Environmental Problems, Japan.', vi: 'Báo cáo miệng tại hội thảo quốc tế COMPSAFE 2025 (Computational Engineering and Science for Safety and Environmental Problems), Nhật Bản.' },
      { en: 'A reusable CFD + surrogate workflow for simulation-driven design.', vi: 'Một quy trình CFD + surrogate tái sử dụng được cho thiết kế dựa trên mô phỏng.' },
    ],
    tools: ['OpenFOAM', 'Surrogate modeling', 'Python', 'Slurm'],
  },
  {
    slug: 'ai-meshing-agent',
    art: 'mesh',
    industry: 'software',
    featured: true,
    highlight: { en: 'Current work', vi: 'Đang thực hiện' },
    org: 'Akselos',
    period: '2026',
    title: { en: 'AI agent for meshing automation', vi: 'AI agent tự động hoá chia lưới' },
    summary: {
      en: 'Using AI agents to automate the meshing step of the simulation workflow.',
      vi: 'Dùng AI agent để tự động hoá bước chia lưới trong quy trình mô phỏng.',
    },
    context: {
      en: 'Meshing is one of the most manual, expertise-heavy steps between a CAD model and a trustworthy simulation — and a bottleneck when building digital twins at scale.',
      vi: 'Chia lưới là một trong những bước thủ công và đòi hỏi kinh nghiệm nhất giữa mô hình CAD và một kết quả mô phỏng đáng tin — và là nút thắt khi xây digital twin ở quy mô lớn.',
    },
    approach: [
      { en: 'Designing an agent-driven workflow that handles repetitive meshing tasks.', vi: 'Thiết kế quy trình do agent điều khiển để xử lý các tác vụ chia lưới lặp lại.' },
      { en: 'Packaging engineering know-how as agent skills and automations.', vi: 'Đóng gói kinh nghiệm kỹ thuật thành agent skill và automation.' },
    ],
    outcome: [
      { en: 'In progress at Akselos.', vi: 'Đang triển khai tại Akselos.' },
    ],
    tools: ['AI Agents', 'Python', 'Agent skills', 'Linux'],
  },
  {
    slug: 'jupiter-cfd-product',
    art: 'roadmap',
    industry: 'software',
    featured: true,
    metric: { value: '40–60%', label: { en: 'faster turnaround', vi: 'nhanh hơn' } },
    org: 'TechnoStar',
    period: '2024 – 2026',
    title: { en: 'Product leadership for Jupiter CFD', vi: 'Quản lý sản phẩm phần mềm Jupiter CFD' },
    summary: {
      en: 'Product vision, strategy and roadmap for a CFD software — cutting simulation turnaround time by 40–60%.',
      vi: 'Tầm nhìn, chiến lược và lộ trình cho một phần mềm CFD — rút ngắn 40–60% thời gian mô phỏng.',
    },
    context: {
      en: 'A CFD product has to balance advanced physics, numerical accuracy and the day-to-day speed engineers need — across development, HPC, sales and support teams.',
      vi: 'Một sản phẩm CFD phải cân bằng giữa vật lý nâng cao, độ chính xác số và tốc độ mà kỹ sư cần hằng ngày — giữa các đội phát triển, HPC, kinh doanh và hỗ trợ.',
    },
    approach: [
      { en: 'Defined product vision, strategy and roadmap, aligning solver development with turbulence modeling, multiphase flow and performance work.', vi: 'Xác định tầm nhìn, chiến lược và lộ trình, gắn phát triển solver với mô hình rối, dòng đa pha và hiệu năng tính toán.' },
      { en: 'Worked with CFD development, HPC, sales and support teams on workflow integrations and solver acceleration.', vi: 'Phối hợp đội CFD, HPC, kinh doanh và hỗ trợ cho các tích hợp quy trình và tăng tốc solver.' },
      { en: 'Bridged engineering needs, software functionality and customer use cases across the product lifecycle.', vi: 'Làm cầu nối giữa nhu cầu kỹ thuật, tính năng phần mềm và tình huống sử dụng của khách hàng trong suốt vòng đời sản phẩm.' },
    ],
    outcome: [
      { en: 'Simulation turnaround time reduced by 40–60% while maintaining numerical accuracy.', vi: 'Thời gian mô phỏng giảm 40–60% mà vẫn giữ độ chính xác số.' },
    ],
    tools: ['Product Management', 'Scrum', 'HPC', 'CFD'],
  },
  {
    slug: 'ship-trim-energy-efficiency',
    art: 'hull',
    industry: 'maritime',
    featured: true,
    metric: { value: '3%', label: { en: 'energy savings', vi: 'tiết kiệm năng lượng' } },
    org: 'TechnoStar',
    period: '2020 – 2026',
    title: { en: 'Ship energy efficiency & trim optimization', vi: 'Hiệu quả năng lượng & tối ưu trim cho tàu' },
    summary: {
      en: 'Hydrodynamic assessment and design-focused analysis delivering ship energy savings of up to 3%.',
      vi: 'Đánh giá thuỷ động lực và phân tích thiết kế, giúp tàu tiết kiệm tới 3% năng lượng.',
    },
    context: {
      en: 'For a ship in service, small changes in hydrodynamic resistance compound into significant fuel and emissions over its lifetime.',
      vi: 'Với một con tàu đang vận hành, thay đổi nhỏ về lực cản thuỷ động cộng dồn thành lượng nhiên liệu và khí thải đáng kể trong suốt vòng đời.',
    },
    approach: [
      { en: 'CFD-based hydrodynamic assessment of the hull across operating conditions.', vi: 'Đánh giá thuỷ động lực thân tàu bằng CFD ở nhiều điều kiện vận hành.' },
      { en: 'Trim optimization and design-focused analysis to identify efficiency gains.', vi: 'Tối ưu trim và phân tích thiết kế để tìm điểm cải thiện hiệu suất.' },
    ],
    outcome: [{ en: 'Energy savings of up to 3%.', vi: 'Tiết kiệm năng lượng tới 3%.' }],
    tools: ['OpenFOAM', 'Linux', 'Slurm'],
  },
  {
    slug: 'aerodynamic-drag-reduction',
    art: 'body',
    industry: 'automotive',
    metric: { value: '12–18%', label: { en: 'less drag', vi: 'giảm lực cản' } },
    org: 'TechnoStar',
    period: '2020 – 2026',
    title: { en: 'Aerodynamic drag reduction', vi: 'Giảm lực cản khí động' },
    summary: {
      en: 'CFD R&D on external aerodynamics, achieving 12–18% drag reduction.',
      vi: 'R&D khí động học ngoài bằng CFD, giảm 12–18% lực cản.',
    },
    context: {
      en: 'Aerodynamic drag drives energy consumption; finding where flow separates and how to control it is the key to reducing it.',
      vi: 'Lực cản khí động quyết định mức tiêu thụ năng lượng; tìm ra nơi dòng chảy tách và cách kiểm soát nó là chìa khoá để giảm lực cản.',
    },
    approach: [
      { en: 'External-flow CFD with OpenFOAM to analyze separation and wake.', vi: 'Mô phỏng dòng ngoài bằng OpenFOAM để phân tích tách dòng và vùng xoáy sau.' },
      { en: 'Design iterations evaluated against the baseline.', vi: 'Đánh giá các vòng lặp thiết kế so với phương án gốc.' },
    ],
    outcome: [{ en: '12–18% reduction in aerodynamic drag.', vi: 'Giảm 12–18% lực cản khí động.' }],
    tools: ['OpenFOAM', 'ANSYS Fluent', 'STAR-CCM+'],
  },
  {
    slug: 'heat-exchanger-validation',
    art: 'exchanger',
    industry: 'energy',
    metric: { value: '±5%', label: { en: 'vs. experiment', vi: 'so với thực nghiệm' } },
    org: 'TechnoStar',
    period: '2020 – 2026',
    title: { en: 'Heat exchanger thermal validation', vi: 'Kiểm chứng nhiệt cho bộ trao đổi nhiệt' },
    summary: {
      en: 'Conjugate thermal CFD validated within ±5% of experimental data.',
      vi: 'Mô phỏng nhiệt CFD được kiểm chứng sai lệch trong ±5% so với thực nghiệm.',
    },
    context: {
      en: 'Simulation only drives design decisions when engineers can trust it — which means proving it against measurements.',
      vi: 'Mô phỏng chỉ dẫn dắt được quyết định thiết kế khi kỹ sư tin được nó — nghĩa là phải chứng minh bằng số đo thực tế.',
    },
    approach: [
      { en: 'Thermal-flow CFD of the heat exchanger.', vi: 'Mô phỏng nhiệt – dòng chảy cho bộ trao đổi nhiệt.' },
      { en: 'Systematic comparison with experimental data and cross-checks between solvers.', vi: 'So sánh có hệ thống với dữ liệu thực nghiệm và kiểm tra chéo giữa các solver.' },
    ],
    outcome: [{ en: 'Results within ±5% of experiment.', vi: 'Kết quả sai lệch trong khoảng ±5% so với thực nghiệm.' }],
    tools: ['OpenFOAM', 'ANSYS Fluent', 'STAR-CCM+'],
  },
  {
    slug: 'cargo-tank-thermal-flow',
    art: 'cargo',
    industry: 'maritime',
    org: 'TechnoStar',
    period: '2020 – 2026',
    title: { en: 'Cargo tank thermal-flow analysis', vi: 'Phân tích nhiệt – dòng chảy bồn hàng' },
    summary: {
      en: 'Temperature distribution, heat transfer and internal flow behavior in cargo tanks.',
      vi: 'Phân bố nhiệt độ, truyền nhiệt và dòng chảy bên trong bồn hàng.',
    },
    context: {
      en: 'Temperature-sensitive cargo requires understanding how heat moves and how the fluid circulates inside the tank.',
      vi: 'Hàng hoá nhạy nhiệt đòi hỏi hiểu rõ nhiệt truyền thế nào và chất lỏng tuần hoàn ra sao trong bồn.',
    },
    approach: [
      { en: 'CFD of temperature distribution, heat transfer and internal flow characteristics.', vi: 'Mô phỏng CFD phân bố nhiệt độ, truyền nhiệt và đặc tính dòng chảy bên trong.' },
    ],
    outcome: [{ en: 'Thermal-flow insight for engineering evaluation.', vi: 'Cung cấp dữ liệu nhiệt – dòng chảy cho đánh giá kỹ thuật.' }],
    tools: ['OpenFOAM', 'Linux', 'Slurm'],
  },
  {
    slug: 'exhaust-cavitation-detection',
    art: 'exhaust',
    industry: 'automotive',
    org: 'TechnoStar',
    period: '2020 – 2026',
    title: { en: 'Exhaust cavitation detection', vi: 'Phát hiện xâm thực trong hệ thống xả' },
    summary: {
      en: 'Using CFD to detect cavitation risk in an exhaust system.',
      vi: 'Dùng CFD để phát hiện nguy cơ xâm thực trong hệ thống xả.',
    },
    context: {
      en: 'Cavitation causes noise, erosion and performance loss — and is hard to observe directly.',
      vi: 'Xâm thực gây tiếng ồn, ăn mòn và giảm hiệu suất — và rất khó quan sát trực tiếp.',
    },
    approach: [
      { en: 'Multiphase CFD to locate low-pressure regions where cavitation occurs.', vi: 'Mô phỏng CFD đa pha để xác định vùng áp suất thấp nơi xảy ra xâm thực.' },
    ],
    outcome: [{ en: 'Cavitation-prone regions identified for design review.', vi: 'Xác định vùng dễ xâm thực để rà soát thiết kế.' }],
    tools: ['OpenFOAM'],
  },
  {
    slug: 'pipeline-ffs-assessment',
    art: 'pipe',
    industry: 'oilgas',
    org: 'Akselos',
    period: '2026',
    title: { en: 'Fitness-for-service assessment of pipelines', vi: 'Đánh giá khả năng làm việc (FFS) cho đường ống' },
    summary: {
      en: 'FFS assessment for protection against plastic collapse of pipelines.',
      vi: 'Đánh giá FFS chống sụp dẻo (plastic collapse) cho đường ống.',
    },
    context: {
      en: 'Aging pipelines must be proven safe to keep operating — fitness-for-service assessment quantifies how much margin remains.',
      vi: 'Đường ống lâu năm phải được chứng minh an toàn để tiếp tục vận hành — đánh giá FFS định lượng biên an toàn còn lại.',
    },
    approach: [
      { en: 'Structural assessment against plastic collapse using simulation.', vi: 'Đánh giá kết cấu chống sụp dẻo bằng mô phỏng.' },
    ],
    outcome: [{ en: 'In progress at Akselos.', vi: 'Đang triển khai tại Akselos.' }],
    tools: ['FEA', 'Digital twin'],
  },
];

export type Step = { year: string; org: string; role: L; body: L; kind: 'edu' | 'work' };
export const journey: Step[] = [
  {
    year: '2016',
    org: 'Ho Chi Minh City University of Technology',
    role: { en: 'B.Eng. Engineering Mechanics', vi: 'Kỹ sư Cơ Kỹ Thuật' },
    body: {
      en: 'Finite element method, structural analysis, behavior of materials, parameter optimization. GPA 8.16/10. Led a volunteer team in the Green Summer campaign.',
      vi: 'Phương pháp phần tử hữu hạn, phân tích kết cấu, ứng xử vật liệu, tối ưu tham số. GPA 8.16/10. Đội trưởng đội tình nguyện Mùa Hè Xanh.',
    },
    kind: 'edu',
  },
  {
    year: '2019',
    org: 'Martech Boiler',
    role: { en: 'Engineering Mechanics Intern', vi: 'Thực tập Cơ Kỹ Thuật' },
    body: {
      en: 'Modeled boiler steel structures in Tekla and checked their strength under wind and earthquake loads in SAP2000.',
      vi: 'Dựng mô hình kết cấu thép lò hơi bằng Tekla và tính bền dưới tải gió, động đất bằng SAP2000.',
    },
    kind: 'work',
  },
  {
    year: '2020',
    org: 'TechnoStar',
    role: { en: 'CAE Engineer Intern', vi: 'Thực tập sinh CAE' },
    body: {
      en: 'CAD/CAE software investigation; first steps in Python. Thesis: free vibration and static analysis of corrugated plates using an equivalent orthotropic plate model.',
      vi: 'Tìm hiểu phần mềm CAD/CAE; bắt đầu học Python. Luận văn: dao động tự do và phân tích tĩnh tấm gợn sóng bằng mô hình tấm trực hướng tương đương.',
    },
    kind: 'work',
  },
  {
    year: '2020',
    org: 'TechnoStar',
    role: { en: 'Senior CFD Engineer', vi: 'Senior CFD Engineer' },
    body: {
      en: 'Led CFD R&D across 8+ industrial projects with OpenFOAM — marine, automotive and thermal — cross-validated with Fluent and STAR-CCM+, run on Linux clusters with Bash and Slurm.',
      vi: 'Dẫn dắt R&D CFD cho hơn 8 dự án công nghiệp với OpenFOAM — hàng hải, ô tô, nhiệt — kiểm chứng chéo với Fluent và STAR-CCM+, chạy trên cluster Linux với Bash và Slurm.',
    },
    kind: 'work',
  },
  {
    year: '2024',
    org: 'TechnoStar',
    role: { en: 'Product Manager — Jupiter CFD', vi: 'Product Manager — Jupiter CFD' },
    body: {
      en: 'Owned vision and roadmap for a CFD software; cut simulation turnaround by 40–60%. Presented sloshing research at COMPSAFE 2025, Japan.',
      vi: 'Phụ trách tầm nhìn và lộ trình cho phần mềm CFD; rút ngắn 40–60% thời gian mô phỏng. Báo cáo nghiên cứu sóng sánh tại COMPSAFE 2025, Nhật Bản.',
    },
    kind: 'work',
  },
  {
    year: '2026',
    org: 'Akselos',
    role: { en: 'Senior Application Engineer', vi: 'Senior Application Engineer' },
    body: {
      en: 'Digital twins for critical infrastructure: pipeline fitness-for-service, project data & QA, and AI agents that automate meshing.',
      vi: 'Digital twin cho hạ tầng trọng yếu: đánh giá FFS đường ống, quản lý dữ liệu & QA dự án, và AI agent tự động hoá chia lưới.',
    },
    kind: 'work',
  },
];

export const talks = [
  {
    year: '2025',
    event: 'COMPSAFE 2025',
    place: { en: 'Japan', vi: 'Nhật Bản' } as L,
    url: 'https://www.compsafe2025.org/',
    type: { en: 'Oral presentation', vi: 'Báo cáo miệng' } as L,
    title: 'Baffle Characteristics Optimization of Rectangular and Prismatic Tank Using Surrogate Model and CFD Simulation',
    project: 'sloshing-baffle-optimization',
  },
];

export const certifications = [
  { name: 'Mastering Claude Code & AI Agents [2026]', issuer: 'Udemy', date: '2026' },
  { name: 'Introduction to Agent Skills', issuer: 'Anthropic', date: '2026' },
  { name: 'Claude Code in Action', issuer: 'Anthropic', date: '2026' },
  { name: 'Scrum: The Basics', issuer: '', date: '' },
];

export const skills: { group: L; items: string[] }[] = [
  { group: { en: 'Simulation', vi: 'Mô phỏng' }, items: ['CFD', 'CAE', 'FEM', 'Turbulence', 'Multiphase', 'Heat transfer', 'Sloshing', 'Surrogate modeling'] },
  { group: { en: 'Tools', vi: 'Công cụ' }, items: ['OpenFOAM', 'ANSYS Fluent', 'STAR-CCM+', 'SAP2000', 'Tekla Structures', 'CAD'] },
  { group: { en: 'Software & compute', vi: 'Phần mềm & tính toán' }, items: ['Python', 'Bash', 'Slurm', 'Ubuntu', 'CentOS', 'HPC / cloud', 'AI agents'] },
  { group: { en: 'Product', vi: 'Sản phẩm' }, items: ['Product Management', 'Project Management', 'Scrum', 'Roadmapping', 'QA'] },
];

export const t = (l: L, lang: Lang) => l[lang];
