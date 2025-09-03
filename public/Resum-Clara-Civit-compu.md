## 1. Interpolació i arrels de funcions

### 1.1 INTERPOLACIÓ DE FUNCIONS

Quan NO coneixem la FUNCIÓ ANALÍTICA, en coneixem un CONJUNT FINIT D'ABCISSES:

$$\rightarrow \{x_1, f(x_1)\}, \{x_2, f(x_2)\}, \ldots, \{x_n, f(x_n)\}$$

**Interpolació**: obtenció de punts intermedis als coneguts per conèixer l'estructura de la funció.

En els punts intermedis tindrem una aproximació contínua i derivable de les dades conegudes.

#### INTERPOLACIÓ PER POLINOMIS DE LAGRANGE

$\forall k = 0, 1, 2, \ldots, n$ existeix un únic polinomi $e_k$ de grau $\leq n$ tal que:

$$e_k(x_j) = \delta_{kj}$$

$$e_k(z) = \frac{(z-x_0) \cdots (z-x_{k-1})(z-x_{k+1}) \cdots (z-x_n)}{(x_k-x_0) \cdots (x_k-x_{k-1})(x_k-x_{k+1}) \cdots (x_k-x_n)} = \prod_{\substack{i=0 \\ i \neq k}}^n \frac{z-x_i}{x_k-x_i}$$

**Polinomi interpolador de Lagrange**: 

$$P_n(x) = y_0 l_0(x) + y_1 l_1(x) + \ldots + y_n l_n(x)$$

Aquest polinomi és equivalent a la funció que busquem.
#### INTERPOLACIÓ LINEAL (curvatura)

Ús de dos punts per obtenir-ne un de tercer intermig:

Donats $(x_a, y_a)$ i $(x_b, y_b)$, el punt intermig $(x, y)$ és:

$$y = y_a + (x - x_a) \frac{y_b - y_a}{x_b - x_a}$$

#### INTERPOLACIÓ QUADRÀTICA (inflexions)

Similar a la lineal però amb 3 punts: $(x_0, y_0)$, $(x_1, y_1)$, $(x_2, y_2)$

$$y = y_0 \frac{(x-x_1)(x-x_2)}{(x_0-x_1)(x_0-x_2)} + y_1 \frac{(x-x_0)(x-x_2)}{(x_1-x_0)(x_1-x_2)} + y_2 \frac{(x-x_0)(x-x_1)}{(x_2-x_0)(x_2-x_1)}$$

### 1.2 ARRELS DE FUNCIONS

Trobar els zeros d'una funció donada: $x_k \in \mathbb{R} \mid f(x_k) = 0$

#### MÈTODE DE LA BISECCIÓ

**Teorema de Bolzano**: Sigui $x = a$ i $x = b$ amb $b > a$ tal que $f(a) \cdot f(b) < 0$. 

Aleshores existeix $x = c \in (a, b)$ tal que $f(c) = 0$.

**Algoritme**:
1. Definim $c = \frac{a+b}{2}$ i avaluem $f(c)$:
   - Si $f(c) \cdot f(a) < 0$ → redefinim l'interval en $[a, c]$ (substituint $b \rightarrow c$)
   - Si $f(c) \cdot f(b) < 0$ → redefinim l'interval en $[c, b]$ (substituint $a \rightarrow c$)
   - Si $f(c) = 0$ → ja hem trobat la solució

2. Repetim fins que $(b-a) < \varepsilon$ (precisió desitjada)

**Propietats**:
- Sempre convergeix
- L'error disminueix en un factor 2 en cada iteració
- El nou error és proporcional a l'anterior
#### MÈTODE REGULA-FALSI

Similar al de la bisecció però el punt $x = c$ correspon al tall entre la recta que passa per $(a, f(a))$ i $(b, f(b))$ i l'eix d'abscisses.

**Inicialització**: Interval $[a, b]$ tal que $f(a) \cdot f(b) < 0$

**Algoritme**:
1. Definim $c = \frac{af(b) - bf(a)}{f(b) - f(a)}$ i avaluem $f(c)$:
   - Si $f(a) \cdot f(c) < 0$ → redefinim l'interval amb $b = c$
   - Si $f(b) \cdot f(c) < 0$ → redefinim l'interval amb $a = c$
   - Si $f(c) = 0$ → ja hem trobat la solució

**Criteri de convergència**: $\min(c-a, b-c) < \varepsilon$

#### MÈTODE DE NEWTON-RAPHSON

**Algoritme**:
1. Comencem amb un valor $x_0$ relativament proper a l'arrel que busquem

2. Polinomi de Taylor al voltant de $x_0$:
   $$T_1(x; x_0) = f(x_0) + (x - x_0)f'(x_0)$$

3. Resolem el problema lineal $T_1(x_1; x_0) = 0$:
   $$x_1 = x_0 - \frac{f(x_0)}{f'(x_0)}$$

4. **Criteri de convergència**: Si $|\Delta_1| = |x_1 - x_0| < \varepsilon$ finalitzem. 
   En cas contrari, $x_0 = x_1$ i repetim.

**Propietats**:
- A cada iteració s'obté una millora quadràtica de l'error
- Pot divergir si $f'(x_0) \sim 0$ o si el pendent de la derivada és oposat al que necessitem
- Pot trobar una altra arrel o divergir

#### MÈTODE DE LA SECANT

Variant del mètode de Newton-Raphson quan:
- NO coneixem la derivada de la funció
- La derivada s'anul·la en un punt

En aquests casos, canviem la derivada a $x_0$ pel pendent de la secant emprant dos punts propers:

$$x_{n+1} = x_n - f(x_n) \frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}$$

**Requisits**: Dos punts inicials $(x_0$ i $x_1)$ idealment propers a l'arrel i entre si.

**Convergència**: Lleugerament més lent que el mètode de Newton-Raphson.

## 2. Integració numèrica

Els mètodes d'integració numèrica es basen en aproximar la integral al sumatori que inclou valors discrets de punts coneguts dins l'interval d'integració:

$$\int_a^b f(x) dx \simeq \sum_{k=0}^N f(x_k) \omega_k$$

On $\omega_k$ és la **funció pes**, que indica la contribució del valor de la funció al punt $x_k$.

### 2.1 INTEGRACIÓ TANCADA

Inclouen els punts de la frontera de l'interval → **INTEGRAL DEFINIDA**

#### MÈTODE DELS TRAPEZIS

**Aproximació lineal** entre dos punts consecutius $(x_0, f(x_0))$ i $(x_1, f(x_1))$.

**Polinomi interpolador**:
$$P_1(x) = f(x_0) + \frac{x - x_0}{h}(f(x_1) - f(x_0))$$

**Integral aproximada**:
$$\int_{x_0}^{x_1} f(x) dx \simeq \int_{x_0}^{x_1} P_1(x) dx = \frac{h}{2}(f(x_0) + f(x_1))$$

On $h = x_1 - x_0$ (pas).

**Error**: L'error comès en l'integració per un sub-interval $h$ creix com $h^3$:
$$E_r \simeq -\frac{h^3}{12} f''(\xi) \quad \text{amb } \xi \in [x_0, x_1]$$

#### MÈTODE DE SIMPSON

**Aproximació quadràtica** (paràbola) entre 3 punts consecutius.

**Polinomi interpolador**:
$$P_2(x) = f_0 + \frac{x-x_0}{2h}(4f_1 - 3f_0 - f_2) + \frac{(x-x_0)^2}{2h^2}(f_0 - 2f_1 + f_2)$$

**Integral aproximada**:
$$\int_{x_0}^{x_2} f(x) dx \simeq \frac{h}{3}(f_0 + 4f_1 + f_2)$$

**Error**: L'error comès creix com $h^5$:
$$E_r \simeq -\frac{h^5}{90} f^{(4)}(\xi) \quad \text{amb } \xi \in [x_0, x_2]$$
#### MÈTODE DE SIMPSON-3/8

**Aproximació cúbica** entre 4 punts consecutius.

A partir del polinomi interpolador calculem la integral:
$$\int_{x_0}^{x_3} f(x) dx \simeq \frac{3h}{8}(f_0 + 3f_1 + 3f_2 + f_3)$$

**Error**: L'error comès creix com $h^5$:
$$E_r \simeq -\frac{3h^5}{80} f^{(4)}(\xi) \quad \text{amb } \xi \in [x_0, x_3]$$

#### MÈTODE DE BOOLE

**Aproximació quàrtica** entre 5 punts consecutius.

A partir del polinomi interpolador calculem la integral:
$$\int_{x_0}^{x_4} f(x) dx \simeq \frac{2h}{45}(7f_0 + 32f_1 + 12f_2 + 32f_3 + 7f_4)$$

**Error**: L'error comès creix com $h^7$:
$$E_r \simeq -\frac{8h^7}{945} f^{(6)}(\xi) \quad \text{amb } \xi \in [x_0, x_4]$$

#### Resum dels mètodes d'integració

A partir dels diferents mètodes d'integració obtenim un resultat exacte per:

| Mètode | Grau polinomi exacte | Ordre error |
|--------|---------------------|-------------|
| Trapezis | Polinomis de grau 1 | $O(h^3)$ |
| Simpson | Polinomis de grau 3 | $O(h^5)$ |
| Simpson-3/8 | Polinomis de grau 3 | $O(h^5)$ |
| Boole | Polinomis de grau 5 | $O(h^7)$ |

### 2.2 INTEGRACIÓ AMB REPETICIÓ

Els mètodes d'integració esmentats anteriorment es poden encadenar per tal d'estendre el càlcul a intervals complets $[a, b]$.

Tenim $f(x)$ definida en un conjunt de $N+1$ punts equiespaiats $h$ en $[a, b]$:

$$x_k = x_0 + kh \quad \text{amb} \quad \begin{cases} x_0 \equiv a \\ k \in \mathbb{N} \cup \{0\} \\ x_N \equiv b \end{cases} \quad \text{i} \quad h = \frac{b-a}{N}$$

#### MÈTODE DELS TRAPEZIS AMB REPETICIÓ

**Integral**:
$$\int_a^b f(x) dx = \sum_{k=0}^{N-1} \int_{x_k}^{x_{k+1}} f(x) dx = h \sum_{k=0}^{N-1} \frac{f_k + f_{k+1}}{2}$$

**Fórmula composta**:
$$\int_a^b f(x) dx = h\left[\frac{f_0}{2} + f_1 + f_2 + \ldots + f_{N-1} + \frac{f_N}{2}\right]$$

**Error**: $\text{Err} \propto N \times h^3 = (b-a)h^2$

**Cas especial**: Si la funció s'anul·la als extrems:
$$\int_a^b f(x) dx \simeq h \sum_k f_k$$

#### MÈTODE DE SIMPSON AMB REPETICIÓ

**Integral**:
$$\int_a^b f(x) dx = \sum_{k=0}^{N/2-1} \int_{x_{2k}}^{x_{2k+2}} f(x) dx = \frac{h}{3} \sum_{k=0}^{N/2-1} (f_{2k} + 4f_{2k+1} + f_{2k+2})$$

**Fórmula composta**:
$$\int_a^b f(x) dx \simeq \frac{h}{3}[f_0 + 4f_1 + 2f_2 + 4f_3 + \cdots + 4f_{N-1} + f_N]$$

**Error**: $\text{Err} \propto N \times h^5 = h^4$

#### MÈTODE DE SUMA D'EULER-MCLAURIN

Aproximació de l'error comès en utilitzar el mètode dels trapezis (millora del mètode).

Utilitzant desenvolupaments de Taylor per $x_0$ i $x_1$, obtenim:

$$\int_a^b f(x) dx = h\left[\frac{f_0}{2} + f_1 + f_2 + \cdots + f_{N-1} + \frac{f_N}{2}\right] - \frac{h^2}{12}[f'(b) - f'(a)] + \frac{h^4}{720}[f'''(b) - f'''(a)] + \cdots$$

#### MÈTODE DE ROMBERG

Millora la precisió del mètode dels trapezis basant-se en l'estructura de la fórmula d'Euler-McLaurin.

Considerem la fórmula trapezoidal amb $N$ i $2N$ intervals:

$$\begin{cases}
\int_a^b f(x) dx = T_N + \frac{h^2}{12}(f'(a) - f'(b)) + \ldots \\
\int_a^b f(x) dx = T_{2N} + \frac{h^2}{48}(f'(a) - f'(b)) + \ldots
\end{cases}$$

Cancel·lem el terme quadràtic:
$$\int_a^b f(x) dx = \frac{4T_{2N} - T_N}{3} + O(h^4)$$

**Taula de Romberg**:

| Número d'intervals | $2^0=1$ | $2^1=2$ | $2^2=4$ | $2^3=8$ | $2^4=16$ | Ordre en $h$ |
|:------------------|:--------|:--------|:--------|:--------|:---------|:-------------|
|                   | $T_{0,0}$ | $T_{1,0}$ | $T_{2,0}$ | $T_{3,0}$ | $T_{4,0}$ | $O(h^2)$ |
|                   |         | $T_{1,1}$ | $T_{2,1}$ | $T_{3,1}$ | $T_{4,1}$ | $O(h^4)$ |
|                   |         |         | $T_{2,2}$ | $T_{3,2}$ | $T_{4,2}$ | $O(h^6)$ |
|                   |         |         |         | $T_{3,3}$ | $T_{4,3}$ | $O(h^8)$ |
|                   |         |         |         |         | $T_{4,4}$ | $O(h^{10})$ |

Per un nombre determinat d'intervals, la millor precisió és $T_{m,m}$.

**Algoritme**:

1. Definim $T_{m,0} = T(2^m)$ (trapezis amb $2^m$ intervals)

2. Calculem per $m=0$ (1 interval): $T_{0,0} = \frac{h}{2}(f(a) + f(b))$

3. Calculem per $m=1$: $T_{1,0} = T_{0,0} + h f\left(\frac{a+b}{2}\right)$
   $$T_{1,1} = \frac{4T_{1,0} - T_{0,0}}{3} \quad \text{amb error } \propto h^4$$

4. Avaluem la convergència: $\Delta_1 = |T_{1,1} - T_{0,0}|$
   - Si $\Delta < \varepsilon$ → ens quedem amb $T_{1,1}$
   - Si $\Delta > \varepsilon$ → seguim per $m=2$

5. Fórmula general: $T_{m+k,k} = \frac{4^k T_{m+k,k-1} - T_{m+k-1,k-1}}{4^k - 1}$

### 2.3 INTEGRACIÓ OBERTA

Les fórmules d'integració no depenen del valor de la funció als extrems de l'interval.

#### QUADRATURA DE GAUSS-LEGENDRE

Quadratura construïda per obtenir el resultat exacte en la integració de polinomis.

Es sol definir per l'interval $(a, b) = (-1, 1)$:
$$\int_a^b f(x) dx = \int_{-1}^1 g(u) du$$

**Canvi de variables lineal**:
$$u = -1 + 2\frac{x-a}{b-a}$$

L'objectiu és trobar uns punts $x_k$ i els seus pesos corresponents $\omega_k$ de manera que integrem de forma exacta els polinomis fins un grau determinat $2n-1$, és a dir: $x^0, x^1, x^2, \ldots, x^{2n-1}$.

**Polinomis de Legendre**:
$$\begin{cases}
P_0(x) = 1 \\
P_1(x) = x \\
(n+1)P_{n+1}(x) = (2n+1)xP_n(x) - nP_{n-1}(x)
\end{cases}$$

**Propietat d'ortogonalitat** per $[-1, 1]$:
$$\int_{-1}^1 P_k(x) P_{k'}(x) dx = \delta_{kk'} \frac{2}{2k+1}$$

**Característiques importants**:
- Els punts $x_k$ NO estan equiespaiats
- Hi ha més densitat de punts als extrems que al centre
- Amb $n = 24$ o $n = 48$ tenim bona precisió
- Permet integrar funcions amb singularitats integrables als extrems
- Amb canvis de variables es pot modificar la densitat de punts on ens interessa


### 2.4 INTEGRALS IMPRÒPIES

#### INTERVALS D'INTEGRACIÓ INFINITS
Del tipus $\int_a^{\infty} f(x) dx$

**Estratègies**:
- Escollir un $x_{\max}$ on es cregui que la integral ja no contribueix
- Canvi de variable transformant l'interval infinit en finit

#### AMB SINGULARITATS DE MESURA NUL·LA
Per exemple: $\int_0^1 \frac{1}{\sqrt{x}} dx = 2$

**Estratègies**:
- Canvi de variable que transformi $f(x) \rightarrow g(u)$ sense singularitats
- Integrar en l'interval $(a+h, b-h)$

#### AMB DERIVADES SINGULARS

No presenten cap problema però la convergència no serà l'esperada (ja que per l'estudi d'aquesta hem requerit de derivades contínues i diferenciables).

**Estratègia**: Canvi de variable per fer diferenciable al punt la derivada.

#### MÈTODES ADAPTATIUS

Construcció d'algoritmes que s'adapten a l'integrand tal que avaluem la funció més cops a la zona on té més estructura.

#### INTEGRALS MULTIDIMENSIONALS

Sempre que sigui possible, realitzem les integrals de manera seqüencial (primer una variable i després l'altra):

$$\iint f(x, y) dx dy = \int dy \, F(y) \quad \text{on} \quad F(y) = \int_{x_{\min}(y)}^{x_{\max}(y)} f(x, y) dx$$

### 2.5 CÀLCUL DE DERIVADES

Sigui una funció $f(x)$ definida en $x \in [a, b]$. Discretitzarem la variable $x$ amb un pas $h$ obtenint un conjunt de $N+1$ valors $\{x_k\}$.

#### Fórmules de derivació numèrica

**Fórmula avançada**: 
$$f'(x_k) = \frac{f(x_{k+1}) - f(x_k)}{h} + O(h)$$

**Fórmula central** (utilitza 2 punts):
$$f'(x_k) = \frac{f(x_{k+1}) - f(x_{k-1})}{2h} + O(h^2)$$

**Fórmula endarrerida**:
$$f'(x_k) = \frac{f(x_k) - f(x_{k-1})}{h} + O(h)$$

**Fórmula millorada** (utilitza 5 punts):
$$f'(x_k) = \frac{-f(x_{k+2}) + 8f(x_{k+1}) - 8f(x_{k-1}) + f(x_{k-2})}{12h} + O(h^4)$$

#### Segona derivada

Aplicant dues vegades el càlcul anterior:

**Amb pas $2h$**:
$$f''(x_k) = \frac{f(x_{k+2}) - 2f(x_k) + f(x_{k-2})}{4h^2} + O(h^2)$$

**Amb pas $h$**:
$$f''(x_k) = \frac{f(x_{k+1}) - 2f(x_k) + f(x_{k-1})}{h^2} + O(h^2)$$

## 3. Nombres aleatoris i Integració de Monte-Carlo

### 3.1 VARIABLES ALEATÒRIES

Sigui un conjunt de valors que pot prendre una variable (suport) es té una funció que proporciona la probabilitat (o densitat de probabilitat) de prendre aquests valors.

#### Variable discreta
Conjunt numerable $\{x_k\}$ amb $k = 1, 2, \ldots$ valors.

**Probabilitats**: 
$$P_k \equiv \lim_{N \to \infty} \frac{\text{Nombre de cops que hem obtingut } x_k}{N \text{ total de mesures}}$$

Tal que $\sum_k P_k = 1$

#### Variable contínua
Conjunt continu de valors definit per una densitat de probabilitat.

**Densitat**:
$$\rho(x) = P\{x \mid x_1 < x < x_1 + dx\} \equiv \lim_{N \to \infty} \frac{\text{cops que obtenim } x_1 < x < x_1 + dx}{N \text{ total de mesures}}$$

Tal que $\int \rho(x) dx = 1$

#### FUNCIONS DE VARIABLES ALEATÒRIES

Sigui $x$ una variable aleatòria amb densitat de probabilitat $\rho(x)$. Aleshores $y = f(x)$ també serà una variable aleatòria.

$$\rho(x) dx = g(y) dy$$

$$g(y) = \rho(x)\left|\frac{dx}{dy}\right| = \rho(f^{-1}(y))\left|\frac{df^{-1}(y)}{dy}\right|$$

(sempre que $f(x)$ sigui unívoca)

#### PROBABILITAT ACUMULADA

Sigui $x$ una variable aleatòria amb densitat de probabilitat $\rho(x)$:

$$P(x) \equiv \int_{x_{\min}}^x \rho(x') dx'$$

**Propietats**:
- $\frac{dP(x)}{dx} = \rho(x)$
- $P(x_{\min}) = 0$
- $P(x_{\max}) = 1$

**Per un interval** $[a, b]$:
$$P\{x \mid a < x < b\} = \int_a^b \rho(x) dx = P(b) - P(a)$$

**Per variables discretes**:
$$P(x) = \sum_{x_k < x} \rho_k \quad \text{amb} \quad \rho(x) = \sum_k \rho_k \delta(x - x_k)$$

#### VALORS ESPERATS I MOMENTS DE LA DISTRIBUCIÓ

Sigui $x$ una variable aleatòria amb densitat de probabilitat $\rho(x)$, es defineix el promig de la funció $g(x)$ com:

**Variables contínues**:
$$E[g(x)] = \langle g(x) \rangle = \int_S \rho(x) g(x) dx$$

**Variables discretes**:
$$E[g(x)] = \langle g(x) \rangle = \sum_k \rho_k g(x_k)$$

**Propietats**:
- $\langle f(x) + a \rangle = \langle f(x) \rangle + a$ per a qualsevol $a \in \mathbb{R}$
- $\langle a f(x) \rangle = a \langle f(x) \rangle$ per a qualsevol $a \in \mathbb{R}$
- $\langle f(x) + g(x) \rangle = \langle f(x) \rangle + \langle g(x) \rangle$

#### Moments de la distribució de probabilitat

**Moment d'ordre n**:
$$m_n \equiv \langle x^n \rangle = \int_S x^n \rho(x) dx$$

**Variància**:
$$\text{var}(x) \equiv \langle (x - \langle x \rangle)^2 \rangle = \int_S (x - \langle x \rangle)^2 \rho(x) dx = m_2 - m_1^2$$

Indica com d'allunyats estan els possibles valors de $x$ del seu valor esperat.

**Desviació estàndard**:
$$\sigma_x = \sqrt{\text{var}(x)}$$

Indica l'amplada de la distribució.

**Variable adimensional normalitzada**:
$$x^* = \frac{x - \langle x \rangle}{\sigma_x}$$

Amb les propietats:
- Valor mitjà: $\langle x^* \rangle = 0$
- Desviació estàndard: $\sigma_{x^*} = 1$

#### MÚLTIPLES VARIABLES

Sigui un conjunt de variables aleatòries: $\rho(x_1, x_2, \ldots, x_n)$

**Normalització**:
$$\int_S dx_1 dx_2 \ldots dx_n \, \rho(x_1, x_2, \ldots, x_n) = 1$$

**Funció de n variables aleatòries**:
$$\langle f(x_1, x_2, \ldots, x_n) \rangle = \int_S dx_1 dx_2 \ldots dx_n \, f(x_1, x_2, \ldots, x_n) \rho(x_1, x_2, \ldots, x_n)$$

**Valor esperat**:
$$\langle x_i \rangle = \int_S dx_1 dx_2 \ldots dx_n \, x_i \rho(x_1, x_2, \ldots, x_n) \quad \text{amb } i = 1, 2, \ldots, n$$

**Covariància**: mesura la relació entre dos valors esperats
$$\text{cov}(x_i, x_j) = \langle (x_i - \langle x_i \rangle)(x_j - \langle x_j \rangle) \rangle = \langle x_i x_j \rangle - \langle x_i \rangle \langle x_j \rangle$$

**Coeficient de correlació** entre 2 variables:
$$\rho_{ij} = \rho(x_i, x_j) = \frac{\text{cov}(x_i, x_j)}{\sigma_{x_i} \sigma_{x_j}}$$

**Probabilitat marginal**: la probabilitat de mesurar $x_i$ independentment de les altres variables
$$P_i(x_i) = \int_S dx_1 dx_2 \ldots dx_{i-1} dx_{i+1} \ldots dx_n \, \rho(x_1, x_2, \ldots, x_n)$$

**Variables independents**:
$$\rho(x_1, x_2, \ldots, x_n) = \prod_i \rho_i(x_i)$$

Equivalent a:
$$\langle x_i x_j \rangle = \langle x_i \rangle \langle x_j \rangle \quad \text{o} \quad \rho(x_i, x_j) = 0$$

### 3.2 EXEMPLES DE DISTRIBUCIONS DE PROBABILITAT

#### DISTRIBUCIONS DISCRETES

##### Distribució de Bernoulli
Considerem una variable aleatòria amb suport $S = \{0, 1\}$:

**Probabilitats**:
$$P(0) = q = 1-p, \quad P(1) = p$$

**Moments** ($0^n = 0$):
$$m_n = \langle i^n \rangle = \sum_{i=0}^1 P_i i^n = 0^n \cdot (1-p) + 1^n \cdot p = p$$

**Variància**:
$$\text{var}(i) = \langle (i - \langle i \rangle)^2 \rangle = m_2 - m_1^2 = p(1-p) = pq$$

##### Distribució binomial
Donada una variable aleatòria que conta el nombre d'èxits en $n$ experiments independents, cada un amb probabilitat d'èxit $p$.

**Probabilitat** de $k$ èxits en $n$ experiments amb $k \in \{0, 1, \ldots, n\}$:
$$B(k; n, p) = \binom{n}{k} p^k (1-p)^{n-k} = \frac{n!}{k!(n-k)!} p^k (1-p)^{n-k}$$

**Valor esperat**: $\langle k \rangle = np$
**Segon moment**: $\langle k^2 \rangle = np[1 + (n-1)p]$
**Variància**: $\text{var}(k) = np(1-p)$
##### Distribució de Poisson
Límit $N \to \infty$ de la distribució binomial:
$$P(k; \lambda) = e^{-\lambda} \frac{\lambda^k}{k!} \quad \text{amb } \lambda = np$$

**Valor esperat**: $\langle k \rangle = np = \lambda$
**Segon moment**: $\langle k^2 \rangle = \lambda(\lambda + 1)$
**Variància**: $\text{var}(k) = \lambda$

**Propietat additiva**: La suma de dues variables de Poisson $\lambda_1, \lambda_2$ segueix també una distribució de Poisson amb $\lambda = \lambda_1 + \lambda_2$.

#### DISTRIBUCIONS CONTÍNUES

##### Distribució uniforme
$U(a, b)$ per $y \in [a, b]$:
$$\rho(y) = \frac{1}{b-a}$$

**Probabilitat acumulada**:
$$P(y) = \int_a^y \rho(y') dy' = \frac{y-a}{b-a}$$

**Valor esperat**: $\langle y \rangle = \frac{a+b}{2}$
**Desviació estàndard**: $\sigma_y = \frac{b-a}{\sqrt{12}}$
**Variància**: $\text{var}(y) = \frac{(b-a)^2}{12}$

##### Distribució exponencial
$\text{Exp}(\gamma)$ per $y \in [0, \infty)$:
$$\rho(y) = \gamma e^{-\gamma y}$$

**Probabilitat acumulada**:
$$P(y) = 1 - e^{-\gamma y}$$

**Valor esperat**: $\langle y \rangle = 1/\gamma$
**Desviació estàndard**: $\sigma = 1/\gamma$
**Moment d'ordre n**: $\langle y^n \rangle = n!/\gamma^n$

##### Distribució gaussiana o normal
Donats el valor mitjà $\mu$ i la variància $\sigma^2$:
$$N(x; \mu, \sigma) \equiv \frac{e^{-(x-\mu)^2/(2\sigma^2)}}{\sqrt{2\pi}\sigma}$$

**Funció d'error**:
$$\text{Erf}(x) = \int_{-\infty}^x N(x'; \mu, \sigma) dx'$$

**Probabilitat en un interval**: La probabilitat que la variable prengui un valor comprès entre $(\mu - k\sigma, \mu + k\sigma)$ amb $k = 1, 2, \ldots, n$ és:
$$P(x) = \int_{\mu-k\sigma}^{\mu+k\sigma} dx \frac{e^{-(x-\mu)^2/(2\sigma^2)}}{\sqrt{2\pi}\sigma} = \text{Erf}\left(\frac{k}{\sqrt{2}}\right)$$

### 3.3 MÈTODES DE MOSTREIG DE DENSITATS DE PROBABILITAT

Un ordinador genera nombres pseudo-aleatoris distribuïts uniformement en l'interval $(0,1)$. Cal doncs buscar una variable aleatòria que s'adapti al problema en l'interval $(a, b)$.

#### MÈTODE DEL CANVI DE VARIABLE

Fem el canvi $g(y) dy = \rho(x) dx$:
$$g(y) = \rho(x)\left|\frac{dx}{dy}\right| = \rho(f^{-1}(y))\left|\frac{df^{-1}(y)}{dy}\right|$$
(quan $f(x)$ sigui unívoca)

Fixem la variable tal que $x \in (0,1)$ amb $\rho(x) = 1$ i les condicions:
$$\begin{cases} f(0) = a \\ f(1) = b \end{cases}$$

Aleshores: $g(y) = \left|\frac{df^{-1}(y)}{dy}\right|$ tal que:
$$P(y) = \int_a^y g(y') dy' = f^{-1}(y) = x$$

**Exemples**:

**Distribució uniforme**: 
$$x = \frac{y-a}{b-a} \rightarrow y = (b-a)x + a \quad \text{amb } x \in U(0,1)$$

**Distribució exponencial**:
$$y = -\frac{1}{\gamma} \ln(1-x) \quad \text{amb } x \in U(0,1)$$
$$y = -\frac{1}{\gamma} \ln(x) \quad \text{amb } x \in U(0,1]$$

#### MÈTODE DE BOX-MÜLLER

Siguin $x_1$ i $x_2$ dues variables aleatòries que segueixen una distribució gaussiana amb $\mu = 0$ i $\sigma = 1$. El suport de les dues és la recta real.

Prenent cada punt $(x_1, x_2)$ com a punts d'un pla:
$$P(x_1, x_2) = N(x_1; 0,1) \cdot N(x_2; 0,1) dx_1 dx_2$$

Considerem un canvi de variables:
$$\begin{cases} x_1 = r \cos \varphi \\ x_2 = r \sin \varphi \end{cases} \quad \text{amb} \quad \begin{cases} r \in [0, \infty) \\ \varphi \in [0, 2\pi] \end{cases}$$

Aleshores:
$$P(x_1, x_2) dx_1 dx_2 = \frac{1}{2\pi} e^{-\frac{x_1^2 + x_2^2}{2}} dx_1 dx_2 = \frac{1}{2\pi} e^{-\frac{r^2}{2}} r dr d\varphi$$

Això equival a una nova densitat de probabilitat de dues variables independents $(r, \varphi)$:
$$\begin{cases}
\rho(r) dr = e^{-r^2/2} r dr \quad \text{amb} \quad \int_0^{\infty} r e^{-r^2/2} dr = 1 \\
g(\varphi) d\varphi = \frac{1}{2\pi} d\varphi \quad \text{amb} \quad \int_0^{2\pi} \frac{1}{2\pi} d\varphi = 1
\end{cases}$$

**Per variables distribuïdes segons** $U(0,1)$:
$$\begin{cases} \xi_1 \in U(0,1) \\ \xi_2 \in U(0,1) \end{cases} \rightarrow \begin{cases} r = \sqrt{-2 \log(\xi_1)} \\ \varphi = 2\pi \xi_2 \end{cases}$$
#### MÈTODE D'ACCEPTACIÓ-REBUIG

Sigui una variable aleatòria $y$ amb $\rho(y) < M$ (definida i acotada).

**Algoritme**:

1. **Obtenció de nombres aleatoris**: Obtenim dos nombres aleatoris $x \in U(a, b)$ i $p \in U(0, M)$.
   
   Els podem generar a partir de $x_1, x_2 \in U(0,1)$ amb el canvi:
   $$\begin{cases} x = (b-a)x_1 + a \\ p = M x_2 \end{cases}$$

2. **Criteri d'acceptació**:
   - Si $\rho(x) \geq p$ → acceptem el valor de $x$, és a dir $y = x$
   - Si $\rho(x) < p$ → tornem al pas 1 amb altres nombres aleatoris

**Probabilitat resultant**:
$$\bar{\rho}(y) = \int_a^b dx \frac{1}{b-a} \int_0^M dp \frac{1}{M} \delta(x-y) \Theta(\rho(x)-p)$$

$$\bar{\rho}(y) = \rho(y) \frac{1}{M(b-a)}$$

### 3.4 HISTOGRAMES

Mètode per estimar la densitat de probabilitat d'una variable aleatòria.

Sigui un conjunt de $N$ nombres $\{x_1, x_2, \ldots, x_N\}$ generats independentment per $\rho(x)$.

**Construcció de l'histograma**:

1. **Determinació dels extrems**: Calculem el màxim $(x_M)$ i el mínim $(x_m)$ del conjunt.

2. **Partició de l'interval**: Construïm una partició de l'interval $[x_m, x_M]$:
   $$z_1 = x_m < z_2 < \cdots < z_{NB+1} = x_M$$
   
   Amb $NB$ intervals (barres de l'histograma): $\omega_k = z_{k+1} - z_k$ (amplada de l'interval $k$)

3. **Comptatge**: Comptem el nombre de valors $x_j$ de cada sub-interval $N_k$.

4. **Distribució de probabilitat**:
   $$P_N(x) = \sum_{k=1}^{NB} P_k W(x; z_k, z_{k+1})$$
   
   Amb:
   $$P_k = \frac{N_k}{N \omega_k} \quad \text{i} \quad W(x; z_k, z_{k+1}) = \begin{cases} 1 & \text{si } x \in [z_k, z_{k+1}] \\ 0 & \text{si } x \notin [z_k, z_{k+1}] \end{cases}$$

**Propietat de normalització**: $\int_S dx \, P_N(x) = 1$

**Error estadístic**:

**Variància**: 
$$\text{Var}(P_k) = \frac{1}{\omega_k^2 N^2} \text{var}(N_k) = \frac{1}{\omega_k^2 N^2} N \frac{N_k}{N}\left(1 - \frac{N_k}{N}\right)$$

**Desviació estàndard**:
$$\sigma = \sqrt{\text{Var}(P_k)} = \frac{1}{\omega_k \sqrt{N}} \sqrt{\frac{N_k}{N}\left(1 - \frac{N_k}{N}\right)}$$

En augmentar $N$, l'error millora com $\frac{1}{\sqrt{N}}$.

### 3.5 TEOREMA DEL LÍMIT CENTRAL

Sigui $x$ una variable aleatòria distribuïda segons $\rho(x)$. Construïm:
$$z = \frac{x_1 + x_2 + \ldots + x_N}{N}$$
on $x_i$ són els $N$ resultats de $x$.

De manera que $z$ és el **promig d'un grup de resultats** d'una variable aleatòria.

**Resultat del teorema**: $z$ segueix una distribució gaussiana:
$$g(z) = \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{(\mu-z)^2}{2\sigma^2}}$$

Amb:
- **Desviació estàndard**: $\sigma = \frac{\sigma_x}{\sqrt{N}}$
- **Valor esperat**: $\langle z \rangle = \mu$

### 3.6 INTEGRALS DEFINIDES

#### MÈTODE D'ENCERT-ERROR

Càlcul d'integrals de funcions positives i acotades en $[a, b]$:
$$I = \int_a^b f(x) dx = \int_a^b dx \int_0^M dp \, \Theta(f(x) - p)$$

**Emprant el Teorema del Límit Central**:
$$\frac{I}{M(b-a)} \simeq \frac{\sum_{k=1}^N \Theta(f(x_k) - p_k)}{N} = \frac{N(\text{dins})}{N(\text{total})}$$

Això és equivalent a $(b-a)$ cops el promig de la funció $f(x)$ amb la variable aleatòria $x$ distribuïda segons $U(0,1)$.

#### MÈTODE DE MONTECARLO CRU

$$I = \int_a^b f(x) dx = \int_0^1 h(t) dt$$

On l'integral es converteix en el **valor esperat** de la funció $h(t)$ amb la variable $t$ distribuïda segons $U(0,1)$.

**Canvi de variable**: $h(t) = (b-a) \cdot f((b-a)t + a)$

**Emprant el TLC**:
$$\int_0^1 h(t) dt \simeq \frac{1}{N} \sum_{k=1}^N h(t_k)$$

Considerem una variable promig $H_N = \frac{1}{N} \sum_k h(t_k)$, que segons el TLC, si $N$ és prou gran, està distribuïda com una gaussiana.

**Desviació estàndard**: $\sigma_{H_N} = \frac{\sigma_h}{\sqrt{N}}$ amb $\sigma_h = \sqrt{\langle h^2(t) \rangle - \langle h(t) \rangle^2}$

**Per $N$ molt gran**:
$$\int_0^1 h^2(t) dt \simeq \frac{1}{N} \sum_{k=1}^N h^2(t_k)$$

**Desviació estàndard estimada**:
$$\sigma_{H_N} \simeq \frac{1}{\sqrt{N}} \sqrt{\frac{1}{N} \sum_k h^2(t_k) - \left(\frac{1}{N} \sum_k h(t_k)\right)^2}$$
#### MÈTODE DE MONTECARLO AMB MOSTREIG D'IMPORTÀNCIA

Per quan la funció a integrar està més localitzada en alguna regió de l'interval.

Si $f(x)$ conté una $g(x) > 0$ que sigui una distribució amb $\int_S g(x) dx = 1$, emprem punts generats per aquesta distribució.

##### Distribució explícita

Considerem:
$$I = \int_S f(x) dx = \langle h(x) \rangle \quad \text{on} \quad f(x) = h(x) g(x)$$

Aleshores:
$$I = \langle h(x) \rangle = \int_S h(x) g(x) dx$$

**Aplicant el TLC**: $I = \langle H_N \rangle \simeq \frac{1}{N} \sum_k h(x_k)$

Amb:
$$\sigma_h \simeq \sqrt{\frac{1}{N} \sum_k h^2(x_k) - \left(\frac{1}{N} \sum_k h(x_k)\right)^2}$$

$$\sigma_{H_N} \simeq \frac{1}{\sqrt{N}} \sqrt{\frac{1}{N} \sum_k h^2(x_k) - \left(\frac{1}{N} \sum_k h(x_k)\right)^2}$$

**Resultat final**:
$$I = \int_S f(x) dx \simeq \frac{1}{N} \sum_{k=1}^N h(x_k) \pm \frac{1}{\sqrt{N}} \sqrt{\frac{1}{N} \sum_k h^2(x_k) - \left(\frac{1}{N} \sum_k h(x_k)\right)^2}$$

##### Cas general

Considerem:
$$I = \int_S f(x) dx = \int_S \frac{f(x)}{g(x)} g(x) dx$$

Amb les condicions:
$$\begin{cases} \int_S g(x) dx = 1 \\ g(x) > 0 \end{cases}$$

**Aplicant el TLC**:
$$I = \int_S f(x) dx \simeq \frac{1}{N} \sum_{k=1}^N \frac{f(x_k)}{g(x_k)} \pm \frac{1}{\sqrt{N}} \sqrt{\frac{1}{N} \sum_{k=1}^N \frac{f^2(x_k)}{g^2(x_k)} - \left(\frac{1}{N} \sum_{k=1}^N \frac{f(x_k)}{g(x_k)}\right)^2}$$

#### INTEGRALS MULTIDIMENSIONALS

**Estratègia segons el nombre de dimensions**:
- **1-3 dimensions** → utilitzem mètodes de trapezis, Simpson o Romberg
- **4 o més dimensions** → utilitzem el mètode de Montecarlo (tot i que requereix molts punts)

**Montecarlo per $m$ dimensions**:
$$I = \int d\{x\} h(\{x\}) = \frac{1}{N} \sum_{k=1}^N h(x_1^k, \ldots, x_m^k) \pm \frac{1}{\sqrt{N}} \sqrt{\frac{1}{N} \sum_k h^2(x_1^k, \ldots, x_m^k) - \left(\frac{1}{N} \sum_k h(x_1^k, \ldots, x_m^k)\right)^2}$$

### 3.7 GENERACIÓ DE NOMBRES ALEATORIS

Sempre que generem nombres aleatoris utilitzem distribucions del tipus $U(0,1)$. La majoria de mètodes es basen en relacions denominades **congruencials**.

Generen seqüències de nombres amb fórmules com:
$$N_i = \text{mod}[(aN_{i-1} + b), M]$$

On els nombres que busquem són:
$$x_i = \frac{N_i}{M}$$

**Requisits per al bon funcionament**: Aquestes seqüències haurien de donar nombres descorrelacionats i uniformement distribuïts. Aquests mètodes tenen un període que varia amb $M$.

## 4. Equacions diferencials ordinàries

Considerem que coneixem el valor de les variables en un temps inicial $t_0$ i en volem conèixer el valor en temps successius.

### 4.1 ALGORITMES D'INTEGRACIÓ PER EDOs

Considerem $\frac{dy}{dx} = f(x, y)$ (cas general) amb condicions inicials $y(x=0) = y_0$.

Construirem una discretització de la variable $x$ amb $h \equiv \Delta x$ tal que trobarem el valor de $y(x + k\Delta x)$.

La part dreta de l'equació $(f(x, y))$ és també coneguda.

#### MÈTODE D'EULER

**Notació**:
- Variable: $x_n = x_0 + nh$
- Valors: $y_n \equiv y(x_n)$, $f_n \equiv f(x_n, y_n)$

**Fórmula avançada per la derivada**:
$$\frac{y_{n+1} - y_n}{h} + O(h) \simeq f_n$$

**Fórmula d'Euler**:
$$y_{n+1} = y_n + hf_n + O(h^2)$$

#### Millora amb diferències centrals

Per millorar l'error fem servir 2 punts i en trobem un tercer:

Desenvolupaments de Taylor:
$$y(x+h) = y(x) + hy'(x) + \frac{h^2}{2}y''(x) + O(h^3)$$
$$y(x-h) = y(x) - hy'(x) + \frac{h^2}{2}y''(x) + O(h^3)$$

Restant les dues equacions:
$$y(x+h) - y(x-h) = 2hy'(x) + O(h^3)$$

**Fórmula millorada**:
$$y_{n+1} = y_{n-1} + 2hf_n + O(h^3)$$

#### MÈTODES IMPLÍCITS

Podem calcular $\frac{dy}{dx} = f(x, y)$ pels mètodes d'integració estudiats, com el mètode dels trapezis:

$$\int_{x_0}^{x_1} \frac{dy}{dx} dx = y(x_1) - y(x_0) \simeq \frac{h}{2}[f(x_0, y_0) + f(x_1, y_1)] + O(h^3)$$

Això porta a:
$$y_1 - y_0 - \frac{h}{2}(f(x_0, y_0) + f(x_1, y_1)) = 0$$

#### MÈTODE PREDICTOR-CORRECTOR

Combina un mètode explícit (per exemple, Euler) com a **predictor** i un mètode implícit (per exemple, trapezis) com a **corrector**.

El terme implícit es substitueix per la predicció del primer:

**Predictor**: $y_1^{\text{pred}} = y_0 + hf(x_0, y_0)$

**Corrector**: $y_1 = y_0 + \frac{h}{2}(f(x_0, y_0) + f(x_1, y_1^{\text{pred}}))$

### 4.2 MÈTODES MULTIPAS

Calculem diferents punts de la funció i, a partir d'aquests, definim el següent valor. La idea és utilitzar valors de $y$ i $y'$ anteriors per construir un polinomi que s'aproximi a $y'$ i integrar l'equació diferencial.

#### Mètode d'Adams

$$\int_{x_n}^{x_{n+1}} y'(x) dx = y_{n+1} - y_n = \int_{x_n}^{x_{n+1}} f(x, y) dx$$

**Amb 3 passos**:
$$y_{n+1} = y_n + \frac{h}{12}(23f_n - 16f_{n-1} + 5f_{n-2}) + O(h^4)$$

**Amb 4 passos**:
$$y_{n+1} = y_n + \frac{h}{24}(55f_n - 59f_{n-1} + 37f_{n-2} - 9f_{n-3}) + O(h^5)$$

#### Mètode d'Adams-Moulton (predictor-corrector)

**Predictor**: 
$$y_{n+1}^P = y_n + \frac{h}{24}(55f_n - 59f_{n-1} + 37f_{n-2} - 9f_{n-3})$$

**Corrector**:
$$y_{n+1} = y_n + \frac{h}{24}(9f_{n+1}^P + 19f_n - 5f_{n-1} + f_{n-2}) - \frac{19}{720}h^5 f^{(5)}(\xi)$$

#### Mètode de Hamming (predictor-corrector)

**Predictor**: 
$$y_{n+1}^P = y_{n-3} + \frac{4h}{3}(2f_n - f_{n-1} + 2f_{n-2})$$

**Modificador**: 
$$y_{n+1}^M = y_{n+1}^P - \frac{112}{121}(y_n^P - y_n^C)$$

**Corrector**: 
$$y_{n+1}^C = \frac{1}{8}(9y_n - y_{n-2} + 3h(f_{n+1}^M + 2f_n - f_{n-1}))$$

**Valor final**: 
$$y_{n+1} = y_{n+1}^C + \frac{9}{121}(y_{n+1}^P - y_{n+1}^C)$$

**Error global**: $O(h^6)$


### 4.3 MÈTODES D'ORDRE SUPERIOR: RUNGE-KUTTA

Són mètodes multipas que busquen una aproximació d'ordre superior local a la funció $y(x_0 + h)$:

$$y(x_0 + h) = y(x_0) + hy'(x_0) + \frac{h^2}{2}y''(x_0) + \ldots$$

Substituint l'EDO:
$$y(x_0 + h) = y(x_0) + hf(x_0, y_0) + \frac{h^2}{2}y''(x_0) + \ldots$$

Per trobar aproximacions de $y''(x_0)$ cal desenvolupar $f(x, y)$ aproximant-ne les derivades.

#### MÈTODES DE RUNGE-KUTTA

Empra $R$ avaluacions de la funció $f(x, y)$ (derivada de la solució $y(x)$ en diversos punts) i en fa una mitjana ponderada.

**Ordre 4 (RK4)**:
$$y_1 = y_0 + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

On:
$$\begin{cases}
k_1 = f(x_0, y_0) \\
k_2 = f\left(x_0 + \frac{h}{2}, y_0 + \frac{h}{2}k_1\right) \\
k_3 = f\left(x_0 + \frac{h}{2}, y_0 + \frac{h}{2}k_2\right) \\
k_4 = f(x_0 + h, y_0 + hk_3)
\end{cases}$$

### 4.4 EDOs DE SEGON ORDRE - PROBLEMES DE DOS PUNTS

EDOs de segon ordre que donen lloc a problemes de dos punts:
$$\frac{d^2y}{dx^2} = f\left(x, y, \frac{dy}{dx}\right)$$

Amb les condicions de contorn repartides en dos punts diferents $(a, b)$:
$$\begin{cases}
y(x=a) = y_a \\
y(x=b) = y_b
\end{cases}$$

#### MÈTODE DE TIR

Tenim $\frac{d^2y}{dx^2} = f\left(x, y, \frac{dy}{dx}\right)$ amb les condicions anteriors i volem trobar el valor de $y'(a)$.

**Algoritme**:
1. **Proposem un valor** de $y'(a)$ i mirem quina $y(b)$ obtenim
2. **Utilitzem un dels mètodes d'obtenció d'arrels** (tema 1) fins obtenir $y(b) = y_b$ (aproximació)
3. **Ajustem el valor**:
   - Si $y(b) > y_b$ → agafem una $y'(a)$ més petita
   - Si $y(b) < y_b$ → agafem una $y'(a)$ més gran

El procés es repeteix fins trobar la convergència desitjada.

## 5. Equacions diferencials en derivades parcials

### 5.1 CLASSIFICACIÓ DE LES EDPs

Considerem $\phi$ dependent de $x$ i $t$:
$$\frac{\partial^2\phi}{\partial x^2}, \quad \frac{\partial^2\phi}{\partial t^2}, \quad \frac{\partial^2\phi}{\partial x \partial t} = \frac{\partial^2\phi}{\partial t \partial x}$$

**Equació general**:
$$A\frac{\partial^2\phi}{\partial t^2} + B\frac{\partial^2\phi}{\partial t \partial x} + C\frac{\partial^2\phi}{\partial x^2} + D\left(x, t, \frac{\partial\phi}{\partial x}, \frac{\partial\phi}{\partial t}\right) = 0$$

Donat $\Delta = B^2 - 4AC$, es classifiquen com:

#### ELÍPTIQUES ($\Delta < 0$)

**Característiques**: $B = 0$ (no derivades creuades), $AC > 0$ (derivades parcials amb el mateix signe)

**Exemples**:
1. **Laplace**: $\nabla^2 f(x, y, z) = 0 \rightarrow \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} = 0$

2. **Poisson**: $\nabla^2 f(x, y) = -\varphi(x, y)$

3. **Schrödinger estacionària**: $-\frac{\hbar^2}{2m}\left(\frac{\partial^2\Psi}{\partial x^2} + \frac{\partial^2\Psi}{\partial y^2}\right) + V\Psi = E\Psi$

#### PARABÒLIQUES ($\Delta = 0$)

**Característiques**: $B = 0$ (no derivades creuades), $A = 0$ (derivada temporal d'ordre 1)

**Exemples**:
1. **Difusió**: $\frac{\partial\phi}{\partial t} = k\frac{\partial^2\phi}{\partial x^2}$

2. **Schrödinger dependent del temps**: $-\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2} + V\Psi = i\hbar\frac{\partial\Psi}{\partial t}$

#### HIPERBÒLIQUES ($\Delta > 0$)

**Característiques**: $B = 0$ (no derivades creuades), $AC < 0$ (derivades parcials amb signes contraris)

**Exemples**:
1. **Ones d'1D**: $\frac{\partial^2\phi}{\partial t^2} - c^2\frac{\partial^2\phi}{\partial x^2} = 0$

2. **Ones amb atenuació**: $\frac{\partial^2\phi}{\partial t^2} - \lambda\frac{\partial\phi}{\partial t} - c^2\frac{\partial^2\phi}{\partial x^2} = f(x, t)$

#### CONDICIONS INICIALS I DE CONTORN

**Condicions de Dirichlet**: S'imposa que la solució tingui un valor determinat en un contorn tancat (línia 2D, superfície 3D, ...).

**Condicions de Neumann**: S'imposa que es conegui el valor de la derivada de la solució en la direcció normal a la superfície en un contorn donat.
### 5.2 MÈTODES DE DIFERÈNCIES FINITES

Utilitzem aproximacions de diferències finites per les derivades: EDP → EDO discretitzant les variables.

Per funcions suficientment regulars:

$$f(x+h) = f(x) + hf'(x) + \frac{h^2}{2}f''(x) + \frac{h^3}{3!}f'''(x) + O(h^4)$$
$$f(x-h) = f(x) - hf'(x) + \frac{h^2}{2}f''(x) - \frac{h^3}{3!}f'''(x) + O(h^4)$$

**Definicions**:
$$x = nh, \quad f(x) \equiv f_n, \quad f(x+h) \equiv f_{n+1}$$

**Aproximacions de derivades**:
$$f'_n \simeq \frac{f_{n+1} - f_{n-1}}{2h} + O(h^2)$$
$$f''_n = \frac{f_{n+1} - 2f_n + f_{n-1}}{h^2} + O(h^2)$$

#### EQUACIÓ DE LAPLACE

$$\frac{\partial^2\phi}{\partial x^2} + \frac{\partial^2\phi}{\partial y^2} = 0$$

Utilitzarem una malla de pas constant i igual per les dues coordenades:
$$\begin{cases} x = ih & \text{amb } i = 0, 1, \ldots, N_x \\ y = jh & \text{amb } j = 0, 1, \ldots, N_y \end{cases}$$

Definim: $\phi(x, y) = \phi(ih, jh) = \phi_{i,j}$ → MATRIU $N_x \times N_y$

**Aproximacions**:

**Direcció x**: 
$$\frac{\partial\phi}{\partial x} \simeq \frac{\phi_{i+1,j} - \phi_{i-1,j}}{2h}, \quad \frac{\partial^2\phi}{\partial x^2} \simeq \frac{\phi_{i+1,j} + \phi_{i-1,j} - 2\phi_{i,j}}{h^2}$$

**Direcció y**: 
$$\frac{\partial\phi}{\partial y} \simeq \frac{\phi_{i,j+1} - \phi_{i,j-1}}{2h}, \quad \frac{\partial^2\phi}{\partial y^2} \simeq \frac{\phi_{i,j+1} + \phi_{i,j-1} - 2\phi_{i,j}}{h^2}$$

**Equació discretitzada**:
$$\phi_{i+1,j} + \phi_{i-1,j} + \phi_{i,j+1} + \phi_{i,j-1} - 4\phi_{i,j} = 0$$

##### Condicions de Dirichlet
Alguns termes de l'equació són coneguts, tal que tindrem un conjunt de $(N_x-1)(N_y-1)$ equacions i incògnites.

##### Condicions de Neumann
**Exemple**: Gradient en $x = 0$: $\left.\frac{\partial\phi}{\partial x}\right|_{x=0} = \beta$ (recta $x = 0$)

Per imposar aquesta condició cal afegir punts auxiliars $\phi_{-1,j}$ tal que $\phi_{0,j}$ seran interiors. Tindrem $(N_x+1)$ incògnites noves amb equació per resoldre.

Emprant $f'_n \simeq \frac{f_{n+1} - f_{n-1}}{2h} + O(h^2)$:

**Condició de contorn**: $\phi_{-1,j} = \phi_{1,j} - 2h\beta$

#### RESOLUCIÓ DEL SISTEMA D'EQUACIONS RESULTANT

Donada l'equació de Laplace discreta $\phi_{i,j} = \frac{\phi_{i+1,j} + \phi_{i-1,j} + \phi_{i,j+1} + \phi_{i,j-1}}{4}$, la resolem seguint la següent estructura:

1. **Inicialitzem** $\phi_{i,j}$ amb valors aleatoris i en el contorn utilitzem les condicions de Dirichlet
2. **Comencem a iterar** (mètode Jacobi, Gauss-Seidel o sobre-relaxació) recorrent tots els nodes  
3. **Avaluem l'error**: $\text{Error} = \max\left[\left|\phi_{i,j}^{k+1} - \phi_{i,j}^k\right|\right] \quad \forall i,j$ amb $k \equiv$ iteracions
4. **Si l'error és menor que la tolerància**, aturem; si no, tornem a 2

**Mètodes iteratius**:

- **Mètode de Jacobi**: 
  $$\phi_{i,j}^{k+1} = \frac{\phi_{i+1,j}^k + \phi_{i-1,j}^k + \phi_{i,j+1}^k + \phi_{i,j-1}^k}{4}$$

- **Mètode de Gauss-Seidel**: 
  $$\phi_{i,j}^{k+1} = \frac{\phi_{i+1,j}^k + \phi_{i-1,j}^{k+1} + \phi_{i,j+1}^k + \phi_{i,j-1}^{k+1}}{4}$$

- **Mètode de sobre-relaxació**: 
  $$\phi_{i,j}^{k+1} = \phi_{i,j}^k + \omega \frac{\phi_{i+1,j}^k + \phi_{i-1,j}^{k+1} + \phi_{i,j+1}^k + \phi_{i,j-1}^{k+1} - 4\phi_{i,j}}{4}$$
  
  amb $\omega > 1$ (valors òptims $\omega \in [1,2]$)

#### EQUACIÓ DE POISSON I MÈTODES D'ORDRE SUPERIOR

Donada l'equació de Poisson $\nabla^2\phi(x,y) = -\rho(x,y)$, apliquem el mateix procediment amb algoritmes iteratius, ara amb:

$$\phi_{i,j} = \frac{\phi_{i+1,j} + \phi_{i-1,j} + \phi_{i,j+1} + \phi_{i,j-1} + h^2\rho_{i,j}}{4}$$

**Per ordre superior** tenim:
$$\phi_{i,j} = \frac{\phi_{i+1,j+1} + \phi_{i-1,j+1} + \phi_{i+1,j-1} + \phi_{i-1,j-1} + 4\phi_{i,j+1} + 4\phi_{i,j-1} + 4\phi_{i+1,j} + 4\phi_{i-1,j}}{20}$$

### 5.3 EQUACIÓ DEL CALOR (PARABÒLICA)

$$\frac{\partial u}{\partial t} = \alpha \frac{\partial^2 u}{\partial x^2}$$

Discretitzem el domini: 
- **Spatial**: $x = ih$ amb $i = 0, 1, \ldots, N$  
- **Temporal**: $t = n\tau$ amb $n = 0, 1, \ldots, M$

**Notació**: $u(ih, n\tau) = u_i^n$

**Aproximació temporal**: $\frac{\partial u}{\partial t} \simeq \frac{u_i^{n+1} - u_i^n}{\tau}$

**Aproximació espacial**: $\frac{\partial^2 u}{\partial x^2} \simeq \frac{u_{i+1}^n - 2u_i^n + u_{i-1}^n}{h^2}$

#### Esquema explícit (Forward Euler):

$$u_i^{n+1} = u_i^n + \frac{\alpha\tau}{h^2}(u_{i+1}^n - 2u_i^n + u_{i-1}^n)$$

**Definim**: $r = \frac{\alpha\tau}{h^2}$ (nombre de Courant)

$$u_i^{n+1} = ru_{i-1}^n + (1-2r)u_i^n + ru_{i+1}^n$$

**Estabilitat**: Requereix $r \leq \frac{1}{2}$ per estabilitat.

#### Esquema implícit (Backward Euler):

Aproximem la derivada espacial en el temps $(n+1)$:

$$\frac{u_i^{n+1} - u_i^n}{\tau} = \alpha \frac{u_{i+1}^{n+1} - 2u_i^{n+1} + u_{i-1}^{n+1}}{h^2}$$

Reorganitzant:
$$-ru_{i-1}^{n+1} + (1+2r)u_i^{n+1} - ru_{i+1}^{n+1} = u_i^n$$

Això genera un sistema d'equacions lineals **tridiagonal** que cal resoldre a cada pas temporal.

**Avantatges**: Esquema incondicionalment estable (pot usar qualsevol $\tau$).

#### Esquema de Crank-Nicolson:

Combina els esquemes explícit i implícit amb pes $\theta$:

$$\frac{u_i^{n+1} - u_i^n}{\tau} = \alpha\left[\theta \frac{\partial^2 u^{n+1}}{\partial x^2} + (1-\theta)\frac{\partial^2 u^n}{\partial x^2}\right]$$

Per $\theta = \frac{1}{2}$ (Crank-Nicolson):

$$u_i^{n+1} - u_i^n = \frac{r}{2}[(u_{i+1}^{n+1} - 2u_i^{n+1} + u_{i-1}^{n+1}) + (u_{i+1}^n - 2u_i^n + u_{i-1}^n)]$$

**Propietats**:
- Precisió d'ordre 2 en temps i espai
- Incondicionalment estable
- Requereix resoldre sistema tridiagonal

### 5.4 CONDICIONS INICIALS I DE CONTORN PER EQUACIONS PARABÒLIQUES

**Condicions inicials**: Temperatura a tots els punts per $t = 0$:
$$u(x, t=0) = f(x)$$

**Condicions de contorn**: Temperatura als extrems (constants):
$$u(0, t) = C_1 \quad \text{i} \quad u(L, t) = C_2$$
