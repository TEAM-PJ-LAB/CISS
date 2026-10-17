import type { Author } from './types';

/** slug|이름 — 이름 앞 `*`는 조직. 공개 출판물에 표기된 이름만 사용 (PRD §8 개인정보). */
const RAW = `
adelson-velsky|Georgy Adelson-Velsky
adleman|Leonard Adleman
aho|Alfred V. Aho
ainslie|Joshua Ainslie
alakuijala|Jyrki Alakuijala
allen-zhu|Zeyuan Allen-Zhu
almeida|Jussara Almeida
altschul|Stephen F. Altschul
amdahl|Gene M. Amdahl
andersen|David G. Andersen
andersson|Arne Andersson
andrew|A. M. Andrew
appel|Arthur Appel
aragon|Cecilia R. Aragon
arthur|David Arthur
atkin|A. O. L. Atkin
aumasson|Jean-Philippe Aumasson
ba-jimmy|Jimmy Lei Ba
baeza-yates|Ricardo Baeza-Yates
bahdanau|Dzmitry Bahdanau
balakrishnan|Hari Balakrishnan
barber|C. Bradford Barber
batcher|Kenneth E. Batcher
baum|Leonard E. Baum
bayer|Rudolf Bayer
bellare|Mihir Bellare
bellman|Richard Bellman
bengio|Yoshua Bengio
bentley|Jon Louis Bentley
bernstein|Daniel J. Bernstein
bertoni|Guido Bertoni
bezier|Pierre Bézier
biryukov|Alex Biryukov
blackman|David Blackman
blinn|James F. Blinn
bloom|Burton H. Bloom
bluestein|Leo I. Bluestein
blumer-janet|Janet Blumer
blumer|Anselm Blumer
blum|Manuel Blum
booth|Andrew D. Booth
boruvka|Otakar Borůvka
boser|Bernhard E. Boser
bougares|Fethi Bougares
bowyer|Adrian Bowyer
boyer|Robert S. Boyer
breiman|Leo Breiman
bresenham|Jack E. Bresenham
brin|Sergey Brin
broder|Andrei Z. Broder
burrows|Michael Burrows
bykat|A. Bykat
canetti|Ran Canetti
cao|Pei Cao
catmull|Edwin Catmull
cauchy|Augustin-Louis Cauchy
celis|Pedro Celis
cerny|Vladimír Černý
chan-timothy|Timothy M. Chan
chang-ming-wei|Ming-Wei Chang
chen-mt|M. T. Chen
chen-tianqi|Tianqi Chen
chen-weizhu|Weizhu Chen
chen-wei|Wei Chen
cheney|C. J. Cheney
cheng|Edward Cheng
cho|Kyunghyun Cho
clark-jim|Jim Clark
cline|Harvey E. Cline
cocks|Clifford Cocks
colin|A. J. T. Colin
collet|Yann Collet
collins|George E. Collins
cook-stephen|Stephen A. Cook
cooley|James W. Cooley
coppersmith|Don Coppersmith
corasick|Margaret J. Corasick
cormode|Graham Cormode
cortes|Corinna Cortes
coulom|Rémi Coulom
daemen|Joan Daemen
damgard|Ivan Damgård
dantzig|George B. Dantzig
dao|Tri Dao
de-casteljau|Paul de Casteljau
de-jong|Michiel de Jong
de-la-briandais|René de la Briandais
dempster|Arthur P. Dempster
denker|John S. Denker
deremer|Frank DeRemer
devlin|Jacob Devlin
diffie|Whitfield Diffie
dijkstra|Edsger W. Dijkstra
dinitz|Yefim Dinitz
dinu|Daniel Dinu
dobkin|David P. Dobkin
duan|Duan Fanding (段凡丁)
duchi|John Duchi
duda|Jarosław Duda
duif|Niels Duif
durand|Marianne Durand
earley|Jay Earley
eddy|William F. Eddy
edmonds|Jack Edmonds
edwards-daniel|Daniel J. Edwards
ehrenfeucht|Andrzej Ehrenfeucht
elgamal|Taher Elgamal
eratosthenes|Eratosthenes of Cyrene
ermon|Stefano Ermon
euclid|Euclid
fan-bin|Bin Fan
fan-li|Li Fan
fano|Robert M. Fano
feistel|Horst Feistel
fenichel|Robert R. Fenichel
fenwick|Peter M. Fenwick
ferragina|Paolo Ferragina
fidge|Colin J. Fidge
finley|Thomas Finley
fischer|Michael J. Fischer
flajolet|Philippe Flajolet
floyd|Robert W. Floyd
ford-lester|L. R. Ford Jr.
fortune|Steven Fortune
fredkin|Edward Fredkin
fredman|Michael L. Fredman
freund|Yoav Freund
friedman-jerome|Jerome H. Friedman
fu-daniel|Daniel Y. Fu
fukushima|Kunihiko Fukushima
fulkerson|D. R. Fulkerson
furer|Martin Fürer
fusy|Éric Fusy
galler|Bernard A. Galler
gandouet|Olivier Gandouet
gauss|Carl Friedrich Gauss
gawlick|Dieter Gawlick
gelatt|C. Daniel Gelatt
geman-donald|Donald Geman
geman-stuart|Stuart Geman
gilbert|Elmer G. Gilbert
gish|Warren Gish
gomez|Aidan N. Gomez
gonnet|Gaston H. Gonnet
gouraud|Henri Gouraud
graham|Ronald L. Graham
grastien|Alban Grastien
gray-jim|Jim Gray
gries|David Gries
guestrin|Carlos Guestrin
guibas|Leonidas J. Guibas
gulcehre|Caglar Gulcehre
gumin|Maxim Gumin
guttman|Antonin Guttman
guyon|Isabelle M. Guyon
hall|Alexander Hall
harabor|Daniel Harabor
hart-timothy|Timothy P. Hart
hart|Peter E. Hart
harvey|David Harvey
hastings|W. K. Hastings
haussler|David Haussler
hazan|Elad Hazan
he-kaiming|Kaiming He
hellman|Martin E. Hellman
henderson|Donnie Henderson
henzen|Luca Henzen
heule|Stefan Heule
hewitt|Carl Hewitt
hibbard|Thomas N. Hibbard
hinton|Geoffrey E. Hinton
ho-tin-kam|Tin Kam Ho
hoare|C. A. R. Hoare
hochreiter|Sepp Hochreiter
horspool|R. Nigel Horspool
hotelling|Harold Hotelling
howard|Richard E. Howard
hu-edward|Edward J. Hu
hubbard|Wayne Hubbard
huffman|David A. Huffman
huhdanpaa|Hannu Huhdanpaa
hunt|James W. Hunt
hutter|Frank Hutter
ibm|*IBM
ioffe|Sergey Ioffe
jackel|Lawrence D. Jackel
jarnik|Vojtěch Jarník
jarvis|R. A. Jarvis
johnson-daniel|Daniel W. Johnson
johnson-donald|Donald B. Johnson
jones|Llion Jones
kaashoek|M. Frans Kaashoek
kahn|Arthur B. Kahn
kaiser|Łukasz Kaiser
kajiya|James T. Kajiya
kaliski|Burt Kaliski
kaminsky|Michael Kaminsky
karatsuba|Anatoly Karatsuba
karger-david|David Karger
karmarkar|Narendra Karmarkar
karp-richard|Richard M. Karp
kasami|Tadao Kasami
katz|Phil Katz
keerthi|S. Sathiya Keerthi
ke|Guolin Ke
khovratovich|Dmitry Khovratovich
kingma|Diederik P. Kingma
kirkpatrick|Scott Kirkpatrick
kiros|Jamie Ryan Kiros
kleinberg|Jon M. Kleinberg
knudsen|Lars R. Knudsen
knuth|Donald E. Knuth
koblitz|Neal Koblitz
kocsis|Levente Kocsis
korf|Richard E. Korf
kosaraju|S. Rao Kosaraju
kravitz|David W. Kravitz
krawczyk|Hugo Krawczyk
krizhevsky|Alex Krizhevsky
kruskal|Joseph B. Kruskal
kuhn|Harold W. Kuhn
laird|Nan M. Laird
lamping|John Lamping
lamport|Leslie Lamport
landis|Evgenii Landis
lange|Tanja Lange
langley|Adam Langley
larson|Per-Åke Larson
le-quoc|Quoc V. Le
lebron|Federico Lebrón
lecun|Yann LeCun
lee-kenton|Kenton Lee
lee-thorp|James Lee-Thorp
lehman|Eric Lehman
lehmer|D. H. Lehmer
leighton|Tom Leighton
lempel|Abraham Lempel
levenshtein|Vladimir I. Levenshtein
levine|Matthew Levine
lewin|Daniel Lewin
li-yuanzhi|Yuanzhi Li
lieberman|Henry Lieberman
linnainmaa|Seppo Linnainmaa
lipman|David J. Lipman
liskov|Barbara Liskov
liu-tie-yan|Tie-Yan Liu
liu-yunfeng|Yunfeng Liu
lloyd|Stuart P. Lloyd
lorensen|William E. Lorensen
loshchilov|Ilya Loshchilov
lu-yu|Yu Lu
luhn|Hans Peter Luhn
luong|Minh-Thang Luong
ma-weidong|Weidong Ma
macqueen|James MacQueen
manacher|Glenn Manacher
manber|Udi Manber
manning|Christopher D. Manning
manzini|Giovanni Manzini
marsaglia|George Marsaglia
martin-alain|Alain J. Martin
martin-gnn|G. Nigel N. Martin
matsumoto|Makoto Matsumoto
mattern|Friedemann Mattern
mauchly|John Mauchly
mazieres|David Mazières
mccarthy|John McCarthy
mccreight|Edward M. McCreight
mcgraw|Elaine M. McGraw
meier|Willi Meier
meng|Qi Meng
merkle|Ralph C. Merkle
metropolis|Nicholas Metropolis
meunier|Frédéric Meunier
miller-victor|Victor S. Miller
miller-webb|Webb Miller
misra|Jayadev Misra
mitzenmacher|Michael Mitzenmacher
monro|Sutton Monro
moore-ef|Edward F. Moore
moore-js|J Strother Moore
morris-james|James H. Morris
morris-robert|Robert Morris
morrison|Donald R. Morrison
munro|J. Ian Munro
murtadha|Ahmed Murtadha
musser|David R. Musser
muthukrishnan|S. Muthukrishnan
myers-eugene|Eugene W. Myers
narasimhan|Karthik Narasimhan
needleman|Saul B. Needleman
nesterov|Yurii Nesterov
neves|Samuel Neves
newton|Isaac Newton
nilsson|Nils J. Nilsson
nir|Yoav Nir
nishimura|Takuji Nishimura
nsa|*NSA
nunkesser|Marc Nunkesser
oconnor|Jack O'Connor
ofman|Yuri Ofman
oki|Brian M. Oki
olshen|Richard A. Olshen
oneil-elizabeth|Elizabeth O'Neil
oneil-patrick|Patrick O'Neil
oneill-melissa|Melissa E. O'Neill
ongaro|Diego Ongaro
ottmann|Thomas Ottmann
ousterhout|John Ousterhout
page|Lawrence Page
pagh|Rasmus Pagh
pan-shengfeng|Shengfeng Pan
panigrahy|Rina Panigrahy
parmar|Niki Parmar
pasco|Richard C. Pasco
pavlov|Igor Pavlov
pearson|Karl Pearson
peeters|Michaël Peeters
percival|Colin Percival
perlin|Ken Perlin
peters-orson|Orson R. L. Peters
peters-tim|Tim Peters
peterson|W. W. Peterson
petrie|Ted Petrie
pham|Hieu Pham
phan|Raphael C.-W. Phan
phong|Bui Tuong Phong
polosukhin|Illia Polosukhin
polyak|Boris T. Polyak
pratt|Vaughan R. Pratt
prim|Robert C. Prim
provos|Niels Provos
pugh|William Pugh
quinlan|J. Ross Quinlan
rabin|Michael O. Rabin
rader|Charles M. Rader
radford|Alec Radford
raphael|Bertram Raphael
raphson|Joseph Raphson
ravishankar|Chinya V. Ravishankar
ren-shaoqing|Shaoqing Ren
reynolds|Craig W. Reynolds
re|Christopher Ré
rijmen|Vincent Rijmen
rissanen|Jorma J. Rissanen
rivest|Ronald L. Rivest
robbins|Herbert Robbins
rochester|Nathaniel Rochester
rodler|Flemming Friche Rodler
rosenblatt|Frank Rosenblatt
rosenbluth-arianna|Arianna W. Rosenbluth
rosenbluth-marshall|Marshall N. Rosenbluth
roy|Bernard Roy
rubin|Donald B. Rubin
rudra|Atri Rudra
rumelhart|David E. Rumelhart
ryabko|Boris Ryabko
salakhutdinov|Ruslan Salakhutdinov
salimans|Tim Salimans
samuel|Arthur L. Samuel
sanghai|Sumit Sanghai
schapire|Robert E. Schapire
schmidhuber|Jürgen Schmidhuber
schneier|Bruce Schneier
schnorr|Claus P. Schnorr
scholten|Carel S. Scholten
schonhage|Arnold Schönhage
schwabe|Peter Schwabe
schwenk|Holger Schwenk
sedgewick|Robert Sedgewick
seidel|Raimund Seidel
seiferas|Joel Seiferas
seward-julian|Julian Seward
seward|Harold H. Seward
shamir|Adi Shamir
shannon|Claude E. Shannon
sharir|Micha Sharir
shazeer|Noam Shazeer
shell|Donald L. Shell
shen-yelong|Yelong Shen
simonyan|Karen Simonyan
singer|Yoram Singer
sleator|Daniel D. Sleator
smith-temple|Temple F. Smith
snider|Tim Snider
soules|George Soules
srivastava|Nitish Srivastava
steffens|Elisabeth F. M. Steffens
steinhaus|Hugo Steinhaus
stentz|Anthony Stentz
stoica|Ion Stoica
stone|Charles J. Stone
storer|James A. Storer
strassen|Volker Strassen
strasser|Wolfgang Straßer
su-jianlin|Jianlin Su
sun-jian|Jian Sun
sutskever|Ilya Sutskever
szabadka|Zoltán Szabadka
szegedy|Christian Szegedy
szepesvari|Csaba Szepesvári
szymanski-thomas|Thomas G. Szymanski
tarjan|Robert E. Tarjan
teller-augusta|Augusta H. Teller
teller-edward|Edward Teller
thaler|David G. Thaler
toom|Andrei Toom
toutanova|Kristina Toutanova
tremaux|Charles Pierre Trémaux
tukey|John W. Tukey
ukkonen|Esko Ukkonen
ulam|Stanisław Ulam
ungar|David Ungar
uszkoreit|Jakob Uszkoreit
van-assche|Gilles Van Assche
van-der-hoeven|Joris van der Hoeven
van-merrienboer|Bart van Merriënboer
vanstone|Scott Vanstone
vapnik|Vladimir N. Vapnik
vassilvitskii|Sergei Vassilvitskii
vaswani|Ashish Vaswani
veach|Eric Veach
vecchi|Mario P. Vecchi
vigna|Sebastiano Vigna
vinyals|Oriol Vinyals
viterbi|Andrew J. Viterbi
von-neumann|John von Neumann
vuillemin|Jean Vuillemin
wagner|Robert A. Wagner
wallis|Phillip Wallis
wang-lu|Lu Wang
wang-shean|Shean Wang
wang-taifeng|Taifeng Wang
warshall|Stephen Warshall
waterman|Michael S. Waterman
watson|David F. Watson
weiner|Peter Weiner
weiss|Norman Weiss
wei|Victor K. Wei
welch|Terry A. Welch
wen-bo|Bo Wen
werbos|Paul J. Werbos
wheeler|David J. Wheeler
whitted|Turner Whitted
wilcox-ohearn|Zooko Wilcox-O'Hearn
williams-lance|Lance Williams
williams-ronald|Ronald J. Williams
williamson|Malcolm J. Williamson
williams|J. W. J. Williams
windley|P. F. Windley
winnerlein|Christian Winnerlein
winograd|Shmuel Winograd
wu-xiaolin|Xiaolin Wu
wunsch|Christian D. Wunsch
yang-bo-yin|Bo-Yin Yang
yao|Andrew Chi-Chih Yao
yaroslavskiy|Vladimir Yaroslavskiy
ye-qiwei|Qiwei Ye
yochelson|Jerome C. Yochelson
younger|Daniel H. Younger
zemlyanskiy|Yury Zemlyanskiy
zhang-xiangyu|Xiangyu Zhang
zisserman|Andrew Zisserman
ziv|Jacob Ziv
zuse|Konrad Zuse
`;

export const AUTHORS: Author[] = RAW.trim().split('\n').map((line) => {
  const [slug, raw] = line.split('|');
  return raw.startsWith('*') ? { slug, name: raw.slice(1), org: true } : { slug, name: raw };
});
