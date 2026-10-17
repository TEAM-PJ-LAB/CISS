import { field, o } from '../dsl';

const a = field('geometry');

export default [
  a('graham-scan', 'Graham Scan', '최저점 기준 극각으로 점을 정렬한 뒤 스택으로 오른쪽 회전을 제거해 볼록 껍질을 O(n log n)에 구하는 알고리즘.',
    [o('graham', 1972, 'An Efficient Algorithm for Determining the Convex Hull of a Finite Planar Set', 'Information Processing Letters 1(4)', 'doi:10.1016/0020-0190(72)90045-2')], { ko: '그레이엄 스캔', aka: ['convex hull'] }),
  a('jarvis-march', 'Jarvis March', '현재 꼭짓점에서 다른 모든 점이 한쪽에 있는 점을 다음 꼭짓점으로 고르는 출력 민감 볼록 껍질 알고리즘.',
    [o('jarvis', 1973, 'On the Identification of the Convex Hull of a Finite Set of Points in the Plane', 'Information Processing Letters 2(1)', 'doi:10.1016/0020-0190(73)90020-3')], { aka: ['gift wrapping'] }),
  a('monotone-chain', "Andrew's Monotone Chain", '점을 x좌표로 정렬해 위·아래 껍질을 따로 스캔하는 그레이엄 스캔 변형.',
    [o('andrew', 1979, 'Another Efficient Algorithm for Convex Hulls in Two Dimensions', 'Information Processing Letters 9(5)', 'doi:10.1016/0020-0190(79)90072-3')]),
  a('chan-hull', "Chan's Algorithm", '작은 묶음마다 그레이엄 스캔을 돌리고 묶음 껍질들 위에서 자비스 행진을 하는 O(n log h) 볼록 껍질 알고리즘.',
    [o('chan-timothy', 1996, 'Optimal Output-Sensitive Convex Hull Algorithms in Two and Three Dimensions', 'Discrete & Computational Geometry 16(4)', 'doi:10.1007/BF02712873')]),
  a('quickhull', 'Quickhull', '가장 먼 점으로 영역을 나누고 내부 점을 버리며 재귀하는 분할 정복 볼록 껍질 알고리즘.', [
    o('eddy', 1977, 'A New Convex Hull Algorithm for Planar Sets', 'ACM Transactions on Mathematical Software 3(4)', 'doi:10.1145/355759.355766'),
    o('bykat', 1978, 'Convex Hull of a Finite Set of Points in Two Dimensions', 'Information Processing Letters 7(6)', 'doi:10.1016/0020-0190(78)90021-2'),
  ]),
  a('qhull', 'Quickhull (n-d) / Qhull', '퀵헐을 임의 차원으로 일반화하고 수치 오차를 다루도록 설계한 볼록 껍질 알고리즘과 구현.',
    [o('barber,dobkin,huhdanpaa', 1996, 'The Quickhull Algorithm for Convex Hulls', 'ACM Transactions on Mathematical Software 22(4)', 'doi:10.1145/235815.235821')]),
  a('bresenham-line', "Bresenham's Line Algorithm", '정수 덧셈과 오차 항만으로 래스터 격자 위에 직선을 그리는 알고리즘.',
    [o('bresenham', 1965, 'Algorithm for Computer Control of a Digital Plotter', 'IBM Systems Journal 4(1)', 'doi:10.1147/sj.41.0025')], { ko: '브레젠험 직선 알고리즘' }),
  a('bresenham-circle', 'Midpoint Circle Algorithm', '팔분원 대칭과 증분 오차 판정으로 원을 정수 연산만으로 래스터화하는 알고리즘.',
    [o('bresenham', 1977, 'A Linear Algorithm for Incremental Digital Display of Circular Arcs', 'Communications of the ACM 20(2)', 'doi:10.1145/359423.359432')], { ko: '중점 원 알고리즘' }),
  a('xiaolin-wu-line', "Xiaolin Wu's Line Algorithm", '직선이 걸치는 두 픽셀에 거리 비례 밝기를 나눠 그리는 안티에일리어싱 직선 알고리즘.',
    [o('wu-xiaolin', 1991, 'An Efficient Antialiasing Technique', 'SIGGRAPH ’91 (Computer Graphics 25(4))', 'doi:10.1145/127719.122734')]),
  a('bowyer-watson', 'Bowyer–Watson Algorithm', '점을 하나씩 넣으며 외접원이 그 점을 포함하는 삼각형을 지우고 빈 공간을 다시 삼각분할하는 들로네 삼각분할 알고리즘.', [
    o('bowyer', 1981, 'Computing Dirichlet Tessellations', 'The Computer Journal 24(2)', 'doi:10.1093/comjnl/24.2.162'),
    o('watson', 1981, 'Computing the n-dimensional Delaunay Tessellation with Application to Voronoi Polytopes', 'The Computer Journal 24(2)', 'doi:10.1093/comjnl/24.2.167'),
  ], { aka: ['Delaunay triangulation'] }),
  a('bentley-ottmann', 'Bentley–Ottmann', '스윕 직선과 이벤트 큐로 선분 교차점 k개를 O((n + k) log n)에 모두 보고하는 알고리즘.',
    [o('bentley,ottmann', 1979, 'Algorithms for Reporting and Counting Geometric Intersections', 'IEEE Transactions on Computers C-28(9)', 'doi:10.1109/TC.1979.1675432')], { aka: ['sweep line'] }),
  a('fortune', "Fortune's Algorithm", '스윕 직선과 포물선 해변선으로 보로노이 다이어그램을 O(n log n)에 구성하는 알고리즘.',
    [o('fortune', 1987, 'A Sweepline Algorithm for Voronoi Diagrams', 'Algorithmica 2', 'doi:10.1007/BF01840357', 'SoCG 1986에 먼저 발표')], { aka: ['Voronoi diagram'] }),
];
