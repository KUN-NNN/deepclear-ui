/**
 * DeepClear UI — the blank New Session surface.
 *
 * The blank home becomes a dotted composition: a dot-matrix portrait on the
 * right and the deepseek / harness wordmark on the left, both driven by one
 * canvas layer registered into `conversation.hero.frame` (the HOC slot that
 * wraps the Conversation scroll body and reports whether the blank home shows).
 * The layer renders the wrapped `children` unchanged and paints below the
 * content (`z-index: -1`, `pointer-events: none`).
 *
 * It also hides the stock home chrome it replaces: the headline, the brand mark,
 * and the official pixel-whale canvas. A faint `deepclear-ui` signature sits in
 * the page corner while the home is showing.
 *
 * The stylesheet below also carries the accent half in the same bundle:
 * whale-blue bold runs in chat prose, the whale-blue composer focus ring, and the
 * re-inked diff plates. One install, one stylesheet, one place to tune.
 */
window.__ModuleLoader__.load({
  id: 'deepclear-ui',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /* ------------------------------------------------------------ hero mascot */

    /** Dot grid sampled from the mascot artwork: one hex digit per cell. */
    const GIRL_COLUMNS = 104
    const GIRL_ROWS = 73
    const GIRL_GRID = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000121100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013133112320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000163116400000264223200000000000000000000000000000000000000000000000000000000000000000000000000000000000326000001000000a800134000000000000000000000000000000000000000000000000000000000000000000000000000000002500000001200020000000014000000000000000000000000000000000000000000000000000000000000000000000000000000353000310023201320020000050000000000000000000000000000000000000000000000000000000000000000000000000000003000003310000000001300001b33300000000000000000000000000000000000000000000000000000000000000000000000000100010110035457764200000022002400000000000000000000000000000000000000000000000000000000000000000000000030000300006aba999accb820022000003000000000000000000000000000000000000000000000000000000000000000000000031000000224abbaa976778bca300200008900000000000000000000000000000000000000000000000000000000000000000000a1031005789787777898777679c8000000055000000000000000000000000000000000000000000000000000000000000000000b800220a98b96777777788777777ab30001008100000000000000000000000000000000000000000000000000000000000000007f00002b97b97777777777777777768c402100460000000000000000000000000000000000000000000000000000000000000000ef4000a9699777777777777778777677b600000a2000000000000000000000000000000000000000000000000000000000000000820107a68978777777777777778766788b30000c220000000000000000000000000000000000000000000000000000000000000300003b77887877777777877777787677889220af30300000000000000000000000000000000000000000000000000000000000130000897787787777777797754778877779960025d002000000000000000000000000000000000000000000000000000000000040000297777778777875878a777677977777981000870300000000000000000000000000000000000000000000000000000000003101069878778777865578779777778977778a70105a0300000000000000000000000000000000000000000000000000000000000c60288778778877744778855977777987777994004b0401000000000000000000000000000000000000000000000000000000008d00596788777777757878880497777897777888009a059800000000000000000000000000000000000000000000000000000002e00077578878668777777899203987779777778931ea57780000000000000000000000000000000000000000000000000000000aa004956788784587777777894246988789787788648688681000000000000000000000000000000000000000000000000000000ec00784679878439877777868710049888a74778877667da30000000000000000000000000000000000000000000000000000002fe20964779878408877777856800005878836877877749dd800000000000000000000000000000000000000000000000000000003c01857679879305977777762910000327985487876a7bbad90000000000000000000000000000000000000000000000000000000e00778679878433887877782610001620864877786aecbaad700000000000000000000000000000000000000000000000000002dda47786798787005868867755205cffde4587778887bbbaaad7000000000000000000000000000000000000000000000000004dccdb677778979300076788777604fc5d48fa77778868aaaaaaad50000000000000000000000000000000000000000000000003c2bcc9677778976300046677777704cb7ca0b96777796bbaaaaaaad400000000000000000000000000000000000000000000000a91ebb8777777974300002477776460abe8a02387877889acbaaaaabc2000000000000000000000000000000000000000000000009edba77777779812039a7038678400687660058787689703accbaaabc1000000000000000000000000000000000000000000000004ba977777778900dffab603624520073430087886599c00037bccbabc000000000000000000000000000000000000000000000000ba878787778908c9c89b001100000121104789756a9a900000369ccdb0000000000000000000000000000000000000000000000aca88969777893f26bbe91000111111111347a8649a98b8100000015afc000000000000000000000000000000000000000000006caa8996a877786f01a6562011111111222237a669aa888cb7414600000aa0000000000000000000000000000000000000000002daaa89b6a96777b9502742111111000111110586999998799047558778698000000000000000000000000000000000000000000bbaabaa969a77778600022011110012201100177aa7999777a400000210210000000000000000000000000000000000000000009caaadc6078b877779501112111036666010028aaa76a9a777880000000000000000000000000000000000000000000000000006daabda144a7aa778777401211105a434201000bb996699a86778400000000000000000000000000000000000000000000000005daaca4002aa7898789777532111014343101009d987769aa9677781000000000000000000000000000000000000000000000003dbcc700006c99788977a8473001110011001009db877768a9976767700000000000000000000000000000000000000000000000ddc8200005c9998789a868acb20000000011004cbb777667a9a8676786000000000000000000000000000000000000000000000bb600008867aa88977899967abc8310000000235baa7774678a99666759600000000000000000000000000000000000000000000d6269893007b9787778a788779aabcba52213425cb898536889997667509700000000000000000000000000000000000000000000562020000b97788889a967898989bb65444433278aa7647798998666810780000000000000000000000000000000000000000000000000007b7777225bca7768b989b802333331015c977677a889966777004830000000000000000000000000000000000000000000000000b7778410007c8676898ac502122222203c9877669a88a97878400096000000000000000000000000000000000000000000000006878861220003957889984001019491111ba986569a99aa447781000991000000000000000000000000000000000000000000006878785022000047576608100107e1e6000069a5458bb82000777600008a300000000000000000000000000000000000000000498787787113a00017454607a8bbac969b676067264478200000576840000995000000000000000000000000000000000000005996888788620aa0100835b607edbbdb687bdcccc6295362000000576682000198520000000000000000000000000000000000587204876892004b00214834a904fcbba9677bcbacb07a844500000098666700006965300000000000000000000000000000005740001977799000ad000077446b00cdcbada09caaae702977662001009a7666600029706200000000000000000000000000000970000088768a8102ce200085448d101cbabd706eaabb002d967885300005966665101881060000000000000000000000000001a70000078777999206cda0028435c6002babcc201dcbb7002bea6889940006a8766662588303500000000000000000000000000990000079776898a609bce005634ac006fbabbb010bbbac7002de22878a810398875555779200710000000000000000000000007a50000797777989911bbbc006348f9003bdcac60e57cabcf6008d80877984607988755545700073000000000000000000000003995003897776987a503daae81659df6000047dc30005dbbb81002dd27777906259888854545510850000000000000000000000078894688777679789006caad9593aed0001100c901001cd2000000af8677771b429888885455566740000000000000000000000098777787777787789308cab97820df4001000021000008400011004c7778726d60398888974454566400000000000000000000019665687777678778787aab768300eb00010001011200100120000158857a20cf702987876985445768740000000000000000003666668777777877767bcab8679002f40001000100013500001000000af752005f706a7789008a53450488500000000000000038867667877787787777bbab9776bb02e00000000000009e000010000002fa00009d6099877930099634303783000000000000189402766787789778778baaaa89769fa2d000000000000000000000000000dc0006dc6059877870079973530486000000000005a4000766687889777777baaaaa8b757e52d000000000000100100000000000ad003fbc606787778008889745106700000000008a1000676568888877787abaaaaa9aa77901f3000000000001001000000000008c000acba3777877900977896550070000000008b00001756568888877787baaaaaaa9baba00f8002210000000000000000000009b000cbab967678785787788966305000000007a4000046466588888777769cbaaaaaaaabd10be1123232100106a001000000000c800ccaaaa767677788777a258556400000004980000065466579888777765acbbaaaaabbcc04f9012222321107c011011122005f200dbaaab96776777777880086561000000078700001654465688887775665bbbbaaaaabcd009f702222223221012233323321ec02bcbaaaab86776777788000475620'
    const GIRL_LINES = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001221000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000050551247200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e601e8000001b624620000000000000000000000000000000000000000000000000000000000000000000000000000000000061f000000000000ff00068000000000000000000000000000000000000000000000000000000000000000000000000000000004b000000004000300000000090000000000000000000000000000000000000000000000000000000000000000000000000000006c5000600015100520030000080000000000000000000000000000000000000000000000000000000000000000000000000000005000005700000000000400000f55700000000000000000000000000000000000000000000000000000000000000000000000000100020000012125521100000021002800000000000000000000000000000000000000000000000000000000000000000000000070000600003fea779dfff910011000005000000000000000000000000000000000000000000000000000000000000000000000050000000112deb98422225efe10010000ff00000000000000000000000000000000000000000000000000000000000000000000f006000259b233233353322239fb000000099000000000000000000000000000000000000000000000000000000000000000000fd00110f95f52223222233323323cf1000000f000000000000000000000000000000000000000000000000000000000000000007f00001f82a43333333332333333324f2010005c0000000000000000000000000000000000000000000000000000000000000000ff1000f9254333333333333333333223f400000f1000000000000000000000000000000000000000000000000000000000000000f10008e23433333333333333323322333f10000f110000000000000000000000000000000000000000000000000000000000000300001f3333333333333332322234223335d110ff10400000000000000000000000000000000000000000000000000000000000060000983333333333333353222323422326920012f0010000000000000000000000000000000000000000000000000000000000700001d33333333334223239232232632323990000da0300000000000000000000000000000000000000000000000000000000004000059333333333322223337333323523324b70002f0100000000000000000000000000000000000000000000000000000000000f901b5333323333212233322b333326323336c1001f010000000000000000000000000000000000000000000000000000000000cf002b22333332332224343601a333236233237800bf02ee00000000000000000000000000000000000000000000000000000001f00085233324224333332369101a43326323334910fb246d0000000000000000000000000000000000000000000000000000000ff002c22333262273333333492116b733342333452152332b0000000000000000000000000000000000000000000000000000000ff00791234337119333333327a0002c533a31233332223f810000000000000000000000000000000000000000000000000000001ff10d22234338108633332422d00002735612433323313cf300000000000000000000000000000000000000000000000000000001f00a22235339102933322321f0000011287223333273743f80000000000000000000000000000000000000000000000000000000f005242343381118533222618000002104213333324f8433f400000000000000000000000000000000000000000000000000001ff813332243288004825322522102fffff1253323333654344f2000000000000000000000000000000000000000000000000001fc9d823332342b100082453224601fd2f13f9333233234333344f20000000000000000000000000000000000000000000000001f16683233323634100013233324901f72c90f82333342894333335f100000000000000000000000000000000000000000000000f90f453233323751100001163242270bdf3c011423323347e9433336f100000000000000000000000000000000000000000000000dfd4432333326801018d201b46b200572260025333233201afc84349f0000000000000000000000000000000000000000000000001a4323333334900fff7c2017129100b1110083432243f00013dfd97bf000000000000000000000000000000000000000000000000b5333233233806f3a36f000100000010002547322739900000128ffff0000000000000000000000000000000000000000000000cb533325322361f12ccfb0000000000000124b3225733e7000000002bff000000000000000000000000000000000000000000002f4433327322342f00e2251000000000111116b22584333ff9204a00000ff0000000000000000000000000000000000000000001f54433a2642323c9201a1100000000000001023243333325b03d86fced4fe000000000000000000000000000000000000000000f943548724822224200011000000001100000043662334223d100000100100000000000000000000000000000000000000000008e444ff2023932322b20000100002babe00001896932434322780000000000000000000000000000000000000000000000000002f548fa0119276333225100110009f214200000ea33224353222a200000000000000000000000000000000000000000000000002f66eb1001b72343235325211000005343000008f3332234432224a0000000000000000000000000000000000000000000000001fbdf300002e333333239322100000000000000af932222363422226a00000000000000000000000000000000000000000000000fff5100002f434333383238ff10000000000001f8722322353532223b8000000000000000000000000000000000000000000000ff20000ff45b5333323433228bf5100000000112e73232123343422222e900000000000000000000000000000000000000000000f515fef1003a3233223533322389dfff41102612fa33321233335222420fb00000000000000000000000000000000000000000000591010000f622557477323343333be36255411134662222343333222800cf0000000000000000000000000000000000000000000000000005f2236112ff922238333c601111111002f4332227333522246003f10000000000000000000000000000000000000000000000000f3337100006f52323437f201011111101f43322245338836491000fb000000000000000000000000000000000000000000000005623440110001d2253675100000c1f0000fa542224767ef1175b0000ff0000000000000000000000000000000000000000000004734352011000015242207000004f1f2000027d2125df9100065780000ff1000000000000000000000000000000000000000002e9343376001f00009121203b3dd8f324d222022121169100000272a10000ff3000000000000000000000000000000000000006ff2633269710ff0000c12f303fc66e72338eceef21c21410000002622b10001fa6100000000000000000000000000000000009fc1026323a1001f00102c11da02f744332237754ce03f6214000000e9222900005d46200000000000000000000000000000009f50000b3228a000cf0000b7112f00fc444d803a444f30172225100000fe222470001c70a100000000000000000000000000000fc00000b522398001ff1000d2126f000c444f302f444c001f6236a2100002922246000bc00d0000000000000000000000000000fc000008822246a102efb001d112f20018447f100f8463001ff9256ab20003c42224712ab102900000000000000000000000000ff000008b322354b20899f005511af005f9446c000b644d2001ff11536fc001c542222257e100f00000000000000000000000009f200009b3223536a10d46d006113f8001ffa4e20f22c45df7007f303328815056353222129000e3000000000000000000000001d92001aa3222433a201f44f30325ff2000013ff10002faafa0001ff12322904129334422222400d500000000000000000000000995a12a7222234338002e44f62c18ff0000000fd00000ff1000000cf3233440f2195334421223659100000000000000000000000c6322452222243337103a4632910ff100000001000000d200012001f2337712f2018333493112123610000000000000000000000c222242222233333232558325100ff00010000000400000010000025322f10ff201933432ca211287dc200000000000000000017322243222323333229a463228001f10001000000002700000000000df321002f202b323900ae212201cd60000000000000002fd6622243223323332375443222cf01f0000100010000ff000010000001fb00006f20b8322b100ab212101be10000000000000ff3016223322352333237444434225fb1f000000001000000000010000000ff0002fe20284228600598212101f8000000000007f500083223333432333364443439222f21f000000001000000000000000000ef001f9c20235324b008538313009d0000000000ef0000772223333332233554443434422500f1000000000000000000000000009f00089641323422a009234922400e000000000df00001922224333322233a44344443448900f900140000000000000000000000df000d547522233252242246a24109000000009f1000056242253333222323c4433444444f00ff001324200000cf000000000000fa00fc4446222223255222c12b229300000001eb000008312223433322232249444444445cf01fb00111241000df000000133002f100f64446322222322228900c32900000000ab80000082112224333223222244444444448f007f701111224110001246323310ff01fd44444832222322248000172810'

    /** Grid aspect (width / height), used to keep the portrait undistorted. */
    const GIRL_ASPECT = GIRL_COLUMNS / GIRL_ROWS

    /** Wordmark set in dots on the left: two lines, sampled from live text. */
    const LOCKUP_LINES = ['deepseek', 'harness']
    const LOCKUP_COLUMNS = 140
    const LOCKUP_ROWS = 58

    /** Alpha buckets drawn per frame, so the twinkle costs one fill per level. */
    const LEVELS = 12
    const TAU = Math.PI * 2

    /**
     * Twinkle refresh rate. The field is dense, so the frame budget is kept
     * loose: slow alpha breathing reads the same at 16 fps, and the canvas is
     * only alive while the blank home is on screen.
     */
    const FRAME_MS = 1000 / 30

    /** One dot's cell in CSS pixels: fixed, so dots never scale with the window. */
    const DOT_PITCH = 9

    /** Smallest dot pitch the wordmark may use before it is dropped. */
    const TEXT_MIN_PITCH = 3.6

    /** Wordmark assembly: dots reveal left to right over this long. */
    const ASSEMBLY_MS = 1300

    /** Each line's slice of the assembly, in timeline fractions: line 1 starts
     *  while line 0 is still finishing, so the two never pop at once. */
    const ASSEMBLY_SECOND_LINE = 0.42
    const ASSEMBLY_LINE_SPAN = 0.58

    /** Temporary on-canvas readout used to diagnose layout mismatches. */
    const DEBUG = false

    /** Dot model of the portrait for the light canvas (ink-weighted). */
    let dotModel

    /** Dot model of the portrait for the dark canvas (line-art weighted). */
    let lineModel

    /** Dot model of the wordmark, built once by rasterising live text. */
    let lockupModel

    /**
     * Decode one hex grid into dots: one dot per non-empty cell, weight from the
     * digit, each with its own twinkle phase and speed so the field never blinks
     * in unison.
     * @param cells - one hex digit per grid cell, row-major.
     * @returns dots in normalised space (`u`/`v` 0..1, `a` weight 0..1).
     */
    function decodeGrid(cells) {
      const dots = []
      for (let index = 0; index < cells.length; index += 1) {
        const weight = Number.parseInt(cells[index], 16)
        if (!(weight > 0)) continue
        const row = Math.floor(index / GIRL_COLUMNS)
        const column = index % GIRL_COLUMNS
        dots.push({
          u: (column + 0.5) / GIRL_COLUMNS,
          v: (row + 0.5) / GIRL_ROWS,
          a: weight / 15,
          phase: Math.random() * TAU,
          speed: 0.5 + Math.random() * 0.8,
        })
      }
      return dots
    }

    /**
     * Light canvas: the artwork's ink drives dot weight, so dark hair and the
     * dark dress read dark on the pale canvas.
     * @returns dots in normalised space.
     */
    function mascotDots() {
      if (dotModel === undefined) dotModel = decodeGrid(GIRL_GRID)
      return dotModel
    }

    /**
     * Dark canvas: the dots are light, so the artwork's ink is inverted — skin
     * and the white apron become dense bright dots while ink-heavy hair and the
     * dress fade back into the canvas. Cells with no ink but enclosed by the
     * figure count as full weight, which is what keeps the face from turning
     * into an empty hole.
     * @returns dots in normalised space.
     */
    function invertedDots() {
      if (lineModel !== undefined) return lineModel
      const total = GIRL_COLUMNS * GIRL_ROWS
      const occupied = new Uint8Array(total)
      const weight = new Float32Array(total)
      for (let index = 0; index < GIRL_GRID.length && index < total; index += 1) {
        const value = Number.parseInt(GIRL_GRID[index], 16)
        if (!(value > 0)) continue
        occupied[index] = 1
        weight[index] = value / 15
      }
      const rowFirst = new Int32Array(GIRL_ROWS).fill(-1)
      const rowLast = new Int32Array(GIRL_ROWS).fill(-1)
      const columnFirst = new Int32Array(GIRL_COLUMNS).fill(-1)
      const columnLast = new Int32Array(GIRL_COLUMNS).fill(-1)
      for (let row = 0; row < GIRL_ROWS; row += 1) {
        for (let column = 0; column < GIRL_COLUMNS; column += 1) {
          if (occupied[row * GIRL_COLUMNS + column] === 0) continue
          if (rowFirst[row] < 0) rowFirst[row] = column
          rowLast[row] = column
          if (columnFirst[column] < 0) columnFirst[column] = row
          columnLast[column] = row
        }
      }
      const dots = []
      for (let row = 0; row < GIRL_ROWS; row += 1) {
        for (let column = 0; column < GIRL_COLUMNS; column += 1) {
          if (row < columnFirst[column] || row > columnLast[column]) continue
          if (column < rowFirst[row] || column > rowLast[row]) continue
          const index = row * GIRL_COLUMNS + column
          const alpha = occupied[index] === 1 ? 1 - weight[index] : 1
          if (alpha < 0.45) continue
          dots.push({
            u: (column + 0.5) / GIRL_COLUMNS,
            v: (row + 0.5) / GIRL_ROWS,
            a: alpha,
            phase: Math.random() * TAU,
            speed: 0.5 + Math.random() * 0.8,
          })
        }
      }
      lineModel = dots
      return dots
    }

    /**
     * Rasterise the two wordmark lines with the UI font and reduce them to the
     * same dotted grid the portrait uses.
     * @returns dots in normalised block space (`u`/`v` 0..1, `a` weight 0..1).
     */
    function lockupDots() {
      if (lockupModel !== undefined) return lockupModel
      const supersample = 4
      const family = '"Segoe UI", system-ui, sans-serif'
      // Display treatment: heavy italic with wide tracking, filled solid. Each
      // line is rasterised on its own canvas, so a descender that crosses the
      // other line's band still belongs to its own colour.
      const style = 'italic 700'
      const probe = document.createElement('canvas').getContext('2d')
      probe.font = `${style} 100px ${family}`
      if ('letterSpacing' in probe) probe.letterSpacing = '6px'
      const width = LOCKUP_COLUMNS * supersample
      const height = LOCKUP_ROWS * supersample
      const widest = Math.max(...LOCKUP_LINES.map(line => probe.measureText(line).width), 1)
      const size = ((width * 0.94) / widest) * 100
      const model = LOCKUP_LINES.map((line, lineIndex) => {
        const big = document.createElement('canvas')
        big.width = width
        big.height = height
        const bigContext = big.getContext('2d')
        bigContext.textAlign = 'left'
        bigContext.textBaseline = 'middle'
        if ('letterSpacing' in bigContext) bigContext.letterSpacing = '6px'
        bigContext.font = `${style} ${size.toFixed(1)}px ${family}`
        bigContext.fillStyle = 'rgba(255, 255, 255, 0.92)'
        bigContext.fillText(line, width * 0.02, height * (0.34 + 0.4 * lineIndex))

        const small = document.createElement('canvas')
        small.width = LOCKUP_COLUMNS
        small.height = LOCKUP_ROWS
        const smallContext = small.getContext('2d')
        smallContext.drawImage(big, 0, 0, LOCKUP_COLUMNS, LOCKUP_ROWS)
        const pixels = smallContext.getImageData(0, 0, LOCKUP_COLUMNS, LOCKUP_ROWS).data
        const dots = []
        for (let index = 0; index < LOCKUP_COLUMNS * LOCKUP_ROWS; index += 1) {
          const alpha = pixels[index * 4 + 3] / 255
          if (alpha < 0.08) continue
          dots.push({
            u: ((index % LOCKUP_COLUMNS) + 0.5) / LOCKUP_COLUMNS,
            v: (Math.floor(index / LOCKUP_COLUMNS) + 0.5) / LOCKUP_ROWS,
            a: Math.min(1, alpha * 1.25),
            phase: Math.random() * TAU,
            speed: 0.5 + Math.random() * 0.8,
          })
        }
        return dots
      })
      lockupModel = model
      return model
    }

    /**
     * Paint the dot mascot and wordmark into a canvas, twinkling in place.
     * @param canvas - the frame canvas sized to the conversation area.
     * @returns disposer that cancels the animation and observers.
     */
    function attachMascot(canvas) {
      const context = canvas.getContext('2d')
      if (context === null) return () => {}
      const portraitLight = mascotDots()
      const portraitDark = invertedDots()
      const wordmark = lockupDots()
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const started = performance.now()
      // The reveal clock starts on the first paint that actually has a canvas to draw
      // into, otherwise the animation can finish while the element is still sizing.
      let revealStarted = 0
      let width = 1
      let height = 1
      let dpr = 1
      let frame = 0
      let drawnAt = 0
      let disposed = false
      /** Composer card geometry in canvas coordinates; the composition's bound. */
      let composerLeft = 0
      let composerWidth = 0
      let composerTop = 0
      let composerNode = null
      const composerObserver = new ResizeObserver(() => { readComposer() })

      /** Re-read the composer card (it mounts with the hero and resizes with it). */
      const readComposer = () => {
        const canvasRect = canvas.getBoundingClientRect()
        // Pick the composer card that actually overlaps this conversation area:
        // hidden or off-screen cards (other panels, mounted shells) must not
        // become the layout bound.
        let node = null
        let rect = null
        for (const candidate of document.querySelectorAll('[data-composer-card]')) {
          const box = candidate.getBoundingClientRect()
          if (box.width < 80 || box.height < 20) continue
          if (box.right <= canvasRect.left || box.left >= canvasRect.right) continue
          if (rect === null || box.width > rect.width) {
            node = candidate
            rect = box
          }
        }
        if (node !== composerNode) {
          composerObserver.disconnect()
          composerNode = node
          if (node !== null) composerObserver.observe(node)
        }
        if (node === null || rect === null) {
          composerLeft = 0
          composerWidth = 0
          composerTop = 0
          return
        }
        composerLeft = rect.left - canvasRect.left
        composerWidth = rect.width
        composerTop = rect.top - canvasRect.top
      }

      /** Last canvas box in viewport coordinates, for pointer hit-testing. */
      let boxLeft = 0
      let boxTop = 0
      let boxWidth = 0
      let boxHeight = 0
      /** Pointer position in canvas coordinates; inactive while outside. */
      let pointerX = -1e6
      let pointerY = -1e6
      let pointerActive = false
      const onPointerMove = (event) => {
        pointerX = event.clientX - boxLeft
        pointerY = event.clientY - boxTop
        pointerActive = pointerX >= 0 && pointerY >= 0 && pointerX <= boxWidth && pointerY <= boxHeight
        if (pointerActive) {
          trail.push({ x: pointerX, y: pointerY, at: performance.now() })
          if (trail.length > 8) trail.shift()
        spawnRipple()
        }
        if (reduced) paint(performance.now())
      }
      const onPointerLeave = () => { pointerActive = false }
      /** Moving the pointer over the field band leaves a light ripple behind. */
      const spawnRipple = () => {
        const cfg = window.__dcSettings
        if (cfg !== undefined && cfg.ripple === false) return
        const nowMs = performance.now()
        if (nowMs - lastRippleAt < 90) return
        const bandTop = boxHeight - Math.min(440, Math.max(230, boxHeight * 0.4))
        if (pointerY < bandTop) return
        lastRippleAt = nowMs
        fieldRipples.push({ x: pointerX, y: pointerY, at: nowMs })
        if (fieldRipples.length > 8) fieldRipples.shift()
      }
      /** Recent pointer samples so the light leaves a short, fading trail. */
      const trail = []
      /** Click ripples: origin plus start time, oldest first. */
      const ripples = []
      const onPointerDown = (event) => {
        const x = event.clientX - boxLeft
        const y = event.clientY - boxTop
        if (x < 0 || y < 0 || x > boxWidth || y > boxHeight) return
        ripples.push({ x, y, at: performance.now() })
        if (ripples.length > 5) ripples.shift()
      }


      const measure = () => {
        const rect = canvas.getBoundingClientRect()
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        width = Math.max(1, rect.width)
        height = Math.max(1, rect.height)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        boxLeft = rect.left
        boxTop = rect.top
        boxWidth = width
        boxHeight = height
        readComposer()
      }

      /**
       * Draw one frame: both groups hold still and only their alpha breathes.
       * @param now - frame timestamp.
       */
      let bgLayer = null
        let bgGlow = null
        let fieldDots = null
        const fieldRipples = []
        let lastRippleAt = 0
        let fieldKeyCache = ''
        let composerFocused = false
        let focusAmount = 0
        let bgKey = ''

        const paint = (now) => {
        if (disposed) return
        const cfg = window.__dcSettings
        if (cfg !== undefined && cfg.hero === false) {
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          context.clearRect(0, 0, width, height)
          frame = requestAnimationFrame(paint)
          return
        }
        if (revealStarted === 0 && width > 200 && height > 200) revealStarted = now
        // The assembly is a short, fast reveal: give it a smoother frame rate
        // than the slow twinkle, then fall back to the cheap cadence.
        const assembling = now - revealStarted < ASSEMBLY_MS + 80
        const interval = (assembling ? 1000 / 60 : FRAME_MS) - 1
        if (!reduced && now - drawnAt < interval) {
          frame = requestAnimationFrame(paint)
          return
        }
        drawnAt = now
        const time = reduced ? 0 : (now - started) / 1000
        const dark = document.body.hasAttribute('data-ds-dark-theme')
        const ink = dark ? '236, 238, 242' : '102, 108, 120'
        // The composer card is the layout's bound: the pair is centred on it and
        // can never be wider than the input box.
        const limit = composerWidth > 160 ? composerWidth : width * 0.94
        const originX = composerWidth > 160 ? composerLeft : (width - limit) / 2

        // One pitch drives both groups: the wordmark and the portrait always share
        // the same dot size, and that pitch scales with the space available. Two
        // hard bounds: the composer width (the pair never exceeds the input box)
        // and the space above the composer (the pair hangs above it instead of
        // being covered by it).
        const availW = limit * 0.94
        const pairCells = LOCKUP_COLUMNS + GIRL_COLUMNS - 30
        const bandTop = composerTop > 140 ? composerTop : height * 0.86
        const heightPitch = Math.max(1, bandTop - 8) / GIRL_ROWS
        let pitch = Math.min(DOT_PITCH, availW / pairCells, heightPitch)
        let showText = true
        if (pitch < TEXT_MIN_PITCH) {
          // Only when the type would fall below the readable floor: drop the
          // wordmark and keep the portrait as large as it can be.
          showText = false
          pitch = Math.min(DOT_PITCH, availW / GIRL_COLUMNS, heightPitch)
        }
        if (pitch < 2.2) {
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          context.clearRect(0, 0, width, height)
          return
        }
        const blockW = LOCKUP_COLUMNS * pitch
        const blockH = LOCKUP_ROWS * pitch
        const portraitW = GIRL_COLUMNS * pitch
        const portraitH = GIRL_ROWS * pitch
        const overlap = Math.max(8, pitch * 30)
        const pairW = blockW + portraitW - overlap

        // Hang the pair off the composer: the portrait's bottom edge sits on the
        // composer's top edge, and the dot pitch above guaranteed it fits there.
        const portraitY = Math.min(
          Math.max(bandTop - portraitH / 2, 6 + portraitH / 2),
          Math.max(6 + portraitH / 2, height - portraitH / 2 - 6),
        )
        let portraitX
        let blockX = 0
        if (showText) {
          blockX = originX + Math.max(0, (limit - pairW) / 2)
          portraitX = blockX + blockW - overlap + portraitW / 2
        } else {
          portraitX = originX + limit / 2
        }
        // Keep the pair inside the canvas even if the composer rect was odd.
        const minX = portraitW / 2 + 6
        const maxX = Math.max(minX, width - portraitW / 2 - 6)
        portraitX = Math.min(Math.max(portraitX, minX), maxX)
        const blockY = portraitY - blockH / 2
        // The portrait and the wordmark are centred on each other, which leaves their
        // cell rows half a cell apart; nudge the portrait so every dot in the scene
        // (artwork and printed field alike) lands on one single lattice.
        const portraitYAligned = portraitY + pitch / 2
        const portraitRadius = Math.max(0.8, pitch * 0.28)
        const lockupRadius = Math.max(0.8, pitch * 0.34)

        // A faint dot field under everything, built on the artwork's own pitch and
        // ink so the background reads as part of the same printed sheet.
        // Phase the background lattice onto the artwork's own grid: the wordmark and the
        // portrait already sit on one lattice (their origins differ by a whole number
        // of cells), so matching that phase makes the field read as the same printed
        // sheet instead of a second, offset grid.
        // Artwork dots sit at the CENTRES of their cells (blockX + (col + 0.5) * pitch),
        // so the field has to be phased half a cell further: its dots land exactly on
        // the artwork's dots, like stones on intersections, not inside the squares.
        const phaseX = (((blockX + pitch / 2) % pitch) + pitch) % pitch
        const phaseY = (((blockY + pitch / 2) % pitch) + pitch) % pitch
        const buildKey = pitch.toFixed(3) + '|' + ink + '|' + phaseX.toFixed(3) + '|'
          + phaseY.toFixed(3) + '|' + width + '|' + height + '|' + dpr
        if (buildKey !== bgKey) {
          bgKey = buildKey
          bgLayer = document.createElement('canvas')
          bgLayer.width = Math.max(1, Math.round(width * dpr))
          bgLayer.height = Math.max(1, Math.round(height * dpr))
          const layerContext = bgLayer.getContext('2d')
          if (layerContext === null) {
            bgLayer = null
          } else {
            layerContext.setTransform(dpr, 0, 0, dpr, 0, 0)
            const fieldRadius = Math.max(0.45, pitch * 0.11)

            // The resting field.
            layerContext.fillStyle = 'rgba(' + ink + ', 0.1)'
            for (let y = phaseY; y < height + pitch; y += pitch) {
              for (let x = phaseX; x < width + pitch; x += pitch) {
                layerContext.beginPath()
                layerContext.arc(x, y, fieldRadius, 0, TAU)
                layerContext.fill()
              }
            }

            // The focused field: the same lattice, but brighter close to the
            // composer card and fading out with distance, so the click lights the
            // dots around the input rather than the whole page.
            bgGlow = document.createElement('canvas')
            bgGlow.width = bgLayer.width
            bgGlow.height = bgLayer.height
            const glowContext = bgGlow.getContext('2d')
            if (glowContext === null) {
              bgGlow = null
            } else {
              glowContext.setTransform(dpr, 0, 0, dpr, 0, 0)
              const cardLeft = composerWidth > 160 ? composerLeft : (width - limit) / 2
              const cardWidthForGlow = composerWidth > 160 ? composerWidth : limit
              const glowRadiusX = Math.max(160, cardWidthForGlow * 0.55)
              const glowRadiusY = Math.max(150, Math.min(height * 0.3, 260))
              const centerX = cardLeft + cardWidthForGlow / 2
              const centerY = composerTop + 8
              for (let y = phaseY; y < height + pitch; y += pitch) {
                for (let x = phaseX; x < width + pitch; x += pitch) {
                  const dx = (x - centerX) / glowRadiusX
                  const dy = (y - centerY) / glowRadiusY
                  const falloff = Math.exp(-(dx * dx + dy * dy) * 2.1)
                  if (falloff < 0.03) continue
                  glowContext.fillStyle = 'rgba(' + ink + ', ' + (0.3 * falloff).toFixed(3) + ')'
                  glowContext.beginPath()
                  glowContext.arc(x, y, fieldRadius, 0, TAU)
                  glowContext.fill()
                }
              }
            }
          }
        }

        // The portrait runs one opacity notch brighter than the wordmark, so the
        // two groups keep separate alpha ladders.
        const portraitPaths = []
        const wordmarkPaths = [[], []]
        for (let level = 0; level < LEVELS; level += 1) {
          portraitPaths.push(new Path2D())
          wordmarkPaths[0].push(new Path2D())
          wordmarkPaths[1].push(new Path2D())
        }

        // Wordmark assembly: dots light up left to right, with a bright front.
        const assembly = reduced ? 1 : Math.min(1, (now - revealStarted) / ASSEMBLY_MS)
        // The portrait follows the wordmark: a soft vertical wipe grows it downward
        // about a tenth of a second later.
        const portraitProgress = reduced
          ? 1
          : Math.max(0, Math.min(1, ((now - revealStarted) - 140) / 1100))
        while (ripples.length > 0 && now - ripples[0].at > 760) ripples.shift()
        const trailNow = trail.filter(sample => now - sample.at < 420)
        const rippleBoost = (x, y) => {
          let best = 0
          for (const ripple of ripples) {
            const age = (now - ripple.at) / 760
            const radius = age * 640
            const dx = x - ripple.x
            const dy = y - ripple.y
            if (dx * dx + dy * dy > (radius + 200) * (radius + 200)) continue
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (Math.abs(distance - radius) > 160) continue
            const band = Math.exp(-Math.pow((distance - radius) / 44, 2))
            best = Math.max(best, band * (1 - age))
          }
          return 1 + 1.25 * best
        }
        const trailBoost = (x, y) => {
          let best = 0
          for (const sample of trailNow) {
            const age = Math.max(0, (now - sample.at) / 420)
            const dx = x - sample.x
            const dy = y - sample.y
            if (Math.abs(dx) > 260 || Math.abs(dy) > 260) continue
            best = Math.max(best, Math.exp(-(dx * dx + dy * dy) / (2 * 95 * 95)) * (1 - age))
          }
          return 1 + 0.95 * best
        }
        const place = (target, dot, x, y, radius, kind, line) => {
          // The portrait holds a steady level; only the wordmark breathes.
          const breathe = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(time * dot.speed + dot.phase)
          // Ease the wave so the low and high ends linger instead of sweeping
          // through the extremes linearly, which reads as a softer pulse.
          const eased = breathe * breathe * (3 - 2 * breathe)
          let tone = kind === 'portrait' ? dot.a : dot.a * (0.35 + 0.65 * eased)
          if (kind === 'portrait' && portraitProgress < 1) {
            const local = Math.max(0, Math.min(1, (portraitProgress - dot.v * 0.45) / 0.55))
            const wipe = local * local * (3 - 2 * local)
            if (wipe <= 0.004) return
            tone *= wipe
          }
          if (kind === 'wordmark') {
            if (assembly < 1) {
              // Whole-word fade: the line rises as one piece, no left-to-right sweep.
              const offset = line === 1 ? ASSEMBLY_SECOND_LINE : 0
              const progress = Math.max(0, Math.min(1, (assembly - offset) / ASSEMBLY_LINE_SPAN))
              const smooth = progress * progress * (3 - 2 * progress)
              if (smooth <= 0.02) return
              tone *= smooth
            }
            if (pointerActive) tone *= trailBoost(x, y)
          }
          // Ripples are a wordmark effect; the portrait stays untouched.
          if (kind === 'wordmark') tone = Math.min(1, tone * rippleBoost(x, y))
          const level = Math.min(LEVELS - 1, Math.max(0, Math.round(tone * (LEVELS - 1))))
          // Halftone weighting: heavier cells draw slightly larger dots, so the
          // field reads as printed ink rather than a uniform grid.
          const size = radius * (0.82 + 0.36 * dot.a)
          target[level].moveTo(x + size, y)
          target[level].arc(x, y, size, 0, TAU)
        }
        const portrait = dark ? portraitDark : portraitLight
        for (const dot of portrait) {
          place(
            portraitPaths,
            dot,
            portraitX + (dot.u - 0.5) * portraitW,
            portraitYAligned + (dot.v - 0.5) * portraitH,
            portraitRadius,
            'portrait',
          )
        }
        if (showText) {
          wordmark.forEach((dots, index) => {
            for (const dot of dots) {
              place(
                wordmarkPaths[index],
                dot,
                blockX + dot.u * blockW,
                blockY + dot.v * blockH,
                lockupRadius,
                'wordmark',
                index,
              )
            }
          })
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        context.clearRect(0, 0, width, height)
        // The field is painted after the clear so it survives the frame.
        if (bgLayer !== null && (cfg === undefined || cfg.field !== false)) {
          context.drawImage(bgLayer, 0, 0, width, height)
        }
        const focusTarget = composerFocused ? 1 : 0
        focusAmount += (focusTarget - focusAmount) * 0.14
        if (focusAmount > 0.005 && bgGlow !== null) {
          context.save()
          context.globalAlpha = Math.min(1, focusAmount)
          context.drawImage(bgGlow, 0, 0, width, height)
          context.restore()
        }

        // The wave field lives on the lattice: the light pattern is pure brightness,
        // and the pointer can nudge dots aside. Nothing follows the cursor and every
        // displaced dot springs straight back to its own cell.
        const fieldKey = width + '|' + height + '|' + pitch.toFixed(3) + '|'
          + phaseX.toFixed(2) + '|' + phaseY.toFixed(2)
        if (fieldKey !== fieldKeyCache) {
          fieldKeyCache = fieldKey
          fieldDots = []
          const bandHeight = Math.min(440, Math.max(230, height * 0.4))
          const bandTop = height - bandHeight
          for (let y = phaseY; y < height + pitch; y += pitch) {
            if (y < bandTop) continue
            const depth = Math.min(1, (y - bandTop) / bandHeight)
            const vertical = depth * depth * (3 - 2 * depth)
            for (let x = phaseX; x < width + pitch; x += pitch) {
              fieldDots.push({ x: x, y: y, vertical: vertical, ox: 0, oy: 0, vx: 0, vy: 0 })
            }
          }
        }

        if (!reduced && fieldDots !== null && (cfg === undefined || cfg.wave !== false)) {
          const dt = 1 / 30
          const unit = pitch / 8
          const fieldRadius = Math.max(0.45, pitch * 0.11)
          const breathe = 0.86 + 0.14 * Math.sin(time * 0.13)
          const buckets = [[], [], [], [], [], []]
          while (fieldRipples.length > 0 && now - fieldRipples[0].at > 1100) fieldRipples.shift()
          for (const dot of fieldDots) {

            const warpX = Math.sin(dot.y * 0.006 / unit + time * 0.23) * 30
              + Math.sin(dot.x * 0.003 / unit - time * 0.17) * 20
            const warpY = Math.sin(dot.x * 0.0035 / unit + time * 0.29) * 26
            const u = (dot.x + warpX) / unit
            const v = (dot.y + warpY) / unit
            const field = 0.5
              + 0.3 * Math.sin(u * 0.0035 - time * 0.55)
              + 0.22 * Math.sin(u * 0.0061 + time * 0.37 + v * 0.01)
              + 0.18 * Math.sin(u * 0.0107 - time * 0.29 + v * 0.021)
              + 0.12 * Math.sin(u * 0.0173 + time * 0.83 - v * 0.033)
            let light = Math.max(0, Math.min(1, field)) ** 1.6
            // A touch only adds light: rings race outward and fade, the dots stay put.
            for (const ripple of fieldRipples) {
              const age = (now - ripple.at) / 1100
              const rdx = dot.x - ripple.x
              const rdy = dot.y - ripple.y
              const distance = Math.sqrt(rdx * rdx + rdy * rdy)
              const ring = Math.exp(-Math.pow((distance - age * 420) / 42, 2)) * (1 - age)
              if (ring > 0.001) light += ring * 0.8
            }
            const alpha = dot.vertical * (0.05 + Math.min(1, light) * 0.85) * breathe * (dark ? 1 : 1.2)
            const level = Math.min(5, Math.floor(alpha * 7))
            buckets[level].push(dot.x, dot.y)
          }
          for (let level = 0; level < buckets.length; level += 1) {
            const bucket = buckets[level]
            if (bucket.length === 0) continue
            const alpha = 0.03 + level * 0.105
            context.fillStyle = 'rgba(' + ink + ', ' + alpha.toFixed(3) + ')'
            context.beginPath()
            for (let index = 0; index < bucket.length; index += 2) {
              context.moveTo(bucket[index] + fieldRadius, bucket[index + 1])
              context.arc(bucket[index], bucket[index + 1], fieldRadius, 0, TAU)
            }
            context.fill()
          }
        }

        const paintGroup = (paths, boost, color) => {
          for (let level = 0; level < LEVELS; level += 1) {
            const alpha = Math.min(1, (0.05 + (level / (LEVELS - 1)) * 0.5) * boost).toFixed(3)
            context.fillStyle = `rgba(${color}, ${alpha})`
            context.fill(paths[level])
          }
        }
        // The portrait's opacity nudge flips with the palette: +10% on the light
        // canvas, and its inverse trim on the dark one, where light dots already
        // read brighter against the canvas.
        paintGroup(portraitPaths, dark ? 1.15 : 1.8, ink)
        if (showText) {
          paintGroup(wordmarkPaths[0], dark ? 1 : 1.2, ink)
          paintGroup(wordmarkPaths[1], dark ? 1 : 1.2, '122, 170, 255')
        }
        if (DEBUG) {
          context.fillStyle = '#ff5555'
          context.font = '12px monospace'
          const readout = [
            'pitch=' + pitch.toFixed(2) + ' limit=' + limit.toFixed(0) + ' composerTop=' + composerTop.toFixed(0),
            'canvas=' + width.toFixed(0) + 'x' + height.toFixed(0) + ' dpr=' + dpr + ' showText=' + showText,
            'portrait=' + portraitW.toFixed(0) + 'x' + portraitH.toFixed(0)
              + ' @ ' + portraitX.toFixed(0) + ',' + portraitY.toFixed(0),
            'block=' + blockW.toFixed(0) + 'x' + blockH.toFixed(0)
              + ' @ ' + blockX.toFixed(0) + ',' + blockY.toFixed(0),
          ]
          readout.forEach((line, index) => context.fillText(line, 12, 20 + index * 16))
          context.strokeStyle = '#ff5555'
          context.strokeRect(portraitX - portraitW / 2, portraitY - portraitH / 2, portraitW, portraitH)
          context.strokeStyle = '#5599ff'
          context.strokeRect(blockX, blockY, blockW, blockH)
        }
        if (!reduced) frame = requestAnimationFrame(paint)
      }

      const observer = new ResizeObserver(() => {
        measure()
        if (reduced) paint(performance.now())
      })
      observer.observe(canvas)
      /** Focus inside the composer card lights the field around it. */
      const onFocusChange = () => {
        const active = document.activeElement
        composerFocused = active !== null && active !== document.body
          && typeof active.closest === 'function'
          && active.closest('[data-composer-card]') !== null
      }
      window.addEventListener('focusin', onFocusChange, { passive: true })
      window.addEventListener('focusout', onFocusChange, { passive: true })
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerleave', onPointerLeave, { passive: true })
      window.addEventListener('pointerdown', onPointerDown, { passive: true })
      measure()
      frame = requestAnimationFrame(paint)

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        observer.disconnect()
        composerObserver.disconnect()
        window.removeEventListener('focusin', onFocusChange)
        window.removeEventListener('focusout', onFocusChange)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('pointerdown', onPointerDown)
      }
    }

    /**
     * Frame layer for the blank home: paint the dot mascot below the content and
     * pass the wrapped scroll body through untouched.
     * @param props - the home flag and the wrapped Conversation body.
     * @returns the layout-neutral frame.
     */
    function HeroFrame({ hero, children }) {
      const canvasRef = React.useRef(null)
      React.useEffect(() => {
        const canvas = canvasRef.current
        if (hero !== true || canvas === null) return undefined
        return attachMascot(canvas)
      }, [hero])
      return h('div', { className: 'dwe-frame' },
        hero === true ? h('div', { key: 'sign', className: 'dwe-sign' }, 'deepclear-ui') : null,
        hero === true ? h('canvas', { key: 'mascot', ref: canvasRef, className: 'dwe-whale', 'aria-hidden': 'true' }) : null,
        children)
    }


    /* ---------------------------------------------------------------- styles */

const CSS = `
/* Hero frame layer: layout-neutral wrapper (display: contents keeps the wrapped
   scroll body a direct flex item) plus one canvas that sits above the
   Conversation background and below its content. */
.dwe-frame {
  display: contents;
}
.dwe-whale {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

/* One whale on the blank home: the official pixel whale would otherwise sit
   behind this dot field, so its canvas is hidden. It keeps its slot layer and
   still renders the wrapped content; only its artwork is suppressed. */
[data-home-whale] {
  display: none !important;
}

/* Blank-home headline: drop the headline copy and the brand mark
   beside it, leaving the dot portrait alone above the composer. The title group
   is a CSS-module class (matched by its local name inside the hash, scoped by
   the headline ancestor); the mark is the hero's own brand slot, matched by its
   public slot key. If upstream renames either hook the rule simply stops
   applying. */
[class*="headline"] [class*="titleGroup"],
[data-slot="conversation.hero.brand.mark"] {
  display: none !important;
}


/* Product signature: only while the blank home is on screen, because the
   element lives inside the hero frame layer. */
.dwe-sign {
  position: fixed;
  right: 14px;
  bottom: 10px;
  z-index: 2147483000;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--dsw-alias-label-tertiary);
  opacity: 0.28;
  pointer-events: none;
  user-select: none;
}

/* ------------------------------------------------------------------ accents */

:root:not(.dc-off-bold) [data-slot="conversation.chat.flow"] :is(p, li, td, blockquote, h1, h2, h3, h4, h5, h6) :is(strong, b) {
  color: #7aaaff;
}

/* Composer focus: the shipped 0.5px hairline turns whale blue and an inset ring
   thickens the edge. The inset shadow follows the card radius and costs no
   layout, and a focused draft editor is the only trigger — toolbar buttons
   inside the card keep the resting look. */
/* Frosted composer, but only where something interesting runs behind it: while a
   Session is open the messages scroll under the card, so glass reads as glass. On
   the blank home the card sits on flat dotted paper, where translucency only muddies
   the surface — there it keeps the shipped solid background. */
/* On the blank home the card must be fully opaque: the shipped menu surface is
   slightly translucent, so the wave field behind it would show through the card as
   moving light bands. */
body:has(canvas.dwe-whale) [data-composer-card] {
  background: var(--dsw-specific-menu);
}

:root:not(.dc-off-glass) body:not(:has(canvas.dwe-whale)) [data-composer-card] {
  background: color-mix(in srgb, var(--dsw-specific-menu) 62%, transparent);
  -webkit-backdrop-filter: blur(26px) saturate(120%);
  backdrop-filter: blur(26px) saturate(120%);
}

/* Dot field behind the composer (Session only; the blank home keeps a clean card). */

body {
  --dc-field-dot: rgba(102, 108, 120, 0.6);
}

body[data-ds-dark-theme] {
  --dc-field-dot: rgba(236, 238, 242, 0.4);
}

/* Session: a wide floor of dots pinned to the bottom of the window, fading up over
   a long range so the field reads as depth rather than a stripe. */
:root:not(.dc-off-composerfield) body:not(:has(canvas.dwe-whale)) *:has(> [data-composer-card])::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 108px;
  pointer-events: none;
  background-image: radial-gradient(
    circle at 1px 1px,
    var(--dc-field-dot) 0.9px,
    transparent 1.1px
  );
  background-size: 8px 8px;
  background-position: 0 0;
  -webkit-mask-image: linear-gradient(
    to top,
    #000 0%,
    #000 34%,
    rgba(0, 0, 0, 0.62) 60%,
    rgba(0, 0, 0, 0.26) 84%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to top,
    #000 0%,
    #000 34%,
    rgba(0, 0, 0, 0.62) 60%,
    rgba(0, 0, 0, 0.26) 84%,
    transparent 100%
  );
  opacity: 0.15;
  transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

:root:not(.dc-off-composerfield) body:not(:has(canvas.dwe-whale)) *:has(> [data-composer-card]):focus-within::before {
  opacity: 0.5;
  animation: dc-composer-breathe 5.2s ease-in-out infinite;
}

@keyframes dc-composer-breathe {
  0%, 100% { opacity: 0.38; }
  50% { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  :root:not(.dc-off-composerfield) body:not(:has(canvas.dwe-whale)) *:has(> [data-composer-card]):focus-within::before {
    animation: none;
  }
}

/* Composer focus: a soft whale-blue ring fades in under the card's own hairline
   instead of recolouring it (a rebinding token switches instantly and reads as a
   pop). Both states declare the same shadow layers so the transition interpolates
   every layer, and the easing starts quickly and settles slowly. */
:root:not(.dc-off-focusring) [data-composer-card] {
  box-shadow:
    var(--dsw-elevation-soft),
    inset 0 0 0 1px rgba(122, 170, 255, 0),
    0 0 0 0 rgba(122, 170, 255, 0);
  transition: box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

:root:not(.dc-off-focusring) [data-composer-card]:has(:is([contenteditable="true"], [role="textbox"], textarea):focus) {
  box-shadow:
    var(--dsw-elevation-soft),
    inset 0 0 0 1.2px rgba(122, 170, 255, 0.85),
    0 0 0 3px rgba(122, 170, 255, 0.09);
}

/* Diff plates: the shipped red/green line fills become the deep-blue family and
   whale blue at the same fill strength. These are ui-theme's own file-diff
   tokens, which the deliverables comparison reads directly — no DOM coupling,
   so the plate colours also follow light/dark automatically. The html-body
   prefix outranks the shipped selector regardless of stylesheet order. */
:root:not(.dc-off-diff) html body {
  --dsw-alias-file-diff-deleted-bg: rgb(20 40 110 / 16%);
  --dsw-alias-file-diff-deleted-gutter: rgb(20 40 110 / 8%);
  --dsw-alias-file-diff-deleted-marker: #142f7e;
  --dsw-alias-file-diff-added-bg: rgb(122 170 255 / 16%);
  --dsw-alias-file-diff-added-gutter: rgb(122 170 255 / 8%);
  --dsw-alias-file-diff-added-marker: #7aaaff;
  --dsw-alias-code-diff-deleted: rgb(20 40 110 / 14%);
  --dsw-alias-code-diff-added: rgb(122 170 255 / 14%);
}
html body[data-ds-dark-theme] {
  --dsw-alias-file-diff-deleted-bg: rgb(20 40 110 / 55%);
  --dsw-alias-file-diff-deleted-gutter: rgb(20 40 110 / 32%);
  --dsw-alias-file-diff-deleted-marker: #6e8cff;
  --dsw-alias-file-diff-added-bg: rgb(122 170 255 / 24%);
  --dsw-alias-file-diff-added-gutter: rgb(122 170 255 / 12%);
  --dsw-alias-file-diff-added-marker: #a9c2ff;
  --dsw-alias-code-diff-deleted: rgb(20 40 110 / 55%);
  --dsw-alias-code-diff-added: rgb(122 170 255 / 22%);
}

/* Diff line text: the highlighter's syntax palette inside add/del rows collapses
   to one blue family so plate and ink agree. Setting the colour on the row and
   forcing nested syntax spans to inherit beats the inline styles the shiki
   spans carry; line numbers and the +/- signs follow the same ink, while the
   3px marker bar still comes from the marker tokens above. Unchanged (context)
   rows keep their normal secondary ink. */
[data-diff-line="add"],
[data-diff-line="del"] {
  color: #142f7e;
}
[data-diff-line="add"] *,
[data-diff-line="del"] * {
  color: inherit !important;
}
body[data-ds-dark-theme] [data-diff-line="add"],
body[data-ds-dark-theme] [data-diff-line="del"] {
  color: #a9c2ff;
}

/* Same plates applied straight on the diff rows. The token block above is the
   clean route (the component reads --dsw-alias-file-diff-*), but a surface that
   paints its own row fills would ignore it; these rules make the row itself
   blue regardless, and re-declare the row-local gutter/marker variables the
   number cells consume. */
:root:not(.dc-off-diff) html body [data-diff-line="add"] {
  --diff-gutter-fill: rgb(122 170 255 / 8%);
  --diff-marker: #7aaaff;
  background: #eaf1ff;
}
:root:not(.dc-off-diff) html body [data-diff-line="del"] {
  --diff-gutter-fill: rgb(20 40 110 / 8%);
  --diff-marker: #142f7e;
  background: #d9dde8;
}
:root:not(.dc-off-diff) html body[data-ds-dark-theme] [data-diff-line="add"] {
  --diff-gutter-fill: rgb(122 170 255 / 12%);
  --diff-marker: #a9c2ff;
  background: #2d394f;
}
:root:not(.dc-off-diff) html body[data-ds-dark-theme] [data-diff-line="del"] {
  --diff-gutter-fill: rgb(20 40 110 / 32%);
  --diff-marker: #6e8cff;
  background: #141f47;
}

/* ---------------------------------------------------------------- thinking */
/* The running status row is the live turn indicator: a 14px animated whale tail
   plus a shimmering label. Swap the tail for a dot-matrix wave in whale blue and
   tint the hairline above it, keeping the shipped layout and the label text. */
:root:not(.dc-off-thinkingsphere) [data-chat-running] [class*="_runningIcon"] {
  display: none;
}


/* The label is redrawn on our own canvas so its wording and the sphere share one
   surface; the host text stays in the DOM for layout and screen readers. */
:root:not(.dc-off-thinkinglabel) [data-chat-running] [class*="_runningText"] {
  opacity: 0;
}



/* -------------------------------------------------- thinking: live indicator */
/* Our dot-matrix wave replaces the stock whale tail in the running status row. */
.dc-run-dots {
  flex: none;
  align-self: center;
  display: block;
  width: 20px;
  height: 14px;
}

/* --------------------------------------------------- frame-wide ambient layer */
.dc-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  pointer-events: none;
}

/* ------------------------------------------- composer stats in the button row */
.dc-stats {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: var(--dsh-content-font-size-secondary, 12px);
  font-variant-numeric: tabular-nums;
  line-height: 20px;
  white-space: nowrap;
  user-select: none;
}

.dc-stats-item {
  opacity: 0.85;
}

/* The shipped stats strip below the card now lives in the button row instead. */
:root:not(.dc-off-stats) [data-composer-dock] > * {
  display: none !important;
}

/* ------------------------------------------------------------ settings page */
.dc-set {
  max-width: 720px;
  padding: 4px 2px 24px;
  color: var(--dsw-alias-label-primary);
  font-synthesis: none;
}

.dc-set-group {
  margin: 0 0 22px;
  padding: 0 0 6px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}

.dc-set-group:last-of-type {
  border-bottom: 0;
}

.dc-set-group-title {
  margin: 0 0 6px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dc-set-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
}

.dc-set-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 auto;
}

.dc-set-label {
  font-size: 14px;
  line-height: 1.4;
}

.dc-set-desc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.45;
}

/* The control is an SVG capsule with a drawn circle knob, so the track ends are
   exact semicircles and the knob is an exact circle at any zoom. */
.dc-switch {
  flex: none;
  display: inline-flex;
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: transparent;
  cursor: pointer;
}

.dc-switch:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, #7aaaff);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .dc-switch svg rect,
  .dc-switch svg g,
  .dc-switch svg circle {
    transition: none !important;
  }
}

.dc-set-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
}

.dc-set-reset {
  padding: 7px 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.dc-set-reset:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.1));
}

.dc-set-note {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

/* -------------------------------------------------------- sidebar entry + sheet */
.dc-foot {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dc-foot-button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}

.dc-foot-button:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.1));
  color: var(--dsw-alias-label-primary);
}

.dc-foot-button:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, #7aaaff);
  outline-offset: 1px;
}

.dc-foot-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.dc-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 2147483001;
}

.dc-sheet-scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
}

.dc-sheet-panel {
  position: absolute;
  left: 14px;
  bottom: 78px;
  width: min(420px, calc(100vw - 28px));
  max-height: min(72vh, 640px);
  display: flex;
  flex-direction: column;
  border: 0;
  border-radius: 20px;
  /* Opaque on purpose: a raised surface layered over the base colour, so the panel is
     always solid and always uses the app's own palette instead of a hand-picked grey. */
  background-color: var(--dsw-alias-bg-base, #f6f6f8);
  background-image: linear-gradient(
    var(--dsw-alias-bg-layer-1, transparent),
    var(--dsw-alias-bg-layer-1, transparent)
  );
  box-shadow: var(--dsw-elevation-panel, 0 18px 48px rgba(0, 0, 0, 0.42));
  overflow: hidden;
  animation: dc-sheet-in 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes dc-sheet-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dc-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}

.dc-sheet-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

.dc-sheet-close {
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 18px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
}

.dc-sheet-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.1));
  color: var(--dsw-alias-label-primary);
}

.dc-sheet-body {
  padding: 4px 16px 8px;
  overflow-y: auto;
}

@media (prefers-reduced-motion: reduce) {
  .dc-sheet-panel { animation: none; }
}
`

    /** Frame-wide ambient layer: sonar dot rings plus edge breathing glow. */
    function DcOverlay(props) {
      const busy = props.useSessionStatus((statuses) => {
        let running = false
        statuses.forEach((status) => {
          if (status !== undefined && status.running === true) running = true
        })
        return running
      })
      const canvasRef = React.useRef(null)
      const busyRef = React.useRef(false)
      const controlRef = React.useRef(null)

      React.useEffect(() => {
        const canvas = canvasRef.current
        if (canvas === null) return undefined
        const context = canvas.getContext('2d')
        if (context === null) return undefined
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let width = 0
        let height = 0
        let dpr = 1
        let frame = 0
        let intensity = 0
        let clock = 0
        const rowCache = { element: null, since: 0, color: '#c8cdd7' }

        const resize = () => {
          dpr = Math.min(2, window.devicePixelRatio || 1)
          width = window.innerWidth
          height = window.innerHeight
          canvas.width = Math.max(1, Math.round(width * dpr))
          canvas.height = Math.max(1, Math.round(height * dpr))
          canvas.style.width = width + 'px'
          canvas.style.height = height + 'px'
        }

        const sonar = (time) => {
          const cx = width / 2
          const cy = height * 0.62
          const minSide = Math.min(width, height)
          const maxRadius = Math.hypot(width, height) * 0.62
          const rings = 4
          const period = 1.8
          for (let ring = 0; ring < rings; ring += 1) {
            const phase = ((time / period) + ring / rings) % 1
            const radius = phase * maxRadius
            const fade = (1 - phase) * intensity
            if (fade < 0.05 || radius < 8) continue
            const count = Math.max(10, Math.round((2 * Math.PI * radius) / 13))
            for (let index = 0; index < count; index += 1) {
              const angle = (index / count) * Math.PI * 2
              const x = cx + Math.cos(angle) * radius
              const y = cy + Math.sin(angle) * radius
              if (x < -20 || y < -20 || x > width + 20 || y > height + 20) continue
              const centreDistance = Math.hypot(x - cx, y - cy) / minSide
              if (centreDistance < 0.34) continue
              const edgeFade = Math.min(1, (centreDistance - 0.34) / 0.12)
              const alpha = fade * edgeFade * 0.15
              if (alpha < 0.004) continue
              context.fillStyle = 'rgba(122, 170, 255, ' + alpha.toFixed(4) + ')'
              context.beginPath()
              context.arc(x, y, 1.15, 0, Math.PI * 2)
              context.fill()
            }
          }
        }

        // A rotating point-sphere drawn at the running status row. The row is only
        // measured, never modified: the React tree stays untouched.
        const GLOBE = []
        for (let index = 0; index < 42; index += 1) {
          const y = 1 - (index / 41) * 2
          const ring = Math.sqrt(Math.max(0, 1 - y * y))
          const theta = index * 2.399963229728653
          GLOBE.push([Math.cos(theta) * ring, y, Math.sin(theta) * ring])
        }

        const sphere = (time) => {
          const settings = window.__dcSettings
          if (settings !== undefined && settings.thinkingSphere === false && settings.thinkingLabel === false) return
          const row = document.querySelector('[data-chat-running]')
          if (row === null) {
            rowCache.element = null
            return
          }
          const bounds = row.getBoundingClientRect()
          if (bounds.width === 0) return
          // The overlay paints above every column, so anything the row would draw
          // while it sits behind the composer card (or off-screen) must be skipped:
          // otherwise the sphere and its label bleed over the input box.
          if (bounds.top < 0 || bounds.bottom > height) return
          const card = document.querySelector('[data-composer-card]')
          if (card !== null) {
            const cardTop = card.getBoundingClientRect().top
            if (bounds.bottom + 2 > cardTop) return
          }
          if (rowCache.element !== row) {
            rowCache.element = row
            rowCache.since = time
            const label = row.querySelector('[class*="_runningText"]')
            rowCache.color = label === null
              ? 'rgb(200, 205, 215)'
              : getComputedStyle(label).color
          }
          const size = 24
          // When our English label is on, the host text is invisible and the sphere
          // owns the row's left edge. When it is off, the host text is visible, so the
          // sphere anchors to the left of that text instead of overlapping it.
          const hostLabel = row.querySelector('[class*="_runningText"]')
          const labelVisible = settings !== undefined && settings.thinkingLabel === false
          let cx = bounds.left + 1 + size / 2
          let cy = bounds.top + Math.min(bounds.height, 30) / 2
          if (labelVisible && hostLabel !== null) {
            const labelRect = hostLabel.getBoundingClientRect()
            if (labelRect.width > 0) {
              cx = Math.max(size / 2 + 6, labelRect.left - size / 2 - 8)
              cy = labelRect.top + labelRect.height / 2
            }
          }
          const radius = size / 2 - 2
          const spin = time * 1.5
          const tilt = 0.42
          const cosSpin = Math.cos(spin)
          const sinSpin = Math.sin(spin)
          const cosTilt = Math.cos(tilt)
          const sinTilt = Math.sin(tilt)
          const fade = Math.max(intensity, 0.55)
          const showSphere = settings === undefined || settings.thinkingSphere !== false
          for (const point of GLOBE) {
            if (!showSphere) break
            const x1 = point[0] * cosSpin + point[2] * sinSpin
            const z1 = -point[0] * sinSpin + point[2] * cosSpin
            const y2 = point[1] * cosTilt - z1 * sinTilt
            const z2 = point[1] * sinTilt + z1 * cosTilt
            const depth = (z2 + 1) / 2
            context.beginPath()
            context.fillStyle = 'rgba(122, 170, 255, ' + ((0.18 + 0.82 * depth) * fade).toFixed(3) + ')'
            context.arc(cx + x1 * radius, cy + y2 * radius, 0.55 + 0.85 * depth, 0, Math.PI * 2)
            context.fill()
          }
          if (settings !== undefined && settings.thinkingLabel === false) return
          const seconds = Math.max(0, Math.round(time - rowCache.since))
          const label = 'Deep thinking for ' + seconds + 's. . .'
          context.font = '500 12.5px "Microsoft YaHei", "Segoe UI", system-ui, sans-serif'
          context.textBaseline = 'middle'
          const labelX = cx + size / 2 + 6
          const labelWidth = Math.max(1, context.measureText(label).width)
          // A whale-blue highlight band sweeps along the text, the way the light runs
          // across the dots of the artwork.
          const sweep = ((time * 0.5) % 1.8) - 0.35
          const gradient = context.createLinearGradient(labelX, cy, labelX + labelWidth, cy)
          const stop = (value) => Math.max(0, Math.min(1, value))
          gradient.addColorStop(0, rowCache.color)
          gradient.addColorStop(stop(sweep - 0.3), rowCache.color)
          gradient.addColorStop(stop(sweep - 0.12), 'rgba(122, 170, 255, 0.75)')
          gradient.addColorStop(stop(sweep), 'rgba(214, 229, 255, 1)')
          gradient.addColorStop(stop(sweep + 0.12), 'rgba(122, 170, 255, 0.75)')
          gradient.addColorStop(stop(sweep + 0.3), rowCache.color)
          gradient.addColorStop(1, rowCache.color)
          context.fillStyle = gradient
          context.fillText(label, labelX, cy + 0.5)
        }

        const render = (now) => {
          if (clock === 0) clock = now
          const time = (now - clock) / 1000
          const target = busyRef.current ? 1 : 0
          intensity += (target - intensity) * 0.07
          if (!busyRef.current && intensity < 0.012) {
            intensity = 0
            context.setTransform(dpr, 0, 0, dpr, 0, 0)
            context.clearRect(0, 0, width, height)
            frame = 0
            return
          }
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          context.clearRect(0, 0, width, height)
          if (!reduced) sonar(time)
          sphere(time)
          frame = requestAnimationFrame(render)
        }

        const start = () => {
          if (frame !== 0) return
          frame = requestAnimationFrame(render)
        }

        resize()
        window.addEventListener('resize', resize)
        controlRef.current = { start: start }
        if (busyRef.current) start()
        return () => {
          window.removeEventListener('resize', resize)
          controlRef.current = null
          if (frame !== 0) cancelAnimationFrame(frame)
        }
      }, [])

      if (busy === true) busyRef.current = true
      else busyRef.current = false

      React.useEffect(() => {
        const control = controlRef.current
        if (busy === true && control !== null) control.start()
      }, [busy])

      return h('canvas', { ref: canvasRef, className: 'dc-overlay', 'aria-hidden': 'true' })
    }

    /** Compact session stats for the composer button row. */
    function DcStats(props) {
      if (window.__dcSettings !== undefined && window.__dcSettings.stats === false) return null
      let usage
      let pressure
      try {
        usage = props.useProjection('tokenUsage')
        pressure = props.useProjection('contextPressure')
      } catch (error) {
        return null
      }
      const billed = usage === undefined || usage === null
        ? 0
        : (usage.uncachedInputTokens || 0) + (usage.cacheReadTokens || 0)
          + (usage.cacheWriteTokens || 0) + (usage.outputTokens || 0)
      const used = pressure === undefined || pressure === null
        ? undefined
        : (pressure.projectedTokens !== undefined ? pressure.projectedTokens : pressure.pressureTokens)
      const windowSize = pressure === undefined || pressure === null ? undefined : pressure.contextWindow
      const percent = used === undefined || windowSize === undefined || windowSize === 0
        ? null
        : Math.min(100, Math.round((used / windowSize) * 100))
      if (billed === 0 && percent === null) return null
      const tokens = billed >= 1e6
        ? (billed / 1e6).toFixed(1) + 'm'
        : billed >= 1e3
          ? (billed / 1e3).toFixed(1) + 'k'
          : String(billed)
      return h('span', { className: 'dc-stats' }, [
        percent === null
          ? null
          : h('span', { key: 'ctx', className: 'dc-stats-item', title: 'Context usage' }, percent + '%'),
        billed === 0
          ? null
          : h('span', { key: 'tok', className: 'dc-stats-item', title: 'Token usage' }, tokens),
      ])
    }

    // ---------------------------------------------------------------- settings
    /** Persisted preferences for the dot layer. Flags gate CSS and the canvas. */
    const DC_SETTINGS_KEY = 'deepclear-ui:settings'
    const DC_DEFAULT_SETTINGS = {
      hero: true,
      field: true,
      wave: true,
      ripple: true,
      thinkingSphere: true,
      thinkingLabel: true,
      composerField: true,
      glass: true,
      bold: true,
      focusRing: true,
      diff: true,
      stats: true,
    }
    const DC_OFF_CLASS = {
      hero: 'dc-off-hero',
      field: 'dc-off-field',
      wave: 'dc-off-wave',
      ripple: 'dc-off-ripple',
      thinkingSphere: 'dc-off-thinkingsphere',
      thinkingLabel: 'dc-off-thinkinglabel',
      composerField: 'dc-off-composerfield',
      glass: 'dc-off-glass',
      bold: 'dc-off-bold',
      focusRing: 'dc-off-focusring',
      diff: 'dc-off-diff',
      stats: 'dc-off-stats',
    }

    let dcSettings = (() => {
      const merged = { ...DC_DEFAULT_SETTINGS }
      try {
        const raw = window.localStorage.getItem(DC_SETTINGS_KEY)
        if (raw !== null) {
          const parsed = JSON.parse(raw)
          for (const key of Object.keys(merged)) {
            if (typeof parsed[key] === 'boolean') merged[key] = parsed[key]
          }
        }
      } catch (error) {
        console.warn('[deepclear-ui] settings load failed', error)
      }
      return merged
    })()

    function dcApplySettings() {
      const root = document.documentElement
      for (const key of Object.keys(DC_OFF_CLASS)) {
        root.classList.toggle(DC_OFF_CLASS[key], dcSettings[key] === false)
      }
      // The hero canvas and the overlay read this live, without a re-render.
      window.__dcSettings = dcSettings
    }

    function dcSaveSettings() {
      try {
        window.localStorage.setItem(DC_SETTINGS_KEY, JSON.stringify(dcSettings))
      } catch (error) {
        console.warn('[deepclear-ui] settings save failed', error)
      }
    }

    function dcSetSetting(key, value) {
      dcSettings[key] = value
      dcSaveSettings()
      dcApplySettings()
    }

    /** Settings copy follows the app language (Chinese unless the UI is English). */
    const dcUsesChinese = () => {
      const lang = (document.documentElement.lang || navigator.language || '').toLowerCase()
      return lang.startsWith('zh')
    }
    const DC_COPY = {
      zh: {
        lead: '\u8fd9\u91cc\u7684\u5f00\u5173\u7acb\u5373\u751f\u6548\uff0c\u5e76\u6309\u914d\u7f6e\u6587\u4ef6\u8bb0\u4f4f\u3002',
        groups: {
          hero: '\u6b22\u8fce\u9875',
          thinking: '\u601d\u8003\u4e2d',
          composer: '\u8f93\u5165\u6846',
          accents: '\u5f3a\u8c03\u8272',
        },
        items: {
          hero: ['\u70b9\u9635\u4eba\u50cf\u4e0e\u5b57\u6807', '\u7a7a\u767d\u6b22\u8fce\u9875\u4e0a\u7684\u7acb\u7ed8\u548c\u5b57\u6807'],
          field: ['\u80cc\u666f\u70b9\u9635', '\u94fa\u6ee1\u6574\u9875\u7684\u6de1\u70b9\u9635'],
          wave: ['\u5e95\u90e8\u6ce2\u6d6a', '\u9875\u9762\u5e95\u90e8\u7f13\u6162\u6d41\u52a8\u7684\u660e\u6697\u6ce2'],
          ripple: ['\u6307\u9488\u6d9f\u6f2a', '\u9f20\u6807\u5212\u8fc7\u70b9\u9635\u65f6\u8361\u5f00\u7684\u5149\u73af'],
          thinkingSphere: ['\u70b9\u9635\u7403', '\u601d\u8003\u65f6\u65cb\u8f6c\u7684\u5c0f\u7403'],
          thinkingLabel: ['\u82f1\u6587\u601d\u8003\u6587\u6848', '\u628a\u72b6\u6001\u884c\u6362\u6210 \u201cDeep thinking for 12s. . .\u201d'],
          composerField: ['\u8f93\u5165\u6846\u70b9\u9635', '\u4f1a\u8bdd\u9875\u8f93\u5165\u6846\u4e0b\u65b9\u7684\u70b9\u9635\u5e26'],
          glass: ['\u78e8\u7802\u73bb\u7483', '\u4f1a\u8bdd\u9875\u8f93\u5165\u6846\u7684\u534a\u900f\u660e\u6548\u679c'],
          stats: ['\u7528\u91cf\u8bfb\u6570', '\u5728\u53d1\u9001\u6309\u94ae\u6392\u663e\u793a\u4e0a\u4e0b\u6587\u4e0e Token \u7528\u91cf'],
          bold: ['\u9cb8\u9c7c\u84dd\u52a0\u7c97', '\u804a\u5929\u91cc\u7684\u52a0\u7c97\u6587\u5b57\u53d8\u6210\u9cb8\u9c7c\u84dd'],
          focusRing: ['\u805a\u7126\u63cf\u8fb9', '\u8f93\u5165\u6846\u805a\u7126\u65f6\u7684\u67d4\u5149\u63cf\u8fb9'],
          diff: ['diff \u6362\u84dd', '\u65b0\u589e / \u5220\u9664\u884c\u6539\u6210\u84dd\u8272\u65cf'],
        },
        reset: '\u6062\u590d\u9ed8\u8ba4',
        close: '\u5173\u95ed',
        dialog: 'DeepClear UI \u8bbe\u7f6e',
        button: 'DeepClear UI \u8bbe\u7f6e',
      },
      en: {
        lead: 'Everything here applies immediately and is remembered per profile.',
        groups: { hero: 'Welcome page', thinking: 'Thinking', composer: 'Composer', accents: 'Accents' },
        items: {
          hero: ['Dot artwork', 'The portrait and the wordmark on the blank home'],
          field: ['Dot field', 'The faint lattice behind everything'],
          wave: ['Bottom wave', 'The slow brightness wave along the bottom edge'],
          ripple: ['Pointer ripples', 'Light rings where the pointer crosses the field'],
          thinkingSphere: ['Dot sphere', 'The rotating point-sphere beside the live status'],
          thinkingLabel: ['English label', 'Replace the status text with \u201cDeep thinking for 12s. . .\u201d'],
          composerField: ['Dot floor', 'The dot band under the input on session pages'],
          glass: ['Frosted glass', 'Translucent input card on session pages'],
          stats: ['Usage readout', 'Context and token usage in the button row'],
          bold: ['Whale-blue bold', 'Bold runs in chat prose take the accent colour'],
          focusRing: ['Focus ring', 'The soft ring while the composer has focus'],
          diff: ['Re-inked diffs', 'Added and removed lines in the blue family'],
        },
        reset: 'Reset to defaults',
        close: 'Close',
        dialog: 'DeepClear UI settings',
        button: 'DeepClear UI settings',
      },
    }

    /** Switch drawn as SVG so the capsule ends and the knob are exact shapes. */
    function DcSwitchSvg({ value }) {
      const on = value === true
      return h('svg', {
        width: 42,
        height: 24,
        viewBox: '0 0 42 24',
        'aria-hidden': 'true',
        style: { display: 'block', overflow: 'visible' },
      }, [
        h('rect', {
          key: 'track',
          x: 0.5,
          y: 0.5,
          width: 41,
          height: 23,
          rx: 11.5,
          ry: 11.5,
          style: {
            fill: on
              ? 'color-mix(in srgb, var(--dsw-alias-label-primary) 94%, transparent)'
              : 'color-mix(in srgb, var(--dsw-alias-label-tertiary) 44%, transparent)',
            // A stroke in both states keeps the outline explicit, so the bright track
            // and the dim one read at the same size instead of one looking fatter.
            stroke: on
              ? 'color-mix(in srgb, var(--dsw-alias-label-primary) 94%, transparent)'
              : 'none',
            strokeWidth: 1,
            transition: 'fill 200ms cubic-bezier(0.22, 1, 0.36, 1), stroke 200ms cubic-bezier(0.22, 1, 0.36, 1)',
          },
        }),
        h('g', {
          key: 'knob',
          style: {
            transform: on ? 'translateX(18px)' : 'translateX(0px)',
            transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          },
        }, h('circle', {
          cx: 12,
          cy: 12,
          r: 9,
          style: {
            fill: on ? 'var(--dsw-alias-bg-base, #17171a)' : 'color-mix(in srgb, var(--dsw-alias-label-primary) 82%, transparent)',
            transition: 'fill 200ms cubic-bezier(0.22, 1, 0.36, 1)',
          },
        })),
      ])
    }

    /** One settings row: a label on the left and a switch on the right. */
    function DcSwitch({ label, description, value, onChange }) {
      return h('div', { className: 'dc-set-row' }, [
        h('div', { key: 'text', className: 'dc-set-text' }, [
          h('span', { key: 'label', className: 'dc-set-label' }, label),
          description === undefined
            ? null
            : h('span', { key: 'desc', className: 'dc-set-desc' }, description),
        ]),
        h('button', {
          key: 'switch',
          type: 'button',
          role: 'switch',
          'aria-checked': value ? 'true' : 'false',
          'aria-label': label,
          className: 'dc-switch',
          'data-on': value ? 'true' : undefined,
          onClick: () => onChange(!value),
        }, h(DcSwitchSvg, { key: 'glyph', value: value === true })),
      ])
    }

    /** The switch list shown inside the sidebar sheet. */
    function DcSettingsPage() {
      const copy = dcUsesChinese() ? DC_COPY.zh : DC_COPY.en
      const [state, setState] = React.useState({ ...dcSettings })
      const update = (key) => (value) => {
        dcSetSetting(key, value)
        setState({ ...dcSettings })
      }
      const reset = () => {
        for (const key of Object.keys(DC_DEFAULT_SETTINGS)) dcSettings[key] = DC_DEFAULT_SETTINGS[key]
        dcSaveSettings()
        dcApplySettings()
        setState({ ...dcSettings })
      }
      const group = (title, children) => h('section', { key: title, className: 'dc-set-group' }, [
        h('h3', { key: 'title', className: 'dc-set-group-title' }, title),
        ...children,
      ])
      const item = (key) => {
        const row = copy.items[key]
        return h(DcSwitch, {
          key: key,
          label: row[0],
          description: row[1],
          value: state[key],
          onChange: update(key),
        })
      }
      return h('div', { className: 'dc-set' }, [
        group(copy.groups.hero, [
          item('hero'), item('field'), item('wave'), item('ripple'),
        ]),
        group(copy.groups.thinking, [
          item('thinkingSphere'), item('thinkingLabel'),
        ]),
        group(copy.groups.composer, [
          item('composerField'), item('glass'), item('stats'),
        ]),
        group(copy.groups.accents, [
          item('bold'), item('focusRing'), item('diff'),
        ]),
        h('div', { key: 'footer', className: 'dc-set-footer' }, [
          h('button', { key: 'reset', type: 'button', className: 'dc-set-reset', onClick: reset }, copy.reset),
          h('span', { key: 'note', className: 'dc-set-note' }, 'deepclear-ui \u00b7 npm i deepclear-ui'),
        ]),
      ])
    }

    // ----------------------------------------------------------- sidebar entry
    /** Sheet state shared by the sidebar button and the panel itself. */
    let dcSheetOpen = false
    const dcSheetListeners = new Set()
    function dcSetSheetOpen(next) {
      dcSheetOpen = next
      dcSheetListeners.forEach((listener) => listener())
    }
    function useDcSheet() {
      const [open, setOpen] = React.useState(dcSheetOpen)
      React.useEffect(() => {
        const listener = () => setOpen(dcSheetOpen)
        dcSheetListeners.add(listener)
        return () => { dcSheetListeners.delete(listener) }
      }, [])
      return open
    }
    let dcReactDOM = null
    try {
      dcReactDOM = require('react-dom')
    } catch (error) {
      dcReactDOM = null
    }

    /** The floating settings sheet, portalled to the body when react-dom is around. */
    function DcSheet() {
      const open = useDcSheet()
      React.useEffect(() => {
        if (!open) return undefined
        const onKeyDown = (event) => {
          if (event.key === 'Escape') dcSetSheetOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => { document.removeEventListener('keydown', onKeyDown) }
      }, [open])
      if (!open) return null
      const panel = h('div', { className: 'dc-sheet-panel', role: 'dialog', 'aria-label': dcUsesChinese() ? DC_COPY.zh.dialog : DC_COPY.en.dialog }, [
        h('div', { key: 'head', className: 'dc-sheet-head' }, [
          h('span', { key: 'title', className: 'dc-sheet-title' }, 'DeepClear UI'),
          h('button', {
            key: 'close',
            type: 'button',
            className: 'dc-sheet-close',
            'aria-label': dcUsesChinese() ? DC_COPY.zh.close : DC_COPY.en.close,
            onClick: () => dcSetSheetOpen(false),
          }, '\u00d7'),
        ]),
        h('div', { key: 'body', className: 'dc-sheet-body' }, h(DcSettingsPage)),
      ])
      const scrim = h('div', {
        key: 'scrim',
        className: 'dc-sheet-scrim',
        onClick: () => dcSetSheetOpen(false),
      })
      const both = h('div', { className: 'dc-sheet-root' }, [scrim, panel])
      if (dcReactDOM !== null && typeof dcReactDOM.createPortal === 'function') {
        return dcReactDOM.createPortal(both, document.body)
      }
      return both
    }

    /** Nine-dot glyph used by the sidebar button and its active state. */
    function DcSettingsIcon({ size = 16, active }) {
      const unit = size / 16
      const points = [
        [3, 3], [8, 3], [13, 3],
        [3, 8], [8, 8], [13, 8],
        [3, 13], [8, 13], [13, 13],
      ]
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': 'true',
        style: { display: 'block' },
      }, points.map((point, index) => h('circle', {
        key: index,
        cx: point[0],
        cy: point[1],
        r: 1.35 * unit,
        fill: active ? '#7aaaff' : 'currentColor',
      })))
    }

    /** Sidebar footer button that opens the sheet. */
    function DcSidebarAction({ wide }) {
      return h('div', { className: 'dc-foot' }, [
        h('button', {
          key: 'button',
          type: 'button',
          className: 'dc-foot-button',
          title: 'DeepClear UI',
          'aria-label': dcUsesChinese() ? DC_COPY.zh.button : DC_COPY.en.button,
          onClick: () => dcSetSheetOpen(!dcSheetOpen),
        }, [
          h(DcSettingsIcon, { key: 'icon', size: 16, active: dcSheetOpen }),
          wide ? h('span', { key: 'label', className: 'dc-foot-label' }, 'DeepClear UI') : null,
        ]),
        h(DcSheet, { key: 'sheet' }),
      ])
    }


    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.dshPlugin = 'deepclear-ui'
          style.textContent = CSS
          document.head.append(style)
          return () => { style.remove() }
        }, 'whale-emphasis: accent styles')

        // The welcome-page layer is the core of this plugin: register it first so a
        // failure in the experimental chat hooks can never take it down.
        ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
          name: 'conversation.hero.frame',
          id: 'dot-whale',
          order: 20,
        }, HeroFrame))

        const guarded = (label, run) => {
          try {
            run()
          } catch (error) {
            window.__dcError = label + ': ' + (error && error.stack ? error.stack : String(error))
            console.error('[deepclear-ui] ' + label, error)
          }
        }

        guarded('settings', () => {
          dcApplySettings()
          ctx.effect(() => () => {}, 'deepclear-ui: settings')
          ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
            name: 'sidebar.footer.action',
            id: 'deepclear-ui',
            order: 5,
            label: () => 'DeepClear UI',
          }, DcSidebarAction))
        })

        guarded('composer-stats', () => {
          ctx.slots.inject('conversation.input.right', () => {
            try {
              return ctx.slots.register({
                name: 'conversation.input.right',
                id: 'dc-stats',
                order: 0,
              }, DcStats)
            } catch (error) {
              console.error('[deepclear-ui] composer-stats', error)
              return () => {}
            }
          })
        })

        guarded('overlay', () => {
          ctx.slots.inject('shell.overlay', () => ctx.slots.register({
            name: 'shell.overlay',
            id: 'dc-ambient',
            order: 5,
          }, DcOverlay))
        })

      },
    }
  },
})
