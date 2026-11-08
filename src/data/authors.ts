import type { Author } from './types';

/** slug|이름 — 이름 앞 `*`는 조직. 공개 출판물에 표기된 이름만 사용 (PRD §8 개인정보). */
const RAW = `
abbeel|Pieter Abbeel
abdalla|Michel Abdalla
abe|Keiichi Abe
abraham|Ittai Abraham
abramson|Norman Abramson
achanta|Radhakrishna Achanta
ackley|David H. Ackley
adam-hartwig|Hartwig Adam
adams|Ulf Adams
adelson-velsky|Georgy Adelson-Velsky
adelson|Edward H. Adelson
adinets|Andy Adinets
adleman|Leonard Adleman
agarwal-sandhini|Sandhini Agarwal
agarwal|Pankaj K. Agarwal
agathos|Alexander Agathos
agrawal-divyakant|Divyakant Agrawal
agrawal-manindra|Manindra Agrawal
agrawala|Ashok K. Agrawala
agrawal|Rakesh Agrawal
ahmed|N. Ahmed
aho|Alfred V. Aho
ahuja|Ravindra K. Ahuja
aichholzer|Oswin Aichholzer
aiken|Alex Aiken
ainslie|Joshua Ainslie
ajtai|M. Ajtai
akl|Selim G. Akl
al-rfou|Rami Al-Rfou
alakuijala|Jyrki Alakuijala
alberts|David Alberts
albert|Réka Albert
alefeld|G. E. Alefeld
alizadeh|Mohammad Alizadeh
allen-zhu|Zeyuan Allen-Zhu
allis|L. Victor Allis
almeida|Jussara Almeida
alpern|Bowen Alpern
alstrup|Stephen Alstrup
altschul|Stephen F. Altschul
alt|Helmut Alt
amanatides|John Amanatides
amburn|E. Philip Amburn
amdahl|Gene M. Amdahl
amodei|Dario Amodei
andersen-hans|Hans C. Andersen
andersen|David G. Andersen
anderson-charles|Charles W. Anderson
anderson|Ross Anderson
andersson|Arne Andersson
andreetto|Marco Andreetto
andrew|A. M. Andrew
anguelov|Dragomir Anguelov
anh|Vo Ngoc Anh
ankerst|Mihael Ankerst
antimirov|Valentin Antimirov
antonoglou|Ioannis Antonoglou
aoe|Jun-Ichi Aoe
aoki|Kazumaro Aoki
apostolico|Alberto Apostolico
appel-andrew|Andrew W. Appel
appel|Arthur Appel
appleby|Austin Appleby
aragon|Cecilia R. Aragon
arge|Lars Arge
arikan|Erdal Arıkan
arikawa|Setsuo Arikawa
arimura|Hiroki Arimura
aristidou|Andreas Aristidou
armijo|Larry Armijo
arnoldi|W. E. Arnoldi
arora|Nimar S. Arora
arps|Ronald B. Arps
arthur|David Arthur
askell|Amanda Askell
astrahan|M. M. Astrahan
atal|Bishnu S. Atal
atherton|Peter Atherton
atkinson-md|M. D. Atkinson
atkinson-russ|Russ Atkinson
atkin|A. O. L. Atkin
auli|Michael Auli
aumasson|Jean-Philippe Aumasson
aurenhammer|Franz Aurenhammer
auslander|Marc A. Auslander
austern|Matthew H. Austern
austin|John D. Austin
avidan|Shai Avidan
avva|Bharadwaj Avva
axtmann|Michael Axtmann
azar|Yossi Azar
ba-jimmy|Jimmy Lei Ba
bacon|David F. Bacon
badia|Adrià Puigdomènech Badia
baeza-yates|Ricardo Baeza-Yates
bagwell|Phil Bagwell
bahdanau|Dzmitry Bahdanau
bahl|L. R. Bahl
baillie|Robert Baillie
baker-fred|Fred Baker
baker|Henry G. Baker Jr.
balakrishnan|Hari Balakrishnan
baquero|Carlos Baquero
barber|C. Bradford Barber
barnes-connelly|Connelly Barnes
barnes|R. Barnes
barrett|Paul Barrett
barron|Jonathan T. Barron
barsky|Brian A. Barsky
barto|Andrew G. Barto
batagelj|Vladimir Batagelj
batcher|Kenneth E. Batcher
batista|Jorge Batista
battaile|Bennett Battaile
baum|Leonard E. Baum
bayer-bryce|Bryce E. Bayer
bayer|Rudolf Bayer
bays|Carter Bays
bay|Herbert Bay
beaulieu|Ray Beaulieu
beck-leland|Leland L. Beck
beckmann|Norbert Beckmann
beckman|R. J. Beckman
beck|Jay Beck
belady|L. A. Belady
belazzougui|Djamal Belazzougui
belkin|Mikhail Belkin
bellare|Mihir Bellare
bellman|Richard Bellman
bellovin|Steven M. Bellovin
bender|Michael A. Bender
bengio-samy|Samy Bengio
bengio|Yoshua Bengio
benoit|Commandant Benoît
bentley|Jon Louis Bentley
benzaquen|Sam Benzaquen
berenson|Hal Berenson
berens|Peter H. Berens
bergstrom|Carl T. Bergstrom
berkson|Joseph Berkson
berlekamp|Elwyn R. Berlekamp
bernstein-philip|Phil Bernstein
bernstein|Daniel J. Bernstein
berrou|Claude Berrou
bertoni|Guido Bertoni
bertsekas|Dimitri P. Bertsekas
besl|Paul J. Besl
beveridge|J. Ross Beveridge
beyer|Lucas Beyer
beygelzimer|Alina Beygelzimer
bezier|Pierre Bézier
bhargavan|K. Bhargavan
bhojanapalli|Srinadh Bhojanapalli
biber|Peter Biber
biham|Eli Biham
bik|Aart J. C. Bik
birch|Alexandra Birch
birk|Yitzhak Birk
biryukov|Alex Biryukov
bitterli|Benedikt Bitterli
black-john|John Black
blackburn|Stephen M. Blackburn
blackman|David Blackman
blake|Andrew Blake
blattmann|Andreas Blattmann
blei|David M. Blei
blinn|James F. Blinn
blondel|Vincent D. Blondel
bloom-charles|Charles Bloom
bloom|Burton H. Bloom
bluestein|Leo I. Bluestein
blum-lenore|L. Blum
blumer-janet|Janet Blumer
blumer|Anselm Blumer
blumofe|Robert D. Blumofe
blum|Manuel Blum
bobrow|Daniel G. Bobrow
boehm|Hans-Juergen Boehm
bogacki|P. Bogacki
bogdanov|A. Bogdanov
boggs|David R. Boggs
bojanowski|Piotr Bojanowski
bolitho|Matthew Bolitho
bolles|Robert C. Bolles
bolme|David S. Bolme
boncz|Peter Boncz
boneh|Dan Boneh
bonwick|Jeff Bonwick
booth-kellogg|Kellogg S. Booth
booth|Andrew D. Booth
bootle|Jonathan Bootle
borgeaud|Sebastian Borgeaud
boruvka|Otakar Borůvka
boser|Bernhard E. Boser
bose|R. C. Bose
bosselaers|Antoon Bosselaers
bostic|Keith Bostic
bos|Joppe Bos
botelho|Fabiano C. Botelho
bougares|Fethi Bougares
bouknight|W. Jack Bouknight
bowyer|Adrian Bowyer
box|G. E. P. Box
boyer-john|John M. Boyer
boyer|Robert S. Boyer
boykov|Yuri Y. Boykov
boytsov|Leonid Boytsov
bradley|Alan B. Bradley
bradski|Gary R. Bradski
brakerski|Zvika Brakerski
brakmo|Lawrence S. Brakmo
brandes|Ulrik Brandes
brandt|Achi Brandt
brauer|Stefan Bräuer
braun|Matthias Braun
bray|T. A. Bray
breiman|Leo Breiman
brelaz|Daniel Brélaz
brent|Richard P. Brent
bresenham|Jack E. Bresenham
breunig|Markus M. Breunig
bridson|Robert Bridson
brillhart|John Brillhart
brin|Sergey Brin
brodal|Gerth Stølting Brodal
broder|Andrei Z. Broder
brodsky|Isaac Brodsky
bronson|Nathan G. Bronson
bron|Coen Bron
brooks|Rodney A. Brooks
brown-d|D. T. Brown
brown-tom|Tom B. Brown
brown|Randy Brown
brox|Thomas Brox
broyden|C. G. Broyden
brzozowski|Janusz A. Brzozowski
buades|Antoni Buades
buchmann|Johannes Buchmann
buchwald|Sebastian Buchwald
bucy|R. S. Bucy
buhler|J. P. Buhler
bunz|Benedikt Bünz
burkhard|W. A. Burkhard
burrows|Michael Burrows
burt|Peter J. Burt
buzo|Andrés Buzo
bykat|A. Bykat
byrd|Richard H. Byrd
cahill|Michael J. Cahill
calonder|Michael Calonder
campbell|Murray Campbell
campello|Ricardo J. G. B. Campello
canetti|Ran Canetti
canny|John Canny
cantor|David G. Cantor
cao|Pei Cao
cardwell|Neal Cardwell
carpenter|Loren Carpenter
carter|J. Lawrence Carter
casanova-arantxa|Arantxa Casanova
caseiro|Rui Caseiro
castagnoli|Guy Castagnoli
castro|Miguel Castro
catmull|Edwin Catmull
cauchy|Augustin-Louis Cauchy
cavallaro|Paul Cavallaro
celis|Pedro Celis
cerny|Vladimír Černý
chaikin|George Merrill Chaikin
chaitin|Gregory J. Chaitin
chamberlin|D. D. Chamberlin
chambi|Samy Chambi
chan-timothy|Timothy M. Chan
chan-wai-hong|Wai Hong Chan
chandra|Ashok K. Chandra
chandy|K. Mani Chandy
chang-donghoon|Donghoon Chang
chang-ernest|Ernest Chang
chang-ming-wei|Ming-Wei Chang
charikar|Moses Charikar
chase|David Chase
chaum|David Chaum
chazelle|Bernard Chazelle
chee|Seongtaek Chee
chen-bo|Bo Chen
chen-cc|C. C. Chen
chen-charlie|Charlie Chen
chen-danqi|Danqi Chen
chen-kai|Kai Chen
chen-kevin|Kevin Chen
chen-mt|M. T. Chen
chen-tianqi|Tianqi Chen
chen-ting|Ting Chen
chen-weizhu|Weizhu Chen
chen-wei|Wei Chen
chen-xiangning|Xiangning Chen
chen-yang|Yang Chen
cheney|C. J. Cheney
cheng-yuchung|Yuchung Cheng
cheng|Edward Cheng
chentanez|Nuttapong Chentanez
cheon|Jung Hee Cheon
chew|L. Paul Chew
chiba|Norishige Chiba
chien|R. T. Chien
chikhi|Rayan Chikhi
child|Rewon Child
chillotti|Ilaria Chillotti
chiu|Dah-Ming Chiu
chowdhury|Mosharaf Chowdhury
cho|Kyunghyun Cho
christiano|Paul Christiano
christofides|Nicos Christofides
chum|Ondřej Chum
chu|Y. J. Chu
ciaccia|Paolo Ciaccia
ciobotaru|Oana Ciobotaru
cipolla|Michele Cipolla
clark-jack|Jack Clark
clark-jim|Jim Clark
clarke|G. Clarke
claude|Francisco Claude
clauset|Aaron Clauset
cleary|John G. Cleary
clenshaw|C. W. Clenshaw
cline|Harvey E. Cline
clinger|William D. Clinger
cocke|John Cocke
cocks|Clifford Cocks
colin|A. J. T. Colin
collet|Yann Collet
collins-steven|Steven Collins
collins|George E. Collins
coll|Bartomeu Coll
comaniciu|Dorin Comaniciu
commentz-walter|Beate Commentz-Walter
conover|W. J. Conover
cook-robert|Robert L. Cook
cook-stephen|Stephen A. Cook
cooley|James W. Cooley
coppersmith|Don Coppersmith
corasick|Margaret J. Corasick
corbato|Fernando J. Corbató
cordella|L. P. Cordella
cormack|Gordon V. Cormack
cormode|Graham Cormode
corrado|Greg Corrado
cortes|Corinna Cortes
coulom|Rémi Coulom
courtois|P. J. Courtois
courville|Aaron Courville
cousot-patrick|Patrick Cousot
cousot-radhia|Radhia Cousot
cox-m|M. G. Cox
cox|D. R. Cox
craig|Travis S. Craig
cramer|Ronald Cramer
crane|Clark Allan Crane
crespo|A. Crespo
criminisi|Antonio Criminisi
crochemore|Maxime Crochemore
croes|G. A. Croes
cromartie|Robert Cromartie
crow|Franklin C. Crow
cucurull|Guillem Cucurull
cummiskey|P. Cummiskey
cuppen|J. J. M. Cuppen
curtiss|C. F. Curtiss
curtis|A. R. Curtis
cyrus|Mike Cyrus
cytron|Ron Cytron
czajkowski|Grzegorz Czajkowski
dabek|Frank Dabek
dabov|Kostadin Dabov
daemen|Joan Daemen
dahmen|Erik Dahmen
dalal|Navneet Dalal
daley|Robert C. Daley
damerau|Fred J. Damerau
damgard|Ivan Damgård
daniel|Kenny Daniel
dantzig|George B. Dantzig
dao|Tri Dao
darrell|Trevor Darrell
das-abhinandan|Abhinandan Das
das-tathagata|Tathagata Das
dasgupta|Anirban Dasgupta
datar|Mayur Datar
dauphin|Yann N. Dauphin
dave|Ankur Dave
davidon|William C. Davidon
davis-andy|Andy Davis
de-boor|Carl de Boor
de-bruin|Arie de Bruin
de-casteljau|Paul de Casteljau
de-freitas|Nando de Freitas
de-jong|Michiel de Jong
de-la-briandais|René de la Briandais
de-lichtenberg|Kristian de Lichtenberg
de-silva|Vin de Silva
dean-jeff|Jeff Dean
dean|Jeffrey Dean
deering|Michael Deering
deerwester|Scott Deerwester
defago|X. Défago
dehghani|Mostafa Dehghani
dehnert|James C. Dehnert
delling|Daniel Delling
demaine|Erik D. Demaine
demers|Alan Demers
demirbas|Murat Demirbas
demmel|James Demmel
dempster|Arthur P. Dempster
denker|John S. Denker
denning|Peter J. Denning
deremer|Frank DeRemer
derenyi|Imre Derényi
detlefs|David Detlefs
dettmers|Tim Dettmers
deutsch-p|P. Deutsch
deutsch|L. Peter Deutsch
devlin|Jacob Devlin
dewitt|David J. DeWitt
dhariwal|Prafulla Dhariwal
dial|Robert B. Dial
dieleman|Sander Dieleman
dietzfelbinger|Martin Dietzfelbinger
diffie|Whitfield Diffie
dijkstra|Edsger W. Dijkstra
dillinger|Peter C. Dillinger
dinh|Laurent Dinh
dinitz|Yefim Dinitz
dinu|Daniel Dinu
divvala|Santosh Divvala
dixon|John D. Dixon
dobbertin|Hans Dobbertin
dobkin|David P. Dobkin
dobosiewicz|Wlodzimierz Dobosiewicz
dobraunig|Christoph Dobraunig
doig|A. G. Doig
dollar|Piotr Dollár
domiter|Vid Domiter
donahue|Jeff Donahue
donenfeld|Jason A. Donenfeld
dong-xuanyi|Xuanyi Dong
donnelly|William Donnelly
doo|D. Doo
dormand|J. R. Dormand
dorogush|Anna Veronika Dorogush
dosovitskiy|Alexey Dosovitskiy
douglas-jim|Jim Douglas, Jr.
douglas|David H. Douglas
douze|Matthijs Douze
draper|Bruce A. Draper
drettakis|George Drettakis
driscoll|James R. Driscoll
dror|Ron O. Dror
drummond|Tom Drummond
du-jingfei|Jingfei Du
duan-ran|Ran Duan
duane|S. Duane
duan|Duan Fanding (段凡丁)
ducas|Léo Ducas
duchi|John Duchi
duda-richard|Richard O. Duda
duda|Jarosław Duda
dueck|Delbert Dueck
duffy|Chris Duffy
duhamel|P. Duhamel
duif|Niels Duif
dukkipati|Nandita Dukkipati
dumais|Susan T. Dumais
dunning|Ted Dunning
durand-emile|E. Durand
durand|Marianne Durand
durbin-richard|Richard Durbin
durbin|J. Durbin
durrant-whyte|H. F. Durrant-Whyte
durstenfeld|Richard Durstenfeld
duval|Jean Pierre Duval
dwyer|Rex A. Dwyer
earley|Jay Earley
echevarria|Jose I. Echevarria
eddy|William F. Eddy
edelkamp|Stefan Edelkamp
edelsbrunner|Herbert Edelsbrunner
edmonds|Jack Edmonds
edwards-daniel|Daniel J. Edwards
efraimidis|Pavlos S. Efraimidis
efron|Bradley Efron
egiazarian|Karen Egiazarian
ehrenfeucht|Andrzej Ehrenfeucht
eichlseder|Maria Eichlseder
einziger|Gil Einziger
eiter|Thomas Eiter
el-abbadi|Amr El Abbadi
elgamal|Taher Elgamal
elias|Peter Elias
elkan|Charles Elkan
elman|Jeffrey L. Elman
eppstein|David Eppstein
eratosthenes|Eratosthenes of Cyrene
erdahl|Alan Erdahl
erez|Tom Erez
erhan|Dumitru Erhan
ermon|Stefano Ermon
ernst|Damien Ernst
ertl|Otmar Ertl
espinosa|Antonio Espinosa
esposito|Emmanuel Esposito
esser|Patrick Esser
ester|Martin Ester
eswaran|K. P. Eswaran
euclid|Euclid
evans-alex|Alex Evans
evans-david|David Evans
evensen|Geir Evensen
even|Shimon Even
evlogimenos|Alkis Evlogimenos
fagerberg|Rolf Fagerberg
fagin|Ronald Fagin
faller|Newton Faller
faloutsos|Christos Faloutsos
fan-angela|Angela Fan
fan-bin|Bin Fan
fan-junfeng|Junfeng Fan
fan-li|Li Fan
fano|Robert M. Fano
farach-colton|Martin Farach-Colton
farhadi|Ali Farhadi
farkas|Illés Farkas
farneback|Gunnar Farnebäck
farrar|Michael Farrar
fatemi|Emad Fatemi
fedorenko|R. P. Fedorenko
fedus|William Fedus
fehlberg|Erwin Fehlberg
feistel|Horst Feistel
feito|Francisco Ramón Feito
fekete|Alan D. Fekete
feldman|Paul Feldman
felner|Ariel Felner
felzenszwalb|Pedro F. Felzenszwalb
fenichel|Robert R. Fenichel
fenwick|Peter M. Fenwick
ferguson-david|David E. Ferguson
ferguson|Niels Ferguson
ferizovic|Daniel Ferizovic
fernandez-santiago|Santiago Fernández
fernando|Randima Fernando
ferragina|Paolo Ferragina
ferrante|Jeanne Ferrante
ferwerda|James Ferwerda
fiat|Amos Fiat
fidge|Colin J. Fidge
fiduccia|C. M. Fiduccia
finkelstein|Adam Finkelstein
finkel|R. A. Finkel
finley|Thomas Finley
finn-chelsea|Chelsea Finn
fiorini|Paolo Fiorini
fischer-johannes|Johannes Fischer
fischer-philipp|Philipp Fischer
fischer|Michael J. Fischer
fischler|Martin A. Fischler
fisher-kathleen|Kathleen Fisher
fisher|Ronald A. Fisher
fix|Evelyn Fix
flajolet|Philippe Flajolet
flanagan|J. L. Flanagan
fletcher-john|John G. Fletcher
fletcher|R. Fletcher
flood|Christine H. Flood
floyd-sally|Sally Floyd
floyd|Robert W. Floyd
foggia|P. Foggia
foi|Alessandro Foi
ford-bryan|Bryan Ford
ford-lester|L. R. Ford Jr.
forney|G. David Forney Jr.
fortune|Steven Fortune
fouque|Pierre-Alain Fouque
fournier|Alain Fournier
fraenkel|Aviezri S. Fraenkel
francis|J. G. F. Francis
frankel|Stanley P. Frankel
franklin-michael|Michael J. Franklin
franklin|Scott Franklin
frank|Marguerite Frank
fraser|Keir Fraser
frazer|W. D. Frazer
fredkin|Edward Fredkin
fredman|Michael L. Fredman
freeman|Herbert Freeman
freudenthaler|Christoph Freudenthaler
freund|Yoav Freund
frey|Brendan J. Frey
friedman-jerome|Jerome H. Friedman
friedman-roy|Roy Friedman
friend|Edward H. Friend
fu-daniel|Daniel Y. Fu
fua|Pascal Fua
fuchs|Henry Fuchs
fujimoto|Scott Fujimoto
fukunaga|Keinosuke Fukunaga
fukushima|Kunihiko Fukushima
fulkerson|D. R. Fulkerson
funk|Simon Funk
furer|Martin Fürer
furnas|George W. Furnas
fussell|Don Fussell
fusy|Éric Fusy
gabay|Daniel Gabay
gabizon|Ariel Gabizon
gabow|Harold N. Gabow
gailly|J-L. Gailly
gale|David Gale
galil|Zvi Galil
gallager|Robert G. Gallager
galler|Bernard A. Galler
galperin|Igal Galperin
gama|Nicolas Gama
gandouet|Olivier Gandouet
gangnet|Michel Gangnet
ganguli|Surya Ganguli
gantner|Zeno Gantner
garcia-molina|Hector Garcia-Molina
garey|Michael R. Garey
garland|Michael Garland
garner|Harvey L. Garner
gartner|Bernd Gärtner
gauss|Carl Friedrich Gauss
gawlick|Dieter Gawlick
geisberger|Robert Geisberger
gelatt|C. Daniel Gelatt
gelly|Sylvain Gelly
gelman|Andrew Gelman
geman-donald|Donald Geman
geman-stuart|Stuart Geman
gentry|Craig Gentry
george|Lal George
georgieva|Mariya Georgieva
gervautz|M. Gervautz
geselowitz|Ari Geselowitz
geurts|Pierre Geurts
geyer|Charles J. Geyer
ghemawat|Sanjay Ghemawat
ghobadi|Monia Ghobadi
giancarlo|Raffaele Giancarlo
gifford|David K. Gifford
gilbert|Elmer G. Gilbert
gillespie|Daniel T. Gillespie
gilstad|R. L. Gilstad
gimpel|Kevin Gimpel
gingold|R. A. Gingold
girshick|Ross Girshick
girvan|M. Girvan
gish|Warren Gish
givens|Wallace Givens
gkioxari|Georgia Gkioxari
glavieux|Alain Glavieux
glorot|Xavier Glorot
glowinski|R. Glowinski
glushkov|V. M. Glushkov
godau|Michael Godau
godin|Robert Godin
goel-karan|Karan Goel
goertzel|Gerald Goertzel
goh-gabriel|Gabriel Goh
goldberg-ian|Ian Goldberg
goldberg|Andrew V. Goldberg
goldfarb|Donald Goldfarb
goldman|Dan B Goldman
goldreich|Oded Goldreich
goldsmith|Jeffrey Goldsmith
goldstein|Jonathan Goldstein
goldwasser|Shafi Goldwasser
golomb|Solomon W. Golomb
golub|G. H. Golub
gomez-faustino|Faustino Gomez
gomez|Aidan N. Gomez
gomory|R. E. Gomory
gonnet|Gaston H. Gonnet
gonzalez-joseph|Joseph E. Gonzalez
goodfellow|Ian J. Goodfellow
goodman|Jonathan Goodman
good|I. J. Good
google|*Google
goral|Cindy M. Goral
gordon|N. J. Gordon
gorenstein|Daniel Gorenstein
gotoh|Osamu Gotoh
gottschalk|S. Gottschalk
gouraud|Henri Gouraud
goyal-naman|Naman Goyal
graefe|Goetz Graefe
graepel|Thore Graepel
graf|Thomas Mueller Graf
graham|Ronald L. Graham
gram|J. P. Gram
grangier|David Grangier
grastien|Alban Grastien
graves|Alex Graves
grave|Edouard Grave
gray-jim|Jim Gray
gray-robert|Robert M. Gray
gray-scott|Scott Gray
green-oded|Oded Green
greenberg-donald|Donald P. Greenberg
greenberg|Albert Greenberg
greene-dan|Dan Greene
greene|Ned Greene
greengard|L. Greengard
greenwald|Michael Greenwald
green|Peter J. Green
greer|Trey Greer
greff|Klaus Greff
greiner|Günther Greiner
gries|David Gries
grossi|Roberto Grossi
gross|Markus Gross
groth|Jens Groth
grover|Aditya Grover
gu-albert|Albert Gu
gueron|Shay Gueron
guestrin|Carlos Guestrin
gueta|Guy Golan Gueta
guez|Arthur Guez
guibas|Leonidas J. Guibas
guillaume|Jean-Loup Guillaume
gulcehre|Caglar Gulcehre
gulin|Andrey Gulin
gumin|Maxim Gumin
gunn|C. Stephen Gunn
gupta-indranil|Indranil Gupta
gupta|Ankur Gupta
gusev|Gleb Gusev
gusfield|Dan Gusfield
gutierrez|Diego Gutierrez
guttman|Antonin Guttman
guyon|Isabelle M. Guyon
guy|Stephen J. Guy
haario|Heikki Haario
haarnoja|Tuomas Haarnoja
hack|Sebastian Hack
haddon|B. K. Haddon
haddow|Barry Haddow
haderle|Don Haderle
haehnel|Dirk Haehnel
haeupler|Bernhard Haeupler
hagersten|E. Hagersten
halevi|Shai Halevi
halko|N. Halko
hall-chris|Chris Hall
hallacy|Chris Hallacy
halley|E. Halley
hall|Alexander Hall
halton|J. H. Halton
hamilton-william|William L. Hamilton
hamming|R. W. Hamming
han-daewan|Daewan Han
han-jiawei|Jiawei Han
hanauer|Suzanne L. Hanauer
hanbury|Allan Hanbury
hanrahan|Pat Hanrahan
hansen|Thomas Dueholm Hansen
harabor|Daniel Harabor
harel|Dov Harel
harfoush|Khaled Harfoush
harley|Tim Harley
harmon|Dion Harmon
harrelson|Chris Harrelson
harris-timothy|Timothy L. Harris
harrison|A. J. L. Harrison
harris|Chris Harris
harshman|Richard Harshman
hart-john|John C. Hart
hart-timothy|Timothy P. Hart
hart|Peter E. Hart
harvey|David Harvey
harwell|Sam Harwell
harwood|David Harwood
hassabis|Demis Hassabis
hastie|Trevor Hastie
hastings|W. K. Hastings
hauser|Carl Hauser
haussler|David Haussler
haveliwala|Taher H. Haveliwala
hayashibara|N. Hayashibara
hayes|Wayne Hayes
hazan|Elad Hazan
ha|Sangtae Ha
he-kaiming|Kaiming He
healy|John Healy
heckbert|Paul S. Heckbert
heckel|Paul Heckel
hedrick|C. L. Hedrick
heess|Nicolas Heess
heidelberger|Bruno Heidelberger
heigold|Georg Heigold
heinz|Steffen Heinz
held-michael|Michael Held
held|Martin Held
hellerstein|Joseph M. Hellerstein
heller|Steve Heller
hellman|Martin E. Hellman
helsgaun|Keld Helsgaun
heman|Sándor Héman
henderson|Donnie Henderson
hendrycks|Dan Hendrycks
hennix|Marcus Hennix
henriques|João F. Henriques
henzen|Luca Henzen
henzinger|Monika Rauch Henzinger
herlihy|Maurice Herlihy
herrmann|Martin Herrmann
hertel|Stefan Hertel
hessel|Matteo Hessel
hestenes|Magnus R. Hestenes
heule|Stefan Heule
heun|Volker Heun
hewitt|Carl Hewitt
heymans|F. Heymans
hibbard|Thomas N. Hibbard
hierholzer|Carl Hierholzer
hilbert|David Hilbert
hildreth|E. Hildreth
hill|I. D. Hill
hindley|R. Hindley
hinterberger|Hans Hinterberger
hinton|Geoffrey E. Hinton
hinze|Ralf Hinze
hirschberg|Daniel S. Hirschberg
hirschfelder|J. O. Hirschfelder
hirschmuller|Heiko Hirschmüller
ho-jonathan|Jonathan Ho
ho-tin-kam|Tin Kam Ho
hoare|C. A. R. Hoare
hochreiter|Sepp Hochreiter
hocquenghem|A. Hocquenghem
hodges|J. L. Hodges
hodgman|Gary W. Hodgman
hoerl|Arthur E. Hoerl
hoey|Dan Hoey
hoe|Janey C. Hoe
hoffman|Matthew D. Hoffman
hoffstein|Jeffrey Hoffstein
hofmann|Thomas Hofmann
hollmann|H. Hollmann
holm|Jacob Holm
holtzman|Ari Holtzman
hong-deukjo|Deukjo Hong
hong-jin|Jin Hong
hong-seokhie|Seokhie Hong
hoornaert|F. Hoornaert
hopcroft|John E. Hopcroft
hopfield|J. J. Hopfield
hopkins|Martin E. Hopkins
hoppe|Hugues Hoppe
hopwood|Daira Hopwood
hormann-wolfgang|Wolfgang Hörmann
hormann|Kai Hormann
horn-ilan|Ilan Horn
horner|W. G. Horner
horn|Berthold K. P. Horn
horspool|R. Nigel Horspool
horwitz|Susan Horwitz
hostetler|Larry D. Hostetler
hotelling|Harold Hotelling
houlsby|Neil Houlsby
householder|Alston S. Householder
housley|R. Housley
howard-andrew|Andrew G. Howard
howard-heidi|Heidi Howard
howard|Richard E. Howard
howell|Jon Howell
hseu|Jonathan Hseu
hsieh|Cho-Jui Hsieh
hu-edward|Edward J. Hu
hu-te-chiang|T. C. Hu
hu-yifan|Yifan Hu
huang-da|Da Huang
huang-gao|Gao Huang
huang-qi|Qi Huang
hubbard|Wayne Hubbard
hubert|Thomas Hubert
hudson|Richard H. Hudson
huet|Gérard Huet
huffman|David A. Huffman
huhdanpaa|Hannu Huhdanpaa
hukushima|Koji Hukushima
hulsing|Andreas Hülsing
hunt-brian|Brian R. Hunt
hunt-jonathan|Jonathan J. Hunt
hunt-neil|Neil Hunt
hunt|James W. Hunt
huttenlocher|Daniel P. Huttenlocher
hutter|Frank Hutter
hyvarinen|Aapo Hyvärinen
iacono|John Iacono
ibm|*IBM
ichikawa|Tetsuya Ichikawa
ieee|*IEEE
immorlica|Nicole Immorlica
indyk|Piotr Indyk
ioffe|Sergey Ioffe
irish|Wes Irish
irving-geoffrey|Geoffrey Irving
irving|Robert W. Irving
iwata|Tetsu Iwata
izabachene|Malika Izabachène
jackel|Lawrence D. Jackel
jacobi|C. G. J. Jacobi
jacobs-robert|Robert A. Jacobs
jacobson-van|Van Jacobson
jacobson|Guy Jacobson
jain-ajay|Ajay Jain
jain|Raj Jain
jarecki|Stanislaw Jarecki
jarnik|Vojtěch Jarník
jarosz|Wojciech Jarosz
jaro|Matthew A. Jaro
jarvis-jf|J. F. Jarvis
jarvis|R. A. Jarvis
jayant|N. S. Jayant
jegou|Hervé Jégou
jeh|Glen Jeh
jelinek|Frederick Jelinek
jenkins|M. A. Jenkins
jensen|Henrik Wann Jensen
jeong-kitae|Kitae Jeong
jia-yangqing|Yangqing Jia
jiang-song|Song Jiang
jimenez|Jorge Jimenez
johnson-alan|A. W. Johnson
johnson-daniel|Daniel W. Johnson
johnson-david|David S. Johnson
johnson-donald|Donald B. Johnson
johnson-ellis|Ellis L. Johnson
johnson-rob|Rob Johnson
johnson-selmer|Selmer M. Johnson
johnson-theodore|Theodore Johnson
johnstone|Iain Johnstone
jolly|Marie-Pierre Jolly
jones-michael|Michael Jones
jones|Llion Jones
jonker|R. Jonker
jordan|Michael I. Jordan
joshi-mandar|Mandar Joshi
joulin|Armand Joulin
judice|C. N. Judice
julier|S. J. Julier
jumper|John Jumper
junqueira|F. P. Junqueira
ju|Tao Ju
kaashoek|M. Frans Kaashoek
kabsch|Wolfgang Kabsch
kachitvichyanukul|Voratas Kachitvichyanukul
kahan|W. Kahan
kahn-herman|Herman Kahn
kahn|Arthur B. Kahn
kaiser|Łukasz Kaiser
kajiya|James T. Kajiya
kakade|Sham Kakade
kalchbrenner|Nal Kalchbrenner
kalenichenko|Dmitry Kalenichenko
kaliski|Burt Kaliski
kallick|Bruce Kallick
kalman-matan|Matan Kalman
kalman|R. E. Kalman
kamel|Ibrahim Kamel
kaminsky|Michael Kaminsky
kanade|Takeo Kanade
kanda|Masayuki Kanda
kaplan|Haim Kaplan
karatsuba|Anatoly Karatsuba
karger-david|David Karger
karkkainen|Juha Kärkkäinen
karlin|Anna R. Karlin
karmarkar|Narendra Karmarkar
karney|Charles F. F. Karney
karnin|Zohar Karnin
karn|Phil Karn
karp-richard|Richard M. Karp
karypis|George Karypis
kasai|Toru Kasai
kasami|Tadao Kasami
kaser|Owen Kaser
katajainen|Jyrki Katajainen
katayama|T. Katayama
kate|Aniket Kate
katkovnik|Vladimir Katkovnik
katz-leo|Leo Katz
katz-randy|Randy H. Katz
katz|Phil Katz
kavan|Ladislav Kavan
kavukcuoglu|Koray Kavukcuoglu
kayal|Neeraj Kayal
kay|Timothy L. Kay
kazhdan|Michael Kazhdan
kedem|Zvi M. Kedem
keerthi|S. Sathiya Keerthi
keller-alexander|Alexander Keller
keller|R. M. Keller
kelsey|John Kelsey
kemper|Alfons Kemper
kennard|Robert W. Kennard
kennedy|A. D. Kennedy
kent|W. James Kent
kerbl|Bernhard Kerbl
kerbosch|Joep Kerbosch
kerner|Immo O. Kerner
kernighan|Brian W. Kernighan
keshav|Srinivasan Keshav
keutzer|Kurt Keutzer
keys|Robert G. Keys
ke|Guolin Ke
khanna|Sanjeev Khanna
khovratovich|Dmitry Khovratovich
kiefer|J. Kiefer
kildall|Gary A. Kildall
kiltz|Eike Kiltz
kim-andrey|Andrey Kim
kim-dong-chan|Dong-Chan Kim
kim-hyun|Hyun Kim
kim-jaesung|Jaesung Kim
kim-jong-wook|Jong Wook Kim
kim-jongsung|Jongsung Kim
kim-miran|Miran Kim
kim|Pok-Son Kim
kingma|Diederik P. Kingma
king|Valerie King
kipf|Thomas N. Kipf
kirchner|Paul Kirchner
kirkpatrick-david|David G. Kirkpatrick
kirkpatrick|Scott Kirkpatrick
kiros|Jamie Ryan Kiros
kisa|*Korea Information Security Agency
kitsuregawa|Masaru Kitsuregawa
kleinberg|Jon M. Kleinberg
klein|Morton Klein
klimov|Oleg Klimov
knoop|Jens Knoop
knowlton|Kenneth C. Knowlton
knudsen|Lars R. Knudsen
knuth|Donald E. Knuth
knyazev|Andrew V. Knyazev
koblitz|Neal Koblitz
kocsis|Levente Kocsis
koenig|Sven Koenig
kohler|Eddie Kohler
kohonen|Teuvo Kohonen
kolesnikov|Alexander Kolesnikov
kolmogorov|Vladimir Kolmogorov
komlos|János Komlós
konolige|Kurt Konolige
koo|Bon-Seok Koo
kopanas|Georgios Kopanas
koren|Yehuda Koren
korf|Richard E. Korf
kornblith|Simon Kornblith
kosaraju|S. Rao Kosaraju
kravitz|David W. Kravitz
krawczyk|Hugo Krawczyk
kriegel|Hans-Peter Kriegel
krizhevsky|Alex Krizhevsky
krovetz|Ted Krovetz
krueger-david|David Krueger
krueger-gretchen|Gretchen Krueger
kruskal|Joseph B. Kruskal
krylov|Vladimir Krylov
kublanovskaya|V. N. Kublanovskaya
kudo|Taku Kudo
kuhn|Harold W. Kuhn
kulkarni|Sandeep S. Kulkarni
kulukundis|Matt Kulukundis
kumar-sanjiv|Sanjiv Kumar
kumaran|Dharshan Kumaran
kumara|Soundar Kumara
kumar|Vipin Kumar
kung|H. T. Kung
kurosawa|Kaoru Kurosawa
kurz|Nathan Kurz
kuszmaul|Bradley C. Kuszmaul
kutta|W. Kutta
kutzner|Arne Kutzner
kwon-woosuk|Woosuk Kwon
kwon|Daesung Kwon
lafferty|John Lafferty
lafortune|Eric P. Lafortune
lagarias|J. C. Lagarias
lagogiannis|George Lagogiannis
lai-matthew|Matthew Lai
laird|Nan M. Laird
lai|Xuejia Lai
lambiotte|Renaud Lambiotte
lamping|John Lamping
lamport|Leslie Lamport
lanctot|Marc Lanctot
lanczos|Cornelius Lanczos
landauer|Thomas K. Landauer
landau|D. P. Landau
landin|A. Landin
landis|Evgenii Landis
land|A. H. Land
lang-bernard|Bernard Lang
langdon|Glen G. Langdon Jr.
lange|Tanja Lange
langford|John C. Langford
langley|Adam Langley
langmead|Ben Langmead
lang|Kevin Lang
laperriere|Richard Laperrière
larmore|Lawrence L. Larmore
larochelle|Hugo Larochelle
larson-john|John Larson
larson|Per-Åke Larson
larsson|N. Jesper Larsson
lasenby|Joan Lasenby
latapy|Matthieu Latapy
lauck|Tony Lauck
lauritzen|Andrew Lauritzen
lawson|C. L. Lawson
layland|James W. Layland
le-quoc|Quoc V. Le
leander|G. Leander
lea|Doug Lea
lebron|Federico Lebrón
lecun|Yann LeCun
lecuyer|Pierre L'Ecuyer
lee-changhoon|Changhoon Lee
lee-daniel|Daniel D. Lee
lee-der-tsai|D. T. Lee
lee-dong-geon|Dong-Geon Lee
lee-gunho|Gunho Lee
lee-jaewon|Jaewon Lee
lee-jesang|Jesang Lee
lee-jung-keun|Jung-Keun Lee
lee-katherine|Katherine Lee
lee-kenton|Kenton Lee
lee-sangjin|Sangjin Lee
lee-thorp|James Lee-Thorp
lefebvre|Etienne Lefebvre
lefohn|Aaron Lefohn
legg|Shane Legg
lehman-philip|Philip L. Lehman
lehman|Eric Lehman
lehmer|D. H. Lehmer
lehoczky|J. P. Lehoczky
leighton|Tom Leighton
leike|Jan Leike
leimkuhler|Thomas Leimkuehler
leiserson|Charles E. Leiserson
leiser|Naty Leiser
leissa|Roland Leißa
leis|Viktor Leis
lemire|Daniel Lemire
lempel-ronny|R. Lempel
lempel|Abraham Lempel
lempitsky|Victor Lempitsky
lengauer|Thomas Lengauer
lenstra-arjen|A. K. Lenstra
lenstra-hendrik|H. W. Lenstra, Jr.
leone|Marcelo Leone
lepetit|Vincent Lepetit
lepoint|Tancrède Lepoint
leskovec|Jure Leskovec
lespiau|Jean-Baptiste Lespiau
levandoski|Justin J. Levandoski
levenberg|Kenneth Levenberg
levenshtein|Vladimir I. Levenshtein
leviathan|Yaniv Leviathan
levine-sergey|Sergey Levine
levine|Matthew Levine
levinson|Norman Levinson
levoy|Marc Levoy
levy-omer|Omer Levy
levy|Caleb C. Levy
lev|Yossi Lev
lewin|Daniel Lewin
lewis-mike|Mike Lewis
lewis|Philip M. Lewis II
li-heng|Heng Li
li-hongsong|Hongsong Li
li-jing|Jing Li
li-kim-hung|Kim-Hung Li
li-wei|Wei Li
li-yuanzhi|Yuanzhi Li
li-zhuohan|Zhuohan Li
liang-chen|Chen Liang
liang|You-Dong Liang
liberty|Edo Liberty
lieberman|Henry Lieberman
likhachev|Maxim Likhachev
lillicrap|Timothy P. Lillicrap
lim-jongin|Jongin Lim
limasset|Antoine Limasset
lin-ak|A. K. Lin
lin-ming|M. C. Lin
lin-s|S. Lin
lindell|Yehuda Lindell
lindenmayer|Aristid Lindenmayer
linde|Yoseph Linde
lindsay|Bruce Lindsay
linnainmaa|Seppo Linnainmaa
lin|Shen Lin
lio|Pietro Liò
lipman|David J. Lipman
lipp|B. Lipp
liskov|Barbara Liskov
litwin|Witold Litwin
liu-chung-laung|C. L. Liu
liu-dong|Dong C. Liu
liu-fei-tony|Fei Tony Liu
liu-peter|Peter J. Liu
liu-th|T. H. Liu
liu-tie-yan|Tie-Yan Liu
liu-wei|Wei Liu
liu-yao|Yao Liu
liu-yinhan|Yinhan Liu
liu-yunfeng|Yunfeng Liu
liu-zhuang|Zhuang Liu
livny|Miron Livny
lloyd|Stuart P. Lloyd
loffler|Maarten Löffler
logvinov|Andrey Logvinov
loitsch|Florian Loitsch
lomet|David B. Lomet
long-jonathan|Jonathan Long
longuet-higgins|H. C. Longuet-Higgins
loop|Charles Loop
lorensen|William E. Lorensen
lorenz-dominik|Dominik Lorenz
lorie|R. A. Lorie
losasso|Frank Losasso
loshchilov|Ilya Loshchilov
lottes|Timothy Lottes
lougheed|K. Lougheed
lovasz|L. Lovász
lowe|David G. Lowe
lu-peihuang|Peihuang Lu
lu-yifeng|Yifeng Lu
lu-yu|Yu Lu
luby|Michael Luby
lucas-edouard|Édouard Lucas
lucas|Bruce D. Lucas
lucchi|Aurelien Lucchi
lucy|L. B. Lucy
lueker|George S. Lueker
luhn|Hans Peter Luhn
lui|Yui Man Lui
luong|Minh-Thang Luong
luscher|Martin Lüscher
lynn|Ben Lynn
lyubashevsky|Vadim Lyubashevsky
ma-justin|Justin Ma
ma-weidong|Weidong Ma
macdonald|J. David MacDonald
machani|S. Machani
macklin|Miles Macklin
macqueen|James MacQueen
madappa|Deepak Madappa
madgwick|S. O. H. Madgwick
maekawa|Mamoru Maekawa
magnenat-thalmann|Nadia Magnenat-Thalmann
magnusson|P. Magnusson
maheswaranathan|Niru Maheswaranathan
mahoney|Matthew V. Mahoney
malewicz|Grzegorz Malewicz
malik|Jitendra Malik
malkhi|Dahlia Malkhi
malkov|Yury Malkov
mallat|Stephane G. Mallat
mallon|Christoph Mallon
mallows|C. L. Mallows
maltz|David A. Maltz
manacher|Glenn Manacher
manasse|M. S. Manasse
manber|Udi Manber
manduchi|Roberto Manduchi
manes|Ben Manes
manku|Gurmeet Singh Manku
mannila|Heikki Mannila
manning|Christopher D. Manning
manocha|Dinesh Manocha
manzagol|Pierre-Antoine Manzagol
manzini|Giovanni Manzini
mao-jiayi|Jiayi Mao
mao-xiao|Xiao Mao
mao|Yandong Mao
marco-sola|Santiago Marco-Sola
markstein|Peter W. Markstein
marlinspike|Moxie Marlinspike
maron|M. E. Maron
marpe|Detlev Marpe
marquardt|Donald W. Marquardt
marroco|A. Marroco
marr|D. Marr
marsaglia|George Marsaglia
marschner|Stephen R. Marschner
marshall|A. W. Marshall
marsland|T. A. Marsland
martic|Miljan Martic
martin-alain|Alain J. Martin
martin-gnn|G. Nigel N. Martin
martinez-conrado|Conrado Martínez
martinez|Francisco Martínez
martinsson|P. G. Martinsson
martins|Pedro Martins
masmano|M. Masmano
massey|James L. Massey
matas|Jiří Matas
matena|Michael Matena
mathis|Matt Mathis
matias|Yossi Matias
matsui|Mitsuru Matsui
matsumoto|Makoto Matsumoto
mattern|Friedemann Mattern
mattheyses|R. M. Mattheyses
matula|David W. Matula
mauchly|John Mauchly
maurer|W. D. Maurer
maxwell-greg|Greg Maxwell
maxwell|Gregory Maxwell
maziarz|Krzysztof Maziarz
mazieres|David Mazières
mccallum|Andrew McCallum
mccarthy|John McCarthy
mccauley|Murphy McCauley
mccreight|Edward M. McCreight
mceliece|R. J. McEliece
mcgee|Leonard A. McGee
mcgraw|Elaine M. McGraw
mcgrew|David A. McGrew
mcilroy-peter|Peter M. McIlroy
mcilroy|M. Douglas McIlroy
mcinnes|Leland McInnes
mckay-b|B. D. McKay
mckay-m|M. D. McKay
mckay|Neil D. McKay
mckeeman|William M. McKeeman
mckellar|A. C. McKellar
mckenney|Paul E. McKenney
mckinley|Kathryn S. McKinley
mcquillan|John M. McQuillan
mead|R. Mead
meagher|Donald Meagher
medioni|Gérard Medioni
medjedovic|Dzejla Medjedovic
meer|Peter Meer
meger|David Meger
megiddo|Nimrod Megiddo
mehlhorn|Kurt Mehlhorn
mehrotra|Sanjay Mehrotra
meier|Willi Meier
meissel|Ernst Meissel
meisters|G. H. Meisters
melkman|Avraham A. Melkman
mellor-crummey|John M. Mellor-Crummey
melton|Jim Melton
melville|James Melville
memon|Nasir Memon
mendel|Florian Mendel
meng-chenlin|Chenlin Meng
meng|Qi Meng
mercier|Bertrand Mercier
merkle|Ralph C. Merkle
merrill|Duane Merrill
merritt|Michael Merritt
merwin-daggett|Marjorie Merwin-Daggett
metcalfe|Robert M. Metcalfe
metropolis|Nicholas Metropolis
metwally|Ahmed Metwally
metzener|David Metzener
meunier|Frédéric Meunier
meyer|Ulrich Meyer
meza|Justin Meza
micali|Silvio Micali
michael|Maged M. Michael
michie|Donald Michie
mihov|Stoyan Mihov
mikolov|Tomas Mikolov
mildenhall|Ben Mildenhall
miller-gary|Gary L. Miller
miller-victor|Victor S. Miller
miller-webb|Webb Miller
milner|Robin Milner
minderer|Matthias Minderer
mirhoseini|Azalia Mirhoseini
mirrokni|Vahab S. Mirrokni
mirza|Mehdi Mirza
mishkin|Pamela Mishkin
misra|Jayadev Misra
mitchell-eric|Eric Mitchell
mitchell|Joan L. Mitchell
mittring|Martin Mittring
mitzenmacher|Michael Mitzenmacher
mnih|Volodymyr Mnih
modha|Dharmendra S. Modha
moffat|Alistair Moffat
mohamed-shakir|Shakir Mohamed
mohan|C. Mohan
moller|Tomas Möller
monaghan|J. J. Monaghan
monro|Sutton Monro
montes|Pablo Montes
montgomery-peter|Peter L. Montgomery
montgomery|Christopher Montgomery
moore-cristopher|Cristopher Moore
moore-ef|Edward F. Moore
moore-js|J Strother Moore
moraes|Mark A. Moraes
moran|S. Moran
moraru|Iulian Moraru
morel-e|E. Morel
morel|Jean-Michel Morel
moreno-noguer|Francesc Moreno-Noguer
moreto|Miquel Moreto
moriai|Shiho Moriai
moritz|Philipp Moritz
mori|Masatake Mori
morris-james|James H. Morris
morris-robert|Robert Morris
morrison-michael|Michael A. Morrison
morrison|Donald R. Morrison
morton|G. M. Morton
moss|J. Eliot B. Moss
mosteiro|Miguel Mosteiro
motivala|Ashish Motivala
moto-oka|Tohru Moto-Oka
motwani|Rajeev Motwani
moulavi|Davoud Moulavi
mount|Stephen M. Mount
moure|Juan Carlos Moure
mraihi|D. M'Raihi
muller-david|David E. Muller
muller-matthias|Matthias Müller
muller-mervin|Mervin E. Muller
muller-thomas|Thomas Müller
muller|Klaus-Robert Müller
munro|J. Ian Munro
murphy|Sean Murphy
murtadha|Ahmed Murtadha
musser|David R. Musser
muthukrishnan|S. Muthukrishnan
mwassi|Zahi Mwassi
myers-eugene|Eugene W. Myers
myronenko|Andriy Myronenko
myrvold|Wendy J. Myrvold
naccache|D. Naccache
nagle|John Nagle
nair-vinod|Vinod Nair
nakajima-kaisuke|Kaisuke Nakajima
nakajima|Junko Nakajima
nakamoto|Satoshi Nakamoto
narang|Sharan Narang
narasimhan|Karthik Narasimhan
nash|Alex Nash
natarajan-preethi|Preethi Natarajan
natarajan|T. Natarajan
naughton|Jeffrey F. Naughton
navarro|Gonzalo Navarro
nayar|Shree K. Nayar
naylor|Bruce F. Naylor
nbs|*National Bureau of Standards
neal|Radford M. Neal
needham|Roger M. Needham
needleman|Saul B. Needleman
nelder|J. A. Nelder
nelson|R. J. Nelson
nemoto|Koji Nemoto
nesterov|Yurii Nesterov
nes|Niels Nes
neumaier|A. Neumaier
neumann|Thomas Neumann
neuman|B. Clifford Neuman
neves|Samuel Neves
nevill-manning|Craig G. Nevill-Manning
newell-martin|Martin E. Newell
newell-richard|R. G. Newell
newman|M. E. J. Newman
newton|Isaac Newton
ng-andrew|Andrew Y. Ng
ng-raymond|Raymond T. Ng
ng-ren|Ren Ng
nicholl-robin|Robin A. Nicholl
nicholl-tina|Tina M. Nicholl
nichols|Kathleen Nichols
niederhagen|Ruben Niederhagen
niemeyer|Gustavo Niemeyer
nievergelt|Jürg Nievergelt
nilsson|Nils J. Nilsson
ninke|W. H. Ninke
niranjan|Mahesan Niranjan
nir|Yoav Nir
nishimura|Takuji Nishimura
nishizeki|Takao Nishizeki
nister|David Nistér
niyogi|Partha Niyogi
nocedal|Jorge Nocedal
nong|Ge Nong
norouzi|Mohammad Norouzi
nowlan|Steven J. Nowlan
nsa|*NSA
nunkesser|Marc Nunkesser
oconnor|Jack O'Connor
odeh|Saher Odeh
odersky|Martin Odersky
odlyzko|A. M. Odlyzko
ofman|Yuri Ofman
ojala|Timo Ojala
oja|Erkki Oja
oki|Brian M. Oki
olken|Frank Olken
olshen|Richard A. Olshen
omalley|Sean W. O'Malley
ommer|Björn Ommer
oneil-elizabeth|Elizabeth O'Neil
oneil-patrick|Patrick O'Neil
oneill-melissa|Melissa E. O'Neill
ongaro|Diego Ongaro
oren|Michael Oren
orlin|James B. Orlin
osher|Stanley Osher
osindero|Simon Osindero
osullivan|Carol O'Sullivan
otsu|Nobuyuki Otsu
ottmann|Thomas Ottmann
ott|Myle Ott
ousterhout|John Ousterhout
ozair|Sherjil Ozair
paar|C. Paar
paatero|Pentti Paatero
padhye|Jitendra Padhye
paeth|Alan W. Paeth
page|Lawrence Page
pagh|Rasmus Pagh
pagnoni|Artidoro Pagnoni
paice|Chris D. Paice
paige|C. C. Paige
paillier|Pascal Paillier
pajdla|Tomáš Pajdla
pajor|Thomas Pajor
paliwal|K. K. Paliwal
palla|Gergely Palla
pan-rong|Rong Pan
pan-shengfeng|Shengfeng Pan
pandey|Prashant Pandey
panigrahy|Rina Panigrahy
panneton|François Panneton
papachristodoulou|Louiza Papachristodoulou
parberry|Ian Parberry
parekh|Abhay K. Parekh
park-kunsoo|Kunsoo Park
park-sangwoo|Sangwoo Park
parmar|Niki Parmar
parnas|D. L. Parnas
parno|Bryan Parno
parr|Terence Parr
partridge|Craig Partridge
pasco|Richard C. Pasco
patella|Marco Patella
patel|Parveen Patel
paterson|Ross Paterson
paton|Keith Paton
patrascu|Mihai Pătraşcu
patro|Rob Patro
pavlov|Igor Pavlov
peano|Giuseppe Peano
pearlman|William A. Pearlman
pearl|Judea Pearl
pearson-peter|Peter K. Pearson
pearson-william|William R. Pearson
pearson|Karl Pearson
pease|M. Pease
pedersen|Torben Pryds Pedersen
peeters|Michaël Peeters
pei-jian|Jian Pei
peikert|Chris Peikert
pei|M. Pei
pelkonen|Tuomas Pelkonen
pendleton|B. J. Pendleton
peng|Daniel Peng
pennebaker|William B. Pennebaker
pennington|Jeffrey Pennington
percival|Colin Percival
pereira|Fernando C. N. Pereira
perepelitsa|Roman Perepelitsa
perez|Patrick Pérez
perlin|Ken Perlin
perlman|Radia Perlman
perona|Pietro Perona
perozzi|Bryan Perozzi
perrin-dominique|Dominique Perrin
perrin|Trevor Perrin
peterlongo|Pierre Peterlongo
peters-orson|Orson R. L. Peters
peters-tim|Tim Peters
peterson-gary|G. L. Peterson
peterson-larry|Larry L. Peterson
peterson|W. W. Peterson
petrie|Ted Petrie
petzold|Linda Petzold
peucker|Thomas K. Peucker
pfaltz|John L. Pfaltz
pfeffer|Avi Pfeffer
pfister|Hanspeter Pfister
pham|Hieu Pham
phan|Raphael C.-W. Phan
pharr|Matt Pharr
philips|Lawrence Philips
phong|Bui Tuong Phong
pietikainen|Matti Pietikäinen
piglione|Chiara Piglione
pijls|Wim Pijls
pike|Geoff Pike
pineda|Juan Pineda
pipher|Jill Pipher
pippenger|Nicholas Pippenger
pirahesh|Hamid Pirahesh
pizer|Stephen M. Pizer
plaat|Aske Plaat
plass|Michael Plass
platt|John C. Platt
plaxton|C. Greg Plaxton
poelstra|Andrew Poelstra
pohlig|S. Pohlig
pohl|Ira Pohl
pointcheval|David Pointcheval
poletto|Massimiliano Poletto
pollaczek-geiringer|H. Pollaczek-Geiringer
pollard|J. M. Pollard
polosukhin|Illia Polosukhin
polyak|Boris T. Polyak
pomerance|Carl Pomerance
ponomarenko|Alexander Ponomarenko
pons|Pascal Pons
pop|Mihai Pop
pornin|Thomas Pornin
porter-thomas|Thomas Porter
porter|M. F. Porter
poschmann|A. Poschmann
potra|Florian A. Potra
pouget-abadie|Jean Pouget-Abadie
powell-m|M. J. D. Powell
powell|M. B. Powell
powers|R. E. Powers
prabhakar|Balaji Prabhakar
prabhu|Mythili Suryanarayana Prabhu
pratt|Vaughan R. Pratt
preguica|Nuno Preguiça
preneel|Bart Preneel
preparata|Franco P. Preparata
press-ofir|Ofir Press
prest|Thomas Prest
price|T. G. Price
prim|Robert C. Prim
princen|John P. Princen
prince|P. J. Prince
printezis|Tony Printezis
pritzel|Alexander Pritzel
procopiuc|Octavian Procopiuc
prokhorenkova|Liudmila Prokhorenkova
prokopec|Aleksandar Prokopec
provos|Niels Provos
pugh|William Pugh
purgathofer|W. Purgathofer
putze|Felix Putze
quan|John Quan
quinlan|J. Ross Quinlan
rabaud|Vincent Rabaud
rabinovich|Andrew Rabinovich
rabin|Michael O. Rabin
rachford|H. H. Rachford, Jr.
rader|Charles M. Rader
radford|Alec Radford
radzik|Tomasz Radzik
rafailov|Rafael Rafailov
raffel|Colin Raffel
raffinot|Mathieu Raffinot
raghavan|Usha Nandini Raghavan
raita|Timo Raita
rajan|V. T. Rajan
rajkumar|R. Rajkumar
ramakrishnan|Raghu Ramakrishnan
ramalingam|G. Ramalingam
ramamoorthi|Ravi Ramamoorthi
ramer|Urs Ramer
ramesh-aditya|Aditya Ramesh
ramesh|Visvanathan Ramesh
ranen|O. Ranen
rao|K. R. Rao
raphael|Bertram Raphael
raphson|Joseph Raphson
ratcliff-john|John Ratcliff
ratcliff|John W. Ratcliff
rauch|H. E. Rauch
ravishankar|Chinya V. Ravishankar
raviv|Josef Raviv
ray-chaudhuri|D. K. Ray-Chaudhuri
raykova|Mariana Raykova
real-esteban|Esteban Real
real|J. Real
reddi|Sashank Reddi
redmon|Joseph Redmon
reed-benjamin|B. C. Reed
reed-david|David Patrick Reed
reed-scott|Scott Reed
reed|Irving S. Reed
reeves-william|William T. Reeves
reeves|C. M. Reeves
regev|Oded Regev
reinefeld|Alexander Reinefeld
reingold|E. M. Reingold
reinhard|Erik Reinhard
reinsch|C. Reinsch
reiter|Michael K. Reiter
reitz|K. P. Reitz
rekhter|Y. Rekhter
ren-shaoqing|Shaoqing Ren
rendle|Steffen Rendle
renvoise|C. Renvoise
reps|Thomas Reps
rescorla|E. Rescorla
reshetov|Alexander Reshetov
reynolds|Craig W. Reynolds
rezende|Danilo Jimenez Rezende
re|Christopher Ré
rhee|Injong Rhee
rhodes|Lee Rhodes
ricart|Glenn Ricart
rice|Robert F. Rice
richardson-john|John Richardson
richardson|L. F. Richardson
richer|Ira Richer
ricosset|Thomas Ricosset
ridders|C. Ridders
riedmiller|Martin Riedmiller
rijmen|Vincent Rijmen
ripoll|I. Ripoll
rissanen|Jorma J. Rissanen
rivest|Ronald L. Rivest
rizk|Guillaume Rizk
robbins|Herbert Robbins
roberts-adam|Adam Roberts
roberts-lawrence|Lawrence G. Roberts
roberts-rosemary|Rosemary Roberts
roberts|Michael Roberts
robinson-j|J. A. Robinson
robinson|John T. Robinson
robshaw|M. J. B. Robshaw
rochester|Nathaniel Rochester
rodler|Flemming Friche Rodler
rogaway|Phillip Rogaway
rohm|Uwe Röhm
rokhlin|V. Rokhlin
rombach|Robin Rombach
romberg|Werner Romberg
romero-adriana|Adriana Romero
romney|Gordon Romney
rom|Raphael Rom
ronneberger|Olaf Ronneberger
rosen-barry|Barry K. Rosen
rosen-eric|Eric C. Rosen
rosenblatt-murray|Murray Rosenblatt
rosenblatt|Frank Rosenblatt
rosenbluth-arianna|Arianna W. Rosenbluth
rosenbluth-marshall|Marshall N. Rosenbluth
rosenbrock|H. H. Rosenbrock
rosenfeld|Azriel Rosenfeld
rosenkrantz|Daniel J. Rosenkrantz
rose|Donald J. Rose
ross|Steven J. Ross
rosten|Edward Rosten
rosvall|Martin Rosvall
rother|Carsten Rother
roura|Salvador Roura
roweis|Sam T. Roweis
roweth|D. Roweth
roy|Bernard Roy
rubin-steven|Steven M. Rubin
rubinchik|Mikhail Rubinchik
rubin|Donald B. Rubin
rublee|Ethan Rublee
rudin|Leonid I. Rudin
rudra|Atri Rudra
rueda|Antonio Jesús Rueda
rumelhart|David E. Rumelhart
rummery|Gavin A. Rummery
runge|C. Runge
ruppert|Jim Ruppert
rupp|Christoph Rupp
russell|Robert C. Russell
ruthing|Oliver Rüthing
ryabko|Boris Ryabko
rydell|J. Rydell
ryu|Kwon Ho Ryu
saad|Youcef Saad
sabin|M. Sabin
sack|J.-R. Sack
sagiv|Mooly Sagiv
said|Amir Said
saito|Mutsuo Saito
saksman|Eero Saksman
salakhutdinov|Ruslan Salakhutdinov
salesin|David H. Salesin
salimans|Tim Salimans
salmond|D. J. Salmond
salmon|John K. Salmon
salzberg|Steven L. Salzberg
samuel|Arthur L. Samuel
sancha|T. L. Sancha
sanders|Peter Sanders
sander|Jörg Sander
sanghai|Sumit Sanghai
sansone|C. Sansone
santoro|N. Santoro
sapiro|Guillermo Sapiro
sarkar|Vivek Sarkar
sarnak|Neil Sarnak
sarwate|Dilip V. Sarwate
sastry-girish|Girish Sastry
saul|Lawrence K. Saul
saunders|M. A. Saunders
saxena|Nitin Saxena
schachter|B. J. Schachter
schaefer|Scott Schaefer
schaeffer|Jonathan Schaeffer
schanck|John M. Schanck
schapire|Robert E. Schapire
schaul|Tom Schaul
schediwy|Bic Schediwy
schieber|Baruch Schieber
schied|Christoph Schied
schiller|Jeffrey I. Schiller
schlaffer|Martin Schläffer
schleimer|Saul Schleimer
schlick|Christophe Schlick
schmeiser|Bruce W. Schmeiser
schmidhuber|Jürgen Schmidhuber
schmidt-erhard|Erhard Schmidt
schmidt-stanley|Stanley F. Schmidt
schmidt-thieme|Lars Schmidt-Thieme
schmidt|Jens M. Schmidt
schmid|Cordelia Schmid
schneider-fred|Fred B. Schneider
schneider-michael|Michael Schneider
schneider|Ralf Schneider
schneier|Bruce Schneier
schnorr|Claus P. Schnorr
schoenberg|I. J. Schoenberg
scholkopf|Bernhard Schölkopf
scholten|Carel S. Scholten
schonhage|Arnold Schönhage
schrittwieser|Julian Schrittwieser
schroeder|Michael D. Schroeder
schulman|John Schulman
schultes|Dominik Schultes
schultz|Martin H. Schultz
schulz|Klaus U. Schulz
schunck|Brian G. Schunck
schuster|Mike Schuster
schwabe|Peter Schwabe
schwartz|Eugene S. Schwartz
schwarz-peter|Peter Schwarz
schwarz|Heiko Schwarz
schwenk|Holger Schwenk
scott-michael|Michael L. Scott
scott|D. Scott
sculley|D. Sculley
sedgewick|Robert Sedgewick
seeger|Bernhard Seeger
segal|Aleksandr V. Segal
seidel-ludwig|L. Seidel
seidel|Raimund Seidel
seiferas|Joel Seiferas
seiler|Gregor Seiler
sejnowski|Terrence J. Sejnowski
selfridge|J. L. Selfridge
selinger|P. Griffiths Selinger
sellers|Peter H. Sellers
sengupta|Sudipta Sengupta
senior-andrew|Andrew Senior
sennrich|Rico Sennrich
sen|Siddhartha Sen
serafini|M. Serafini
serdyukov|A. I. Serdyukov
sermanet|Pierre Sermanet
seroussi|Gadiel Seroussi
sethi|Ravi Sethi
seung|H. Sebastian Seung
seurin|Y. Seurin
sevcik|Kenneth C. Sevcik
seward-julian|Julian Seward
seward|Harold H. Seward
shacham|Hovav Shacham
shaft|Uri Shaft
shaji|Appu Shaji
shamir-ariel|Ariel Shamir
shamir|Adi Shamir
shamos|Michael Ian Shamos
shampine|L. F. Shampine
shanks|Daniel Shanks
shannon|Claude E. Shannon
shanno|D. F. Shanno
shapira|Ruth Shapira
shapiro-leonard|Leonard D. Shapiro
shapiro-marc|Marc Shapiro
shapiro|Jerome M. Shapiro
shapley|Lloyd S. Shapley
sharir|Micha Sharir
sharma-archit|Archit Sharma
shasha|Dennis Shasha
shavit|Nir Shavit
shawe-taylor|John Shawe-Taylor
shaw|David E. Shaw
shazeer|Noam Shazeer
sha|L. Sha
shechtman|Eli Shechtman
shelhamer|Evan Shelhamer
shell|Donald L. Shell
shen-yelong|Yelong Shen
sheng-ying|Ying Sheng
shenker|Scott Shenker
shetty|Pradeep Shetty
shi-yixun|Yixun Shi
shiller|Zvi Shiller
shimrat|M. Shimrat
shirley|Peter Shirley
shi|Jianbo Shi
shkarin|Dmitry Shkarin
shlens|Jonathon Shlens
shmueli|Oz Shmueli
shneiderman|Ben Shneiderman
shoemake|Ken Shoemake
shokrollahi|Amin Shokrollahi
shors|Douglas Shors
shostak|R. Shostak
shoup|Victor Shoup
shreedhar|M. Shreedhar
shrimpton|Thomas Shrimpton
shtarkov|Yuri M. Shtarkov
shub|M. Shub
shur|Arseny M. Shur
shu|Xinkai Shu
sibson|R. Sibson
sidney|R. Sidney
sifre|Laurent Sifre
silverman-robert|Robert D. Silverman
silverman|Joseph H. Silverman
silver|David Silver
simonyan|Karen Simonyan
sinclair|David Sinclair
singer|Yoram Singer
singler|Johannes Singler
skeen|Dale Skeen
skiena|Steven Skiena
sleator|Daniel D. Sleator
slingwine|John D. Slingwine
smith-adrian|A. F. M. Smith
smith-bernard|Bernard Smith
smith-gerald|Gerald L. Smith
smith-jason|Jason Smith
smith-kevin|Kevin Smith
smith-noah|Noah A. Smith
smith-temple|Temple F. Smith
smola|Alex J. Smola
snider|Tim Snider
sobol|I. M. Sobol'
socher|Richard Socher
sohl-dickstein|Jascha Sohl-Dickstein
sohn|Yaekwon Sohn
soille|Pierre Soille
solomon|Gustave Solomon
solovay|R. Solovay
song-jiaming|Jiaming Song
song-jung-hwan|Jung Hwan Song
song-xiaodan|Xiaodan Song
song-xubo|Xubo Song
song-yongsoo|Yongsoo Song
sorensen|D. C. Sorensen
soules|George Soules
sousa|Tiago Sousa
sparrow|E. M. Sparrow
spiegelman|Alexander Spiegelman
spielman|Daniel A. Spielman
spillane|Richard P. Spillane
spirakis|Paul G. Spirakis
sridharan|Murari Sridharan
srikant|Ramakrishnan Srikant
srinivasan|Pratul P. Srinivasan
srivastava-rupesh|Rupesh Kumar Srivastava
srivastava|Nitish Srivastava
stam|Jos Stam
stark|Michael Stark
stearns|Richard E. Stearns
steele|Guy L. Steele Jr.
steensgaard|Bjarne Steensgaard
steffensen|J. F. Steffensen
steffens|Elisabeth F. M. Steffens
steffen|Bernhard Steffen
stehle|Damien Stehlé
stein-j|J. Stein
steinberg|Louis Steinberg
steindorfer|Michael J. Steindorfer
steiner|Jennifer G. Steiner
steinhaus|Hugo Steinhaus
stein|Clifford Stein
stemann|Volker Stemann
stentz|Anthony Stentz
stephens|Mike Stephens
stern-mitchell|Mitchell Stern
stiefel|Eduard Stiefel
stoer|Mechthild Stoer
stoica|Ion Stoica
stolfi|Jorge Stolfi
stonebraker|Michael R. Stonebraker
stone|Charles J. Stone
storer|James A. Storer
stoyanov|Veselin Stoyanov
strash|Darren Strash
strassen|Volker Strassen
strasser|Wolfgang Straßer
strecha|Christoph Strecha
striebel|C. T. Striebel
strong|H. Raymond Strong
strothotte|T. Strothotte
sturgis|Howard Sturgis
su-jianlin|Jianlin Su
subramanian|Vijay Subramanian
suen|C. Y. Suen
sun-jian|Jian Sun
sunday|Daniel M. Sunday
sung-jaechul|Jaechul Sung
sung-soo-hak|Soo Hak Sung
susstrunk|Sabine Süsstrunk
sutherland|Ivan E. Sutherland
sutskever|Ilya Sutskever
sutton|Richard S. Sutton
suurballe|J. W. Suurballe
suzuki|Satoshi Suzuki
swendsen|Robert H. Swendsen
swinehart|Dan Swinehart
swope|William C. Swope
szabadka|Zoltán Szabadka
szablewski|Dominic Szablewski
szegedy|Christian Szegedy
szemeredi|Endre Szemerédi
szepesvari|Csaba Szepesvári
szymanski-thomas|Thomas G. Szymanski
taha|Abdel Aziz Taha
takahashi|Haruhisa Takahashi
takahasi|Hidetosi Takahasi
tamminen|Johanna Tamminen
tan-mingxing|Mingxing Tan
tanaka-hidehiko|Hidehiko Tanaka
tanaka|Akira Tanaka
tancik|Matthew Tancik
tang|Xiaoou Tang
tapper|Unto Tapper
tarjan|Robert E. Tarjan
tassa|Yuval Tassa
taubin|Gabriel Taubin
taubman|David Taubman
taylor|Howard M. Taylor
teh|Yee-Whye Teh
telea|Alexandru Telea
teller-augusta|Augusta H. Teller
teller-edward|Edward Teller
teller-justin|Justin Teller
tenenbaum|Joshua B. Tenenbaum
ter-haar-romeny|Bart ter Haar Romeny
terriberry|Timothy B. Terriberry
terry|Doug Terry
teuhola|Jukka Teuhola
thaler-justin|Justin Thaler
thaler|David G. Thaler
thalmann|Daniel Thalmann
thitimajshima|Punya Thitimajshima
thomas|L. H. Thomas
thompson|Ken Thompson
thorup|Mikkel Thorup
thrun|Sebastian Thrun
tibshirani|Robert Tibshirani
tiernan|James C. Tiernan
timmel|Stephen Timmel
ting|Kai Ming Ting
tjalkens|Tjalling J. Tjalkens
tokita|Toshio Tokita
tomasi|Carlo Tomasi
tomita-masaru|Masaru Tomita
tomita|Etsuji Tomita
tonelli|Alberto Tonelli
toom|Andrei Toom
torgerson|Warren S. Torgerson
torrance|Kenneth E. Torrance
touitou|Dan Touitou
toussaint|Godfried T. Toussaint
toutanova|Kristina Toutanova
toyama|Kentaro Toyama
traag|V. A. Traag
traiger|I. L. Traiger
trapnell|Cole Trapnell
traub|J. F. Traub
treatman-clark|Stefan Treatman-Clark
treiber|R. Kent Treiber
tremaux|Charles Pierre Trémaux
triggs|Bill Triggs
tropp|J. A. Tropp
trowbridge|T. S. Trowbridge
trumbore|Ben Trumbore
tsang|Wai Wan Tsang
tucker|A. C. Tucker
tukey|John W. Tukey
tung|F. Tung
turner|Jonathan S. Turner
turpin|Andrew Turpin
tuytelaars|Tinne Tuytelaars
tzafrir|Moran Tzafrir
uhlmann|Jeffrey K. Uhlmann
ukkonen|Esko Ukkonen
ulam|Stanisław Ulam
ullmann|J. R. Ullmann
ullman|J. D. Ullman
ulyanov|Dmitry Ulyanov
umeyama|Shinji Umeyama
ungar|David Ungar
unterthiner|Thomas Unterthiner
upfal|Eli Upfal
urban|Martin Urban
uszkoreit|Jakob Uszkoreit
vaidyanathan|R. Vaidyanathan
vaikuntanathan|Vinod Vaikuntanathan
valiant|Leslie G. Valiant
valin|Jean-Marc Valin
van-assche|Gilles Van Assche
van-baar|Jeroen van Baar
van-den-berg|Jur van den Berg
van-den-herik|H. Jaap van den Herik
van-den-oord|Aaron van den Oord
van-der-hoeven|Joris van der Hoeven
van-der-maaten|Laurens van der Maaten
van-der-meulen|Maarten van der Meulen
van-der-vorst|H. A. van der Vorst
van-eck|N. J. van Eck
van-emde-boas|P. van Emde Boas
van-gool|Luc Van Gool
van-hasselt|Hado van Hasselt
van-hoof|Herke van Hoof
van-keer|Ronny Van Keer
van-merrienboer|Bart van Merriënboer
van-oorschot|Paul C. van Oorschot
van-renesse|Robbert van Renesse
vander-zanden|Brad T. Vander-Zanden
vandevenne|Lode Vandevenne
vanhoucke|Vincent Vanhoucke
vanstone|Scott Vanstone
vapnik|Vladimir N. Vapnik
varghese|George Varghese
vassilvitskii|Sergei Vassilvitskii
vaswani|Ashish Vaswani
vatti|Bala R. Vatti
veach|Eric Veach
vecchi|Mario P. Vecchi
vedaldi|Andrea Vedaldi
veeraraghavan|Kaushik Veeraraghavan
velickovic|Petar Veličković
vento|M. Vento
vercauteren|Frederik Vercauteren
verlet|Loup Verlet
versteeg|Bill VerSteeg
vicsek|Tamás Vicsek
viega|John Viega
vigna|Sebastiano Vigna
viguier|Benoît Viguier
vikkelsoe|C. Vikkelsoe
vincent-pascal|Pascal Vincent
vincenty|T. Vincenty
vincent|Luc Vincent
vinju|Jurgen J. Vinju
vinyals|Oriol Vinyals
viola|Paul Viola
vishkin|Uzi Vishkin
visvalingam|M. Visvalingam
viterbi|Andrew J. Viterbi
vitter|Jeffrey Scott Vitter
volder|Jack E. Volder
volgenant|A. Volgenant
volinsky|Chris Volinsky
von-mises|R. von Mises
von-neumann|John von Neumann
vorobev|Aleksandr Vorobev
vose|Michael D. Vose
vos|Koen Vos
vuillemin|Jean Vuillemin
wagner-david|David Wagner
wagner-frank|Frank Wagner
wagner|Robert A. Wagner
wagstaff|Samuel S. Wagstaff, Jr.
waldspurger|Carl A. Waldspurger
walker|A. J. Walker
wallace|Gregory K. Wallace
wallis|Phillip Wallis
walter|Bruce Walter
waltman|L. Waltman
walzer|Stefan Walzer
wang-fugao|Fugao Wang
wang-jiansheng|Jian-Sheng Wang
wang-kaiyuan|Kaiyuan Wang
wang-lichun|L.-C. T. Wang
wang-lu|Lu Wang
wang-shean|Shean Wang
wang-taifeng|Taifeng Wang
wang-weijun|Weijun Wang
wang-ziyu|Ziyu Wang
warde-farley|David Warde-Farley
ward|Joe H. Ward Jr.
warren|Joe Warren
warshall|Stephen Warshall
waterman|Michael S. Waterman
watkins|Christopher J. C. H. Watkins
watson|David F. Watson
weare|Jonathan Weare
weeks|Bryan Weeks
wegman|Mark N. Wegman
wehenkel|Louis Wehenkel
weierstrass|K. Weierstrass
weihl|William E. Weihl
weikum|Gerhard Weikum
weiler|Kevin Weiler
weinberger-kilian|Kilian Q. Weinberger
weinberger|Marcelo J. Weinberger
weiner|Peter Weiner
weiser|Mark Weiser
weiss-armin|Armin Weiß
weiss-eric|Eric A. Weiss
weiss-yair|Yair Weiss
weissenborn|Dirk Weissenborn
weiss|Norman Weiss
wei|Victor K. Wei
welch|Terry A. Welch
welling|Max Welling
welsch|John H. Welsch
welsh|D. J. A. Welsh
welzl|Emo Welzl
wen-bo|Bo Wen
werbos|Paul J. Werbos
werneck|Renato F. Werneck
weyand|Tobias Weyand
whang|Kyu-Young Whang
wheeler|David J. Wheeler
white|Jon L. White
whiting|Doug Whiting
whitted|Turner Whitted
whyatt|J. D. Whyatt
whyte|William Whyte
wichmann|B. A. Wichmann
widom|Jennifer Widom
wiegand|Thomas Wiegand
wiener|Michael J. Wiener
wierstra|Daan Wierstra
wilcox-ohearn|Zooko Wilcox-O'Hearn
wild|Sebastian Wild
wilkerson|Daniel S. Wilkerson
willard|Dan E. Willard
willems-yves|Yves D. Willems
willems|Frans M. J. Willems
williams-hugh-hugh|Hugh E. Williams
williams-hugh|H. C. Williams
williams-lance|Lance Williams
williams-ronald|Ronald J. Williams
williams-ross|Ross N. Williams
williamson-robert|Robert C. Williamson
williamson-zachary|Zachary J. Williamson
williamson|Malcolm J. Williamson
williams|J. W. J. Williams
wilson|Kent R. Wilson
windley|P. F. Windley
wingers|Louis Wingers
winkel|Sebastian Winkel
winkler|William E. Winkler
winnerlein|Christian Winnerlein
winner|Stephanie Winner
winograd|Shmuel Winograd
witten|Ian H. Witten
witt|Sascha Witt
wojna|Zbigniew Wojna
wolfe|Philip Wolfe
wolff|Ulli Wolff
wolpert|David H. Wolpert
wolski|Filip Wolski
wood-david|David Wood
wood|C. Wood
woo|Andrew Woo
worley|Steven Worley
wright|J. W. Wright
wu-sun|Sun Wu
wu-thomas|Thomas Wu
wu-xiaolin|Xiaolin Wu
wu-yuxin|Yuxin Wu
wuille|Pieter Wuille
wunsch|Christian D. Wunsch
wylie|Chris Wylie
wyman|Chris Wyman
xu-bing|Bing Xu
xu-jiayu|Jiayu Xu
xu-xiaowei|Xiaowei Xu
xu|Lisong Xu
yang-bo-yin|Bo-Yin Yang
yannakakis|Mihalis Yannakakis
yao-s-bing|S. Bing Yao
yao|Andrew Chi-Chih Yao
yared|R. Yared
yaroslavskiy|Vladimir Yaroslavskiy
yashunin|D. A. Yashunin
yates|Frank Yates
yavne|R. Yavne
ye-qiwei|Qiwei Ye
yeganeh|Soheil Hassas Yeganeh
yen|Jin Y. Yen
yeom|Yongjin Yeom
yianilos|Peter N. Yianilos
yin-longhui|Longhui Yin
yin-maofan|Maofan Yin
yin-yiwen|Yiwen Yin
ying-rex|Rex Ying
yin|Y. L. Yin
yochelson|Jerome C. Yochelson
yoon|E-Joong Yoon
yorke|James A. Yorke
you-yang|Yang You
younger|Daniel H. Younger
young|David Young
yu-cody|Cody Hao Yu
yuasa|Taiichi Yuasa
zadeck|F. Kenneth Zadeck
zadok|Erez Zadok
zaharia|Matei Zaharia
zalik|Borut Žalik
zaman|Arif Zaman
zara|Jiří Žára
zassenhaus|Hans Zassenhaus
zaversnik|Matjaz Zaversnik
zaverucha|Gregory M. Zaverucha
zawirski|Marek Zawirski
zemlyanskiy|Yury Zemlyanskiy
zen-heiga|Heiga Zen
zettlemoyer|Luke Zettlemoyer
zezula|Pavel Zezula
zhai-xiaohua|Xiaohua Zhai
zhang-biao|Biao Zhang
zhang-hao|Hao Zhang
zhang-sen|Sen Zhang
zhang-tian|Tian Zhang
zhang-ty|T. Y. Zhang
zhang-xiangyu|Xiangyu Zhang
zhang-xiaodong|Xiaodong Zhang
zhang-zhenfei|Zhenfei Zhang
zhang-zhengyou|Zhengyou Zhang
zheng-lianmin|Lianmin Zheng
zhou-aurick|Aurick Zhou
zhou-yanqi|Yanqi Zhou
zhou-zhi-hua|Zhi-Hua Zhou
zhu-ciyou|Ciyou Zhu
zhu-menglong|Menglong Zhu
zhuang-siyuan|Siyuan Zhuang
zierler|Neal Zierler
zimmerman|John B. Zimmerman
zisserman|Andrew Zisserman
ziv|Jacob Ziv
zobel|Justin Zobel
zobrist|Albert L. Zobrist
zoph|Barret Zoph
zou|Hui Zou
zuiderveld|Karel Zuiderveld
zukowski|Marcin Zukowski
zuse|Konrad Zuse
zwicker|Matthias Zwicker
zwick|Uri Zwick
zwinkau|Andreas Zwinkau
`;

export const AUTHORS: Author[] = RAW.trim().split('\n').map((line) => {
  const [slug, raw] = line.split('|');
  return raw.startsWith('*') ? { slug, name: raw.slice(1), org: true } : { slug, name: raw };
});
