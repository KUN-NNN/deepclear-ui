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
    const LEVELS = 7
    const TAU = Math.PI * 2

    /**
     * Twinkle refresh rate. The field is dense, so the frame budget is kept
     * loose: slow alpha breathing reads the same at 16 fps, and the canvas is
     * only alive while the blank home is on screen.
     */
    const FRAME_MS = 1000 / 16

    /** One dot's cell in CSS pixels: fixed, so dots never scale with the window. */
    const DOT_PITCH = 9

    /** Smallest dot pitch the wordmark may use before it is dropped. */
    const TEXT_MIN_PITCH = 3.6

    /** Wordmark assembly: dots reveal left to right over this long. */
    const ASSEMBLY_MS = 1000

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
        }
        if (reduced) paint(performance.now())
      }
      const onPointerLeave = () => { pointerActive = false }
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
      const paint = (now) => {
        if (disposed) return
        // The assembly is a short, fast reveal: give it a smoother frame rate
        // than the slow twinkle, then fall back to the cheap cadence.
        const assembling = now - started < ASSEMBLY_MS + 80
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
        const portraitRadius = Math.max(0.8, pitch * 0.28)
        const lockupRadius = Math.max(0.8, pitch * 0.34)

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
        const assembly = reduced ? 1 : Math.min(1, (now - started) / ASSEMBLY_MS)
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
          let tone = kind === 'portrait' ? dot.a : dot.a * (0.35 + 0.65 * breathe)
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
            portraitY + (dot.v - 0.5) * portraitH,
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
        paintGroup(portraitPaths, dark ? 1.15 : 1.5, ink)
        if (showText) {
          paintGroup(wordmarkPaths[0], 1, ink)
          paintGroup(wordmarkPaths[1], 1, '122, 170, 255')
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

[data-slot="conversation.chat.flow"] :is(p, li, td, blockquote, h1, h2, h3, h4, h5, h6) :is(strong, b) {
  color: #7aaaff;
}

/* Composer focus: the shipped 0.5px hairline turns whale blue and an inset ring
   thickens the edge. The inset shadow follows the card radius and costs no
   layout, and a focused draft editor is the only trigger — toolbar buttons
   inside the card keep the resting look. */
[data-composer-card] {
  transition: box-shadow 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
[data-composer-card]:has(:is([contenteditable="true"], [role="textbox"], textarea):focus) {
  --dsw-elevation-stroke-color: #7aaaff;
  box-shadow: var(--dsw-elevation-soft), inset 0 0 0 1px #7aaaff;
}

/* Diff plates: the shipped red/green line fills become the deep-blue family and
   whale blue at the same fill strength. These are ui-theme's own file-diff
   tokens, which the deliverables comparison reads directly — no DOM coupling,
   so the plate colours also follow light/dark automatically. The html-body
   prefix outranks the shipped selector regardless of stylesheet order. */
html body {
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
html body [data-diff-line="add"] {
  --diff-gutter-fill: rgb(122 170 255 / 8%);
  --diff-marker: #7aaaff;
  background: #eaf1ff;
}
html body [data-diff-line="del"] {
  --diff-gutter-fill: rgb(20 40 110 / 8%);
  --diff-marker: #142f7e;
  background: #d9dde8;
}
html body[data-ds-dark-theme] [data-diff-line="add"] {
  --diff-gutter-fill: rgb(122 170 255 / 12%);
  --diff-marker: #a9c2ff;
  background: #2d394f;
}
html body[data-ds-dark-theme] [data-diff-line="del"] {
  --diff-gutter-fill: rgb(20 40 110 / 32%);
  --diff-marker: #6e8cff;
  background: #141f47;
}
`

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

        ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
          name: 'conversation.hero.frame',
          id: 'dot-whale',
          order: 20,
        }, HeroFrame))
      },
    }
  },
})
