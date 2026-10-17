import { field, o } from '../dsl';

const a = field('compression');
const LZ77 = o('ziv,lempel', 1977, 'A Universal Algorithm for Sequential Data Compression', 'IEEE Transactions on Information Theory 23(3)', 'doi:10.1109/TIT.1977.1055714');

export default [
  a('shannon-fano', 'Shannon–Fano Coding', '확률 순으로 정렬한 기호를 누적 확률이 비슷한 두 묶음으로 반복 분할해 접두 부호를 만드는 방법.', [
    o('shannon', 1948, 'A Mathematical Theory of Communication', 'Bell System Technical Journal 27(3)', 'doi:10.1002/j.1538-7305.1948.tb01338.x'),
    o('fano', 1949, 'The Transmission of Information', 'MIT Research Laboratory of Electronics, Technical Report 65'),
  ], { ko: '섀넌-파노 부호화' }),
  a('huffman', 'Huffman Coding', '가장 빈도가 낮은 두 기호를 반복 병합해 평균 부호 길이가 최소인 접두 부호를 만드는 탐욕 알고리즘.',
    [o('huffman', 1952, 'A Method for the Construction of Minimum-Redundancy Codes', 'Proceedings of the IRE 40(9)', 'doi:10.1109/JRPROC.1952.273898')], { ko: '허프만 부호화' }),
  a('arithmetic-coding', 'Arithmetic Coding', '메시지 전체를 [0,1) 구간의 한 실수 구간으로 좁혀 기호당 정수 비트 제약 없이 엔트로피에 근접하는 부호화.', [
    o('rissanen', 1976, 'Generalized Kraft Inequality and Arithmetic Coding', 'IBM Journal of Research and Development 20(3)', 'doi:10.1147/rd.203.0198'),
    o('pasco', 1976, 'Source Coding Algorithms for Fast Data Compression', 'Stanford University 박사 학위 논문'),
  ], { ko: '산술 부호화' }),
  a('range-coding', 'Range Coding', '산술 부호화를 큰 정수 범위와 바이트 단위 출력으로 구현한 엔트로피 부호화.',
    [o('martin-gnn', 1979, 'Range Encoding: An Algorithm for Removing Redundancy from a Digitised Message', 'Video & Data Recording Conference, Southampton')], { ko: '범위 부호화' }),
  a('move-to-front', 'Move-to-Front Transform', '최근 사용한 기호를 목록 맨 앞으로 옮기며 위치 번호를 출력해 국소적 반복을 작은 수로 바꾸는 변환.',
    [o('bentley,sleator,tarjan,wei', 1986, 'A Locally Adaptive Data Compression Scheme', 'Communications of the ACM 29(4)', 'doi:10.1145/5684.5688')], { ko: 'MTF 변환', aka: ['MTF'] }),
  a('lz77', 'LZ77', '이미 본 데이터의 슬라이딩 윈도 안에서 가장 긴 일치를 (거리, 길이) 쌍으로 참조하는 사전 압축.', [LZ77], { aka: ['Lempel–Ziv 1977'] }),
  a('lz78', 'LZ78', '입력을 지금까지 만든 사전 항목 + 한 문자로 나누며 사전을 명시적으로 키워 가는 사전 압축.',
    [o('ziv,lempel', 1978, 'Compression of Individual Sequences via Variable-Rate Coding', 'IEEE Transactions on Information Theory 24(5)', 'doi:10.1109/TIT.1978.1055934')], { aka: ['Lempel–Ziv 1978'] }),
  a('lzss', 'LZSS', '일치 길이가 참조 비용보다 짧으면 리터럴을 그대로 내보내 LZ77의 낭비를 줄인 변형.',
    [o('storer,szymanski-thomas', 1982, 'Data Compression via Textual Substitution', 'Journal of the ACM 29(4)', 'doi:10.1145/322344.322346')]),
  a('lzw', 'LZW', '사전을 모든 단일 문자로 초기화해 LZ78의 명시적 문자 출력을 없앤 사전 압축. GIF·Unix compress에 쓰였다.',
    [o('welch', 1984, 'A Technique for High-Performance Data Compression', 'Computer 17(6)', 'doi:10.1109/MC.1984.1659158')], { aka: ['Lempel–Ziv–Welch'] }),
  a('deflate', 'DEFLATE', 'LZ77 일치 탐색 결과를 허프만 부호로 다시 압축하는 포맷. zip·gzip·PNG의 기반이다.',
    [o('katz', 1993, 'PKZIP 2.0의 Deflate 메서드', 'PKWARE', 'url:https://www.rfc-editor.org/rfc/rfc1951', '명세 문서는 RFC 1951 (L. P. Deutsch, 1996)')], { ko: '디플레이트' }),
  a('lzma', 'LZMA', '큰 사전의 LZ77 일치와 문맥 모델 기반 범위 부호화를 결합한 압축. 7z·xz 포맷의 핵심이다.',
    [o('pavlov', 1998, '7-Zip의 LZMA 압축', '7-Zip')], { aka: ['Lempel–Ziv–Markov chain'] }),
  a('bzip2', 'bzip2', 'BWT, MTF, 런 길이 부호화, 허프만 부호화를 차례로 적용하는 블록 정렬 압축기.',
    [o('seward-julian', 1996, 'bzip2', 'bzip2 공개 배포')]),
  a('ans', 'Asymmetric Numeral Systems', '상태 하나의 정수에 기호를 확률에 맞춰 누적해 산술 부호화 수준의 압축률을 허프만 수준 속도로 얻는 엔트로피 부호화.',
    [o('duda', 2009, 'Asymmetric Numeral Systems', 'arXiv', 'arxiv:0902.0271')], { aka: ['ANS', 'tANS', 'rANS', 'FSE'] }),
  a('lz4', 'LZ4', '엔트로피 부호화 없이 바이트 정렬된 LZ77 시퀀스만 사용해 압축 해제 속도를 극대화한 압축.',
    [o('collet', 2011, 'LZ4', 'LZ4 공개 배포', 'url:https://github.com/lz4/lz4')]),
  a('zstd', 'Zstandard', 'LZ77 일치를 tANS(FSE)와 허프만 부호로 부호화하는 압축. 넓은 속도·압축률 범위를 제공한다.',
    [o('collet', 2016, 'Zstandard 1.0', 'Facebook 공개 배포 (명세: RFC 8878, 2021)', 'url:https://www.rfc-editor.org/rfc/rfc8878')], { aka: ['zstd'] }),
  a('brotli', 'Brotli', 'LZ77, 허프만 부호화, 2차 문맥 모델링, 내장 정적 사전을 결합한 웹 압축 포맷.',
    [o('alakuijala,szabadka', 2016, 'Brotli Compressed Data Format', 'RFC 7932', 'url:https://www.rfc-editor.org/rfc/rfc7932', 'Google이 2013년 WOFF 2.0용으로 처음 개발')], { ko: '브로틀리' }),
];
